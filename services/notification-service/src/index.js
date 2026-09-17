const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5006;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notification_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Notification Service', database: 'notification_db' });
});

// Notifications endpoints
app.get('/api/notifications', (req, res) => {
  res.status(200).json({
    notifications: [
      {
        id: 'notif-1',
        title: 'Welcome to ProjectFlow',
        message: 'Your project environment is ready.',
        read: false,
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.put('/api/notifications/:id/read', (req, res) => {
  res.status(200).json({
    message: 'Notification marked as read',
    id: req.params.id
  });
});

app.listen(PORT, () => {
  console.log(`[Notification Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
