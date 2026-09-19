const bcrypt = require('bcryptjs');
const { createDatabase } = require('../shared/db');

async function seed() {
  console.log('--- Starting ProjectFlow Seed Script ---');

  // 1. Auth Service Database (auth_db)
  const authDb = await createDatabase('seed-auth', 'auth_db');
  const usersCol = authDb.collection('users');
  await usersCol.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const users = [
    {
      name: 'Dr. Arthur Vance',
      email: 'admin@projectflow.edu',
      passwordHash: adminPasswordHash,
      role: 'Admin',
      status: 'active',
      department: 'Academic Administration & Capstone Oversight',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Dr. Robert Harrison',
      email: 'dr.harrison@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Systems & Networking',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Dr. Sarah Patel',
      email: 'dr.patel@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Software Architecture',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    }
  ];

  await usersCol.insertMany(users);
  const studentAlex = await usersCol.findOne({ email: 'alex.chen@student.edu' });
  const facultyHarrison = await usersCol.findOne({ email: 'dr.harrison@projectflow.edu' });
  console.log('✓ Seeded 7 users into auth_db (1 Admin, 2 Faculty, 4 Students)');

  // 2. Project Service Database (project_db)
  const projDb = await createDatabase('seed-proj', 'project_db');
  const projectsCol = projDb.collection('projects');
  const teamCol = projDb.collection('teamMembers');
  const reqsCol = projDb.collection('requirements');
  const critCol = projDb.collection('criteria');
  const msCol = projDb.collection('projectMilestones');
  const docsCol = projDb.collection('documents');

  await projectsCol.deleteMany({});
  await teamCol.deleteMany({});
  await reqsCol.deleteMany({});
  await critCol.deleteMany({});
  await msCol.deleteMany({});
  await docsCol.deleteMany({});

  // Seed Criteria
  const criteria = [
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
  await critCol.insertMany(criteria);

  // Seed Project
  const project = {
    name: 'Distributed Real-time Cloud Pipeline (ProjectFlow)',
    description: 'A fault-tolerant microservices platform with automated GitHub synchronization and dynamic milestone evaluation for academic software teams.',
    status: 'In Progress',
    leadId: studentAlex._id,
    leadName: 'Alex Chen',
    leadEmail: 'alex.chen@student.edu',
    facultyId: facultyHarrison._id,
    facultyName: 'Dr. Robert Harrison',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date().toISOString()
  };
  const projResult = await projectsCol.insertOne(project);
  const projectId = projResult.insertedId;

  // Seed Team
  await teamCol.insertMany([
    { projectId, userId: studentAlex._id, name: 'Alex Chen', email: 'alex.chen@student.edu', role: 'Team Lead & Backend', isLeader: true, addedAt: new Date().toISOString() },
    { projectId, name: 'Priya Patel', email: 'priya.patel@student.edu', role: 'Fullstack & Gateway Dev', isLeader: false, addedAt: new Date().toISOString() },
    { projectId, name: 'Marcus Vance', email: 'marcus.vance@student.edu', role: 'Microservice Architect', isLeader: false, addedAt: new Date().toISOString() },
    { projectId, name: 'Elena Rostova', email: 'elena.rostova@student.edu', role: 'Documentation & QA Lead', isLeader: false, addedAt: new Date().toISOString() }
  ]);

  // Seed Requirements (manually entered by students per SRS)
  await reqsCol.insertMany([
    {
      projectId,
      reqCode: 'REQ-01',
      title: 'Decoupled Microservice Architecture with Independent Databases',
      description: 'Each service must maintain an isolated database with zero cross-database joins and communicate strictly via REST or messaging.',
      priority: 'High',
      category: 'Architecture',
      status: 'Verified',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString()
    },
    {
      projectId,
      reqCode: 'REQ-02',
      title: 'Automated GitHub Sync Pipeline for Commits & PRs',
      description: 'Never permit manual commit or PR entry; all development metrics must sync directly from GitHub REST API.',
      priority: 'High',
      category: 'Integration',
      status: 'Verified',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString()
    },
    {
      projectId,
      reqCode: 'REQ-03',
      title: 'Automated Milestone Evidence Calculation Engine',
      description: 'Milestones must evaluate progress dynamically based on confirmed GitHub facts (commits, PRs, issues) and uploaded academic artifacts.',
      priority: 'High',
      category: 'Milestones',
      status: 'Verified',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString()
    },
    {
      projectId,
      reqCode: 'REQ-04',
      title: 'Role-Specific Distinct Dashboard Shells',
      description: 'Students, Faculty, and Administrators must have dedicated UI shells with distinct action sets.',
      priority: 'Medium',
      category: 'Frontend',
      status: 'In Progress',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString()
    }
  ]);

  // Seed Documents (manually uploaded artifacts)
  await docsCol.insertMany([
    {
      projectId,
      name: 'Software Requirements Specification (SRS v1.0).pdf',
      type: 'SRS',
      fileUrl: 'https://projectflow.academic.storage/docs/srs-v1.pdf',
      fileSize: '2.4 MB',
      uploadedBy: studentAlex._id,
      uploadedByName: 'Elena Rostova',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    },
    {
      projectId,
      name: 'Microservice System Architecture Design.pdf',
      type: 'Architecture Design',
      fileUrl: 'https://projectflow.academic.storage/docs/architecture-v1.pdf',
      fileSize: '3.8 MB',
      uploadedBy: studentAlex._id,
      uploadedByName: 'Marcus Vance',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
    }
  ]);

  // Seed Milestones state
  await msCol.insertMany([
    {
      projectId,
      criteriaCode: 'M1',
      name: 'Milestone 1: Project Genesis & Scaffolding',
      description: 'Initial repository setup, architectural scaffolding, initial commits, and Requirements Document (SRS).',
      percentage: 100,
      status: 'Completed',
      evidenceList: [
        '✓ GitHub repository connected (projectflow-team/academic-capstone-project)',
        '✓ Commits: 14/5 commits detected',
        '✓ Merged PRs: 3/1 merged pull requests',
        '✓ Issues Closed: 4/1 completed issues',
        '✓ Document Artifact: SRS verified in Documents'
      ],
      lastCheckedAt: new Date().toISOString()
    },
    {
      projectId,
      criteriaCode: 'M2',
      name: 'Milestone 2: Core Development & Architecture',
      description: 'Full microservice development, team collaboration PRs, closed feature issues, and Architecture Documentation.',
      percentage: 95,
      status: 'In Progress',
      evidenceList: [
        '✓ GitHub repository connected (projectflow-team/academic-capstone-project)',
        '✓ Commits: 14/10 commits detected',
        '✓ Merged PRs: 3/2 merged pull requests',
        '✓ Issues Closed: 4/3 completed issues',
        '✓ Document Artifact: Architecture Design verified in Documents'
      ],
      lastCheckedAt: new Date().toISOString()
    },
    {
      projectId,
      criteriaCode: 'M3',
      name: 'Milestone 3: Evaluation, Testing & Final Report',
      description: 'Comprehensive test coverage, final pull requests merged, resolved issues, and Final Capstone Report.',
      percentage: 60,
      status: 'In Progress',
      evidenceList: [
        '✓ GitHub repository connected (projectflow-team/academic-capstone-project)',
        '⏳ Commits: 14/15 commits (1 remaining)',
        '✓ Merged PRs: 3/3 merged pull requests',
        '⏳ Issues Closed: 4/5 closed (1 remaining)',
        '⏳ Document Artifact: Final Report required (upload in Documents)'
      ],
      lastCheckedAt: new Date().toISOString()
    }
  ]);
  console.log('✓ Seeded project, team, requirements, criteria, documents, and milestones into project_db');

  // 3. Task Service Database (task_db)
  const taskDb = await createDatabase('seed-task', 'task_db');
  const tasksCol = taskDb.collection('tasks');
  await tasksCol.deleteMany({});

  await tasksCol.insertMany([
    {
      projectId,
      title: 'Scaffold Express Gateway with JWT Header Forwarding',
      description: 'Setup reverse proxy and attach x-user-id, x-user-role headers.',
      assigneeId: studentAlex._id,
      assigneeName: 'Alex Chen',
      priority: 'critical',
      status: 'completed',
      dueDate: '2026-09-20',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      projectId,
      title: 'Implement Resilient GitHub Sync Pipeline',
      description: 'Fetch commits, PRs, issues and preserve last-good-snapshot on failure.',
      assigneeId: studentAlex._id,
      assigneeName: 'Priya Patel',
      priority: 'high',
      status: 'completed',
      dueDate: '2026-09-22',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      projectId,
      title: 'Connect RabbitMQ Topic Exchange for Milestone Events',
      description: 'Publish MilestoneCompleted and consume in Notification Service.',
      assigneeId: studentAlex._id,
      assigneeName: 'Marcus Vance',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-09-25',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      projectId,
      title: 'Prepare Capstone Evaluation & Rubric Criteria Demo',
      description: 'Compile testing benchmarks and user acceptance reports.',
      assigneeId: studentAlex._id,
      assigneeName: 'Elena Rostova',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-09-28',
      createdBy: studentAlex._id,
      createdByName: 'Alex Chen',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  console.log('✓ Seeded 4 tasks into task_db');

  // 4. Integration Service Database (integration_db)
  const integDb = await createDatabase('seed-integ', 'integration_db');
  const connCol = integDb.collection('connections');
  const commitsCol = integDb.collection('commits');
  const pullsCol = integDb.collection('pulls');
  const issuesCol = integDb.collection('issues');
  const contribCol = integDb.collection('contributors');
  const logsCol = integDb.collection('syncLogs');

  await connCol.deleteMany({});
  await commitsCol.deleteMany({});
  await pullsCol.deleteMany({});
  await issuesCol.deleteMany({});
  await contribCol.deleteMany({});
  await logsCol.deleteMany({});

  await connCol.insertOne({
    projectId,
    repoOwner: 'projectflow-team',
    repoName: 'academic-capstone-project',
    repoFullName: 'projectflow-team/academic-capstone-project',
    repoUrl: 'https://github.com/projectflow-team/academic-capstone-project',
    stars: 24,
    forks: 7,
    openIssues: 3,
    lastSyncedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    syncStatus: 'synced',
    useDemoMode: true,
    stats: {
      totalCommits: 14,
      totalPRs: 5,
      mergedPRs: 3,
      openPRs: 1,
      closedIssues: 4,
      openIssues: 1,
      totalContributors: 4
    }
  });

  const authors = [
    { login: 'alex-chen', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { login: 'priya-patel', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { login: 'marcus-vance', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
    { login: 'elena-rostova', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
  ];

  await contribCol.insertMany([
    { projectId, login: 'alex-chen', name: 'Alex Chen', avatar: authors[0].avatar, commits: 6, additions: 1420, deletions: 210 },
    { projectId, login: 'priya-patel', name: 'Priya Patel', avatar: authors[1].avatar, commits: 4, additions: 890, deletions: 140 },
    { projectId, login: 'marcus-vance', name: 'Marcus Vance', avatar: authors[2].avatar, commits: 3, additions: 650, deletions: 80 },
    { projectId, login: 'elena-rostova', name: 'Elena Rostova', avatar: authors[3].avatar, commits: 1, additions: 230, deletions: 35 }
  ]);

  await commitsCol.insertMany([
    { projectId, sha: 'e4a1b09', message: 'feat: implement JWT auth middleware with refresh tokens', author: authors[1], timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { projectId, sha: '7b2c9df', message: 'fix: resolve race condition in milestone recalculation engine', author: authors[0], timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { projectId, sha: '91f82c1', message: 'feat: add rubric evaluation calculations and scoring API', author: authors[2], timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
    { projectId, sha: '63d0aa2', message: 'docs: update software architecture document and API contract', author: authors[3], timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString() },
    { projectId, sha: '58c3a11', message: 'test: write integration test suite for task transition states', author: authors[1], timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString() },
    { projectId, sha: '47d2b88', message: 'feat: setup RabbitMQ event bus with topic exchange routing', author: authors[0], timestamp: new Date(Date.now() - 1000 * 60 * 2100).toISOString() },
    { projectId, sha: '31f9c04', message: 'refactor: isolate database connection layers per microservice', author: authors[2], timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString() }
  ]);

  await pullsCol.insertMany([
    { projectId, number: 104, title: 'feat: Real-time milestone evidence synchronization', state: 'merged', mergedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), author: authors[0], additions: 420, deletions: 65 },
    { projectId, number: 103, title: 'feat: Rubric scoring engine and evaluation feedback', state: 'merged', mergedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(), author: authors[2], additions: 280, deletions: 40 },
    { projectId, number: 102, title: 'feat: Add secure JWT authorization and gateway proxying', state: 'merged', mergedAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(), author: authors[1], additions: 510, deletions: 110 },
    { projectId, number: 105, title: 'test: End-to-end task workflow coverage', state: 'open', mergedAt: null, author: authors[1], additions: 140, deletions: 18 }
  ]);

  await issuesCol.insertMany([
    { projectId, number: 12, title: 'Validate foreign key ID boundaries across microservice APIs', state: 'closed', closedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), author: authors[0] },
    { projectId, number: 11, title: 'Ensure failed GitHub sync does not overwrite previous good snapshot', state: 'closed', closedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(), author: authors[2] },
    { projectId, number: 10, title: 'Support dark glassmorphic styling tokens across all dashboard shells', state: 'closed', closedAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString(), author: authors[1] },
    { projectId, number: 9, title: 'Rate-limiting backoff for external GitHub API requests', state: 'closed', closedAt: new Date(Date.now() - 1000 * 60 * 2500).toISOString(), author: authors[0] },
    { projectId, number: 13, title: 'Faculty rubric scoring validation and lock after submit', state: 'open', closedAt: null, author: authors[2] }
  ]);

  console.log('✓ Seeded GitHub connection, commits, PRs, and issues into integration_db');

  // 5. Evaluation Service Database (evaluation_db)
  const evalDb = await createDatabase('seed-eval', 'evaluation_db');
  const evalCol = evalDb.collection('evaluations');
  await evalCol.deleteMany({});

  await evalCol.insertOne({
    projectId,
    projectName: project.name,
    facultyId: facultyHarrison._id,
    facultyName: 'Dr. Robert Harrison',
    facultyEmail: 'dr.harrison@projectflow.edu',
    scores: {
      requirements: 19,
      implementation: 24,
      githubDevelopment: 23,
      documentation: 14,
      projectProgress: 14
    },
    totalScore: 94,
    maxScore: 100,
    percentage: 94,
    feedback: 'Outstanding software architecture and demonstrable Git hygiene. The microservice isolation is pristine and the automated milestone tracking is well-demonstrated.',
    recommendations: 'Ensure comprehensive stress-testing on the event bus before final capstone symposium defense.',
    status: 'submitted',
    evaluatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    disclaimer: 'GitHub evidence informs the evaluation, but the score itself is an academic faculty decision.'
  });
  console.log('✓ Seeded faculty rubric evaluation into evaluation_db');

  console.log('--- ProjectFlow Seeding Complete! ---');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
