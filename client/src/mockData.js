// Turnkey Mock & Offline Demo Data for ProjectFlow
// Automatically activated when running as a static build on Netlify without live backend microservices

const MOCK_STORAGE_KEY = 'projectflow_mock_db_v2';

const defaultAuthors = [
  { login: 'alex-chen', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { login: 'priya-patel', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { login: 'marcus-vance', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
  { login: 'elena-rostova', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
];

export const INITIAL_DATA = {
  users: [
    {
      id: 'usr_admin',
      name: 'Dr. Arthur Vance',
      email: 'admin@projectflow.edu',
      role: 'Admin',
      status: 'active',
      department: 'Academic Administration & Capstone Oversight',
      createdAt: '2026-08-15T09:00:00.000Z'
    },
    {
      id: 'usr_fac1',
      name: 'Dr. Robert Harrison',
      email: 'dr.harrison@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Systems & Networking',
      createdAt: '2026-08-20T10:00:00.000Z'
    },
    {
      id: 'usr_fac2',
      name: 'Dr. Sarah Patel',
      email: 'dr.patel@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Software Architecture',
      createdAt: '2026-08-22T10:00:00.000Z'
    },
    {
      id: 'usr_stu1',
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: '2026-09-01T11:00:00.000Z'
    },
    {
      id: 'usr_stu2',
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: '2026-09-01T11:05:00.000Z'
    },
    {
      id: 'usr_stu3',
      name: 'Marcus Vance',
      email: 'marcus.vance@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: '2026-09-01T11:10:00.000Z'
    },
    {
      id: 'usr_stu4',
      name: 'Elena Rostova',
      email: 'elena.rostova@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: '2026-09-01T11:15:00.000Z'
    }
  ],
  projects: [
    {
      id: 'proj_capstone_101',
      name: 'Distributed Real-time Cloud Pipeline (ProjectFlow)',
      description: 'A fault-tolerant microservices platform with automated GitHub synchronization and dynamic milestone evaluation for academic software teams.',
      status: 'In Progress',
      leadId: 'usr_stu1',
      leadName: 'Alex Chen',
      leadEmail: 'alex.chen@student.edu',
      facultyId: 'usr_fac1',
      facultyName: 'Dr. Robert Harrison',
      createdAt: '2026-09-10T10:00:00.000Z',
      updatedAt: '2026-10-22T08:00:00.000Z'
    }
  ],
  teamMembers: [
    { id: 'tm_1', projectId: 'proj_capstone_101', userId: 'usr_stu1', name: 'Alex Chen', email: 'alex.chen@student.edu', role: 'Team Lead & Backend', isLeader: true, addedAt: '2026-09-10T10:00:00.000Z' },
    { id: 'tm_2', projectId: 'proj_capstone_101', userId: 'usr_stu2', name: 'Priya Patel', email: 'priya.patel@student.edu', role: 'Fullstack & Gateway Dev', isLeader: false, addedAt: '2026-09-10T10:05:00.000Z' },
    { id: 'tm_3', projectId: 'proj_capstone_101', userId: 'usr_stu3', name: 'Marcus Vance', email: 'marcus.vance@student.edu', role: 'Microservice Architect', isLeader: false, addedAt: '2026-09-10T10:10:00.000Z' },
    { id: 'tm_4', projectId: 'proj_capstone_101', userId: 'usr_stu4', name: 'Elena Rostova', email: 'elena.rostova@student.edu', role: 'Documentation & QA Lead', isLeader: false, addedAt: '2026-09-10T10:15:00.000Z' }
  ],
  requirements: [
    {
      id: 'req_1',
      projectId: 'proj_capstone_101',
      reqCode: 'REQ-01',
      title: 'Decoupled Microservice Architecture with Independent Databases',
      description: 'Each service must maintain an isolated database with zero cross-database joins and communicate strictly via REST or messaging.',
      priority: 'High',
      category: 'Architecture',
      status: 'Verified',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-12T10:00:00.000Z'
    },
    {
      id: 'req_2',
      projectId: 'proj_capstone_101',
      reqCode: 'REQ-02',
      title: 'Automated GitHub Sync Pipeline for Commits & PRs',
      description: 'Never permit manual commit or PR entry; all development metrics must sync directly from GitHub REST API.',
      priority: 'High',
      category: 'Integration',
      status: 'Verified',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-12T10:30:00.000Z'
    },
    {
      id: 'req_3',
      projectId: 'proj_capstone_101',
      reqCode: 'REQ-03',
      title: 'Automated Milestone Evidence Calculation Engine',
      description: 'Milestones must evaluate progress dynamically based on confirmed GitHub facts (commits, PRs, issues) and uploaded academic artifacts.',
      priority: 'High',
      category: 'Milestones',
      status: 'Verified',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-12T11:00:00.000Z'
    },
    {
      id: 'req_4',
      projectId: 'proj_capstone_101',
      reqCode: 'REQ-04',
      title: 'Role-Specific Distinct Dashboard Shells',
      description: 'Students, Faculty, and Administrators must have dedicated UI shells with distinct action sets.',
      priority: 'Medium',
      category: 'Frontend',
      status: 'In Progress',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-12T11:30:00.000Z'
    }
  ],
  criteria: [
    {
      id: 'crit_1',
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
      id: 'crit_2',
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
      id: 'crit_3',
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
  ],
  milestones: [
    {
      id: 'ms_1',
      projectId: 'proj_capstone_101',
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
      lastCheckedAt: '2026-10-22T08:00:00.000Z'
    },
    {
      id: 'ms_2',
      projectId: 'proj_capstone_101',
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
      lastCheckedAt: '2026-10-22T08:00:00.000Z'
    },
    {
      id: 'ms_3',
      projectId: 'proj_capstone_101',
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
      lastCheckedAt: '2026-10-22T08:00:00.000Z'
    }
  ],
  documents: [
    {
      id: 'doc_1',
      projectId: 'proj_capstone_101',
      name: 'Software Requirements Specification (SRS v1.0).pdf',
      type: 'SRS',
      fileUrl: '#',
      fileSize: '2.4 MB',
      uploadedBy: 'usr_stu4',
      uploadedByName: 'Elena Rostova',
      uploadedAt: '2026-09-15T14:30:00.000Z'
    },
    {
      id: 'doc_2',
      projectId: 'proj_capstone_101',
      name: 'Microservice System Architecture Design.pdf',
      type: 'Architecture Design',
      fileUrl: '#',
      fileSize: '3.8 MB',
      uploadedBy: 'usr_stu3',
      uploadedByName: 'Marcus Vance',
      uploadedAt: '2026-09-28T16:45:00.000Z'
    }
  ],
  tasks: [
    {
      id: 'tsk_1',
      projectId: 'proj_capstone_101',
      title: 'Scaffold Express Gateway with JWT Header Forwarding',
      description: 'Setup reverse proxy and attach x-user-id, x-user-role headers.',
      assigneeId: 'usr_stu1',
      assigneeName: 'Alex Chen',
      priority: 'critical',
      status: 'completed',
      dueDate: '2026-09-20',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-12T10:00:00.000Z',
      updatedAt: '2026-09-20T17:00:00.000Z'
    },
    {
      id: 'tsk_2',
      projectId: 'proj_capstone_101',
      title: 'Implement Resilient GitHub Sync Pipeline',
      description: 'Fetch commits, PRs, issues and preserve last-good-snapshot on failure.',
      assigneeId: 'usr_stu2',
      assigneeName: 'Priya Patel',
      priority: 'high',
      status: 'completed',
      dueDate: '2026-09-22',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-14T10:00:00.000Z',
      updatedAt: '2026-09-22T15:30:00.000Z'
    },
    {
      id: 'tsk_3',
      projectId: 'proj_capstone_101',
      title: 'Connect RabbitMQ Topic Exchange for Milestone Events',
      description: 'Publish MilestoneCompleted and consume in Notification Service.',
      assigneeId: 'usr_stu3',
      assigneeName: 'Marcus Vance',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-09-25',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-15T11:00:00.000Z',
      updatedAt: '2026-09-24T12:00:00.000Z'
    },
    {
      id: 'tsk_4',
      projectId: 'proj_capstone_101',
      title: 'Prepare Capstone Evaluation & Rubric Criteria Demo',
      description: 'Compile testing benchmarks and user acceptance reports.',
      assigneeId: 'usr_stu4',
      assigneeName: 'Elena Rostova',
      priority: 'medium',
      status: 'todo',
      dueDate: '2026-09-28',
      createdBy: 'usr_stu1',
      createdByName: 'Alex Chen',
      createdAt: '2026-09-16T14:00:00.000Z',
      updatedAt: '2026-09-16T14:00:00.000Z'
    }
  ],
  githubConnection: {
    projectId: 'proj_capstone_101',
    repoOwner: 'projectflow-team',
    repoName: 'academic-capstone-project',
    repoFullName: 'projectflow-team/academic-capstone-project',
    repoUrl: 'https://github.com/TargetUltimate-Alka/projectFlow',
    stars: 24,
    forks: 7,
    openIssues: 3,
    lastSyncedAt: '2026-10-22T08:00:00.000Z',
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
  },
  githubActivity: [
    { type: 'commit', id: 'act_1', sha: 'e4a1b09', message: 'feat: implement JWT auth middleware with refresh tokens', author: defaultAuthors[1].name, authorData: defaultAuthors[1], timestamp: '2026-10-22T07:15:00.000Z' },
    { type: 'pull', id: 'act_2', number: 104, title: 'feat: Real-time milestone evidence synchronization', state: 'merged', author: defaultAuthors[0].name, authorData: defaultAuthors[0], timestamp: '2026-10-22T06:30:00.000Z' },
    { type: 'commit', id: 'act_3', sha: '7b2c9df', message: 'fix: resolve race condition in milestone recalculation engine', author: defaultAuthors[0].name, authorData: defaultAuthors[0], timestamp: '2026-10-22T05:00:00.000Z' },
    { type: 'issue', id: 'act_4', number: 12, title: 'Validate foreign key ID boundaries across microservice APIs', state: 'closed', author: defaultAuthors[0].name, authorData: defaultAuthors[0], timestamp: '2026-10-22T04:00:00.000Z' },
    { type: 'pull', id: 'act_5', number: 103, title: 'feat: Rubric scoring engine and evaluation feedback', state: 'merged', author: defaultAuthors[2].name, authorData: defaultAuthors[2], timestamp: '2026-10-22T03:00:00.000Z' },
    { type: 'commit', id: 'act_6', sha: '91f82c1', message: 'feat: add rubric evaluation calculations and scoring API', author: defaultAuthors[2].name, authorData: defaultAuthors[2], timestamp: '2026-10-22T02:00:00.000Z' }
  ],
  evaluations: [
    {
      id: 'eval_1',
      projectId: 'proj_capstone_101',
      projectName: 'Distributed Real-time Cloud Pipeline (ProjectFlow)',
      facultyId: 'usr_fac1',
      facultyName: 'Dr. Robert Harrison',
      facultyEmail: 'dr.harrison@projectflow.edu',
      scores: {
        requirements: 19,
        architecture: 20,
        gitPractices: 18,
        codeQuality: 19,
        documentation: 18
      },
      totalScore: 94,
      maxScore: 100,
      grade: 'A',
      feedback: 'Outstanding microservice design and evidence-based milestone completion. The decoupled databases and GitHub evidence synchronization exceed typical capstone expectations.',
      isSubmitted: true,
      evaluatedAt: '2026-10-18T14:30:00.000Z'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      title: 'Milestone 1 Verified',
      message: 'Milestone 1: Project Genesis & Scaffolding has reached 100% automated evidence verification.',
      type: 'milestone',
      read: false,
      createdAt: '2026-10-22T07:45:00.000Z'
    },
    {
      id: 'notif_2',
      title: 'GitHub Synchronization Complete',
      message: '14 commits, 4 pull requests, and 5 issues synchronized from repository.',
      type: 'github',
      read: false,
      createdAt: '2026-10-22T06:00:00.000Z'
    },
    {
      id: 'notif_3',
      title: 'Faculty Evaluation Submitted',
      message: 'Dr. Robert Harrison recorded an evaluation score of 94/100 (Grade A).',
      type: 'evaluation',
      read: true,
      createdAt: '2026-10-18T14:35:00.000Z'
    }
  ]
};

function getStorage() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function saveStorage(data) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export const mockService = {
  // Auth
  login: async ({ email, password }) => {
    const db = getStorage();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-create guest student if not recognized
      const newUser = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'Student',
        status: 'active',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      saveStorage(db);
      return { token: `demo-token-${newUser.id}`, user: newUser };
    }
    return { token: `demo-token-${user.id}`, user };
  },

  register: async (userData) => {
    const db = getStorage();
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'Student',
      status: 'active',
      department: userData.department || 'Computer Science',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveStorage(db);
    return { token: `demo-token-${newUser.id}`, user: newUser };
  },

  getMe: async (token) => {
    const db = getStorage();
    if (!token) throw new Error('Not authenticated');
    const userId = token.replace('demo-token-', '');
    const user = db.users.find(u => u.id === userId) || db.users[3]; // default Alex Chen
    return user;
  },

  getUsers: async () => {
    return getStorage().users;
  },

  getFaculty: async () => {
    return getStorage().users.filter(u => u.role === 'Faculty');
  },

  createUser: async (userData) => {
    const db = getStorage();
    const user = {
      id: `usr_${Date.now()}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    saveStorage(db);
    return user;
  },

  updateUser: async (id, data) => {
    const db = getStorage();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...data };
      saveStorage(db);
      return db.users[idx];
    }
    return { id, ...data };
  },

  // Projects
  getProjects: async () => {
    return getStorage().projects;
  },

  getProject: async (id) => {
    const db = getStorage();
    return db.projects.find(p => p.id === id) || db.projects[0];
  },

  createProject: async (data) => {
    const db = getStorage();
    const newProj = {
      id: `proj_${Date.now()}`,
      ...data,
      status: 'In Progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.projects.push(newProj);
    saveStorage(db);
    return newProj;
  },

  updateProject: async (id, data) => {
    const db = getStorage();
    const idx = db.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.projects[idx] = { ...db.projects[idx], ...data, updatedAt: new Date().toISOString() };
      saveStorage(db);
      return db.projects[idx];
    }
    return { id, ...data };
  },

  deleteProject: async (id) => {
    const db = getStorage();
    db.projects = db.projects.filter(p => p.id !== id);
    saveStorage(db);
    return { success: true };
  },

  getProjectOverview: async (id) => {
    const db = getStorage();
    const project = db.projects.find(p => p.id === id) || db.projects[0];
    const team = db.teamMembers.filter(t => t.projectId === id || t.projectId === 'proj_capstone_101');
    const tasks = db.tasks.filter(t => t.projectId === id || t.projectId === 'proj_capstone_101');
    const milestones = db.milestones.filter(m => m.projectId === id || m.projectId === 'proj_capstone_101');
    return {
      project,
      teamCount: team.length,
      taskCount: tasks.length,
      milestoneCount: milestones.length,
      overallProgress: 85
    };
  },

  // Team
  getTeam: async (projectId) => {
    const db = getStorage();
    return db.teamMembers.filter(t => t.projectId === projectId || t.projectId === 'proj_capstone_101');
  },

  addTeamMember: async (projectId, memberData) => {
    const db = getStorage();
    const member = {
      id: `tm_${Date.now()}`,
      projectId,
      ...memberData,
      addedAt: new Date().toISOString()
    };
    db.teamMembers.push(member);
    saveStorage(db);
    return member;
  },

  removeTeamMember: async (projectId, memberId) => {
    const db = getStorage();
    db.teamMembers = db.teamMembers.filter(t => t.id !== memberId);
    saveStorage(db);
    return { success: true };
  },

  // Requirements
  getRequirements: async (projectId) => {
    const db = getStorage();
    return db.requirements.filter(r => r.projectId === projectId || r.projectId === 'proj_capstone_101');
  },

  createRequirement: async (projectId, data) => {
    const db = getStorage();
    const req = {
      id: `req_${Date.now()}`,
      projectId,
      reqCode: `REQ-${String(db.requirements.length + 1).padStart(2, '0')}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
      ...data
    };
    db.requirements.push(req);
    saveStorage(db);
    return req;
  },

  updateRequirement: async (projectId, reqId, data) => {
    const db = getStorage();
    const idx = db.requirements.findIndex(r => r.id === reqId);
    if (idx !== -1) {
      db.requirements[idx] = { ...db.requirements[idx], ...data };
      saveStorage(db);
      return db.requirements[idx];
    }
    return { id: reqId, ...data };
  },

  deleteRequirement: async (projectId, reqId) => {
    const db = getStorage();
    db.requirements = db.requirements.filter(r => r.id !== reqId);
    saveStorage(db);
    return { success: true };
  },

  // Milestones & Criteria
  getMilestones: async (projectId) => {
    const db = getStorage();
    return db.milestones.filter(m => m.projectId === projectId || m.projectId === 'proj_capstone_101');
  },

  recalculateMilestones: async (projectId) => {
    const db = getStorage();
    return db.milestones.map(m => ({ ...m, lastCheckedAt: new Date().toISOString() }));
  },

  getCriteria: async () => {
    return getStorage().criteria;
  },

  createCriteria: async (data) => {
    const db = getStorage();
    const crit = {
      id: `crit_${Date.now()}`,
      code: `M${db.criteria.length + 1}`,
      order: db.criteria.length + 1,
      ...data
    };
    db.criteria.push(crit);
    saveStorage(db);
    return crit;
  },

  updateCriteria: async (id, data) => {
    const db = getStorage();
    const idx = db.criteria.findIndex(c => c.id === id);
    if (idx !== -1) {
      db.criteria[idx] = { ...db.criteria[idx], ...data };
      saveStorage(db);
      return db.criteria[idx];
    }
    return { id, ...data };
  },

  deleteCriteria: async (id) => {
    const db = getStorage();
    db.criteria = db.criteria.filter(c => c.id !== id);
    saveStorage(db);
    return { success: true };
  },

  // Documents
  getDocuments: async (projectId) => {
    const db = getStorage();
    return db.documents.filter(d => d.projectId === projectId || d.projectId === 'proj_capstone_101');
  },

  uploadDocument: async (projectId, data) => {
    const db = getStorage();
    const doc = {
      id: `doc_${Date.now()}`,
      projectId,
      fileSize: '1.8 MB',
      fileUrl: '#',
      uploadedAt: new Date().toISOString(),
      ...data
    };
    db.documents.push(doc);
    saveStorage(db);
    return doc;
  },

  deleteDocument: async (projectId, docId) => {
    const db = getStorage();
    db.documents = db.documents.filter(d => d.id !== docId);
    saveStorage(db);
    return { success: true };
  },

  // Tasks
  getTasks: async (projectId, filter = {}) => {
    const db = getStorage();
    let tasks = db.tasks.filter(t => t.projectId === projectId || t.projectId === 'proj_capstone_101');
    if (filter.status) tasks = tasks.filter(t => t.status === filter.status);
    return tasks;
  },

  createTask: async (data) => {
    const db = getStorage();
    const task = {
      id: `tsk_${Date.now()}`,
      status: 'todo',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    db.tasks.push(task);
    saveStorage(db);
    return task;
  },

  updateTask: async (id, data) => {
    const db = getStorage();
    const idx = db.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      db.tasks[idx] = { ...db.tasks[idx], ...data, updatedAt: new Date().toISOString() };
      saveStorage(db);
      return db.tasks[idx];
    }
    return { id, ...data };
  },

  deleteTask: async (id) => {
    const db = getStorage();
    db.tasks = db.tasks.filter(t => t.id !== id);
    saveStorage(db);
    return { success: true };
  },

  // GitHub
  connectGitHub: async (data) => {
    const db = getStorage();
    db.githubConnection = { ...db.githubConnection, ...data, syncStatus: 'synced', lastSyncedAt: new Date().toISOString() };
    saveStorage(db);
    return db.githubConnection;
  },

  syncGitHub: async (projectId) => {
    const db = getStorage();
    db.githubConnection.lastSyncedAt = new Date().toISOString();
    saveStorage(db);
    return { success: true, message: 'GitHub repository synchronized successfully' };
  },

  getGitHubStatus: async (projectId) => {
    return getStorage().githubConnection;
  },

  getGitHubActivity: async (projectId) => {
    return getStorage().githubActivity;
  },

  getGitHubEvidence: async (projectId) => {
    return {
      commitsCount: 14,
      prsMerged: 3,
      issuesClosed: 4,
      repository: 'projectflow-team/academic-capstone-project'
    };
  },

  // Evaluation
  getEvaluations: async (projectId) => {
    const db = getStorage();
    return db.evaluations.filter(e => e.projectId === projectId || e.projectId === 'proj_capstone_101');
  },

  createEvaluation: async (data) => {
    const db = getStorage();
    const evalItem = {
      id: `eval_${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
      isSubmitted: true,
      ...data
    };
    db.evaluations.push(evalItem);
    saveStorage(db);
    return evalItem;
  },

  updateEvaluation: async (id, data) => {
    const db = getStorage();
    const idx = db.evaluations.findIndex(e => e.id === id);
    if (idx !== -1) {
      db.evaluations[idx] = { ...db.evaluations[idx], ...data };
      saveStorage(db);
      return db.evaluations[idx];
    }
    return { id, ...data };
  },

  getRubricTemplate: async () => {
    return {
      categories: [
        { key: 'requirements', label: 'Requirements & Scope Alignment', maxScore: 20 },
        { key: 'architecture', label: 'Microservice Architecture & Modularity', maxScore: 20 },
        { key: 'gitPractices', label: 'Git Hygiene, PRs & GitHub Evidence', maxScore: 20 },
        { key: 'codeQuality', label: 'Implementation Quality & Test Coverage', maxScore: 20 },
        { key: 'documentation', label: 'SRS, Diagrams & Technical Documentation', maxScore: 20 }
      ],
      maxTotal: 100
    };
  },

  // Notifications
  getNotifications: async () => {
    return getStorage().notifications;
  },

  markNotificationRead: async (id) => {
    const db = getStorage();
    const notif = db.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    saveStorage(db);
    return { success: true };
  },

  markAllNotificationsRead: async () => {
    const db = getStorage();
    db.notifications.forEach(n => { n.read = true; });
    saveStorage(db);
    return { success: true };
  }
};
