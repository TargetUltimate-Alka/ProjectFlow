// Turnkey Mock & Offline Demo Data for ProjectFlow
// Automatically activated when running as a static build on Netlify without live backend microservices

const MOCK_STORAGE_KEY = 'projectflow_mock_db_v5';

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
      id: 'usr_fac_sharma',
      name: 'Dr. R. Sharma',
      email: 'dr.sharma@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Web & Cloud Systems',
      createdAt: '2026-08-23T10:00:00.000Z'
    },
    {
      id: 'usr_fac_singh',
      name: 'Dr. P. Singh',
      email: 'dr.singh@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Algorithms & Theory',
      createdAt: '2026-08-23T10:00:00.000Z'
    },
    {
      id: 'usr_fac_verma',
      name: 'Dr. M. Verma',
      email: 'dr.verma@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Data Engineering',
      createdAt: '2026-08-23T10:00:00.000Z'
    },
    {
      id: 'usr_fac_nair',
      name: 'Dr. S. Nair',
      email: 'dr.nair@projectflow.edu',
      role: 'Faculty',
      status: 'active',
      department: 'Computer Science - Software Engineering',
      createdAt: '2026-08-23T10:00:00.000Z'
    },
    {
      id: 'usr_stu1',
      name: 'Alex Chen',
      email: 'alex.chen@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651001',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:00:00.000Z'
    },
    {
      id: 'usr_stu_alka',
      name: 'Alka Jha',
      email: 'alkaj29@gmail.com',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651013',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:02:00.000Z'
    },
    {
      id: 'usr_stu_alka2',
      name: 'Alka Jha',
      email: 'alka123@iitv.ac.in',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651013',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:02:00.000Z'
    },
    {
      id: 'usr_stu2',
      name: 'Priya Patel',
      email: 'priya.patel@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651002',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:05:00.000Z'
    },
    {
      id: 'usr_stu3',
      name: 'Marcus Vance',
      email: 'marcus.vance@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651003',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:10:00.000Z'
    },
    {
      id: 'usr_stu4',
      name: 'Elena Rostova',
      email: 'elena.rostova@student.edu',
      role: 'Student',
      status: 'active',
      department: 'Computer Science & Engineering',
      rollNumber: '20251651004',
      batch: '2026-2028',
      createdAt: '2026-09-01T11:15:00.000Z'
    }
  ],
  courses: [
    {
      id: 'course_cs543',
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
      id: 'course_cs541',
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
      id: 'course_cs542',
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
      id: 'course_cs544',
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
  ],
  announcements: [
    {
      id: 'ann_cs543_team_guidelines',
      _id: 'ann_cs543_team_guidelines',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      courseName: 'Web Services',
      title: 'Project Team Formation Guidelines',
      content: `Dear Students,\n\nPlease read and strictly follow the team formation guidelines before submitting your project groups:\n\n• Each team must contain 4–5 students.\n• All members must belong to the same academic batch (2026-2028).\n• Every member must have a unique roll number and institutional email.\n• Each student can belong to only one team in the course.\n• Students must select a topic from the faculty-approved list in Resources.\n• Project proposals must be submitted before the faculty-defined deadline (25 Oct 2026).\n\nProject proposal format and evaluation criteria are attached below. Contact the course instructor during office hours for topic approvals.`,
      facultyId: 'usr_fac_sharma',
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
      id: 'ann_cs543_api_specs',
      _id: 'ann_cs543_api_specs',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      courseName: 'Web Services',
      title: 'Updated REST & GraphQL API Specification Standards',
      content: 'All teams developing web service microservices must use OpenAPI 3.0 / YAML specifications for API contracts. Docker-compose configuration for service discovery must be committed to your team repository by Milestone 1.',
      facultyId: 'usr_fac_sharma',
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
      id: 'ann_cs541_deadline',
      _id: 'ann_cs541_deadline',
      courseId: 'course_cs541',
      courseCode: 'CS541',
      courseName: 'Design and Analysis of Algorithms',
      title: 'Team Formation Deadline Extended',
      content: 'The deadline for algorithm capstone project groups has been extended to 28 Oct 2026. Review benchmark dataset resources in the course page.',
      facultyId: 'usr_fac_singh',
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
      id: 'ann_cs542_proposal',
      _id: 'ann_cs542_proposal',
      courseId: 'course_cs542',
      courseCode: 'CS542',
      courseName: 'Database Systems',
      title: 'Submit Project Proposal Format',
      content: 'Submit your database schema proposals using the approved institute format before the upcoming laboratory session.',
      facultyId: 'usr_fac_verma',
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
      id: 'ann_cs544_sprint',
      _id: 'ann_cs544_sprint',
      courseId: 'course_cs544',
      courseCode: 'CS544',
      courseName: 'Software Engineering',
      title: 'Sprint Planning Session Schedule',
      content: 'Sprint 1 planning sessions will be scheduled during the lab hours next week. Review Agile guidelines.',
      facultyId: 'usr_fac_nair',
      facultyName: 'Dr. S. Nair',
      facultyEmail: 'dr.nair@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: '2026-10-16T15:00:00.000Z',
      date: '16 Oct 2026, 03:00 PM',
      attachments: [],
      readBy: []
    },
    {
      id: 'ann_team_alpha_1',
      _id: 'ann_team_alpha_1',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      teamId: 'team_alpha',
      title: 'Updated API Documentation',
      content: 'Please use the updated API endpoints. Check the document attached.',
      facultyId: 'usr_fac_sharma',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      isPinned: false,
      isImportant: true,
      publishedAt: '2026-10-25T14:00:00.000Z',
      date: '25 Oct 2026',
      attachments: [
        { id: 'att_api_doc_v2', name: 'API_Endpoints_v2.pdf', size: '1.4 MB', type: 'pdf', downloadUrl: '#' }
      ],
      readBy: ['alka123@iitv.ac.in']
    },
    {
      id: 'ann_team_alpha_2',
      _id: 'ann_team_alpha_2',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      teamId: 'team_alpha',
      title: 'Good Progress!',
      content: 'Team Alpha has good progress in module 1. Keep it up!',
      facultyId: 'usr_fac_sharma',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: '2026-10-20T11:00:00.000Z',
      date: '20 Oct 2026',
      attachments: [],
      readBy: ['alka123@iitv.ac.in']
    },
    {
      id: 'ann_team_alpha_3',
      _id: 'ann_team_alpha_3',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      teamId: 'team_alpha',
      title: 'Next Meeting',
      content: 'We will discuss your project in the next class on 22 Oct.',
      facultyId: 'usr_fac_sharma',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: '2026-10-18T16:00:00.000Z',
      date: '18 Oct 2026',
      attachments: [],
      readBy: []
    }
  ],
  courseTeams: [
    {
      id: 'team_alpha',
      _id: 'team_alpha',
      courseId: 'course_cs543',
      courseCode: 'CS543',
      name: 'Team Alpha',
      projectId: 'proj_capstone_101',
      projectTitle: 'ProjectFlow Development',
      projectDescription: 'Development of an academic project management system with microservices architecture.',
      startDate: '2026-09-01',
      endDate: '2026-12-15',
      facultyName: 'Dr. R. Sharma',
      facultyEmail: 'dr.sharma@projectflow.edu',
      description: 'Development of an academic project management system with microservices architecture.',
      teamLead: 'Alka Jha',
      teamLeadEmail: 'alka123@iitv.ac.in',
      memberCount: 4,
      maxMembers: 5,
      status: 'Active',
      members: [
        { name: 'Alka Jha', email: 'alka123@iitv.ac.in', rollNumber: '20251651013', isLeader: true, role: 'Team Lead' },
        { name: 'Alex Chen', email: 'alex.chen@student.edu', rollNumber: '20251651001', isLeader: false, role: 'Fullstack Dev' },
        { name: 'Priya Patel', email: 'priya.patel@student.edu', rollNumber: '20251651002', isLeader: false, role: 'Backend Dev' },
        { name: 'Marcus Vance', email: 'marcus.vance@student.edu', rollNumber: '20251651003', isLeader: false, role: 'DevOps & QA' }
      ],
      createdAt: '2026-10-15T10:00:00.000Z'
    },
    {
      id: 'team_innovators',
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
      id: 'team_codecraft',
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
      id: 'team_nextgen',
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
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const expectedPassword = user.password || (user.role === 'Admin' ? 'admin123' : 'password123');
    if (!password || password !== expectedPassword) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new Error('Your account has been suspended. Please contact Admin.');
    }

    return { token: `demo-token-${user.id}`, user };
  },

  register: async (userData) => {
    const db = getStorage();
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Name, email, and password are required');
    }

    const normalizedEmail = userData.email.trim().toLowerCase();
    const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const assignedRole = (userData.role === 'Faculty') ? 'Faculty' : 'Student';
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      role: assignedRole,
      status: 'active',
      department: userData.department || 'Computer Science & Engineering',
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

  // Academic Courses (Google Classroom style)
  getCourses: async (params = {}) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userRole = (curUser?.role || 'Student').toLowerCase();
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    let list = db.courses || [];
    if (userRole === 'student') {
      list = list.filter(c => {
        const emails = (c.enrolledEmails || []).map(e => e.toLowerCase());
        const ids = c.enrolledStudentIds || [];
        return emails.includes(userEmail) || ids.includes(userId);
      });
    } else if (userRole === 'faculty') {
      list = list.filter(c => {
        const fEmail = (c.facultyEmail || '').toLowerCase();
        return fEmail === userEmail || c.facultyId === userId;
      });
    }

    if (params.search) {
      const q = params.search.trim().toLowerCase();
      list = list.filter(c =>
        (c.code || '').toLowerCase().includes(q) ||
        (c.name || '').toLowerCase().includes(q) ||
        (c.facultyName || '').toLowerCase().includes(q) ||
        (c.batch || '').toLowerCase().includes(q) ||
        (c.semester || '').toLowerCase().includes(q)
      );
    }

    return list.map(c => ({
      id: c.id || c._id,
      code: c.code,
      name: c.name,
      facultyName: c.facultyName,
      facultyEmail: c.facultyEmail,
      batch: c.batch,
      semester: c.semester,
      department: c.department,
      color: c.color,
      icon: c.icon,
      description: c.description,
      announcementsCount: (c.announcements || []).length,
      createdAt: c.createdAt
    }));
  },

  getCourse: async (idOrCode) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userRole = (curUser?.role || 'Student').toLowerCase();
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    const course = (db.courses || []).find(c =>
      c.id === idOrCode || (c.code || '').toLowerCase() === (idOrCode || '').toLowerCase()
    );

    if (!course) {
      const err = new Error(`Course '${idOrCode}' not found`);
      err.status = 404;
      throw err;
    }

    if (userRole === 'student') {
      const emails = (course.enrolledEmails || []).map(e => e.toLowerCase());
      const ids = course.enrolledStudentIds || [];
      if (!emails.includes(userEmail) && !ids.includes(userId)) {
        const err = new Error(`Access denied. You are not enrolled in ${course.code} - ${course.name}.`);
        err.status = 403;
        throw err;
      }
    }

    return course;
  },

  getCourseBroadcasts: async () => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userRole = (curUser?.role || 'Student').toLowerCase();
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    let list = db.courses || [];
    if (userRole === 'student') {
      list = list.filter(c => {
        const emails = (c.enrolledEmails || []).map(e => e.toLowerCase());
        const ids = c.enrolledStudentIds || [];
        return emails.includes(userEmail) || ids.includes(userId);
      });
    }

    const broadcasts = [];
    list.forEach(c => {
      (c.announcements || []).forEach(ann => {
        broadcasts.push({
          ...ann,
          courseId: c.id,
          courseCode: c.code,
          courseName: c.name,
          color: c.color
        });
      });
    });

    return broadcasts;
  },

  getCourseAnnouncements: async (courseId, params = {}) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    let announcements = (db.announcements || []).filter(a =>
      a.courseCode === courseId.toUpperCase() ||
      a.courseId === courseId ||
      a.courseCode === courseId
    );

    if (params.search) {
      const q = String(params.search).toLowerCase().trim();
      announcements = announcements.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.content && a.content.toLowerCase().includes(q)) ||
        (a.facultyName && a.facultyName.toLowerCase().includes(q))
      );
    }

    if (params.unreadOnly === 'true' || params.unreadOnly === true) {
      announcements = announcements.filter(a => {
        const reads = (a.readBy || []).map(r => String(r).toLowerCase());
        return !reads.includes(userEmail) && !reads.includes(String(userId));
      });
    }

    if (params.pinnedOnly === 'true' || params.pinnedOnly === true) {
      announcements = announcements.filter(a => a.isPinned);
    }

    announcements.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.publishedAt || a.date || 0);
      const dateB = new Date(b.publishedAt || b.date || 0);
      return dateB - dateA;
    });

    return announcements.map(a => {
      const reads = (a.readBy || []).map(r => String(r).toLowerCase());
      const isRead = reads.includes(userEmail) || reads.includes(String(userId));
      return {
        ...a,
        id: a._id || a.id,
        isRead
      };
    });
  },

  getCourseAnnouncement: async (courseId, announcementId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    const ann = (db.announcements || []).find(a => (a.id === announcementId || a._id === announcementId));
    if (!ann) throw new Error(`Announcement '${announcementId}' not found`);

    const reads = (ann.readBy || []).map(r => String(r).toLowerCase());
    const isRead = reads.includes(userEmail) || reads.includes(String(userId));
    return { ...ann, isRead };
  },

  createCourseAnnouncement: async (courseId, data) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const course = (db.courses || []).find(c => c.code === courseId.toUpperCase() || c.id === courseId);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newAnn = {
      id: `ann_${Date.now()}`,
      _id: `ann_${Date.now()}`,
      courseId: course?.id || courseId,
      courseCode: course?.code || courseId.toUpperCase(),
      courseName: course?.name || 'Academic Course',
      title: data.title,
      content: data.content,
      facultyId: curUser?.id || 'fac_user',
      facultyName: curUser?.name || course?.facultyName || 'Course Instructor',
      facultyEmail: curUser?.email || course?.facultyEmail,
      isPinned: Boolean(data.isPinned),
      isImportant: Boolean(data.isImportant),
      publishedAt: now.toISOString(),
      date: dateFormatted,
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      readBy: []
    };

    db.announcements = db.announcements || [];
    db.announcements.unshift(newAnn);
    saveStorage(db);
    return { ...newAnn, isRead: false };
  },

  updateCourseAnnouncement: async (courseId, announcementId, data) => {
    const db = getStorage();
    const idx = (db.announcements || []).findIndex(a => a.id === announcementId || a._id === announcementId);
    if (idx !== -1) {
      db.announcements[idx] = { ...db.announcements[idx], ...data, updatedAt: new Date().toISOString() };
      saveStorage(db);
      return db.announcements[idx];
    }
    return { id: announcementId, ...data };
  },

  deleteCourseAnnouncement: async (courseId, announcementId) => {
    const db = getStorage();
    db.announcements = (db.announcements || []).filter(a => a.id !== announcementId && a._id !== announcementId);
    saveStorage(db);
    return { success: true };
  },

  markAnnouncementRead: async (courseId, announcementId, unread = false) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();

    const ann = (db.announcements || []).find(a => a.id === announcementId || a._id === announcementId);
    if (ann) {
      let readBy = Array.isArray(ann.readBy) ? [...ann.readBy] : [];
      if (unread) {
        readBy = readBy.filter(e => e.toLowerCase() !== userEmail);
      } else {
        if (!readBy.map(e => e.toLowerCase()).includes(userEmail)) {
          readBy.push(userEmail);
        }
      }
      ann.readBy = readBy;
      saveStorage(db);
      return { success: true, announcementId, isRead: !unread, readByCount: readBy.length };
    }
    return { success: true, announcementId, isRead: !unread };
  },

  getCourseTeams: async (courseId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();

    let teams = (db.courseTeams || []).filter(t =>
      t.courseCode === courseId.toUpperCase() ||
      t.courseId === courseId ||
      t.courseCode === courseId
    );

    return teams.map(t => {
      const members = Array.isArray(t.members) ? t.members : [];
      const isUserMember = members.some(m => (m.email || '').toLowerCase() === userEmail) ||
                           ((t.teamLeadEmail || '').toLowerCase() === userEmail);
      const memberCount = members.length || t.memberCount || 0;
      const maxMembers = t.maxMembers || 5;

      let status = memberCount >= maxMembers ? 'Full' : 'Available';
      if (isUserMember) {
        status = 'Joined';
      }

      return {
        ...t,
        id: t._id || t.id,
        _id: t._id || t.id,
        status,
        isUserMember,
        memberCount,
        maxMembers,
        members
      };
    });
  },

  getMyCourseTeam: async (courseId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();

    let teams = (db.courseTeams || []).filter(t =>
      t.courseCode === courseId.toUpperCase() ||
      t.courseId === courseId ||
      t.courseCode === courseId
    );

    const userTeam = teams.find(t => {
      const members = Array.isArray(t.members) ? t.members : [];
      return members.some(m => (m.email || '').toLowerCase() === userEmail) ||
             ((t.teamLeadEmail || '').toLowerCase() === userEmail);
    });

    if (!userTeam) return { team: null };

    const members = Array.isArray(userTeam.members) ? userTeam.members : [];
    const isLeader = ((userTeam.teamLeadEmail || '').toLowerCase() === userEmail) ||
                     members.some(m => (m.email || '').toLowerCase() === userEmail && m.isLeader);

    return {
      team: {
        ...userTeam,
        id: userTeam._id || userTeam.id,
        _id: userTeam._id || userTeam.id,
        status: 'Joined',
        isLeader,
        memberCount: members.length,
        maxMembers: userTeam.maxMembers || 5,
        members
      }
    };
  },

  createCourseTeam: async (courseId, data) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || 'alka123@iitv.ac.in').toLowerCase();
    const userName = curUser?.name || 'Alka Jha';

    if (!db.courseTeams) db.courseTeams = [];

    const existingTeam = db.courseTeams.find(t => {
      if (t.courseCode !== courseId.toUpperCase() && t.courseId !== courseId) return false;
      const members = Array.isArray(t.members) ? t.members : [];
      return members.some(m => (m.email || '').toLowerCase() === userEmail) ||
             ((t.teamLeadEmail || '').toLowerCase() === userEmail);
    });

    if (existingTeam) {
      throw new Error(`You already belong to team '${existingTeam.name}' in this course.`);
    }

    if (!data.name || !data.name.trim()) {
      throw new Error('Team name is required.');
    }

    if (!Array.isArray(data.members) || data.members.length < 4 || data.members.length > 5) {
      throw new Error('Team size must be between 4 and 5 members.');
    }

    const resolvedMembers = data.members.map((m, idx) => ({
      name: m.name || (m.email.toLowerCase() === userEmail ? userName : `Member ${idx + 1}`),
      email: m.email,
      rollNumber: m.rollNumber,
      isLeader: m.email.toLowerCase() === userEmail
    }));

    const newTeam = {
      id: `team_${Date.now()}`,
      _id: `team_${Date.now()}`,
      courseId: courseId,
      courseCode: courseId.toUpperCase(),
      name: data.name.trim(),
      description: data.description || '',
      teamLead: userName,
      teamLeadEmail: userEmail,
      memberCount: resolvedMembers.length,
      maxMembers: 5,
      status: resolvedMembers.length >= 5 ? 'Full' : 'Available',
      members: resolvedMembers,
      createdAt: new Date().toISOString()
    };

    db.courseTeams.push(newTeam);
    saveStorage(db);
    return { success: true, message: 'Team created successfully', team: newTeam };
  },

  joinCourseTeam: async (courseId, teamId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || 'alka123@iitv.ac.in').toLowerCase();
    const userName = curUser?.name || 'Alka Jha';

    const targetTeam = (db.courseTeams || []).find(t => t.id === teamId || t._id === teamId);
    if (!targetTeam) throw new Error('Team not found');

    if (!targetTeam.members) targetTeam.members = [];
    if (targetTeam.members.length >= (targetTeam.maxMembers || 5)) {
      throw new Error('Team is already full');
    }

    targetTeam.members.push({
      name: userName,
      email: curUser?.email || 'alka123@iitv.ac.in',
      rollNumber: curUser?.rollNumber || '20251651013',
      isLeader: false
    });
    targetTeam.memberCount = targetTeam.members.length;
    targetTeam.status = targetTeam.memberCount >= (targetTeam.maxMembers || 5) ? 'Full' : 'Available';

    saveStorage(db);
    return { success: true, message: `Joined ${targetTeam.name}!`, team: targetTeam };
  },

  leaveCourseTeam: async (courseId, teamId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userEmail = (curUser?.email || '').toLowerCase();

    const targetTeam = (db.courseTeams || []).find(t => t.id === teamId || t._id === teamId);
    if (!targetTeam) throw new Error('Team not found');

    targetTeam.members = (targetTeam.members || []).filter(m => (m.email || '').toLowerCase() !== userEmail);
    targetTeam.memberCount = targetTeam.members.length;
    targetTeam.status = 'Available';

    saveStorage(db);
    return { success: true, message: 'Left team successfully' };
  },

  getTeamDashboard: async (courseId, teamId) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;
    const userRole = (curUser?.role || 'Student').toLowerCase();
    const userEmail = (curUser?.email || '').toLowerCase();
    const userId = curUser?.id;

    const team = (db.courseTeams || []).find(t => t.id === teamId || t._id === teamId);
    if (!team) {
      const err = new Error(`Team '${teamId}' not found.`);
      err.status = 404;
      throw err;
    }

    const course = (db.courses || []).find(c =>
      c.id === courseId || (c.code || '').toLowerCase() === (courseId || '').toLowerCase()
    );
    if (!course) {
      const err = new Error(`Course '${courseId}' not found.`);
      err.status = 404;
      throw err;
    }

    // Authorization checks
    if (userRole === 'student') {
      const isMember = (team.members || []).some(m => (m.email || '').toLowerCase() === userEmail) ||
                       ((team.teamLeadEmail || '').toLowerCase() === userEmail);
      if (!isMember) {
        const err = new Error(`Access denied. You are not an authorized member of team '${team.name}'. Students can only access their own team workspace.`);
        err.status = 403;
        throw err;
      }
    } else if (userRole === 'faculty') {
      const isAssigned = (course.facultyEmail || '').toLowerCase() === userEmail ||
                         course.facultyId === userId ||
                         (team.facultyEmail || '').toLowerCase() === userEmail;
      if (!isAssigned) {
        const err = new Error('Access denied. You are not the assigned faculty supervisor for this course or team.');
        err.status = 403;
        throw err;
      }
    }

    const projectInfo = {
      id: team.projectId || 'proj_capstone_101',
      title: team.projectTitle || 'ProjectFlow Development',
      description: team.projectDescription || team.description || 'Development of an academic project management system with microservices architecture.',
      associatedCourse: `${course.code} - ${course.name}`,
      facultySupervisor: team.facultyName || course.facultyName || 'Dr. R. Sharma',
      facultyEmail: team.facultyEmail || course.facultyEmail || 'dr.sharma@projectflow.edu',
      startDate: team.startDate || '2026-09-01',
      endDate: team.endDate || '2026-12-15',
      status: team.status || 'Active'
    };

    const taskMetrics = {
      total: 12,
      completed: 6,
      pending: 6,
      isConfigured: true
    };

    const docMetrics = {
      count: 6,
      submitted: 6,
      isConfigured: true
    };

    const githubMetrics = {
      connected: true,
      repoFullName: 'TargetUltimate-Alka/projectFlow',
      commits: 48,
      prs: 5,
      isConfigured: true
    };

    const evaluationMetrics = {
      status: 'Pending',
      score: null,
      feedback: 'Milestone 1 evaluation pending supervisor review.',
      isConfigured: true
    };

    const overallPercentage = Math.round((taskMetrics.completed / taskMetrics.total) * 100);

    const teamAnnouncements = (db.announcements || []).filter(a =>
      a.teamId === team.id || a.teamId === team._id || a.teamId === 'team_alpha'
    ).map(a => ({
      id: a.id || a._id,
      title: a.title,
      author: a.facultyName || 'Dr. R. Sharma',
      authorEmail: a.facultyEmail || 'dr.sharma@projectflow.edu',
      date: a.date || 'Recent',
      content: a.content,
      attachments: a.attachments || []
    }));

    return {
      team: {
        id: team._id || team.id,
        _id: team._id || team.id,
        name: team.name,
        description: team.description || '',
        teamLead: team.teamLead,
        teamLeadEmail: team.teamLeadEmail,
        memberCount: (team.members || []).length,
        maxMembers: team.maxMembers || 5,
        status: team.status || 'Active',
        members: team.members || [],
        createdAt: team.createdAt
      },
      course: {
        id: course.id || course._id,
        code: course.code,
        name: course.name,
        batch: course.batch,
        semester: course.semester,
        facultyName: course.facultyName,
        facultyEmail: course.facultyEmail
      },
      project: projectInfo,
      progress: {
        overallPercentage,
        tasks: taskMetrics,
        documents: docMetrics,
        github: githubMetrics,
        evaluation: evaluationMetrics
      },
      announcements: teamAnnouncements
    };
  },

  createTeamAnnouncement: async (courseId, teamId, data) => {
    const db = getStorage();
    const curUser = (typeof localStorage !== 'undefined' && localStorage.getItem('projectflow_user'))
      ? JSON.parse(localStorage.getItem('projectflow_user'))
      : null;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newAnn = {
      id: `ann_team_${Date.now()}`,
      _id: `ann_team_${Date.now()}`,
      courseId,
      teamId,
      title: data.title,
      content: data.content,
      facultyId: curUser?.id || 'usr_fac_sharma',
      facultyName: curUser?.name || 'Dr. R. Sharma',
      facultyEmail: curUser?.email || 'dr.sharma@projectflow.edu',
      isPinned: false,
      isImportant: false,
      publishedAt: now.toISOString(),
      date: dateFormatted,
      attachments: Array.isArray(data.attachments) ? data.attachments : [],
      readBy: []
    };

    db.announcements = db.announcements || [];
    db.announcements.unshift(newAnn);
    saveStorage(db);
    return { success: true, announcement: newAnn };
  },

  updateTeamProject: async (courseId, teamId, data) => {
    const db = getStorage();
    const team = (db.courseTeams || []).find(t => t.id === teamId || t._id === teamId);
    if (!team) throw new Error('Team not found');

    if (data.projectTitle) team.projectTitle = data.projectTitle;
    if (data.projectDescription !== undefined) team.projectDescription = data.projectDescription;
    if (data.startDate) team.startDate = data.startDate;
    if (data.endDate) team.endDate = data.endDate;

    saveStorage(db);
    return { success: true, message: 'Project information updated successfully.' };
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
    let tasks = db.tasks || [];
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId || t.teamId === projectId || t.projectId === 'proj_capstone_101' || t.projectId === 'b503fcaeb7f9f3732992009b');
    }
    if (filter.status && filter.status !== 'all') {
      if (filter.status === 'completed') {
        tasks = tasks.filter(t => t.status === 'completed');
      } else if (filter.status === 'not_completed') {
        tasks = tasks.filter(t => t.status !== 'completed');
      } else {
        tasks = tasks.filter(t => t.status === filter.status);
      }
    }
    tasks.sort((a, b) => (Number(a.taskNo) || 0) - (Number(b.taskNo) || 0));
    return tasks;
  },

  getTask: async (id) => {
    const db = getStorage();
    return (db.tasks || []).find(t => t.id === id || t._id === id) || null;
  },

  createTask: async (data) => {
    const db = getStorage();
    const existing = db.tasks || [];
    const maxTaskNo = existing.reduce((max, t) => Math.max(max, Number(t.taskNo) || 0), 0);
    const task = {
      id: `task_${Date.now()}`,
      _id: `task_${Date.now()}`,
      taskNo: maxTaskNo + 1,
      status: 'not_completed',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      marks: '-',
      ...data
    };
    db.tasks = db.tasks || [];
    db.tasks.push(task);
    saveStorage(db);
    return task;
  },

  updateTask: async (id, data) => {
    const db = getStorage();
    const idx = (db.tasks || []).findIndex(t => t.id === id || t._id === id);
    if (idx !== -1) {
      db.tasks[idx] = { ...db.tasks[idx], ...data, updatedAt: new Date().toISOString() };
      saveStorage(db);
      return db.tasks[idx];
    }
    return { id, ...data };
  },

  submitTask: async (id, data) => {
    const db = getStorage();
    const idx = (db.tasks || []).findIndex(t => t.id === id || t._id === id);
    if (idx !== -1) {
      db.tasks[idx] = {
        ...db.tasks[idx],
        status: 'completed',
        submission: {
          description: data.submissionDescription || '',
          attachment: data.attachment || null,
          submittedAt: new Date().toISOString()
        },
        description: data.submissionDescription || db.tasks[idx].description,
        updatedAt: new Date().toISOString()
      };
      saveStorage(db);
      return db.tasks[idx];
    }
    return { id, ...data, status: 'completed' };
  },

  evaluateTask: async (id, data) => {
    const db = getStorage();
    const idx = (db.tasks || []).findIndex(t => t.id === id || t._id === id);
    if (idx !== -1) {
      db.tasks[idx] = {
        ...db.tasks[idx],
        evaluation: {
          marksAwarded: Number(data.marksAwarded),
          maxMarks: Number(data.maxMarks || 10),
          feedback: data.feedback || '',
          evaluatedAt: new Date().toISOString()
        },
        marks: `${data.marksAwarded}/${data.maxMarks || 10}`,
        updatedAt: new Date().toISOString()
      };
      saveStorage(db);
      return db.tasks[idx];
    }
    return { id, ...data };
  },

  deleteTask: async (id) => {
    const db = getStorage();
    db.tasks = (db.tasks || []).filter(t => t.id !== id && t._id !== id);
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
      connected: true,
      repoFullName: 'TargetUltimate-Alka/projectFlow',
      repoUrl: 'https://github.com/TargetUltimate-Alka/projectFlow',
      totalCommits: 16,
      totalPRs: 0,
      mergedPRs: 0,
      openPRs: 0,
      closedIssues: 0,
      openIssues: 0,
      totalContributors: 2,
      contributors: [
        { login: 'TargetUltimate-Alka', name: 'TargetUltimate-Alka', commits: 14, additions: 630, deletions: 168, avatar: 'https://avatars.githubusercontent.com/u/241401052?v=4' },
        { login: 'Nandinikanaujiya', name: 'Nandinikanaujiya', commits: 2, additions: 90, deletions: 24, avatar: 'https://avatars.githubusercontent.com/u/226968939?v=4' }
      ],
      recentPullRequests: []
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
    return [
      { key: 'requirements', name: 'Requirements & Scope Alignment', maxScore: 20, description: 'Completeness of functional/non-functional requirements and trace.' },
      { key: 'architecture', name: 'Microservice Architecture & Modularity', maxScore: 25, description: 'Code modularity, design patterns, separation of concerns, and clean code.' },
      { key: 'gitPractices', name: 'Git Hygiene, PRs & GitHub Evidence', maxScore: 25, description: 'Commit frequency, pull request reviews, branches, contributor balance.' },
      { key: 'codeQuality', name: 'Implementation Quality & Test Coverage', maxScore: 15, description: 'Unit testing, API contracts, error boundaries, and reliability.' },
      { key: 'documentation', name: 'SRS, Diagrams & Technical Documentation', maxScore: 15, description: 'SRS document, architecture diagrams, user manual, and reports.' }
    ];
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
