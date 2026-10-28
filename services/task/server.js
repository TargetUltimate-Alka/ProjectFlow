const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createDatabase } = require('../../shared/db');
const { createEventBus } = require('../../shared/eventBus');
const { authenticate } = require('../../shared/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.TASK_PORT || 5003;

let db;
let projectDb;
let tasksCollection;
let courseTeamsCollection;
let projectsCollection;
let coursesCollection;
let eventBus;

// Helper: Normalize ID comparison
function matchId(docId, targetId) {
  if (!docId || !targetId) return false;
  return String(docId) === String(targetId);
}

// Helper: Resolve Team and Project
async function resolveTeamAndCourse(projectId, teamId, courseId) {
  let team = null;
  let project = null;
  let course = null;

  if (teamId) {
    team = await courseTeamsCollection.findOne({
      $or: [{ _id: teamId }, { id: teamId }]
    });
  }

  if (!team && projectId) {
    team = await courseTeamsCollection.findOne({
      $or: [{ projectId: projectId }]
    });
  }

  if (projectId) {
    project = await projectsCollection.findOne({
      $or: [{ _id: projectId }, { id: projectId }]
    });
  } else if (team && team.projectId) {
    project = await projectsCollection.findOne({
      $or: [{ _id: team.projectId }, { id: team.projectId }]
    });
  }

  const effectiveCourseId = courseId || (team && team.courseId) || (project && project.courseId);
  if (effectiveCourseId) {
    course = await coursesCollection.findOne({
      $or: [{ _id: effectiveCourseId }, { id: effectiveCourseId }, { code: effectiveCourseId }]
    });
  }

  return { team, project, course };
}

// Helper: Check Role Authorization
function checkAccess(user, team, course) {
  if (!user) return { allowed: false, reason: 'Authentication required' };
  const role = (user.role || '').toLowerCase();
  const userEmail = (user.email || '').toLowerCase();

  // Admin / System have universal supervision access
  if (role === 'admin' || role === 'system') {
    return { allowed: true, isLead: true, isFaculty: true };
  }

  // Faculty supervision permissions
  if (role === 'faculty') {
    const assignedEmails = [
      (course?.facultyEmail || '').toLowerCase(),
      (team?.facultyEmail || '').toLowerCase(),
      (course?.assignedFacultyEmail || '').toLowerCase()
    ].filter(Boolean);

    const isAssigned = assignedEmails.includes(userEmail) ||
      (course && !course.facultyEmail) || // fallback if open
      (team && !team.facultyEmail);

    if (!isAssigned && assignedEmails.length > 0) {
      return {
        allowed: false,
        reason: `Access denied. You are not the assigned faculty supervisor for ${course?.code || 'this course'}.`
      };
    }
    return { allowed: true, isLead: false, isFaculty: true };
  }

  // Student permissions: check team membership
  if (role === 'student') {
    if (!team) {
      return { allowed: true, isLead: false, isFaculty: false };
    }

    const teamLeadEmail = (team.teamLeadEmail || '').toLowerCase();
    const isLead = userEmail === teamLeadEmail ||
      (Array.isArray(team.members) && team.members.some(m => (m.email || '').toLowerCase() === userEmail && m.isLeader));

    const isMember = isLead ||
      (Array.isArray(team.members) && team.members.some(m => (m.email || '').toLowerCase() === userEmail));

    if (!isMember) {
      return {
        allowed: false,
        reason: `Access denied. You are not an authorized member of team '${team.name || 'this team'}'. Students can only access their own team workspace.`
      };
    }

    return { allowed: true, isLead, isFaculty: false };
  }

  return { allowed: false, reason: 'Unauthorized role.' };
}

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'task-service', status: 'healthy', dbType: db.type });
});

// 1. GET /tasks - List tasks with permissions & filtering
app.get('/tasks', authenticate, async (req, res) => {
  try {
    const { projectId, teamId, courseId, status, priority, assigneeId } = req.query;

    const { team, project, course } = await resolveTeamAndCourse(projectId, teamId, courseId);

    if (team) {
      const access = checkAccess(req.user, team, course);
      if (!access.allowed) {
        return res.status(403).json({ error: access.reason });
      }
    }

    // Build query filter
    const query = {};
    if (projectId) {
      query.projectId = projectId;
    } else if (team && team.projectId) {
      query.projectId = team.projectId;
    } else if (teamId) {
      query.teamId = teamId;
    }

    if (status && status !== 'all') {
      if (status === 'completed') {
        query.status = 'completed';
      } else if (status === 'not_completed' || status === 'pending') {
        query.status = { $ne: 'completed' };
      } else {
        query.status = status;
      }
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (assigneeId && assigneeId !== 'all') {
      query.$or = [{ assigneeId }, { assigneeEmail: assigneeId }];
    }

    let tasks = await tasksCollection.find(query).toArray();

    // Ensure all tasks have proper taskNo and default fields
    tasks = tasks.map((t, idx) => ({
      _id: t._id || t.id,
      id: t.id || t._id,
      taskNo: t.taskNo || (idx + 1),
      title: t.title || 'Untitled Task',
      description: t.description || '',
      instructions: t.instructions || t.description || '',
      submissionRequirements: t.submissionRequirements || '',
      assigneeId: t.assigneeId || null,
      assigneeName: t.assigneeName || 'Unassigned',
      assigneeEmail: t.assigneeEmail || null,
      priority: t.priority || 'medium',
      status: t.status === 'completed' ? 'completed' : 'not_completed',
      dueDate: t.dueDate || null,
      attachments: Array.isArray(t.attachments) ? t.attachments : [],
      submission: t.submission || null,
      evaluation: t.evaluation || null,
      marks: t.evaluation && t.evaluation.marksAwarded !== undefined && t.evaluation.marksAwarded !== null
        ? `${t.evaluation.marksAwarded}/${t.evaluation.maxMarks || 10}`
        : '-',
      projectId: t.projectId,
      teamId: t.teamId || (team ? (team.id || team._id) : null),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    // Sort by taskNo ascending
    tasks.sort((a, b) => (Number(a.taskNo) || 0) - (Number(b.taskNo) || 0));

    res.json(tasks);
  } catch (err) {
    console.error('[TaskService] List tasks error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /tasks/:id - Task details with authorization
app.get('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(task.projectId, task.teamId, task.courseId);
    if (team) {
      const access = checkAccess(req.user, team, course);
      if (!access.allowed) {
        return res.status(403).json({ error: access.reason });
      }
    }

    const formattedTask = {
      ...task,
      id: task._id || task.id,
      taskNo: task.taskNo || 1,
      status: task.status === 'completed' ? 'completed' : 'not_completed',
      marks: task.evaluation && task.evaluation.marksAwarded !== undefined && task.evaluation.marksAwarded !== null
        ? `${task.evaluation.marksAwarded}/${task.evaluation.maxMarks || 10}`
        : '-'
    };

    res.json(formattedTask);
  } catch (err) {
    console.error('[TaskService] Get task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /tasks - Create and assign task (Team Lead / Faculty / Admin only)
app.post('/tasks', authenticate, async (req, res) => {
  try {
    const {
      projectId,
      teamId,
      courseId,
      title,
      description,
      instructions,
      submissionRequirements,
      assigneeId,
      assigneeName,
      assigneeEmail,
      priority,
      dueDate,
      attachments
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const { team, project, course } = await resolveTeamAndCourse(projectId, teamId, courseId);

    if (!team) {
      return res.status(400).json({ error: 'Valid team or project ID is required to create a task.' });
    }

    // Authorization: Only Team Lead, Faculty, or Admin
    const access = checkAccess(req.user, team, course);
    if (!access.allowed) {
      return res.status(403).json({ error: access.reason });
    }

    if (!access.isLead && !access.isFaculty && req.user.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({
        error: 'Only the authorized team lead or assigned faculty supervisor can create and assign tasks.'
      });
    }

    // Validate assignee belongs to the team
    const teamMembers = Array.isArray(team.members) ? team.members : [];
    let matchedMember = null;

    if (assigneeEmail || assigneeId || assigneeName) {
      matchedMember = teamMembers.find(m =>
        (assigneeEmail && (m.email || '').toLowerCase() === assigneeEmail.toLowerCase()) ||
        (assigneeId && (matchId(m.id, assigneeId) || matchId(m._id, assigneeId))) ||
        (assigneeName && (m.name || '').toLowerCase() === assigneeName.toLowerCase())
      );

      if (!matchedMember) {
        return res.status(400).json({
          error: `Assigned member must be an active member of team '${team.name}'. Cannot assign tasks to members of another team.`
        });
      }
    } else {
      return res.status(400).json({ error: 'A valid team member must be selected for task assignment.' });
    }

    // Determine next sequential task number for this project/team
    const existingTasks = await tasksCollection.find({
      $or: [
        { projectId: team.projectId || projectId },
        { teamId: team.id || team._id }
      ]
    }).toArray();

    const maxTaskNo = existingTasks.reduce((max, t) => Math.max(max, Number(t.taskNo) || 0), 0);
    const nextTaskNo = maxTaskNo + 1;

    // Process attachments
    const normalizedAttachments = Array.isArray(attachments)
      ? attachments.map(att => typeof att === 'string' ? { name: att, type: 'document' } : att)
      : (attachments ? [typeof attachments === 'string' ? { name: attachments, type: 'document' } : attachments] : []);

    const taskDoc = {
      projectId: team.projectId || projectId,
      teamId: team.id || team._id,
      courseId: team.courseId || courseId,
      taskNo: nextTaskNo,
      title: title.trim(),
      description: description ? description.trim() : '',
      instructions: instructions ? instructions.trim() : (description ? description.trim() : ''),
      submissionRequirements: submissionRequirements ? submissionRequirements.trim() : '',
      assigneeId: matchedMember.id || matchedMember._id || matchedMember.email,
      assigneeName: matchedMember.name,
      assigneeEmail: matchedMember.email,
      priority: priority || 'medium',
      status: 'not_completed',
      dueDate: dueDate || null,
      attachments: normalizedAttachments,
      submission: null,
      evaluation: null,
      createdBy: req.user.id || req.user.email,
      createdByName: req.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await tasksCollection.insertOne(taskDoc);

    await eventBus.publish('TaskCreated', {
      taskId: result.insertedId,
      taskNo: nextTaskNo,
      projectId: taskDoc.projectId,
      teamId: taskDoc.teamId,
      title: taskDoc.title,
      assigneeName: taskDoc.assigneeName,
      createdByName: req.user.name
    });

    res.status(201).json({
      id: result.insertedId,
      _id: result.insertedId,
      ...taskDoc,
      marks: '-'
    });
  } catch (err) {
    console.error('[TaskService] Create task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT /tasks/:id - Update or reassign task (Team Lead / Faculty / Admin only)
app.put('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      instructions,
      submissionRequirements,
      assigneeId,
      assigneeName,
      assigneeEmail,
      priority,
      status,
      dueDate,
      attachments,
      marks,
      evaluation
    } = req.body;

    const existingTask = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(existingTask.projectId, existingTask.teamId, existingTask.courseId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found for this task' });
    }

    const access = checkAccess(req.user, team, course);
    if (!access.allowed) {
      return res.status(403).json({ error: access.reason });
    }

    // Students CANNOT award themselves marks or modify evaluation
    if ((marks !== undefined || evaluation !== undefined) && !access.isFaculty && req.user.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({
        error: 'Students cannot award themselves marks or modify evaluation scores. Marks can only be awarded by authorized faculty.'
      });
    }

    // Regular team members cannot reassign tasks or modify definitions
    if (!access.isLead && !access.isFaculty && req.user.role?.toLowerCase() !== 'admin') {
      return res.status(403).json({
        error: 'Only the authorized team lead or faculty supervisor can modify or reassign tasks.'
      });
    }

    const update = { updatedAt: new Date().toISOString() };

    if (title && title.trim()) update.title = title.trim();
    if (description !== undefined) update.description = description.trim();
    if (instructions !== undefined) update.instructions = instructions.trim();
    if (submissionRequirements !== undefined) update.submissionRequirements = submissionRequirements.trim();

    // Reassignment validation
    if (assigneeEmail || assigneeId || assigneeName) {
      const teamMembers = Array.isArray(team.members) ? team.members : [];
      const matchedMember = teamMembers.find(m =>
        (assigneeEmail && (m.email || '').toLowerCase() === assigneeEmail.toLowerCase()) ||
        (assigneeId && (matchId(m.id, assigneeId) || matchId(m._id, assigneeId))) ||
        (assigneeName && (m.name || '').toLowerCase() === assigneeName.toLowerCase())
      );

      if (!matchedMember) {
        return res.status(400).json({
          error: `Cannot reassign task: Member must be an active member of team '${team.name}'.`
        });
      }

      update.assigneeId = matchedMember.id || matchedMember._id || matchedMember.email;
      update.assigneeName = matchedMember.name;
      update.assigneeEmail = matchedMember.email;
    }

    if (priority) update.priority = priority;
    if (status) update.status = status === 'completed' ? 'completed' : 'not_completed';
    if (dueDate !== undefined) update.dueDate = dueDate;
    if (attachments !== undefined) update.attachments = attachments;

    await tasksCollection.updateOne({ _id: existingTask._id }, { $set: update });
    const updatedTask = { ...existingTask, ...update };

    res.json({
      message: 'Task updated successfully',
      task: {
        ...updatedTask,
        id: updatedTask._id,
        marks: updatedTask.evaluation && updatedTask.evaluation.marksAwarded !== undefined
          ? `${updatedTask.evaluation.marksAwarded}/${updatedTask.evaluation.maxMarks || 10}`
          : '-'
      }
    });
  } catch (err) {
    console.error('[TaskService] Update task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. POST /tasks/:id/submit - Submit work for task (Assigned Member / Lead)
app.post('/tasks/:id/submit', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionDescription, attachment } = req.body;

    const existingTask = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(existingTask.projectId, existingTask.teamId, existingTask.courseId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found for this task' });
    }

    const access = checkAccess(req.user, team, course);
    if (!access.allowed) {
      return res.status(403).json({ error: access.reason });
    }

    // Check submission deadline
    if (existingTask.dueDate) {
      const deadline = new Date(existingTask.dueDate);
      if (!isNaN(deadline.getTime()) && Date.now() > deadline.getTime()) {
        return res.status(400).json({
          error: 'Submission deadline has passed. Late submissions are not permitted for this task.'
        });
      }
    }

    const submissionData = {
      description: submissionDescription ? submissionDescription.trim() : (existingTask.description || ''),
      attachment: attachment || null,
      submittedAt: new Date().toISOString(),
      submittedBy: req.user.name,
      submittedByEmail: req.user.email
    };

    const update = {
      status: 'completed',
      submission: submissionData,
      // Description column shows student's submission notes when submitted
      description: submissionData.description || existingTask.description,
      updatedAt: new Date().toISOString()
    };

    // If attachment was uploaded, add to task attachments list if not already present
    if (attachment && attachment.name) {
      const existingAttachments = Array.isArray(existingTask.attachments) ? [...existingTask.attachments] : [];
      if (!existingAttachments.some(a => (a.name || a) === attachment.name)) {
        existingAttachments.push(attachment);
        update.attachments = existingAttachments;
      }
    }

    await tasksCollection.updateOne({ _id: existingTask._id }, { $set: update });
    const updatedTask = { ...existingTask, ...update };

    await eventBus.publish('TaskSubmitted', {
      taskId: existingTask._id,
      taskNo: existingTask.taskNo,
      projectId: existingTask.projectId,
      teamId: existingTask.teamId,
      title: existingTask.title,
      submittedBy: req.user.name
    });

    res.json({
      message: 'Task submitted successfully.',
      task: {
        ...updatedTask,
        id: updatedTask._id,
        marks: updatedTask.evaluation && updatedTask.evaluation.marksAwarded !== undefined
          ? `${updatedTask.evaluation.marksAwarded}/${updatedTask.evaluation.maxMarks || 10}`
          : '-'
      }
    });
  } catch (err) {
    console.error('[TaskService] Submit task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. POST /tasks/:id/evaluate - Faculty evaluates task & awards marks
app.post('/tasks/:id/evaluate', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { marksAwarded, maxMarks = 10, feedback } = req.body;

    const userRole = (req.user?.role || '').toLowerCase();
    if (userRole !== 'faculty' && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Students cannot evaluate tasks or award marks. Only authorized faculty can grade submissions.'
      });
    }

    const existingTask = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(existingTask.projectId, existingTask.teamId, existingTask.courseId);
    const access = checkAccess(req.user, team, course);
    if (!access.allowed) {
      return res.status(403).json({ error: access.reason });
    }

    const parsedMarks = Number(marksAwarded);
    const parsedMax = Number(maxMarks) || 10;
    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > parsedMax) {
      return res.status(400).json({
        error: `Marks awarded must be a valid number between 0 and ${parsedMax}.`
      });
    }

    const evaluationData = {
      marksAwarded: parsedMarks,
      maxMarks: parsedMax,
      feedback: feedback ? feedback.trim() : '',
      evaluatedBy: req.user.name,
      evaluatedByEmail: req.user.email,
      evaluatedAt: new Date().toISOString()
    };

    const update = {
      evaluation: evaluationData,
      updatedAt: new Date().toISOString()
    };

    await tasksCollection.updateOne({ _id: existingTask._id }, { $set: update });
    const updatedTask = { ...existingTask, ...update };

    await eventBus.publish('TaskEvaluated', {
      taskId: existingTask._id,
      taskNo: existingTask.taskNo,
      projectId: existingTask.projectId,
      teamId: existingTask.teamId,
      title: existingTask.title,
      marksAwarded: parsedMarks,
      maxMarks: parsedMax,
      facultyName: req.user.name
    });

    res.json({
      message: 'Task evaluated successfully.',
      task: {
        ...updatedTask,
        id: updatedTask._id,
        marks: `${parsedMarks}/${parsedMax}`
      }
    });
  } catch (err) {
    console.error('[TaskService] Evaluate task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. GET /tasks/:id/attachments/:filename - Download task reference/submission attachment
app.get('/tasks/:id/attachments/:filename', authenticate, async (req, res) => {
  try {
    const { id, filename } = req.params;
    const task = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(task.projectId, task.teamId, task.courseId);
    if (team) {
      const access = checkAccess(req.user, team, course);
      if (!access.allowed) {
        return res.status(403).json({ error: access.reason });
      }
    }

    const cleanFilename = path.basename(filename);
    const ext = path.extname(cleanFilename).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' :
      ext === '.zip' ? 'application/zip' :
      ext === '.png' ? 'image/png' :
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);

    // Stream generated content for document simulation
    const dummyContent = Buffer.from(
      `ProjectFlow Academic Workspace Attachment\nTask: ${task.title} (Task No. ${task.taskNo || 1})\nFile: ${cleanFilename}\nGenerated: ${new Date().toISOString()}\nTeam: ${team ? team.name : 'Project Team'}\n`,
      'utf-8'
    );
    res.send(dummyContent);
  } catch (err) {
    console.error('[TaskService] Download attachment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. DELETE /tasks/:id - Delete task (Team Lead / Faculty / Admin only)
app.delete('/tasks/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await tasksCollection.findOne({ $or: [{ _id: id }, { id }] });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { team, course } = await resolveTeamAndCourse(task.projectId, task.teamId, task.courseId);
    if (team) {
      const access = checkAccess(req.user, team, course);
      if (!access.allowed) {
        return res.status(403).json({ error: access.reason });
      }

      if (!access.isLead && !access.isFaculty && req.user.role?.toLowerCase() !== 'admin') {
        return res.status(403).json({
          error: 'Only the authorized team lead or faculty supervisor can delete tasks.'
        });
      }
    }

    await tasksCollection.deleteOne({ _id: task._id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('[TaskService] Delete task error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Compatibility route: GET /projects/:projectId/tasks
app.get('/projects/:projectId/tasks', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assigneeId } = req.query;

    const filter = { projectId };
    if (status && status !== 'all') {
      filter.status = status === 'completed' ? 'completed' : { $ne: 'completed' };
    }
    if (priority && priority !== 'all') filter.priority = priority;
    if (assigneeId && assigneeId !== 'all') filter.assigneeId = assigneeId;

    let tasks = await tasksCollection.find(filter).toArray();
    tasks = tasks.map((t, idx) => ({
      _id: t._id || t.id,
      id: t.id || t._id,
      taskNo: t.taskNo || (idx + 1),
      title: t.title,
      description: t.description || '',
      instructions: t.instructions || t.description || '',
      submissionRequirements: t.submissionRequirements || '',
      assigneeId: t.assigneeId,
      assigneeName: t.assigneeName || 'Unassigned',
      assigneeEmail: t.assigneeEmail || null,
      priority: t.priority || 'medium',
      status: t.status === 'completed' ? 'completed' : 'not_completed',
      dueDate: t.dueDate,
      attachments: t.attachments || [],
      submission: t.submission || null,
      evaluation: t.evaluation || null,
      marks: t.evaluation && t.evaluation.marksAwarded !== undefined ? `${t.evaluation.marksAwarded}/${t.evaluation.maxMarks || 10}` : '-'
    }));

    tasks.sort((a, b) => (Number(a.taskNo) || 0) - (Number(b.taskNo) || 0));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  db = await createDatabase('task-service', 'task_db');
  tasksCollection = db.collection('tasks');

  projectDb = await createDatabase('task-service', 'project_db');
  courseTeamsCollection = projectDb.collection('courseTeams');
  projectsCollection = projectDb.collection('projects');
  coursesCollection = projectDb.collection('courses');

  eventBus = await createEventBus('task-service');

  app.listen(PORT, () => {
    console.log(`[TaskService] Active on port ${PORT} with databases 'task_db' & 'project_db'`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Task Service:', err);
});
