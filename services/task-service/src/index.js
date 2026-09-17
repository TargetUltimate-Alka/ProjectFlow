const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Task Service', database: 'task_db' });
});

// Task endpoints
app.post('/api/tasks', (req, res) => {
  const { projectId, title, description, assignedTo, priority, dueDate } = req.body;
  res.status(201).json({
    message: 'Task created successfully (Stub)',
    task: {
      id: 'mock-task-id',
      projectId,
      title,
      description,
      assignedTo,
      priority: priority || 'Medium',
      status: 'To Do',
      dueDate,
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/tasks/project/:projectId', (req, res) => {
  res.status(200).json({
    tasks: [
      {
        id: 'mock-task-1',
        projectId: req.params.projectId,
        title: 'Setup Monorepo Structure',
        status: 'Done',
        priority: 'High'
      }
    ]
  });
});

app.put('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  res.status(200).json({
    message: 'Task status updated (Stub)',
    task: { id: req.params.id, status }
  });
});

app.listen(PORT, () => {
  console.log(`[Task Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
