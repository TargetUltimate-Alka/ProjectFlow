const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const crypto = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

function matchFilter(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const [key, expected] of Object.entries(filter)) {
    if (key === '$or' && Array.isArray(expected)) {
      const anyMatch = expected.some(subFilter => matchFilter(doc, subFilter));
      if (!anyMatch) return false;
      continue;
    }
    const val = doc[key];
    if (expected !== null && typeof expected === 'object' && !Array.isArray(expected)) {
      for (const [op, opVal] of Object.entries(expected)) {
        if (op === '$in' && Array.isArray(opVal)) {
          if (!opVal.includes(val)) return false;
        } else if (op === '$ne') {
          if (val === opVal) return false;
        } else if (op === '$gt') {
          if (!(val > opVal)) return false;
        } else if (op === '$gte') {
          if (!(val >= opVal)) return false;
        } else if (op === '$lt') {
          if (!(val < opVal)) return false;
        } else if (op === '$lte') {
          if (!(val <= opVal)) return false;
        } else if (op === '$regex') {
          const re = new RegExp(opVal, expected.$options || '');
          if (!re.test(String(val || ''))) return false;
        }
      }
    } else {
      if (val !== expected) return false;
    }
  }
  return true;
}

function applyUpdate(doc, update) {
  const result = { ...doc };
  if (update.$set) {
    for (const [k, v] of Object.entries(update.$set)) {
      result[k] = v;
    }
  }
  if (update.$inc) {
    for (const [k, v] of Object.entries(update.$inc)) {
      result[k] = (result[k] || 0) + v;
    }
  }
  if (update.$push) {
    for (const [k, v] of Object.entries(update.$push)) {
      if (!Array.isArray(result[k])) result[k] = [];
      result[k].push(v);
    }
  }
  if (update.$pull) {
    for (const [k, v] of Object.entries(update.$pull)) {
      if (Array.isArray(result[k])) {
        result[k] = result[k].filter(item => {
          if (typeof v === 'object') return !matchFilter(item, v);
          return item !== v;
        });
      }
    }
  }
  if (!update.$set && !update.$inc && !update.$push && !update.$pull) {
    return { ...doc, ...update, _id: doc._id };
  }
  result.updatedAt = new Date().toISOString();
  return result;
}

class EmbeddedCollection {
  constructor(dbDir, name) {
    this.filePath = path.join(dbDir, `${name}.json`);
    this.name = name;
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(path.dirname(this.filePath))) {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  readAll() {
    this.ensureFile();
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      return [];
    }
  }

  writeAll(docs) {
    fs.writeFileSync(this.filePath, JSON.stringify(docs, null, 2), 'utf-8');
  }

  find(filter = {}) {
    const docs = this.readAll().filter(d => matchFilter(d, filter));
    return {
      toArray: async () => docs,
      sort: function(sortObj) {
        const sorted = [...docs].sort((a, b) => {
          for (const [k, order] of Object.entries(sortObj)) {
            if (a[k] < b[k]) return order === -1 ? 1 : -1;
            if (a[k] > b[k]) return order === -1 ? -1 : 1;
          }
          return 0;
        });
        return {
          toArray: async () => sorted,
          limit: (n) => ({ toArray: async () => sorted.slice(0, n) })
        };
      },
      limit: function(n) {
        return { toArray: async () => docs.slice(0, n) };
      }
    };
  }

  async findOne(filter = {}) {
    const docs = this.readAll();
    return docs.find(d => matchFilter(d, filter)) || null;
  }

  async insertOne(doc) {
    const docs = this.readAll();
    const newDoc = {
      _id: doc._id || generateId(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    docs.push(newDoc);
    this.writeAll(docs);
    return { insertedId: newDoc._id, acknowledged: true };
  }

  async insertMany(docsToInsert) {
    const docs = this.readAll();
    const insertedIds = [];
    for (const d of docsToInsert) {
      const newDoc = {
        _id: d._id || generateId(),
        ...d,
        createdAt: d.createdAt || new Date().toISOString()
      };
      docs.push(newDoc);
      insertedIds.push(newDoc._id);
    }
    this.writeAll(docs);
    return { insertedIds, acknowledged: true };
  }

  async updateOne(filter, update, options = {}) {
    const docs = this.readAll();
    const index = docs.findIndex(d => matchFilter(d, filter));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = applyUpdate({ _id: generateId(), ...filter }, update);
        docs.push(newDoc);
        this.writeAll(docs);
        return { matchedCount: 0, modifiedCount: 1, upsertedId: newDoc._id };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }
    docs[index] = applyUpdate(docs[index], update);
    this.writeAll(docs);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async updateMany(filter, update) {
    const docs = this.readAll();
    let modifiedCount = 0;
    const newDocs = docs.map(d => {
      if (matchFilter(d, filter)) {
        modifiedCount++;
        return applyUpdate(d, update);
      }
      return d;
    });
    this.writeAll(newDocs);
    return { matchedCount: modifiedCount, modifiedCount };
  }

  async deleteOne(filter) {
    const docs = this.readAll();
    const index = docs.findIndex(d => matchFilter(d, filter));
    if (index === -1) return { deletedCount: 0 };
    docs.splice(index, 1);
    this.writeAll(docs);
    return { deletedCount: 1 };
  }

  async deleteMany(filter) {
    const docs = this.readAll();
    const remaining = docs.filter(d => !matchFilter(d, filter));
    const deletedCount = docs.length - remaining.length;
    this.writeAll(remaining);
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    const docs = this.readAll();
    return docs.filter(d => matchFilter(d, filter)).length;
  }
}

function normalizeFilter(filter) {
  if (!filter || typeof filter !== 'object') return filter;
  const normalized = { ...filter };

  if (normalized._id !== undefined) {
    if (typeof normalized._id === 'string' && ObjectId.isValid(normalized._id) && normalized._id.length === 24) {
      // Support finding documents whether stored with string _id or ObjectId
      normalized._id = { $in: [normalized._id, new ObjectId(normalized._id)] };
    }
  }

  return normalized;
}

class MongoCollectionWrapper {
  constructor(rawCollection) {
    this.raw = rawCollection;
  }

  find(filter = {}, options = {}) {
    return this.raw.find(normalizeFilter(filter), options);
  }

  async findOne(filter = {}, options = {}) {
    return await this.raw.findOne(normalizeFilter(filter), options);
  }

  async insertOne(doc, options = {}) {
    const newDoc = {
      _id: doc._id || generateId(),
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    const result = await this.raw.insertOne(newDoc, options);
    return {
      acknowledged: result.acknowledged,
      insertedId: newDoc._id
    };
  }

  async insertMany(docs, options = {}) {
    const prepared = docs.map(d => ({
      _id: d._id || generateId(),
      ...d,
      createdAt: d.createdAt || new Date().toISOString()
    }));
    const result = await this.raw.insertMany(prepared, options);
    return {
      acknowledged: result.acknowledged,
      insertedIds: prepared.map(d => d._id)
    };
  }

  async updateOne(filter, update, options = {}) {
    return await this.raw.updateOne(normalizeFilter(filter), update, options);
  }

  async updateMany(filter, update, options = {}) {
    return await this.raw.updateMany(normalizeFilter(filter), update, options);
  }

  async deleteOne(filter, options = {}) {
    return await this.raw.deleteOne(normalizeFilter(filter), options);
  }

  async deleteMany(filter, options = {}) {
    return await this.raw.deleteMany(normalizeFilter(filter), options);
  }

  async countDocuments(filter = {}, options = {}) {
    return await this.raw.countDocuments(normalizeFilter(filter), options);
  }
}

// Global cache for Mongo client instances to prevent connection pool exhaustion
const cachedClients = {};

async function createDatabase(serviceName, dbName) {
  const baseUri = process.env.MONGODB_URI;
  const mongoUri = baseUri || `mongodb://localhost:27017/${dbName}`;
  let client = null;
  let useMongo = false;

  try {
    if (!cachedClients[mongoUri]) {
      const c = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 1500 });
      await c.connect();
      cachedClients[mongoUri] = c;
    }
    client = cachedClients[mongoUri];
    // Verify connection by pinging
    await client.db(dbName).command({ ping: 1 });
    useMongo = true;
    console.log(`[${serviceName}] Connected to real MongoDB database: '${dbName}'`);
  } catch (err) {
    useMongo = false;
    console.log(`[${serviceName}] MongoDB offline (${err.message}). Using fallback embedded JSON database for '${dbName}'.`);
  }

  if (useMongo) {
    const db = client.db(dbName);
    return {
      type: 'mongodb',
      collection: (name) => new MongoCollectionWrapper(db.collection(name)),
      close: () => client.close()
    };
  }

  // Isolated database directory per microservice database
  const dbDir = path.resolve(__dirname, '..', 'data', dbName);
  return {
    type: 'embedded',
    collection: (name) => new EmbeddedCollection(dbDir, name),
    close: async () => {}
  };
}

module.exports = { createDatabase, generateId, normalizeFilter, MongoCollectionWrapper };
