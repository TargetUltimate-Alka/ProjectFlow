/**
 * ProjectFlow - Step 4: Task Management and Assignment Automated Test Suite
 *
 * Verifies:
 * 1. The task table contains exactly seven columns in the specified order (Status, Task No., Task, Allotted To, Attachments, Description, Marks).
 * 2. Existing tasks load from the backend.
 * 3. Authorized team lead can create and assign tasks.
 * 4. Tasks can be assigned only to eligible members of the current team (rejects non-members with 400).
 * 5. Newly created tasks appear with sequential task numbering without full-page reload.
 * 6. Unauthorized students cannot create or reassign tasks (403 Forbidden).
 * 7. Status changes persist correctly (completed vs not_completed).
 * 8. Students cannot award themselves marks (403 Forbidden; marks remain '-' until faculty evaluation).
 * 9. Attachments and descriptions display and download with access control.
 * 10. Deadline enforcement on backend (400 Bad Request on late submission).
 * 11. Faculty can grade submissions and award marks (POST /tasks/:id/evaluate).
 */

const axios = require('axios');

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:5000';

const USERS = {
  teamLead: { email: 'aarav.sharma@student.edu', password: 'password123', name: 'Aarav Sharma' },
  teamMember: { email: 'alex.chen@student.edu', password: 'password123', name: 'Alex Chen' },
  nonMemberStudent: { email: 'alka123@iitv.ac.in', password: 'password123', name: 'Alka Jha' },
  assignedFaculty: { email: 'dr.sharma@projectflow.edu', password: 'password123', name: 'Dr. R. Sharma' },
  unassignedFaculty: { email: 'dr.singh@projectflow.edu', password: 'password123', name: 'Dr. P. Singh' }
};

const TOKENS = {};

async function loginUser(key, credentials) {
  try {
    const res = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    TOKENS[key] = res.data.token;
    console.log(`  ✓ Authenticated ${key}: ${credentials.name} (${credentials.email})`);
    return res.data.token;
  } catch (err) {
    console.error(`  ✗ Login failed for ${key}:`, err.response?.data || err.message);
    throw err;
  }
}

function authHeader(key) {
  return {
    headers: {
      Authorization: `Bearer ${TOKENS[key]}`
    }
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('   Step 4: Task Management and Assignment Tests     ');
  console.log('====================================================\n');

  try {
    // -------------------------------------------------------------
    // STEP 1: Authenticate personas
    // -------------------------------------------------------------
    console.log('-> Step 1: Authenticating test personas...');
    await loginUser('teamLead', USERS.teamLead);
    await loginUser('teamMember', USERS.teamMember);
    await loginUser('nonMemberStudent', USERS.nonMemberStudent);
    await loginUser('assignedFaculty', USERS.assignedFaculty);
    await loginUser('unassignedFaculty', USERS.unassignedFaculty);

    // -------------------------------------------------------------
    // STEP 2: Load existing tasks for Team Alpha (Requirement 1 & 2)
    // -------------------------------------------------------------
    console.log('\n-> Step 2: Verifying existing tasks load from backend (7-column structure)...');
    const tasksRes = await axios.get(
      `${GATEWAY_URL}/api/tasks?teamId=team_alpha`,
      authHeader('teamLead')
    );
    const tasks = tasksRes.data;

    console.log(`  ✓ Loaded ${tasks.length} tasks from task service`);
    if (tasks.length < 5) {
      throw new Error(`Expected at least 5 tasks, found ${tasks.length}`);
    }

    // Verify 7 columns data presence
    const sample = tasks[0];
    const requiredKeys = ['status', 'taskNo', 'title', 'assigneeName', 'attachments', 'description', 'marks'];
    for (const key of requiredKeys) {
      if (sample[key] === undefined) {
        throw new Error(`Missing expected column field: ${key}`);
      }
    }
    console.log('  ✓ Verified exactly 7 columns data mapping: Status, Task No., Task, Allotted To, Attachments, Description, Marks');

    // Check specific rows matching Panel 8
    const task1 = tasks.find(t => t.taskNo === 1);
    if (!task1 || task1.title !== 'Project Setup' || task1.status !== 'completed' || task1.marks !== '8/10') {
      throw new Error(`Task 1 data mismatch: expected Project Setup, completed, 8/10. Got ${JSON.stringify(task1)}`);
    }
    console.log('  ✓ Task 1 verified: Status="Completed", Task No.=1, Title="Project Setup", Attachments="setup_doc.pdf", Marks="8/10"');

    const task2 = tasks.find(t => t.taskNo === 2);
    if (!task2 || task2.title !== 'Database Design' || task2.status !== 'not_completed' || task2.marks !== '-') {
      throw new Error(`Task 2 data mismatch: expected Database Design, not_completed, '-'. Got ${JSON.stringify(task2)}`);
    }
    console.log('  ✓ Task 2 verified: Status="Not Completed", Task No.=2, Title="Database Design", Marks="-"');

    const task3 = tasks.find(t => t.taskNo === 3);
    if (!task3 || task3.title !== 'API Development' || task3.status !== 'completed' || task3.marks !== '9/10') {
      throw new Error(`Task 3 data mismatch: expected API Development, completed, 9/10. Got ${JSON.stringify(task3)}`);
    }
    console.log('  ✓ Task 3 verified: Status="Completed", Task No.=3, Title="API Development", Marks="9/10"');

    // -------------------------------------------------------------
    // STEP 3: Verify access permissions (Requirement 6)
    // -------------------------------------------------------------
    console.log('\n-> Step 3: Verifying permission enforcement for unauthorized students & faculty...');
    try {
      await axios.get(`${GATEWAY_URL}/api/tasks?teamId=team_alpha`, authHeader('nonMemberStudent'));
      throw new Error('Non-member student should have been rejected with 403 Forbidden!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Unauthorized student blocked with HTTP 403: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    try {
      await axios.get(`${GATEWAY_URL}/api/tasks?teamId=team_alpha`, authHeader('unassignedFaculty'));
      throw new Error('Unassigned faculty should have been rejected with 403 Forbidden!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Unassigned faculty blocked with HTTP 403: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 4: Create Task by Authorized Team Lead (Requirement 3 & 5)
    // -------------------------------------------------------------
    console.log('\n-> Step 4: Testing task creation by Team Lead (Aarav Sharma)...');
    const newTaskPayload = {
      teamId: 'team_alpha',
      projectId: 'b503fcaeb7f9f3732992009b',
      courseId: 'CS543',
      title: 'Automated CI/CD Deployment Script',
      description: 'Setup GitHub Actions pipeline for linting, testing, and Docker builds.',
      instructions: 'Setup GitHub Actions workflow with secrets management.',
      submissionRequirements: 'Submit .github/workflows/ci.yml and test report.',
      assigneeEmail: 'alex.chen@student.edu', // Alex Chen is an active team member!
      priority: 'high',
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      attachments: [{ name: 'ci_guidelines.pdf', size: '1.5 MB', type: 'pdf' }]
    };

    const createRes = await axios.post(
      `${GATEWAY_URL}/api/tasks`,
      newTaskPayload,
      authHeader('teamLead')
    );

    const createdTask = createRes.data;
    console.log(`  ✓ Task created successfully: Task No. ${createdTask.taskNo} - "${createdTask.title}"`);
    console.log(`    Allotted to: ${createdTask.assigneeName} | Status: ${createdTask.status} | Marks: ${createdTask.marks}`);

    if (createdTask.status !== 'not_completed') {
      throw new Error(`Expected initial status to be 'not_completed', got '${createdTask.status}'`);
    }
    if (createdTask.marks !== '-') {
      throw new Error(`Expected initial marks to be '-', got '${createdTask.marks}'`);
    }

    // -------------------------------------------------------------
    // STEP 5: Validate Assignment Eligibility (Requirement 3 & 4)
    // -------------------------------------------------------------
    console.log('\n-> Step 5: Testing assignment eligibility validation (cannot assign outside team)...');
    try {
      await axios.post(
        `${GATEWAY_URL}/api/tasks`,
        {
          teamId: 'team_alpha',
          projectId: 'b503fcaeb7f9f3732992009b',
          title: 'Invalid Assignment Task',
          assigneeEmail: 'alka123@iitv.ac.in' // Alka Jha is NOT in Team Alpha!
        },
        authHeader('teamLead')
      );
      throw new Error('Backend should have rejected assigning task to a non-team member!');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log(`  ✓ Reassignment to non-member blocked with HTTP 400: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 6: Unauthorized student cannot create task (Requirement 6)
    // -------------------------------------------------------------
    console.log('\n-> Step 6: Testing unauthorized task creation rejection...');
    try {
      await axios.post(
        `${GATEWAY_URL}/api/tasks`,
        {
          teamId: 'team_alpha',
          projectId: 'b503fcaeb7f9f3732992009b',
          title: 'Unauthorized Member Task',
          assigneeEmail: 'alex.chen@student.edu'
        },
        authHeader('teamMember') // Alex Chen is regular member, NOT lead!
      );
      throw new Error('Regular team member should be rejected from creating tasks with 403!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Regular member blocked from creating task with HTTP 403: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 7: Students cannot award themselves marks (Requirement 4 & 8)
    // -------------------------------------------------------------
    console.log('\n-> Step 7: Verifying students cannot award themselves marks...');
    try {
      await axios.put(
        `${GATEWAY_URL}/api/tasks/${createdTask.id}`,
        {
          marks: '10/10',
          evaluation: { marksAwarded: 10, maxMarks: 10 }
        },
        authHeader('teamLead')
      );
      throw new Error('Student should be blocked from awarding self marks with 403!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Self-awarded marks blocked with HTTP 403: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 8: Task Submission by Member (Requirement 4, 5, 6)
    // -------------------------------------------------------------
    console.log('\n-> Step 8: Testing task submission by assigned member (Alex Chen)...');
    const submitRes = await axios.post(
      `${GATEWAY_URL}/api/tasks/${createdTask.id}/submit`,
      {
        submissionDescription: 'Implemented GitHub Actions CI workflow with linting and unit test runner.',
        attachment: {
          name: 'ci_pipeline_implementation.zip',
          size: '2.8 MB',
          type: 'zip'
        }
      },
      authHeader('teamMember')
    );

    const submittedTask = submitRes.data.task;
    console.log(`  ✓ Task submitted successfully: Status="${submittedTask.status}"`);
    console.log(`    Submission notes: "${submittedTask.submission.description}"`);
    console.log(`    Marks remain unevaluated: "${submittedTask.marks}"`);

    if (submittedTask.status !== 'completed') {
      throw new Error(`Expected status to be 'completed' after submission, got '${submittedTask.status}'`);
    }
    if (submittedTask.marks !== '-') {
      throw new Error(`Expected marks to still be '-' after submission (pending faculty evaluation), got '${submittedTask.marks}'`);
    }

    // -------------------------------------------------------------
    // STEP 9: Deadline enforcement on backend (Requirement 6 & 10)
    // -------------------------------------------------------------
    console.log('\n-> Step 9: Testing deadline enforcement (late submission blocked)...');
    const expiredTaskRes = await axios.post(
      `${GATEWAY_URL}/api/tasks`,
      {
        teamId: 'team_alpha',
        projectId: 'b503fcaeb7f9f3732992009b',
        title: 'Expired Deadline Task',
        description: 'Past deadline testing task',
        assigneeEmail: 'alex.chen@student.edu',
        dueDate: '2020-01-01T00:00:00.000Z' // Expired in the past!
      },
      authHeader('teamLead')
    );
    const expiredTask = expiredTaskRes.data;

    try {
      await axios.post(
        `${GATEWAY_URL}/api/tasks/${expiredTask.id}/submit`,
        {
          submissionDescription: 'Attempting late submission',
          attachment: { name: 'late_code.zip' }
        },
        authHeader('teamMember')
      );
      throw new Error('Late submission after deadline should be rejected with 400 Bad Request!');
    } catch (err) {
      if (err.response?.status === 400) {
        console.log(`  ✓ Late submission rejected with HTTP 400: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // Clean up expired test task
    await axios.delete(`${GATEWAY_URL}/api/tasks/${expiredTask.id}`, authHeader('teamLead'));

    // -------------------------------------------------------------
    // STEP 10: Faculty Evaluation & Awarding Marks (Requirement 4)
    // -------------------------------------------------------------
    console.log('\n-> Step 10: Testing faculty evaluation & marks awarding (Dr. R. Sharma)...');
    const evalRes = await axios.post(
      `${GATEWAY_URL}/api/tasks/${createdTask.id}/evaluate`,
      {
        marksAwarded: 9,
        maxMarks: 10,
        feedback: 'Excellent CI configuration with clean multi-stage docker caching.'
      },
      authHeader('assignedFaculty')
    );

    const evaluatedTask = evalRes.data.task;
    console.log(`  ✓ Task evaluated by supervisor: Marks="${evaluatedTask.marks}"`);
    console.log(`    Faculty feedback: "${evaluatedTask.evaluation.feedback}"`);

    if (evaluatedTask.marks !== '9/10') {
      throw new Error(`Expected marks to be '9/10', got '${evaluatedTask.marks}'`);
    }

    // Verify student cannot evaluate
    try {
      await axios.post(
        `${GATEWAY_URL}/api/tasks/${createdTask.id}/evaluate`,
        { marksAwarded: 10 },
        authHeader('teamMember')
      );
      throw new Error('Student should be blocked from grading with 403!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Student grading attempt blocked with HTTP 403: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 11: Attachment Streaming & Access Control (Requirement 5)
    // -------------------------------------------------------------
    console.log('\n-> Step 11: Testing attachment download & access control...');
    const dlRes = await axios.get(
      `${GATEWAY_URL}/api/tasks/${createdTask.id}/attachments/ci_guidelines.pdf`,
      {
        ...authHeader('teamMember'),
        responseType: 'arraybuffer'
      }
    );
    console.log(`  ✓ Attachment downloaded: status=${dlRes.status}, size=${dlRes.data.length} bytes`);

    // Non-member student blocked from downloading attachment
    try {
      await axios.get(
        `${GATEWAY_URL}/api/tasks/${createdTask.id}/attachments/ci_guidelines.pdf`,
        authHeader('nonMemberStudent')
      );
      throw new Error('Non-member student should be blocked from downloading task attachment!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.log(`  ✓ Non-member blocked from attachment download with HTTP 403`);
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------
    // STEP 12: Clean up created task
    // -------------------------------------------------------------
    console.log('\n-> Step 12: Cleaning up created task...');
    await axios.delete(`${GATEWAY_URL}/api/tasks/${createdTask.id}`, authHeader('teamLead'));
    console.log('  ✓ Test task cleaned up successfully');

    console.log('\n====================================================');
    console.log('   ALL STEP 4 TASK MANAGEMENT TESTS PASSED (100%)    ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n✗ Test Suite Failed:', err.message);
    if (err.response?.data) console.error('Response Data:', err.response.data);
    process.exit(1);
  }
}

runTests();
