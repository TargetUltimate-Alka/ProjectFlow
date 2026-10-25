const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

async function importData() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  console.log('====================================================');
  console.log('   ProjectFlow: JSON to Real MongoDB Importer       ');
  console.log('====================================================');
  console.log(`Connecting to MongoDB at: ${mongoUri}\n`);

  let client;
  try {
    client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✓ Successfully connected to MongoDB server!\n');
  } catch (err) {
    console.error('✗ Connection to MongoDB failed:', err.message);
    console.error('\nHow to fix:');
    console.error('1. If using MongoDB Atlas: create a cluster and add your connection string to .env:');
    console.error('   MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"');
    console.error('2. If using Docker: run `docker compose up -d`');
    console.error('3. If using local MongoDB: start MongoDB Community Server (net start MongoDB)');
    process.exit(1);
  }

  const dataDir = path.resolve(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    console.error(`✗ Data directory not found at: ${dataDir}`);
    await client.close();
    process.exit(1);
  }

  const dbFolders = fs.readdirSync(dataDir).filter(f => {
    return fs.statSync(path.join(dataDir, f)).isDirectory();
  });

  let totalCollections = 0;
  let totalDocuments = 0;

  for (const dbName of dbFolders) {
    const dbPath = path.join(dataDir, dbName);
    const jsonFiles = fs.readdirSync(dbPath).filter(f => f.endsWith('.json'));
    const db = client.db(dbName);

    console.log(`\n📁 Database: [${dbName}]`);

    for (const file of jsonFiles) {
      const collectionName = path.basename(file, '.json');
      const filePath = path.join(dbPath, file);
      
      let docs = [];
      try {
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        docs = JSON.parse(rawContent || '[]');
      } catch (e) {
        console.error(`  ✗ Error reading ${file}: ${e.message}`);
        continue;
      }

      if (!Array.isArray(docs)) {
        console.warn(`  ! Warning: ${file} does not contain an array of documents, skipping.`);
        continue;
      }

      const collection = db.collection(collectionName);
      
      // Clear previous documents in the collection to ensure a clean sync
      await collection.deleteMany({});

      if (docs.length > 0) {
        await collection.insertMany(docs);
        console.log(`  ✓ Collection '${collectionName}': ${docs.length} documents imported`);
        totalDocuments += docs.length;
      } else {
        console.log(`  ○ Collection '${collectionName}': 0 documents (empty file)`);
      }

      totalCollections++;
    }
  }

  console.log('\n====================================================');
  console.log(` Import Summary:`);
  console.log(` - Databases populated:  ${dbFolders.length}`);
  console.log(` - Collections created:  ${totalCollections}`);
  console.log(` - Total documents:      ${totalDocuments}`);
  console.log('====================================================\n');
  console.log('ProjectFlow is now fully synchronized with your real MongoDB database!');

  await client.close();
  process.exit(0);
}

importData().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
