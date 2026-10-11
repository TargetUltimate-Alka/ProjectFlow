const express = require('express');
const cors = require('cors');
const { createDatabase } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const { authenticate } = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.NOTIFICATION_PORT || 5006;

let db;
let notificationsCollection;
let eventBus;

// Seed initial notifications if empty
async function seedInitialNotifications() {
  const count = await notificationsCollection.countDocuments({});
  if (count === 0) {
    const now = Date.now();
    await notificationsCollection.insertMany([
      {
        title: 'GitHub Synchronized Successfully',
        message: 'Synchronized latest repository state: 14 commits, 5 pull requests, 4 contributors.',
        type: 'github',
        read: false,
        targetRole: 'all',
        createdAt: new Date(now - 1000 * 60 * 15).toISOString()
      },
      {
        title: 'Milestone 2 Reached 75%',
        message: 'Milestone 2: Core Development & Architecture advanced to 75% after PR #104 was merged.',
        type: 'milestone',
        read: false,
        targetRole: 'all',
        createdAt: new Date(now - 1000 * 60 * 45).toISOString()
      },
      {
        title: 'Faculty Added Evaluation Feedback',
        message: 'Dr. Robert Harrison reviewed the Capstone and submitted rubric evaluation: 94/100.',
        type: 'evaluation',
        read: false,
        targetRole: 'all',
        createdAt: new Date(now - 1000 * 60 * 180).toISOString()
      },
      {
        title: 'Milestone 3 Due Soon',
        message: 'Milestone 3: Evaluation, Testing & Final Report is scheduled for review next week.',
        type: 'milestone',
        read: true,
        targetRole: 'all',
        createdAt: new Date(now - 1000 * 60 * 720).toISOString()
      }
    ]);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'notification-service', status: 'healthy', dbType: db.type });
});

// Get user notifications
app.get('/notifications', authenticate, async (req, res) => {
  try {
    const userRole = (req.user.role || '').toLowerCase();
    const userId = req.user.id;

    // Filter notifications for this specific user or broad roles
    const notifications = await notificationsCollection
      .find({
        $or: [
          { userId: userId },
          { targetRole: 'all' },
          { targetRole: userRole }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
app.put('/notifications/:id/read', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await notificationsCollection.updateOne({ _id: id }, { $set: { read: true } });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all notifications as read
app.put('/notifications/read-all', authenticate, async (req, res) => {
  try {
    const userRole = (req.user.role || '').toLowerCase();
    await notificationsCollection.updateMany(
      {
        $or: [
          { userId: req.user.id },
          { targetRole: 'all' },
          { targetRole: userRole }
        ]
      },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('notification-service', 'notification_db');
  notificationsCollection = db.collection('notifications');
  await seedInitialNotifications();

  eventBus = await createEventBus('notification-service');

  // Event handlers
  eventBus.subscribe('SyncCompleted', async (event) => {
    const { projectId, stats } = event.payload || {};
    await notificationsCollection.insertOne({
      title: 'GitHub Synchronized Successfully',
      message: `Synchronized repository for project. Discovered ${stats?.totalCommits || 0} commits, ${stats?.totalPRs || 0} PRs, ${stats?.totalContributors || 0} contributors.`,
      type: 'github',
      projectId,
      read: false,
      targetRole: 'all',
      createdAt: new Date().toISOString()
    });
  });

  eventBus.subscribe('MilestoneStateChanged', async (event) => {
    const { projectId, milestoneName, percentage } = event.payload || {};
    await notificationsCollection.insertOne({
      title: `${milestoneName} Updated`,
      message: `${milestoneName} has reached ${percentage}% progress based on verified GitHub activity and documents.`,
      type: 'milestone',
      projectId,
      read: false,
      targetRole: 'all',
      createdAt: new Date().toISOString()
    });
  });

  eventBus.subscribe('MilestoneCompleted', async (event) => {
    const { projectId, milestoneName } = event.payload || {};
    await notificationsCollection.insertOne({
      title: `🎉 ${milestoneName} Completed!`,
      message: `All automated GitHub and artifact criteria satisfied for ${milestoneName} (100%).`,
      type: 'milestone',
      projectId,
      read: false,
      targetRole: 'all',
      createdAt: new Date().toISOString()
    });
  });

  eventBus.subscribe('EvaluationCompleted', async (event) => {
    const { projectId, projectName, facultyName, percentage, totalScore, maxScore } = event.payload || {};
    await notificationsCollection.insertOne({
      title: `Faculty Evaluation Submitted: ${percentage}%`,
      message: `${facultyName} evaluated "${projectName || 'Project'}" with a final rubric score of ${totalScore}/${maxScore} (${percentage}%).`,
      type: 'evaluation',
      projectId,
      read: false,
      targetRole: 'all',
      createdAt: new Date().toISOString()
    });
  });

  eventBus.subscribe('TaskCompleted', async (event) => {
    const { projectId, title, completedBy } = event.payload || {};
    await notificationsCollection.insertOne({
      title: 'Task Completed',
      message: `${completedBy || 'A team member'} completed task: "${title}".`,
      type: 'task',
      projectId,
      read: false,
      targetRole: 'all',
      createdAt: new Date().toISOString()
    });
  });

  app.listen(PORT, () => {
    console.log(`[NotificationService] Running on port ${PORT} with database 'notification_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Notification Service:', err);
});
