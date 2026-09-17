const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/project_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Project Service', database: 'project_db' });
});

// Project endpoints
app.post('/api/projects', (req, res) => {
  const { title, description, techStack, members } = req.body;
  res.status(201).json({
    message: 'Project created successfully (Stub)',
    project: {
      id: 'mock-proj-id',
      title,
      description,
      techStack,
      members,
      status: 'Active',
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/projects', (req, res) => {
  res.status(200).json({
    projects: [
      {
        id: 'mock-proj-id',
        title: 'ProjectFlow - Academic Platform',
        status: 'Active'
      }
    ]
  });
});

app.get('/api/projects/:id', (req, res) => {
  res.status(200).json({
    project: {
      id: req.params.id,
      title: 'ProjectFlow',
      requirements: [],
      milestones: []
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Project Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
