const express = require('express');
const cors = require('cors');
const { createDatabase } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const { authenticate } = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.TASK_PORT || 5003;

let db;
let tasksCollection;
let eventBus;

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'task-service', status: 'healthy', dbType: db.type });
});

// Create task
app.post('/tasks', authenticate, async (req, res) => {
  try {
    const { projectId, title, description, assigneeId, assigneeName, priority, dueDate, status } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ error: 'projectId and title are required' });
    }

    const taskDoc = {
      projectId,
      title: title.trim(),
      description: description ? description.trim() : '',
      assigneeId: assigneeId || null,
      assigneeName: assigneeName || 'Unassigned',
      priority: priority || 'medium', // 'low' | 'medium' | 'high' | 'critical'
      status: status || 'todo', // 'todo' | 'in_progress' | 'review' | 'completed'
      dueDate: dueDate || null,
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await tasksCollection.insertOne(taskDoc);

    await eventBus.publish('TaskCreated', {
      taskId: result.insertedId,
      projectId,
      title: taskDoc.title,
      assigneeName: taskDoc.assigneeName
    });

    res.status(201).json({ id: result.insertedId, ...taskDoc });
  } catch (err) {
    console.error('[TaskService] Create task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get task by ID
app.get('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasksCollection.findOne({ _id: id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigneeId, assigneeName, priority, status, dueDate } = req.body;

    const existingTask = await tasksCollection.findOne({ _id: id });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const update = { updatedAt: new Date().toISOString() };
    if (title) update.title = title.trim();
    if (description !== undefined) update.description = description.trim();
    if (assigneeId !== undefined) {
      update.assigneeId = assigneeId;
      if (assigneeName) update.assigneeName = assigneeName;
    }
    if (priority) update.priority = priority;
    if (status) update.status = status;
    if (dueDate !== undefined) update.dueDate = dueDate;

    await tasksCollection.updateOne({ _id: id }, { $set: update });

    const updatedTask = { ...existingTask, ...update };

    // Emit TaskCompleted event if transitioning to completed
    if (status === 'completed' && existingTask.status !== 'completed') {
      await eventBus.publish('TaskCompleted', {
        taskId: id,
        projectId: existingTask.projectId,
        title: updatedTask.title,
        completedBy: req.user.name
      });
    }

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await tasksCollection.deleteOne({ _id: id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a project with filtering
app.get('/projects/:projectId/tasks', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assigneeId } = req.query;

    const filter = { projectId };
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (assigneeId && assigneeId !== 'all') filter.assigneeId = assigneeId;

    const tasks = await tasksCollection.find(filter).toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('task-service', 'task_db');
  tasksCollection = db.collection('tasks');
  eventBus = await createEventBus('task-service');

  app.listen(PORT, () => {
    console.log(`[TaskService] Running on port ${PORT} with database 'task_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Task Service:', err);
});
