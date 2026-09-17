const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/evaluation_db';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Evaluation Service', database: 'evaluation_db' });
});

// Evaluation endpoints
app.post('/api/evaluations', (req, res) => {
  const { projectId, milestoneId, rubrics, totalMarks, feedback } = req.body;
  res.status(201).json({
    message: 'Evaluation recorded successfully (Stub)',
    evaluation: {
      id: 'mock-eval-id',
      projectId,
      milestoneId,
      rubrics,
      totalMarks,
      feedback,
      evaluatedAt: new Date().toISOString()
    }
  });
});

app.get('/api/evaluations/project/:projectId', (req, res) => {
  res.status(200).json({
    evaluations: [
      {
        id: 'mock-eval-1',
        projectId: req.params.projectId,
        milestoneId: 'milestone-1',
        totalMarks: 25,
        feedback: 'Initial architecture look solid. Keep it modular.'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[Evaluation Service] Running on port ${PORT} with DB: ${MONGO_URI}`);
});
