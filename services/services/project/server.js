const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createDatabase, generateId } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const { authenticate, authorizeRoles } = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PROJECT_PORT || 5002;
const INTEGRATION_SERVICE_URL = process.env.INTEGRATION_SERVICE_URL || 'http://localhost:5005';

let db;
let projectsCollection;
let teamMembersCollection;
let requirementsCollection;
let criteriaCollection;
let projectMilestonesCollection;
let documentsCollection;
let eventBus;

// Default Criteria Rule Sets (Configurable by Admin)
const DEFAULT_CRITERIA = [
  {
    code: 'M1',
    name: 'Milestone 1: Project Genesis & Scaffolding',
    description: 'Initial repository setup, architectural scaffolding, initial commits, and Requirements Document (SRS).',
    minCommits: 5,
    minPRs: 1,
    minMergedPRs: 1,
    minClosedIssues: 1,
    requiredDocType: 'SRS',
    order: 1
  },
  {
    code: 'M2',
    name: 'Milestone 2: Core Development & Architecture',
    description: 'Full microservice development, team collaboration PRs, closed feature issues, and Architecture Documentation.',
    minCommits: 10,
    minPRs: 3,
    minMergedPRs: 2,
    minClosedIssues: 3,
    requiredDocType: 'Architecture Design',
    order: 2
  },
  {
    code: 'M3',
    name: 'Milestone 3: Evaluation, Testing & Final Report',
    description: 'Comprehensive test coverage, final pull requests merged, resolved issues, and Final Capstone Report.',
    minCommits: 15,
    minPRs: 4,
    minMergedPRs: 3,
    minClosedIssues: 5,
    requiredDocType: 'Final Report',
    order: 3
  }
];

async function seedCriteriaIfEmpty() {
  const count = await criteriaCollection.countDocuments({});
  if (count === 0) {
    console.log('[ProjectService] Seeding default milestone evaluation criteria...');
    for (const crit of DEFAULT_CRITERIA) {
      await criteriaCollection.insertOne(crit);
    }
  }
}

// Milestone Evaluation Rule Engine
// Evaluates GitHub evidence + manual documents against defined criteria rules
async function evaluateMilestonesForProject(projectId) {
  try {
    const project = await projectsCollection.findOne({ _id: projectId });
    if (!project) return;

    // 1. Fetch GitHub evidence from Integration Service
    let evidence = {
      connected: false,
      totalCommits: 0,
      totalPRs: 0,
      mergedPRs: 0,
      closedIssues: 0,
      totalContributors: 0
    };

    try {
      const resp = await axios.get(`${INTEGRATION_SERVICE_URL}/github/${projectId}/evidence`, { timeout: 4000 });
      if (resp.data) evidence = resp.data;
    } catch (e) {
      console.warn(`[ProjectService] Could not retrieve GitHub evidence for project ${projectId}:`, e.message);
    }

    // 2. Fetch project documents
    const docs = await documentsCollection.find({ projectId }).toArray();
    const uploadedDocTypes = new Set(docs.map(d => (d.type || '').toLowerCase()));

    // 3. Fetch active criteria
    const criteriaList = await criteriaCollection.find({}).sort({ order: 1 }).toArray();

    // 4. Evaluate each milestone
    for (const crit of criteriaList) {
      const evidenceList = [];
      let totalWeight = 0;
      let achievedWeight = 0;

      // Rule: Repo connection (Weight: 10)
      totalWeight += 10;
      if (evidence.connected) {
        achievedWeight += 10;
        evidenceList.push(`✓ GitHub repository connected (${evidence.repoFullName || 'Active'})`);
      } else {
        evidenceList.push(`✗ GitHub repository not connected`);
      }

      // Rule: Commits (Weight: 25)
      totalWeight += 25;
      const commitCount = evidence.totalCommits || 0;
      const commitScore = Math.min(1, commitCount / Math.max(1, crit.minCommits));
      achievedWeight += commitScore * 25;
      if (commitCount >= crit.minCommits) {
        evidenceList.push(`✓ Commits: ${commitCount}/${crit.minCommits} commits detected`);
      } else {
        evidenceList.push(`⏳ Commits: ${commitCount}/${crit.minCommits} commits (${crit.minCommits - commitCount} remaining)`);
      }

      // Rule: Pull Requests / Merges (Weight: 25)
      totalWeight += 25;
      const mergedCount = evidence.mergedPRs || 0;
      const prScore = Math.min(1, mergedCount / Math.max(1, crit.minMergedPRs));
      achievedWeight += prScore * 25;
      if (mergedCount >= crit.minMergedPRs) {
        evidenceList.push(`✓ Merged PRs: ${mergedCount}/${crit.minMergedPRs} merged pull requests`);
      } else {
        evidenceList.push(`⏳ Merged PRs: ${mergedCount}/${crit.minMergedPRs} merged (${crit.minMergedPRs - mergedCount} remaining)`);
      }

      // Rule: Issues closed (Weight: 20)
      totalWeight += 20;
      const issueCount = evidence.closedIssues || 0;
      const issueScore = Math.min(1, issueCount / Math.max(1, crit.minClosedIssues));
      achievedWeight += issueScore * 20;
      if (issueCount >= crit.minClosedIssues) {
        evidenceList.push(`✓ Issues Closed: ${issueCount}/${crit.minClosedIssues} completed issues`);
      } else {
        evidenceList.push(`⏳ Issues Closed: ${issueCount}/${crit.minClosedIssues} closed`);
      }

      // Rule: Required Document Artifact (Weight: 20) - manual upload verification
      if (crit.requiredDocType) {
        totalWeight += 20;
        const hasDoc = uploadedDocTypes.has(crit.requiredDocType.toLowerCase());
        if (hasDoc) {
          achievedWeight += 20;
          evidenceList.push(`✓ Document Artifact: ${crit.requiredDocType} verified in Documents`);
        } else {
          evidenceList.push(`⏳ Document Artifact: ${crit.requiredDocType} required (upload in Documents)`);
        }
      }

      const calculatedPercentage = Math.round((achievedWeight / totalWeight) * 100);
      const isCompleted = calculatedPercentage >= 100;
      const status = isCompleted ? 'Completed' : (calculatedPercentage > 0 ? 'In Progress' : 'Not Started');

      // Check previous milestone state
      const existing = await projectMilestonesCollection.findOne({ projectId, criteriaCode: crit.code });
      const wasCompleted = existing && existing.status === 'Completed';

      await projectMilestonesCollection.updateOne(
        { projectId, criteriaCode: crit.code },
        {
          $set: {
            projectId,
            criteriaCode: crit.code,
            name: crit.name,
            description: crit.description,
            percentage: calculatedPercentage,
            status,
            evidenceList,
            lastCheckedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      // Trigger RabbitMQ events when milestone status progresses
      if (isCompleted && !wasCompleted) {
        console.log(`[ProjectService] Milestone ${crit.code} REACHED 100% for project ${projectId}!`);
        await eventBus.publish('MilestoneCompleted', {
          projectId,
          projectName: project.name,
          milestoneName: crit.name,
          percentage: 100
        });
      } else if (!existing || existing.percentage !== calculatedPercentage) {
        await eventBus.publish('MilestoneStateChanged', {
          projectId,
          projectName: project.name,
          milestoneName: crit.name,
          percentage: calculatedPercentage,
          status
        });
      }
    }
  } catch (err) {
    console.error(`[ProjectService] Error in evaluateMilestonesForProject (${projectId}):`, err);
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'project-service', status: 'healthy', dbType: db.type });
});

// Create Project
app.post('/projects', authenticate, async (req, res) => {
  try {
    const { name, description, facultyId, facultyName } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const projectDoc = {
      name: name.trim(),
      description: description ? description.trim() : '',
      status: 'In Progress',
      leadId: req.user.id,
      leadName: req.user.name || 'Team Lead',
      leadEmail: req.user.email,
      facultyId: facultyId || null,
      facultyName: facultyName || (facultyId ? 'Assigned Faculty' : 'Unassigned'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await projectsCollection.insertOne(projectDoc);
    const projectId = result.insertedId;

    // Automatically add creating student as Team Leader
    await teamMembersCollection.insertOne({
      projectId,
      userId: req.user.id,
      name: req.user.name || 'Student Lead',
      email: req.user.email,
      role: 'Team Lead',
      isLeader: true,
      addedAt: new Date().toISOString()
    });

    // Populate initial milestones based on active criteria
    await evaluateMilestonesForProject(projectId);

    await eventBus.publish('ProjectCreated', {
      projectId,
      name: projectDoc.name,
      leadName: projectDoc.leadName,
      leadEmail: projectDoc.leadEmail,
      facultyId: projectDoc.facultyId
    });

    res.status(201).json({
      message: 'Project created successfully',
      project: { id: projectId, ...projectDoc }
    });
  } catch (err) {
    console.error('[ProjectService] Create project error:', err);
    res.status(500).json({ error: err.message });
  }
});

// List Projects
app.get('/projects', authenticate, async (req, res) => {
  try {
    const userRole = (req.user.role || '').toLowerCase();
    let filter = {};

    if (userRole === 'student') {
      // Find projects where user is lead or a team member
      const teamEntries = await teamMembersCollection.find({ userId: req.user.id }).toArray();
      const projectIds = teamEntries.map(t => t.projectId);
      filter = { $or: [{ leadId: req.user.id }, { _id: { $in: projectIds } }] };
    } else if (userRole === 'faculty') {
      // Find projects assigned to this faculty member, or allow viewing all
      if (req.query.assignedOnly === 'true') {
        filter = { facultyId: req.user.id };
      }
    }

    const projects = await projectsCollection.find(filter).toArray();

    // Enrich with team count, milestone progress, and connection state
    const enriched = await Promise.all(projects.map(async (p) => {
      const teamCount = await teamMembersCollection.countDocuments({ projectId: p._id });
      const milestones = await projectMilestonesCollection.find({ projectId: p._id }).toArray();
      const avgPercentage = milestones.length > 0
        ? Math.round(milestones.reduce((acc, m) => acc + (m.percentage || 0), 0) / milestones.length)
        : 0;

      return {
        id: p._id,
        name: p.name,
        description: p.description,
        status: p.status,
        leadName: p.leadName,
        leadEmail: p.leadEmail,
        facultyId: p.facultyId,
        facultyName: p.facultyName,
        teamSize: teamCount,
        progressPercentage: avgPercentage,
        milestonesCompleted: milestones.filter(m => m.status === 'Completed').length,
        totalMilestones: milestones.length,
        createdAt: p.createdAt
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project Details
app.get('/projects/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectsCollection.findOne({ _id: id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const team = await teamMembersCollection.find({ projectId: id }).toArray();
    const requirements = await requirementsCollection.find({ projectId: id }).toArray();
    const milestones = await projectMilestonesCollection.find({ projectId: id }).toArray();
    const documents = await documentsCollection.find({ projectId: id }).toArray();

    const avgPercentage = milestones.length > 0
      ? Math.round(milestones.reduce((acc, m) => acc + (m.percentage || 0), 0) / milestones.length)
      : 0;

    res.json({
      id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      leadId: project.leadId,
      leadName: project.leadName,
      leadEmail: project.leadEmail,
      facultyId: project.facultyId,
      facultyName: project.facultyName,
      teamSize: team.length,
      progressPercentage: avgPercentage,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      team: team.map(t => ({
        id: t._id,
        name: t.name,
        email: t.email,
        role: t.role,
        isLeader: t.isLeader,
        addedAt: t.addedAt
      })),
      requirementsCount: requirements.length,
      milestonesCount: milestones.length,
      documentsCount: documents.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Project
app.put('/projects/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, facultyId, facultyName } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (description !== undefined) update.description = description.trim();
    if (status) update.status = status;
    if (facultyId !== undefined) {
      update.facultyId = facultyId;
      if (facultyName) update.facultyName = facultyName;
    }

    await projectsCollection.updateOne({ _id: id }, { $set: update });
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Project
app.delete('/projects/:id', authenticate, authorizeRoles('Admin', 'Student'), async (req, res) => {
  try {
    const { id } = req.params;
    await projectsCollection.deleteOne({ _id: id });
    await teamMembersCollection.deleteMany({ projectId: id });
    await requirementsCollection.deleteMany({ projectId: id });
    await projectMilestonesCollection.deleteMany({ projectId: id });
    await documentsCollection.deleteMany({ projectId: id });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Team Management
app.get('/projects/:id/team', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const members = await teamMembersCollection.find({ projectId: id }).toArray();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/projects/:id/team/members', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isLeader } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const memberDoc = {
      projectId: id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'Developer',
      isLeader: Boolean(isLeader),
      addedAt: new Date().toISOString()
    };

    const result = await teamMembersCollection.insertOne(memberDoc);
    res.status(201).json({ id: result.insertedId, ...memberDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/projects/:id/team/members/:memberId', authenticate, async (req, res) => {
  try {
    const { id, memberId } = req.params;
    await teamMembersCollection.deleteOne({ _id: memberId, projectId: id });
    res.json({ message: 'Member removed from team' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Requirements (Manually entered by students per SRS)
app.get('/projects/:id/requirements', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const reqs = await requirementsCollection.find({ projectId: id }).toArray();
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/projects/:id/requirements', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const count = await requirementsCollection.countDocuments({ projectId: id });
    const reqCode = `REQ-${String(count + 1).padStart(2, '0')}`;

    const newReq = {
      projectId: id,
      reqCode,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      category: category || 'Functional',
      status: 'Pending',
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: new Date().toISOString()
    };

    const result = await requirementsCollection.insertOne(newReq);
    res.status(201).json({ id: result.insertedId, ...newReq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/projects/:id/requirements/:reqId', authenticate, async (req, res) => {
  try {
    const { id, reqId } = req.params;
    const { title, description, priority, status } = req.body;
    const update = {};
    if (title) update.title = title.trim();
    if (description !== undefined) update.description = description.trim();
    if (priority) update.priority = priority;
    if (status) update.status = status;

    await requirementsCollection.updateOne({ _id: reqId, projectId: id }, { $set: update });
    res.json({ message: 'Requirement updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/projects/:id/requirements/:reqId', authenticate, async (req, res) => {
  try {
    const { id, reqId } = req.params;
    await requirementsCollection.deleteOne({ _id: reqId, projectId: id });
    res.json({ message: 'Requirement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Milestones & Progress
app.get('/projects/:id/milestones', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    // Always trigger recalculation on read to ensure newest GitHub evidence is reflected
    await evaluateMilestonesForProject(id);
    const milestones = await projectMilestonesCollection.find({ projectId: id }).toArray();
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/projects/:id/milestones/recalculate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await evaluateMilestonesForProject(id);
    const milestones = await projectMilestonesCollection.find({ projectId: id }).toArray();
    res.json({ message: 'Milestones recalculated successfully', milestones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Milestone Evaluation Criteria Management
app.get('/criteria', authenticate, async (req, res) => {
  try {
    const criteria = await criteriaCollection.find({}).sort({ order: 1 }).toArray();
    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/criteria', authenticate, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { name, description, minCommits, minPRs, minMergedPRs, minClosedIssues, requiredDocType } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const count = await criteriaCollection.countDocuments({});
    const critDoc = {
      code: `M${count + 1}`,
      name: name.trim(),
      description: description || '',
      minCommits: parseInt(minCommits || 0, 10),
      minPRs: parseInt(minPRs || 0, 10),
      minMergedPRs: parseInt(minMergedPRs || 0, 10),
      minClosedIssues: parseInt(minClosedIssues || 0, 10),
      requiredDocType: requiredDocType || '',
      order: count + 1,
      createdAt: new Date().toISOString()
    };

    const result = await criteriaCollection.insertOne(critDoc);
    res.status(201).json({ id: result.insertedId, ...critDoc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/criteria/:id', authenticate, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, minCommits, minPRs, minMergedPRs, minClosedIssues, requiredDocType } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (description !== undefined) update.description = description.trim();
    if (minCommits !== undefined) update.minCommits = parseInt(minCommits, 10);
    if (minPRs !== undefined) update.minPRs = parseInt(minPRs, 10);
    if (minMergedPRs !== undefined) update.minMergedPRs = parseInt(minMergedPRs, 10);
    if (minClosedIssues !== undefined) update.minClosedIssues = parseInt(minClosedIssues, 10);
    if (requiredDocType !== undefined) update.requiredDocType = requiredDocType;

    await criteriaCollection.updateOne({ _id: id }, { $set: update });
    res.json({ message: 'Criteria updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/criteria/:id', authenticate, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await criteriaCollection.deleteOne({ _id: id });
    res.json({ message: 'Criteria rule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Documents (Manual file uploads / records per SRS)
app.get('/projects/:id/documents', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const docs = await documentsCollection.find({ projectId: id }).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/projects/:id/documents', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, fileUrl, fileSize } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Document name and type are required' });
    }

    const doc = {
      projectId: id,
      name: name.trim(),
      type: type.trim(), // e.g. 'SRS', 'Architecture Design', 'Final Report', 'User Manual'
      fileUrl: fileUrl || `https://projectflow.academic.storage/docs/${id}/${encodeURIComponent(name)}.pdf`,
      fileSize: fileSize || '1.8 MB',
      uploadedBy: req.user.id,
      uploadedByName: req.user.name,
      uploadedAt: new Date().toISOString()
    };

    const result = await documentsCollection.insertOne(doc);

    // Re-evaluate milestones because documents may satisfy milestone criteria
    await evaluateMilestonesForProject(id);

    await eventBus.publish('DocumentUploaded', {
      projectId: id,
      docName: doc.name,
      docType: doc.type,
      uploadedBy: doc.uploadedByName
    });

    res.status(201).json({ id: result.insertedId, ...doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/projects/:id/documents/:docId', authenticate, async (req, res) => {
  try {
    const { id, docId } = req.params;
    await documentsCollection.deleteOne({ _id: docId, projectId: id });
    await evaluateMilestonesForProject(id);
    res.json({ message: 'Document removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comprehensive Project Overview
app.get('/projects/:id/overview', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectsCollection.findOne({ _id: id });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const team = await teamMembersCollection.find({ projectId: id }).toArray();
    const requirements = await requirementsCollection.find({ projectId: id }).toArray();
    const milestones = await projectMilestonesCollection.find({ projectId: id }).toArray();
    const documents = await documentsCollection.find({ projectId: id }).toArray();

    let githubStats = { connected: false, totalCommits: 0, totalPRs: 0, mergedPRs: 0, closedIssues: 0 };
    try {
      const ghRes = await axios.get(`${INTEGRATION_SERVICE_URL}/github/${id}/status`, { timeout: 3000 });
      if (ghRes.data) githubStats = ghRes.data;
    } catch (e) {
      // safe fallback
    }

    const avgPercentage = milestones.length > 0
      ? Math.round(milestones.reduce((acc, m) => acc + (m.percentage || 0), 0) / milestones.length)
      : 0;

    res.json({
      project,
      team,
      requirements,
      milestones,
      documents,
      githubStats,
      progressPercentage: avgPercentage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('project-service', 'project_db');
  projectsCollection = db.collection('projects');
  teamMembersCollection = db.collection('teamMembers');
  requirementsCollection = db.collection('requirements');
  criteriaCollection = db.collection('criteria');
  projectMilestonesCollection = db.collection('projectMilestones');
  documentsCollection = db.collection('documents');

  await seedCriteriaIfEmpty();

  eventBus = await createEventBus('project-service');

  // Listen for SyncCompleted events from Integration Service to automatically trigger milestone re-evaluation
  await eventBus.subscribe('SyncCompleted', async (event) => {
    if (event.payload?.projectId) {
      console.log(`[ProjectService] Received SyncCompleted event for project ${event.payload.projectId}. Re-evaluating milestones...`);
      await evaluateMilestonesForProject(event.payload.projectId);
    }
  });

  app.listen(PORT, () => {
    console.log(`[ProjectService] Running on port ${PORT} with database 'project_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Project Service:', err);
});
