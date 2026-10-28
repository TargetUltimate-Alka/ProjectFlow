const axios = require('axios');
const assert = require('assert');

const GATEWAY_URL = 'http://localhost:5000';

async function runDashboardTests() {
  console.log('====================================================');
  console.log('   Step 3: Student Team Dashboard Automated Tests   ');
  console.log('====================================================');

  try {
    // 1. Authenticate Personas
    console.log('\n-> Step 1: Authenticating test users...');

    // A. Team Lead: Aarav Sharma
    const aaravLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'aarav.sharma@student.edu',
      password: 'password123'
    });
    const aaravToken = aaravLogin.data.token;
    const aaravHeaders = { Authorization: `Bearer ${aaravToken}` };
    console.log('  ✓ Authenticated Team Lead: Aarav Sharma');

    // B. Team Member: Alex Chen
    const alexLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'alex.chen@student.edu',
      password: 'password123'
    });
    const alexToken = alexLogin.data.token;
    const alexHeaders = { Authorization: `Bearer ${alexToken}` };
    console.log('  ✓ Authenticated Team Member: Alex Chen');

    // C. Non-Member Student: Alka Jha (Enrolled in CS543, but not in team_alpha)
    const alkaLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'alka123@iitv.ac.in',
      password: 'password123'
    });
    const alkaToken = alkaLogin.data.token;
    const alkaHeaders = { Authorization: `Bearer ${alkaToken}` };
    console.log('  ✓ Authenticated Non-Member Student: Alka Jha');

    // D. Assigned Faculty: Dr. R. Sharma (CS543)
    const sharmaLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'dr.sharma@projectflow.edu',
      password: 'password123'
    });
    const sharmaToken = sharmaLogin.data.token;
    const sharmaHeaders = { Authorization: `Bearer ${sharmaToken}` };
    console.log('  ✓ Authenticated Assigned Faculty: Dr. R. Sharma');

    // E. Unassigned Faculty: Dr. P. Singh (CS541)
    const singhLogin = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'dr.singh@projectflow.edu',
      password: 'password123'
    });
    const singhToken = singhLogin.data.token;
    const singhHeaders = { Authorization: `Bearer ${singhToken}` };
    console.log('  ✓ Authenticated Unassigned Faculty: Dr. P. Singh');

    // 2. Authorized Access: Team Lead fetches dashboard
    console.log('\n-> Step 2: Verifying authorized access for Team Lead (Aarav Sharma)...');
    const leadDashRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/dashboard`, {
      headers: aaravHeaders
    });
    assert.strictEqual(leadDashRes.status, 200, 'Team lead dashboard returns 200 OK');
    const data = leadDashRes.data;

    // Verify Team Header Details
    console.log('  -> Validating Team Header data...');
    assert.strictEqual(data.team.name, 'Team Alpha', 'Team name matches Team Alpha');
    assert.strictEqual(data.team.teamLead, 'Aarav Sharma', 'Team lead is Aarav Sharma');
    assert.strictEqual(data.team.memberCount, 4, 'Member count is 4');
    assert.strictEqual(data.team.status, 'Active', 'Team status is Active');
    console.log(`    ✓ Team: ${data.team.name} | Lead: ${data.team.teamLead} | Members: ${data.team.memberCount} | Status: ${data.team.status}`);

    // Verify Course Details
    console.log('  -> Validating Associated Course data...');
    assert.strictEqual(data.course.code, 'CS543', 'Course code is CS543');
    assert.strictEqual(data.course.name, 'Web Services', 'Course name is Web Services');
    assert.strictEqual(data.course.facultyName, 'Dr. R. Sharma', 'Faculty is Dr. R. Sharma');
    console.log(`    ✓ Course: ${data.course.code} - ${data.course.name} | Faculty: ${data.course.facultyName}`);

    // Verify Project Details (Panel 7 data)
    console.log('  -> Validating Project Information...');
    assert.strictEqual(data.project.title, 'ProjectFlow Development', 'Project title matches ProjectFlow Development');
    assert.strictEqual(data.project.startDate, '2026-09-01', 'Start date is 2026-09-01');
    assert.strictEqual(data.project.endDate, '2026-12-15', 'End date is 2026-12-15');
    console.log(`    ✓ Project Title: "${data.project.title}" | Dates: ${data.project.startDate} to ${data.project.endDate}`);

    // Verify Progress Overview Metrics (Matching Panel 7 exactly)
    console.log('  -> Validating Progress Overview Metrics...');
    assert.strictEqual(data.progress.tasks.total, 12, 'Tasks total is 12');
    assert.strictEqual(data.progress.tasks.completed, 6, 'Completed tasks is 6');
    assert.strictEqual(data.progress.documents.count, 6, 'Documents count is 6');
    assert.strictEqual(data.progress.github.commits, 48, 'GitHub commits count is 48');
    assert.strictEqual(data.progress.evaluation.status, 'Pending', 'Evaluation status is Pending');
    assert(data.progress.overallPercentage >= 50 && data.progress.overallPercentage <= 60, 'Overall progress is valid percentage');
    console.log(`    ✓ Tasks: ${data.progress.tasks.total} (${data.progress.tasks.completed} completed)`);
    console.log(`    ✓ Documents: ${data.progress.documents.count}`);
    console.log(`    ✓ GitHub Commits: ${data.progress.github.commits}`);
    console.log(`    ✓ Evaluation: ${data.progress.evaluation.status}`);
    console.log(`    ✓ Overall Progress: ${data.progress.overallPercentage}%`);

    // Verify Team Announcements (Panel 7 items)
    console.log('  -> Validating Team Announcements...');
    assert(Array.isArray(data.announcements), 'Announcements is an array');
    assert(data.announcements.length >= 3, 'At least 3 team announcements returned');
    const titles = data.announcements.map(a => a.title);
    assert(titles.includes('Updated API Documentation'), 'Has "Updated API Documentation" announcement');
    assert(titles.includes('Good Progress!'), 'Has "Good Progress!" announcement');
    assert(titles.includes('Next Meeting'), 'Has "Next Meeting" announcement');
    const docAnn = data.announcements.find(a => a.title === 'Updated API Documentation');
    assert(docAnn.attachments && docAnn.attachments.length > 0, 'Document announcement has attachment');
    assert.strictEqual(docAnn.attachments[0].name, 'API_Endpoints_v2.pdf', 'Attachment name is API_Endpoints_v2.pdf');
    console.log(`    ✓ Found ${data.announcements.length} team announcements with attachment "API_Endpoints_v2.pdf"`);

    // 3. Authorized Access: Regular Team Member fetches dashboard
    console.log('\n-> Step 3: Verifying authorized access for regular Team Member (Alex Chen)...');
    const memberDashRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/dashboard`, {
      headers: alexHeaders
    });
    assert.strictEqual(memberDashRes.status, 200, 'Regular team member can view shared workspace (200 OK)');
    console.log('  ✓ Member successfully retrieved shared team workspace');

    // 4. Unauthorized Access: Student not in team receives 403 Forbidden (Requirement 5)
    console.log('\n-> Step 4: Verifying authorization enforcement for non-member student (Alka Jha)...');
    try {
      await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/dashboard`, {
        headers: alkaHeaders
      });
      assert.fail('Should have failed with 403 Forbidden');
    } catch (err) {
      assert.strictEqual(err.response.status, 403, 'Unauthorized student receives 403 Forbidden');
      console.log(`  ✓ Access blocked with HTTP 403: "${err.response.data.error}"`);
    }

    // 5. Faculty Permissions: Assigned Course Supervisor receives 200 OK
    console.log('\n-> Step 5: Verifying assigned faculty supervisor access (Dr. R. Sharma)...');
    const facultyDashRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/dashboard`, {
      headers: sharmaHeaders
    });
    assert.strictEqual(facultyDashRes.status, 200, 'Assigned faculty supervisor receives 200 OK');
    console.log('  ✓ Assigned supervisor successfully opened supervised team dashboard');

    // 6. Faculty Permissions: Unassigned Faculty receives 403 Forbidden
    console.log('\n-> Step 6: Verifying unassigned faculty blocked (Dr. P. Singh)...');
    try {
      await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/dashboard`, {
        headers: singhHeaders
      });
      assert.fail('Unassigned faculty should be blocked');
    } catch (err) {
      assert.strictEqual(err.response.status, 403, 'Unassigned faculty receives 403 Forbidden');
      console.log(`  ✓ Unassigned faculty blocked with HTTP 403: "${err.response.data.error}"`);
    }

    // 7. Interactive Feature: Post Team Announcement
    console.log('\n-> Step 7: Testing team announcement publishing...');
    const newAnnRes = await axios.post(
      `${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/announcements`,
      {
        title: 'Sprint 2 Milestone Retrospective',
        content: 'Please submit your code review checklist before Thursday 5 PM.',
        attachments: [{ name: 'Sprint_2_Checklist.pdf', size: '450 KB', type: 'pdf' }]
      },
      { headers: aaravHeaders }
    );
    assert.strictEqual(newAnnRes.status, 201, 'Post announcement returns 201 Created');
    assert.strictEqual(newAnnRes.data.announcement.title, 'Sprint 2 Milestone Retrospective');
    console.log('  ✓ Team announcement created successfully (201 Created)');

    // Verify non-member cannot post team announcement
    try {
      await axios.post(
        `${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/announcements`,
        { title: 'Intrusion Attempt', content: 'Should fail' },
        { headers: alkaHeaders }
      );
      assert.fail('Unauthorized post should fail');
    } catch (err) {
      assert.strictEqual(err.response.status, 403, 'Unauthorized student receives 403');
      console.log('  ✓ Unauthorized student blocked from posting team announcements (403)');
    }

    // 8. Interactive Feature: Update Project Information
    console.log('\n-> Step 8: Testing project info update...');
    const updateRes = await axios.put(
      `${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/project`,
      {
        projectTitle: 'ProjectFlow Development (Updated)',
        projectDescription: 'Updated capstone project description with automated CI/CD microservices.',
        startDate: '2026-09-01',
        endDate: '2026-12-20'
      },
      { headers: aaravHeaders }
    );
    assert.strictEqual(updateRes.status, 200, 'Update project returns 200 OK');
    console.log('  ✓ Project metadata updated by Team Lead (200 OK)');

    // Verify non-lead regular member cannot modify project info
    try {
      await axios.put(
        `${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/project`,
        { projectTitle: 'Hacked Title' },
        { headers: alexHeaders }
      );
      assert.fail('Regular member should not be able to modify project info');
    } catch (err) {
      assert.strictEqual(err.response.status, 403, 'Regular member blocked with 403');
      console.log('  ✓ Regular member blocked from modifying project metadata (403)');
    }

    // Reset project info back to panel 7 baseline
    await axios.put(
      `${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/project`,
      {
        projectTitle: 'ProjectFlow Development',
        projectDescription: 'Development of an academic project management system with microservices architecture.',
        startDate: '2026-09-01',
        endDate: '2026-12-15'
      },
      { headers: aaravHeaders }
    );

    console.log('\n====================================================');
    console.log('   ALL STEP 3 TEAM DASHBOARD TESTS PASSED (100%)    ');
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Test failure:', error.response?.data || error.message);
    process.exit(1);
  }
}

runDashboardTests();
