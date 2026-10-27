const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { createDatabase } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
  authenticate,
  authorizeRoles
} = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.AUTH_PORT || 5001;

let db;
let usersCollection;
let institutionsCollection;
let branchesCollection;
let batchesCollection;
let sessionsCollection;
let assignmentsCollection;
let membershipsCollection;
let eventBus;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  role: user.role,
  department: user.department,
  institutionId: user.institutionId || null,
  designation: user.designation || null,
  bio: user.bio || null
});

async function requireCoordinator(req, res, next) {
  try {
    const user = await usersCollection.findOne({ _id: req.user?.id });
    if (!user || !['Coordinator', 'Admin'].includes(user.role) || user.status === 'suspended') {
      return res.status(403).json({ error: 'Coordinator access is required' });
    }
    req.user.role = user.role;
    req.user.institutionId = user.institutionId || null;
    next();
  } catch (err) { res.status(500).json({ error: err.message }); }
}

function coordinatorInstitutionFilter(req) {
  if (req.user.role === 'Admin') return {};
  return { institutionId: req.user.institutionId };
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'healthy', dbType: db.type });
});

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    // Role safety: Admin accounts cannot be self-registered
    const assignedRole = (role === 'Faculty') ? 'Faculty' : 'Student';
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: assignedRole,
      status: 'active',
      department: req.body.department || 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    };

    const result = await usersCollection.insertOne(newUser);
    const token = generateToken({
      id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    const refreshToken = generateRefreshToken({ id: result.insertedId });

    await eventBus.publish('UserRegistered', {
      userId: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department
      }
    });
  } catch (err) {
    console.error('[AuthService] Register error:', err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact Admin.' });
    }

    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId || null,
        department: user.department || 'Computer Science'
      }
    });
  } catch (err) {
    console.error('[AuthService] Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Refresh Token
app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await usersCollection.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ error: 'User no longer exists' });
    }

    const newToken = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.json({ token: newToken });
  } catch (err) {
    res.status(500).json({ error: 'Refresh failed: ' + err.message });
  }
});

// Current User Profile
app.get('/auth/me', authenticate, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      institutionId: user.institutionId || null,
      designation: user.designation || null,
      bio: user.bio || null,
      department: user.department,
      status: user.status,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public institution discovery and profile data. Private account fields are never returned.
app.get('/institutions', async (req, res) => {
  try {
    const query = String(req.query.search || '').trim();
    const filter = { status: 'active' };
    if (query) filter.name = { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const institutions = await institutionsCollection.find(filter).sort({ name: 1 }).limit(50).toArray();
    res.json(institutions.map(({ _id, name, type, city, state, country, logoUrl, coverUrl, description }) => ({ id: _id, name, type, city, state, country, logoUrl, coverUrl, description })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/institutions/:id', async (req, res) => {
  try {
    const institution = await institutionsCollection.findOne({ _id: req.params.id, status: 'active' });
    if (!institution) return res.status(404).json({ error: 'Institution not found' });
    const [branches, coordinators] = await Promise.all([
      branchesCollection.find({ institutionId: institution._id, status: 'active' }).toArray(),
      usersCollection.find({ institutionId: institution._id, role: 'Coordinator', status: 'active' }).toArray()
    ]);
    const { _id, createdBy, ...profile } = institution;
    res.json({ ...profile, id: _id, branches: branches.map(({ _id: id, name, code, programs }) => ({ id, name, code, programs: programs || [] })), coordinatorCount: coordinators.length, coordinators: coordinators.map(publicUser) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/institutions/:id/membership', authenticate, async (req, res) => {
  try {
    const membership = await membershipsCollection.findOne({ institutionId: req.params.id, userId: String(req.user.id) });
    res.json({ status: membership?.status || 'none' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/institutions/:id/membership', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'Faculty') return res.status(403).json({ error: 'Only faculty accounts can request institution membership' });
    const institution = await institutionsCollection.findOne({ _id: req.params.id, status: 'active' });
    if (!institution) return res.status(404).json({ error: 'Institution not found' });
    const userId = String(req.user.id);
    const existing = await membershipsCollection.findOne({ userId, institutionId: req.params.id });
    if (existing) return res.status(200).json({ status: existing.status, message: 'Membership request already exists' });
    const current = await usersCollection.findOne({ _id: req.user.id });
    if (!current || current.institutionId) return res.status(409).json({ error: 'This account is already associated with an institution' });
    const membership = { _id: crypto.randomUUID(), institutionId: req.params.id, userId, status: 'pending', requestedAt: new Date().toISOString() };
    await membershipsCollection.insertOne(membership);
    res.status(201).json({ status: membership.status, message: 'Membership request sent to institution coordinators' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/institutions', authenticate, requireCoordinator, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const type = String(req.body.type || '').trim().toLowerCase();
    if (!name || !['college', 'university', 'school'].includes(type)) return res.status(400).json({ error: 'Institution name and a valid type are required' });
    const duplicate = await institutionsCollection.findOne({ normalizedName: name.toLowerCase(), city: String(req.body.city || '').trim().toLowerCase() });
    if (duplicate) return res.status(409).json({ error: 'An institution with this name and city already exists' });
    const gallery = Array.isArray(req.body.gallery) ? req.body.gallery.map(String).map(url => url.trim()).filter(Boolean).slice(0, 12) : [];
    const imageUrls = [req.body.logoUrl, req.body.coverUrl, ...gallery].filter(Boolean);
    if (imageUrls.some(url => { try { return !['http:', 'https:'].includes(new URL(String(url)).protocol); } catch { return true; } })) return res.status(400).json({ error: 'Image links must be valid http or https URLs' });
    const doc = { _id: crypto.randomUUID(), name, normalizedName: name.toLowerCase(), type, city: String(req.body.city || '').trim(), state: String(req.body.state || '').trim(), country: String(req.body.country || '').trim(), address: String(req.body.address || '').trim(), website: String(req.body.website || '').trim(), description: String(req.body.description || '').trim(), logoUrl: String(req.body.logoUrl || '').trim(), coverUrl: String(req.body.coverUrl || '').trim(), gallery, status: 'active', createdBy: req.user.id, createdAt: new Date().toISOString() };
    if (doc.website && !/^https?:\/\//i.test(doc.website)) return res.status(400).json({ error: 'Website must be a valid http or https URL' });
    const result = await institutionsCollection.insertOne(doc);
    if (req.user.role === 'Coordinator' && !req.user.institutionId) {
      await usersCollection.updateOne({ _id: req.user.id }, { $set: { institutionId: result.insertedId } });
      req.user.institutionId = result.insertedId;
    }
    res.status(201).json({ ...doc, id: result.insertedId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/coordinator/overview', authenticate, requireCoordinator, async (req, res) => {
  try {
    const scope = coordinatorInstitutionFilter(req);
    const [institutions, branches, batches, sessions, faculty, coordinators, assignments] = await Promise.all([
      institutionsCollection.find(scope).toArray(), branchesCollection.find(scope).toArray(), batchesCollection.find(scope).toArray(),
      sessionsCollection.find(scope).toArray(), usersCollection.find({ ...scope, role: 'Faculty' }).toArray(),
      usersCollection.find({ ...scope, role: 'Coordinator' }).toArray(), assignmentsCollection.find(scope).sort({ createdAt: -1 }).limit(8).toArray()
    ]);
    res.json({ institution: institutions[0] || null, stats: { branches: branches.length, batches: batches.length, sessions: sessions.length, faculty: faculty.length, coordinators: coordinators.length }, branches, batches: batches.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,6), faculty: faculty.map(publicUser), coordinators: coordinators.map(publicUser), activity: assignments });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/coordinator/institutions/:id', authenticate, requireCoordinator, async (req, res) => {
  try {
    const institutionId = String(req.params.id);
    if (req.user.role !== 'Admin' && institutionId !== String(req.user.institutionId)) return res.status(403).json({ error: 'Institution access denied' });
    const institution = await institutionsCollection.findOne({ _id: institutionId });
    if (!institution) return res.status(404).json({ error: 'Institution not found' });
    const allowed = ['name', 'type', 'city', 'state', 'country', 'address', 'website', 'description', 'logoUrl', 'coverUrl'];
    const update = {};
    for (const field of allowed) if (req.body[field] !== undefined) update[field] = String(req.body[field]).trim();
    if (update.name !== undefined && !update.name) return res.status(400).json({ error: 'Institution name cannot be empty' });
    if (update.type !== undefined && !['college', 'university', 'school'].includes(update.type.toLowerCase())) return res.status(400).json({ error: 'Institution type is invalid' });
    if (update.name !== undefined) update.normalizedName = update.name.toLowerCase();
    if (update.website && !/^https?:\/\//i.test(update.website)) return res.status(400).json({ error: 'Website must be a valid http or https URL' });
    if (req.body.gallery !== undefined) {
      if (!Array.isArray(req.body.gallery) || req.body.gallery.length > 12) return res.status(400).json({ error: 'Gallery must contain at most 12 image links' });
      update.gallery = req.body.gallery.map(String).map(url => url.trim()).filter(Boolean);
    }
    const imageUrls = [update.logoUrl || institution.logoUrl, update.coverUrl || institution.coverUrl, ...(update.gallery || institution.gallery || [])].filter(Boolean);
    if (imageUrls.some(url => { try { return !['http:', 'https:'].includes(new URL(String(url)).protocol); } catch { return true; } })) return res.status(400).json({ error: 'Image links must be valid http or https URLs' });
    await institutionsCollection.updateOne({ _id: institutionId }, { $set: update });
    res.json({ ...institution, ...update, id: institutionId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/coordinator/branches', authenticate, requireCoordinator, async (req, res) => {
  try { res.json(await branchesCollection.find(coordinatorInstitutionFilter(req)).sort({ name: 1 }).toArray()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/coordinator/memberships', authenticate, requireCoordinator, async (req, res) => {
  try {
    const scope = coordinatorInstitutionFilter(req);
    const requests = await membershipsCollection.find({ ...scope, status: 'pending' }).sort({ requestedAt: -1 }).toArray();
    const users = await Promise.all(requests.map(request => usersCollection.findOne({ _id: request.userId })));
    res.json(requests.map((request, index) => ({ id: request._id, status: request.status, requestedAt: request.requestedAt, faculty: users[index] ? publicUser(users[index]) : null })).filter(request => request.faculty));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/coordinator/memberships/:id', authenticate, requireCoordinator, async (req, res) => {
  try {
    const status = String(req.body.status || '');
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Status must be approved or rejected' });
    const membership = await membershipsCollection.findOne({ _id: req.params.id, ...coordinatorInstitutionFilter(req), status: 'pending' });
    if (!membership) return res.status(404).json({ error: 'Pending membership request not found in your institution' });
    await membershipsCollection.updateOne({ _id: membership._id }, { $set: { status, reviewedBy: String(req.user.id), reviewedAt: new Date().toISOString() } });
    if (status === 'approved') await usersCollection.updateOne({ _id: membership.userId }, { $set: { institutionId: membership.institutionId, institutionMembershipStatus: 'active' } });
    res.json({ id: membership._id, status });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/coordinator/branches', authenticate, requireCoordinator, async (req, res) => {
  try {
    const institutionId = req.user.role === 'Admin' ? String(req.body.institutionId || '') : String(req.user.institutionId || '');
    const name = String(req.body.name || '').trim();
    if (!institutionId || !name) return res.status(400).json({ error: 'Institution and branch name are required' });
    if (req.user.role !== 'Admin' && institutionId !== String(req.user.institutionId)) return res.status(403).json({ error: 'Institution access denied' });
    const institution = await institutionsCollection.findOne({ _id: institutionId });
    if (!institution) return res.status(404).json({ error: 'Institution not found' });
    if (await branchesCollection.findOne({ institutionId, normalizedName: name.toLowerCase() })) return res.status(409).json({ error: 'This branch already exists' });
    const doc = { _id: crypto.randomUUID(), institutionId, name, normalizedName: name.toLowerCase(), code: String(req.body.code || '').trim(), programs: Array.isArray(req.body.programs) ? req.body.programs.map(String).map(x => x.trim()).filter(Boolean) : [], status: 'active', createdBy: req.user.id, createdAt: new Date().toISOString() };
    const result = await branchesCollection.insertOne(doc);
    res.status(201).json({ ...doc, id: result.insertedId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/coordinator/sessions', authenticate, requireCoordinator, async (req, res) => {
  try { res.json(await sessionsCollection.find(coordinatorInstitutionFilter(req)).sort({ startYear: -1 }).toArray()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/coordinator/sessions', authenticate, requireCoordinator, async (req, res) => {
  try {
    const institutionId = req.user.role === 'Admin' ? String(req.body.institutionId || '') : String(req.user.institutionId || '');
    const name = String(req.body.name || '').trim();
    if (!institutionId || !name) return res.status(400).json({ error: 'Institution and session name are required' });
    const institution = await institutionsCollection.findOne({ _id: institutionId });
    if (!institution || (req.user.role !== 'Admin' && institutionId !== String(req.user.institutionId))) return res.status(403).json({ error: 'Institution access denied' });
    if (await sessionsCollection.findOne({ institutionId, name })) return res.status(409).json({ error: 'This academic session already exists' });
    const doc = { _id: crypto.randomUUID(), institutionId, name, startYear: Number(req.body.startYear) || null, endYear: Number(req.body.endYear) || null, status: 'active', createdBy: req.user.id, createdAt: new Date().toISOString() };
    const result = await sessionsCollection.insertOne(doc);
    res.status(201).json({ ...doc, id: result.insertedId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/coordinator/batches', authenticate, requireCoordinator, async (req, res) => {
  try { res.json(await batchesCollection.find(coordinatorInstitutionFilter(req)).sort({ createdAt: -1 }).toArray()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/coordinator/batches', authenticate, requireCoordinator, async (req, res) => {
  try {
    const institutionId = req.user.role === 'Admin' ? String(req.body.institutionId || '') : String(req.user.institutionId || '');
    const { name, branchId, sessionId } = req.body;
    if (!institutionId || !String(name || '').trim() || !branchId || !sessionId) return res.status(400).json({ error: 'Batch name, branch, and academic session are required' });
    if (req.user.role !== 'Admin' && institutionId !== String(req.user.institutionId)) return res.status(403).json({ error: 'Institution access denied' });
    const [branch, session] = await Promise.all([branchesCollection.findOne({ _id: String(branchId), institutionId }), sessionsCollection.findOne({ _id: String(sessionId), institutionId })]);
    if (!branch || !session) return res.status(400).json({ error: 'Branch and academic session must belong to this institution' });
    const normalizedName = String(name).trim().toLowerCase();
    if (await batchesCollection.findOne({ institutionId, normalizedName, sessionId: String(sessionId) })) return res.status(409).json({ error: 'This batch already exists for the selected session' });
    const doc = { _id: crypto.randomUUID(), institutionId, name: String(name).trim(), normalizedName, branchId: String(branchId), branchName: branch.name, sessionId: String(sessionId), sessionName: session.name, cohortYear: Number(req.body.cohortYear) || null, description: String(req.body.description || '').trim(), status: 'active', createdBy: req.user.id, createdAt: new Date().toISOString() };
    const result = await batchesCollection.insertOne(doc);
    res.status(201).json({ ...doc, id: result.insertedId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Faculty List (for faculty assignment dropdowns)
app.get('/auth/faculty', authenticate, async (req, res) => {
  try {
    const facultyMembers = await usersCollection.find({ role: 'Faculty' }).toArray();
    res.json(facultyMembers.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      department: u.department || 'Computer Science',
      status: u.status
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Students List
app.get('/auth/students', authenticate, async (req, res) => {
  try {
    const students = await usersCollection.find({ role: 'Student' }).toArray();
    res.json(students.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      department: u.department,
      status: u.status
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin User Directory
app.get('/auth/users', authenticate, authorizeRoles('Admin', 'Faculty'), async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department || 'Computer Science',
      status: u.status || 'active',
      createdAt: u.createdAt
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Create User (can create Admins, Faculty, Students)
app.post('/auth/users', authenticate, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await usersCollection.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userDoc = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      institutionId: req.body.institutionId || null,
      designation: req.body.designation || null,
      department: department || 'Computer Science & Engineering',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const result = await usersCollection.insertOne(userDoc);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.insertedId,
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        department: userDoc.department
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Update User Status / Details
app.put('/auth/users/:id', authenticate, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role, department, name } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (role) updateFields.role = role;
    if (department) updateFields.department = department;
    if (name) updateFields.name = name;

    await usersCollection.updateOne({ _id: id }, { $set: updateFields });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('auth-service', 'auth_db');
  usersCollection = db.collection('users');
  institutionsCollection = db.collection('institutions');
  branchesCollection = db.collection('branches');
  batchesCollection = db.collection('batches');
  sessionsCollection = db.collection('academic_sessions');
  assignmentsCollection = db.collection('faculty_assignments');
  membershipsCollection = db.collection('institution_memberships');
  eventBus = await createEventBus('auth-service');

  app.listen(PORT, () => {
    console.log(`[AuthService] Running on port ${PORT} with database 'auth_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Auth Service:', err);
});
