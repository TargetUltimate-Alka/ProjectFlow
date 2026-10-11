const express = require('express');
const cors = require('cors');
const { createDatabase } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const { authenticate, authorizeRoles } = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.EVALUATION_PORT || 5004;

let db;
let evaluationsCollection;
let eventBus;

// Default Rubric Schema Structure
const DEFAULT_RUBRIC_TEMPLATE = [
  { key: 'requirements', name: 'Requirements & Scope Management', maxScore: 20, description: 'Completeness of functional/non-functional requirements and trace.' },
  { key: 'implementation', name: 'Software Architecture & Code Quality', maxScore: 25, description: 'Code modularity, design patterns, separation of concerns, and clean code.' },
  { key: 'githubDevelopment', name: 'GitHub Development & Git Hygiene', maxScore: 25, description: 'Commit frequency, pull request reviews, branches, contributor balance.' },
  { key: 'documentation', name: 'Documentation & System Artifacts', maxScore: 15, description: 'SRS document, architecture diagrams, user manual, and reports.' },
  { key: 'projectProgress', name: 'Project Progress & Milestone Delivery', maxScore: 15, description: 'Timely milestone progress and milestone rule achievements.' }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'evaluation-service', status: 'healthy', dbType: db.type });
});

// Get Rubric Template
app.get('/evaluations/rubric-template', authenticate, (req, res) => {
  res.json(DEFAULT_RUBRIC_TEMPLATE);
});

// Create Evaluation (Faculty only)
app.post('/evaluations', authenticate, authorizeRoles('Faculty', 'Admin'), async (req, res) => {
  try {
    const {
      projectId,
      projectName,
      scores, // { requirements: 18, implementation: 23, githubDevelopment: 24, documentation: 14, projectProgress: 14 }
      feedback,
      recommendations,
      status
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const validatedScores = {};
    let totalScore = 0;
    let maxScore = 0;

    for (const item of DEFAULT_RUBRIC_TEMPLATE) {
      const enteredVal = Number(scores?.[item.key] ?? 0);
      const boundedVal = Math.min(item.maxScore, Math.max(0, enteredVal));
      validatedScores[item.key] = boundedVal;
      totalScore += boundedVal;
      maxScore += item.maxScore;
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const evaluationDoc = {
      projectId,
      projectName: projectName || 'CapStone Project',
      facultyId: req.user.id,
      facultyName: req.user.name,
      facultyEmail: req.user.email,
      scores: validatedScores,
      totalScore,
      maxScore,
      percentage,
      feedback: feedback ? feedback.trim() : '',
      recommendations: recommendations ? recommendations.trim() : '',
      status: status || 'submitted', // 'draft' | 'submitted'
      evaluatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      disclaimer: 'GitHub evidence informs the evaluation, but the score itself is an academic faculty decision.'
    };

    const result = await evaluationsCollection.insertOne(evaluationDoc);

    if (evaluationDoc.status === 'submitted') {
      await eventBus.publish('EvaluationCompleted', {
        evaluationId: result.insertedId,
        projectId,
        projectName: evaluationDoc.projectName,
        facultyName: req.user.name,
        totalScore,
        maxScore,
        percentage
      });
    }

    res.status(201).json({ id: result.insertedId, ...evaluationDoc });
  } catch (err) {
    console.error('[EvaluationService] Create evaluation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get evaluations for a project
app.get('/evaluations/:projectId', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const evaluations = await evaluationsCollection.find({ projectId }).sort({ evaluatedAt: -1 }).toArray();
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update evaluation
app.put('/evaluations/:id', authenticate, authorizeRoles('Faculty', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { scores, feedback, recommendations, status } = req.body;

    const existing = await evaluationsCollection.findOne({ _id: id });
    if (!existing) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    const validatedScores = { ...existing.scores };
    let totalScore = 0;
    let maxScore = 0;

    for (const item of DEFAULT_RUBRIC_TEMPLATE) {
      if (scores && scores[item.key] !== undefined) {
        const val = Number(scores[item.key]);
        validatedScores[item.key] = Math.min(item.maxScore, Math.max(0, val));
      }
      totalScore += (validatedScores[item.key] || 0);
      maxScore += item.maxScore;
    }

    const update = {
      scores: validatedScores,
      totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      updatedAt: new Date().toISOString()
    };

    if (feedback !== undefined) update.feedback = feedback.trim();
    if (recommendations !== undefined) update.recommendations = recommendations.trim();
    if (status) update.status = status;

    await evaluationsCollection.updateOne({ _id: id }, { $set: update });

    res.json({ message: 'Evaluation updated successfully', evaluation: { ...existing, ...update } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List evaluations by faculty
app.get('/evaluations/faculty/:facultyId', authenticate, async (req, res) => {
  try {
    const { facultyId } = req.params;
    const evals = await evaluationsCollection.find({ facultyId }).sort({ evaluatedAt: -1 }).toArray();
    res.json(evals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('evaluation-service', 'evaluation_db');
  evaluationsCollection = db.collection('evaluations');
  eventBus = await createEventBus('evaluation-service');

  app.listen(PORT, () => {
    console.log(`[EvaluationService] Running on port ${PORT} with database 'evaluation_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Evaluation Service:', err);
});
