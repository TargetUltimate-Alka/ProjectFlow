const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/integration_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Integration Service', database: 'integration_db' });
});

// GitHub Integration endpoints
app.post('/api/integration/github/connect', (req, res) => {
  const { projectId, repoUrl, branch } = req.body;
  res.status(200).json({
    message: 'GitHub repository linked successfully (Stub)',
    integration: {
      projectId,
      repoUrl,
      branch: branch || 'main',
      connectedAt: new Date().toISOString()
    }
  });
});

app.get('/api/integration/github/:projectId/summary', (req, res) => {
  res.status(200).json({
    projectId: req.params.projectId,
    stats: {
      totalCommits: 84,
      openPullRequests: 3,
      closedPullRequests: 12,
      openIssues: 4,
      contributors: [
        { name: 'Nandini Kanaujiya', commits: 35 },
        { name: 'Team Member 2', commits: 27 },
        { name: 'Team Member 3', commits: 22 }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Integration Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
