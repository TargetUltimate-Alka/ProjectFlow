const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Auth Service', database: 'auth_db' });
});

// Auth Route Handlers
app.post('/api/auth/register', async (req, res) => {
  const { name, email, role } = req.body;
  // TODO: Add bcrypt password hashing and User.save()
  res.status(201).json({
    message: 'User registered successfully (Stub)',
    user: { name, email, role: role || 'student' }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  // TODO: Validate password with bcrypt and sign JWT
  res.status(200).json({
    message: 'Login successful (Stub)',
    token: 'mock-jwt-token-projectflow',
    user: { email, role: 'student' }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({
    message: 'Current authenticated user profile (Stub)',
    user: { email: 'student@example.edu', role: 'student' }
  });
});

app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
