const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));

// Service Target URLs (configured via environment or defaults)
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  projects: process.env.PROJECT_SERVICE_URL || 'http://localhost:5002',
  tasks: process.env.TASK_SERVICE_URL || 'http://localhost:5003',
  evaluations: process.env.EVALUATION_SERVICE_URL || 'http://localhost:5004',
  integration: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:5005',
  notifications: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006',
};

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    routes: {
      auth: `${services.auth}/api/auth`,
      projects: `${services.projects}/api/projects`,
      tasks: `${services.tasks}/api/tasks`,
      evaluations: `${services.evaluations}/api/evaluations`,
      integration: `${services.integration}/api/integration`,
      notifications: `${services.notifications}/api/notifications`,
    }
  });
});

// Proxy Rules
app.use('/api/auth', createProxyMiddleware({ target: services.auth, changeOrigin: true }));
app.use('/api/projects', createProxyMiddleware({ target: services.projects, changeOrigin: true }));
app.use('/api/tasks', createProxyMiddleware({ target: services.tasks, changeOrigin: true }));
app.use('/api/evaluations', createProxyMiddleware({ target: services.evaluations, changeOrigin: true }));
app.use('/api/integration', createProxyMiddleware({ target: services.integration, changeOrigin: true }));
app.use('/api/notifications', createProxyMiddleware({ target: services.notifications, changeOrigin: true }));

// Fallback 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found on API Gateway' });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on port ${PORT}`);
});
