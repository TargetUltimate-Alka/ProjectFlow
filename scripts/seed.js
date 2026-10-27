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
      email: 'coordinator@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Coordinator',
      roles: ['Coordinator'],
      status: 'active',
      department: 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    },
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
      name: 'Dr. R. Sharma',
      email: 'dr.sharma@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Web & Cloud Systems',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Dr. P. Singh',
      email: 'dr.singh@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Algorithms & Theory',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Dr. M. Verma',
      email: 'dr.verma@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Data Engineering',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Dr. S. Nair',
      email: 'dr.nair@projectflow.edu',
      passwordHash: defaultPasswordHash,
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Software Engineering',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651001',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Alka Jha',
      email: 'alkaj29@gmail.com',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651013',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Alka Jha',
      email: 'alka123@iitv.ac.in',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651013',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651002',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.vance@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651003',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@student.edu',
      passwordHash: defaultPasswordHash,
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651004',
      batch: '2026-2028',
      createdAt: new Date().toISOString()
    }
  ];

  await usersCol.insertMany(users);
  const studentAlex = await usersCol.findOne({ email: 'alex.chen@student.edu' });
  const facultyHarrison = await usersCol.findOne({ email: 'dr.harrison@projectflow.edu' });
  console.log('✓ Seeded users into auth_db (1 Admin, 6 Faculty, 5 Students)');

  // 2. Project Service Database (project_db)
  const projDb = await createDatabase('seed-proj', 'project_db');
  const projectsCol = projDb.collection('projects');
  const teamCol = projDb.collection('teamMembers');
  const reqsCol = projDb.collection('requirements');
  const critCol = projDb.collection('criteria');
  const msCol = projDb.collection('projectMilestones');
  const docsCol = projDb.collection('documents');
  const coursesCol = projDb.collection('courses');
  const announcementsCol = projDb.collection('announcements');
  const courseTeamsCol = projDb.collection('courseTeams');

  await projectsCol.deleteMany({});
  await teamCol.deleteMany({});
  await reqsCol.deleteMany({});
  await critCol.deleteMany({});
  await msCol.deleteMany({});
  await docsCol.deleteMany({});
  await coursesCol.deleteMany({});
  await announcementsCol.deleteMany({});
  await courseTeamsCol.deleteMany({});

  // Seed Academic Courses
  const courses = [
    {
      code: 'CS543',
      name: 'Web Services',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      batch: '2026-2028',
      semester: '3rd Semester',
      department: 'Computer Science & Engineering',
      color: '#0284c7',
      icon: 'globe',
      description: 'Advanced distributed web services, RESTful architectural design, microservices communication, and cloud API integration.',
      enrolledEmails: [
        'alex.chen@student.edu',
        'alkaj29@gmail.com',
        'alka123@iitv.ac.in',
        'priya.patel@student.edu',
        'marcus.vance@student.edu'
      ],
      instructorMessage: {
        author: 'Dr. R. Sharma',
        date: '20 Oct 2026',
        title: 'Message from Course Instructor',
        content: `Dear Students,\nPlease read the following before forming your team:\n• Team Size: 4-5 members\n• Each member must be from the same batch.\n• Use your Roll Number and Institute Email ID.\n• Each student can be part of only one team.\n• Topics: Choose from the list provided in 'Resources'.\n• Submit team by 25 Oct 2026.\n• Project proposal format is attached.`,
        attachments: [
          { name: 'Project_Guidelines.pdf', size: '2.4 MB', type: 'pdf' }
        ]
      },
      announcements: [
        {
          id: 'ann_cs543_1',
          title: 'General Guidelines for Project Teams',
          courseCode: 'CS543',
          courseName: 'Web Services',
          facultyName: 'Dr. R. Sharma',
          date: '22 Oct 2026',
          content: 'Please ensure team members are finalized and topics are selected before the deadline. Project proposal templates must be submitted via the portal.'
        }
      ],
      resources: [
        { name: 'Course Syllabus & Lab Manual', type: 'pdf', size: '1.4 MB' },
        { name: 'Approved Capstone Project Topics 2026', type: 'pdf', size: '820 KB' }
      ]
    },
    {
      code: 'CS541',
      name: 'Design and Analysis of Algorithms',
      facultyName: 'Dr. P. Singh',
      facultyEmail: 'dr.singh@projectflow.edu',
      batch: '2026-2028',
      semester: '3rd Semester',
      department: 'Computer Science & Engineering',
      color: '#8b5cf6',
      icon: 'cpu',
      description: 'Algorithm design paradigms, graph theory algorithms, dynamic programming, NP-completeness, and performance analysis.',
      enrolledEmails: [
        'alex.chen@student.edu',
        'alkaj29@gmail.com',
        'alka123@iitv.ac.in',
        'priya.patel@student.edu',
        'elena.rostova@student.edu'
      ],
      instructorMessage: {
        author: 'Dr. P. Singh',
        date: '19 Oct 2026',
        title: 'Algorithm Lab Project Guidelines',
        content: `Dear Students,\nFor the Algorithm Analysis capstone project:\n• Choose from dynamic programming, network flow, or approximation algorithms.\n• Implement in C++ or Python with empirical benchmark plots.\n• Group submissions must adhere to reproducible evaluation metrics.`,
        attachments: [
          { name: 'Algorithm_Project_Syllabus.pdf', size: '1.8 MB', type: 'pdf' }
        ]
      },
      announcements: [
        {
          id: 'ann_cs541_1',
          title: 'Team Formation Deadline Extended',
          courseCode: 'CS541',
          courseName: 'Design and Analysis of Algorithms',
          facultyName: 'Dr. P. Singh',
          date: '20 Oct 2026',
          content: 'Team formation deadline for Algorithms capstone projects has been extended to 28 Oct 2026.'
        }
      ],
      resources: [
        { name: 'Algorithm Benchmark Datasets', type: 'zip', size: '14.2 MB' },
        { name: 'Complexity Analysis Cheat Sheet', type: 'pdf', size: '650 KB' }
      ]
    },
    {
      code: 'CS542',
      name: 'Database Systems',
      facultyName: 'Dr. M. Verma',
      facultyEmail: 'dr.verma@projectflow.edu',
      batch: '2026-2028',
      semester: '3rd Semester',
      department: 'Computer Science & Engineering',
      color: '#f97316',
      icon: 'database',
      description: 'Database engine internals, query execution plans, transactions and isolation, indexing strategies, and distributed NoSQL storage.',
      enrolledEmails: [
        'alex.chen@student.edu',
        'alkaj29@gmail.com',
        'alka123@iitv.ac.in',
        'priya.patel@student.edu',
        'marcus.vance@student.edu'
      ],
      instructorMessage: {
        author: 'Dr. M. Verma',
        date: '18 Oct 2026',
        title: 'Database System Design Project Specifications',
        content: `Welcome to CS542.\nYour semester project involves designing a fully normalized schema with replication, fault tolerance, and query indexing benchmarks.\nReview the proposal format in the resources tab.`,
        attachments: [
          { name: 'DB_Project_Proposal_Format.docx', size: '950 KB', type: 'doc' }
        ]
      },
      announcements: [
        {
          id: 'ann_cs542_1',
          title: 'Submit Project Proposal Format',
          courseCode: 'CS542',
          courseName: 'Database Systems',
          facultyName: 'Dr. M. Verma',
          date: '18 Oct 2026',
          content: 'Use the approved institute proposal format attached in course resources before submitting your proposal.'
        }
      ],
      resources: [
        { name: 'Relational Database Schema Design Rubric', type: 'pdf', size: '1.1 MB' }
      ]
    },
    {
      code: 'CS544',
      name: 'Software Engineering',
      facultyName: 'Dr. S. Nair',
      facultyEmail: 'dr.nair@projectflow.edu',
      batch: '2026-2028',
      semester: '3rd Semester',
      department: 'Computer Science & Engineering',
      color: '#10b981',
      icon: 'layers',
      description: 'Software development lifecycle, Agile methodologies, CI/CD automated testing, clean code architecture, and capstone milestones.',
      enrolledEmails: [
        'alex.chen@student.edu',
        'alkaj29@gmail.com',
        'alka123@iitv.ac.in',
        'priya.patel@student.edu',
        'elena.rostova@student.edu'
      ],
      instructorMessage: {
        author: 'Dr. S. Nair',
        date: '17 Oct 2026',
        title: 'Software Engineering Project Milestones',
        content: `Welcome to CS544 Software Engineering.\nAll groups are required to use GitHub issues and pull requests to track development.\nMilestone audits will occur bi-weekly with automated criteria evaluation.`,
        attachments: [
          { name: 'SE_Milestone_Rubric.pdf', size: '1.2 MB', type: 'pdf' }
        ]
      },
      announcements: [
        {
          id: 'ann_cs544_1',
          title: 'Sprint Planning Session Schedule',
          courseCode: 'CS544',
          courseName: 'Software Engineering',
          facultyName: 'Dr. S. Nair',
          date: '16 Oct 2026',
          content: 'Sprint 1 planning sessions will be scheduled during the lab hours next week. Review Agile guidelines.'
        }
      ],
      resources: [
        { name: 'Agile Sprint Template', type: 'pdf', size: '780 KB' }
      ]
    }
  ];
  await coursesCol.insertMany(courses);
  console.log('✓ Seeded 4 academic courses into project_db');

  const announcements = [
    {
      _id: 'ann_cs543_team_guidelines',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      courseName: 'Web Services',
      title: 'Project Team Formation Guidelines',
      content: `Dear Students,\n\nPlease read and strictly follow the team formation guidelines before submitting your project groups:\n\n• Each team must contain 4–5 students.\n• All members must belong to the same academic batch (2026-2028).\n• Every member must have a unique roll number and institutional email.\n• Each student can belong to only one team in the course.\n• Students must select a topic from the faculty-approved list in Resources.\n• Project proposals must be submitted before the faculty-defined deadline (25 Oct 2026).\n\nProject proposal format and evaluation criteria are attached below. Contact the course instructor during office hours for topic approvals.`,
      facultyId: 'user_fac_sharma',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      isPinned: true,
      isImportant: true,
      publishedAt: '2026-10-20T10:00:00.000Z',
      date: '20 Oct 2026, 10:00 AM',
      attachments: [
        {
          id: 'att_guidelines_pdf',
          name: 'Project_Guidelines.pdf',
          size: '2.4 MB',
          type: 'pdf',
          downloadUrl: '/api/courses/CS543/attachments/Project_Guidelines.pdf'
        },
        {
          id: 'att_proposal_doc',
          name: 'Project_Proposal_Format.docx',
          size: '850 KB',
          type: 'doc',
          downloadUrl: '/api/courses/CS543/attachments/Project_Proposal_Format.docx'
        }
      ],
      readBy: [
        'alex.chen@student.edu'
      ]
    },
    {
      _id: 'ann_cs543_api_specs',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      courseName: 'Web Services',
      title: 'Updated REST & GraphQL API Specification Standards',
      content: 'All teams developing web service microservices must use OpenAPI 3.0 / YAML specifications for API contracts. Docker-compose configuration for service discovery must be committed to your team repository by Milestone 1.',
      facultyId: 'user_fac_sharma',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: '2026-10-22T14:30:00.000Z',
      date: '22 Oct 2026, 02:30 PM',
      attachments: [
        {
          id: 'att_api_std_pdf',
          name: 'API_Specification_Standards_v2.pdf',
          size: '1.1 MB',
          type: 'pdf',
          downloadUrl: '/api/courses/CS543/attachments/API_Specification_Standards_v2.pdf'
        }
      ],
      readBy: []
    },
    {
      _id: 'ann_cs541_deadline',
      courseId: 'course_cs541',
      courseCode: 'CS541',
      courseName: 'Design and Analysis of Algorithms',
      title: 'Team Formation Deadline Extended',
      content: 'The deadline for algorithm capstone project groups has been extended to 28 Oct 2026. Review benchmark dataset resources in the course page.',
      facultyId: 'user_fac_singh',
      facultyName: 'Dr. P. Singh',
      facultyEmail: 'dr.singh@projectflow.edu',
      isPinned: true,
      isImportant: false,
      publishedAt: '2026-10-20T11:00:00.000Z',
      date: '20 Oct 2026, 11:00 AM',
      attachments: [],
      readBy: []
    },
    {
      _id: 'ann_cs542_proposal',
      courseId: 'course_cs542',
      courseCode: 'CS542',
      courseName: 'Database Systems',
      title: 'Submit Project Proposal Format',
      content: 'Submit your database schema proposals using the approved institute format before the upcoming laboratory session.',
      facultyId: 'user_fac_verma',
      facultyName: 'Dr. M. Verma',
      facultyEmail: 'dr.verma@projectflow.edu',
      isPinned: false,
      isImportant: true,
      publishedAt: '2026-10-18T09:00:00.000Z',
      date: '18 Oct 2026, 09:00 AM',
      attachments: [],
      readBy: []
    },
    {
      _id: 'ann_cs544_sprint',
      courseId: 'course_cs544',
      courseCode: 'CS544',
      courseName: 'Software Engineering',
      title: 'Sprint Planning Session Schedule',
      content: 'Sprint 1 planning sessions will be scheduled during the lab hours next week. Review Agile guidelines.',
      facultyId: 'user_fac_nair',
      facultyName: 'Dr. S. Nair',
      facultyEmail: 'dr.nair@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: '2026-10-16T15:00:00.000Z',
      date: '16 Oct 2026, 03:00 PM',
      attachments: [],
      readBy: []
    }
  ];
  await announcementsCol.insertMany(announcements);
  console.log('✓ Seeded 5 broadcast announcements into project_db');

  const courseTeams = [
    {
      _id: 'team_alpha',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      name: 'Team Alpha',
      teamLead: 'Alka Jha',
      teamLeadEmail: 'alka123@iitv.ac.in',
      memberCount: 4,
      maxMembers: 5,
      status: 'Joined',
      members: [
        { name: 'Alka Jha', email: 'alka123@iitv.ac.in', rollNumber: '20251651013', isLeader: true },
        { name: 'Alex Chen', email: 'alex.chen@student.edu', rollNumber: '20251651001', isLeader: false },
        { name: 'Priya Patel', email: 'priya.patel@student.edu', rollNumber: '20251651002', isLeader: false },
        { name: 'Marcus Vance', email: 'marcus.vance@student.edu', rollNumber: '20251651003', isLeader: false }
      ],
      createdAt: '2026-10-15T10:00:00.000Z'
    },
    {
      _id: 'team_innovators',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      name: 'Team Innovators',
      teamLead: 'Rohit Kumar',
      teamLeadEmail: 'rohit.kumar@student.edu',
      memberCount: 5,
      maxMembers: 5,
      status: 'Full',
      members: [
        { name: 'Rohit Kumar', email: 'rohit.kumar@student.edu', rollNumber: '20251651020', isLeader: true },
        { name: 'Neha Verma', email: 'neha.verma@student.edu', rollNumber: '20251651021', isLeader: false },
        { name: 'Amit Raj', email: 'amit.raj@student.edu', rollNumber: '20251651022', isLeader: false },
        { name: 'Suresh Sen', email: 'suresh.sen@student.edu', rollNumber: '20251651023', isLeader: false },
        { name: 'Kavita Roy', email: 'kavita.roy@student.edu', rollNumber: '20251651024', isLeader: false }
      ],
      createdAt: '2026-10-16T11:00:00.000Z'
    },
    {
      _id: 'team_codecraft',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      name: 'Team CodeCraft',
      teamLead: 'Priya Singh',
      teamLeadEmail: 'priya.singh@student.edu',
      memberCount: 4,
      maxMembers: 5,
      status: 'Open',
      members: [
        { name: 'Priya Singh', email: 'priya.singh@student.edu', rollNumber: '20251651030', isLeader: true },
        { name: 'Karan Dave', email: 'karan.dave@student.edu', rollNumber: '20251651031', isLeader: false },
        { name: 'Simran Kaur', email: 'simran.kaur@student.edu', rollNumber: '20251651032', isLeader: false },
        { name: 'Deepak Joshi', email: 'deepak.joshi@student.edu', rollNumber: '20251651033', isLeader: false }
      ],
      createdAt: '2026-10-17T09:30:00.000Z'
    },
    {
      _id: 'team_nextgen',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      name: 'Team NextGen',
      teamLead: 'Vikram Mehta',
      teamLeadEmail: 'vikram.mehta@student.edu',
      memberCount: 5,
      maxMembers: 5,
      status: 'Full',
      members: [
        { name: 'Vikram Mehta', email: 'vikram.mehta@student.edu', rollNumber: '20251651040', isLeader: true },
        { name: 'Ananya Roy', email: 'ananya.roy@student.edu', rollNumber: '20251651041', isLeader: false },
        { name: 'Rohan Gupta', email: 'rohan.gupta@student.edu', rollNumber: '20251651042', isLeader: false },
        { name: 'Divya Nair', email: 'divya.nair@student.edu', rollNumber: '20251651043', isLeader: false },
        { name: 'Harsh Vardhan', email: 'harsh.vardhan@student.edu', rollNumber: '20251651044', isLeader: false }
      ],
      createdAt: '2026-10-18T14:15:00.000Z'
    }
  ];
  await courseTeamsCol.insertMany(courseTeams);
  console.log('✓ Seeded 4 course teams into project_db');

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
