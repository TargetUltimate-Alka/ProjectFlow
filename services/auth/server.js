const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
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
let eventBus;

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
      department: user.department,
      status: user.status,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  eventBus = await createEventBus('auth-service');

  app.listen(PORT, () => {
    console.log(`[AuthService] Running on port ${PORT} with database 'auth_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Auth Service:', err);
});
