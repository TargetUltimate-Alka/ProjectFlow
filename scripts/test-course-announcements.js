/**
 * Automated Verification Script for Step 2: Course Page and Faculty Broadcast Announcements
 *
 * Verifies:
 * 1. Students can read announcements before team formation.
 * 2. Announcements belong to the correct course.
 * 3. Students cannot publish or modify faculty announcements (403 Forbidden).
 * 4. Faculty can publish, update, and delete announcements (201 / 200).
 * 5. Read/unread toggle functions correctly for enrolled students.
 * 6. Attachments are accessible only to authorized users (403 Forbidden for non-enrolled students).
 * 7. Course teams preview listing is accessible without requiring team membership.
 * 8. Existing course navigation and broadcasts continue to function.
 */

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:5000';
const projectRoot = path.resolve(__dirname, '..');

let servicesProcess = null;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isGatewayHealthy() {
  try {
    const res = await axios.get(`${GATEWAY_URL}/health`, { timeout: 2000 });
    return res.data && res.data.gateway === 'healthy' &&
           res.data.services?.auth === 'healthy' &&
           res.data.services?.project === 'healthy';
  } catch (e) {
    return false;
  }
}

async function ensureBackendRunning() {
  const healthy = await isGatewayHealthy();
  if (healthy) {
    console.log('✓ Backend microservices already running and healthy.');
    return;
  }

  console.log('Starting ProjectFlow backend services...');
  servicesProcess = spawn('npm', ['start'], {
    cwd: path.join(projectRoot, 'services'),
    shell: true,
    stdio: 'inherit'
  });

  const maxAttempts = 25;
  for (let i = 1; i <= maxAttempts; i++) {
    await sleep(2000);
    const ok = await isGatewayHealthy();
    if (ok) {
      console.log(`✓ Backend microservices ready after ${i * 2}s.`);
      return;
    }
    process.stdout.write(`Waiting for services readiness... (${i}/${maxAttempts})\r`);
  }
  throw new Error('Backend services failed to reach healthy state.');
}

async function runTests() {
  console.log('\n======================================================');
  console.log('  PROJECTFLOW STEP 2 — VERIFICATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Authenticate Personas
  console.log('[1] Authenticating Test Personas...');
  let alkaToken = null;
  let sharmaToken = null;
  let elenaToken = null;

  try {
    // Alka Jha (Enrolled in CS543, CS541, CS542, CS544)
    const alkaRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'alka123@iitv.ac.in',
      password: 'password123'
    });
    alkaToken = alkaRes.data.token;
    assert(alkaToken && alkaRes.data.user.role === 'Student', 'Student Alka Jha authenticated successfully');
  } catch (err) {
    assert(false, `Student authentication failed: ${err.message}`);
  }

  try {
    // Dr. R. Sharma (Faculty for CS543 Web Services)
    const sharmaRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'dr.sharma@projectflow.edu',
      password: 'password123'
    });
    sharmaToken = sharmaRes.data.token;
    assert(sharmaToken && sharmaRes.data.user.role === 'Faculty', 'Faculty Dr. R. Sharma authenticated successfully');
  } catch (err) {
    assert(false, `Faculty authentication failed: ${err.message}`);
  }

  try {
    // Elena Rostova (Enrolled in CS541 & CS544, NOT enrolled in CS543)
    const elenaRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'elena.rostova@student.edu',
      password: 'password123'
    });
    elenaToken = elenaRes.data.token;
    assert(elenaToken && elenaRes.data.user.role === 'Student', 'Student Elena Rostova authenticated successfully');
  } catch (err) {
    assert(false, `Student Elena authentication failed: ${err.message}`);
  }

  const alkaHeaders = { Authorization: `Bearer ${alkaToken}` };
  const sharmaHeaders = { Authorization: `Bearer ${sharmaToken}` };
  const elenaHeaders = { Authorization: `Bearer ${elenaToken}` };

  // 2. Test Announcements Retrieval for Enrolled Student (Before Team Formation)
  console.log('\n[2] Testing Announcements Retrieval (Enrolled Student Without Team Prerequisite)...');
  try {
    const annRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/announcements`, { headers: alkaHeaders });
    assert(annRes.status === 200, 'GET /api/courses/CS543/announcements returns 200 OK');
    assert(Array.isArray(annRes.data) && annRes.data.length > 0, `Returned ${annRes.data.length} announcements for CS543`);

    // Verify required example announcement
    const guidelinesAnn = annRes.data.find(a => a.title.includes('Project Team Formation Guidelines'));
    assert(!!guidelinesAnn, 'Required announcement "Project Team Formation Guidelines" found in feed');
    if (guidelinesAnn) {
      assert(guidelinesAnn.facultyName === 'Dr. R. Sharma', `Instructor is correctly specified: ${guidelinesAnn.facultyName}`);
      assert(guidelinesAnn.isPinned === true, 'Announcement isPinned is true');
      assert(guidelinesAnn.isImportant === true, 'Announcement isImportant is true');
      assert(guidelinesAnn.content.includes('4–5 students'), 'Announcement contains team size rule (4–5 students)');
      assert(guidelinesAnn.content.includes('academic batch'), 'Announcement contains same academic batch rule');
      assert(guidelinesAnn.content.includes('unique roll number'), 'Announcement contains unique roll number rule');
      assert(guidelinesAnn.content.includes('only one team'), 'Announcement contains single team membership rule');
      assert(guidelinesAnn.content.includes('faculty-approved list'), 'Announcement contains approved topic list rule');
      assert(guidelinesAnn.content.includes('deadline'), 'Announcement contains deadline rule');
      assert(Array.isArray(guidelinesAnn.attachments) && guidelinesAnn.attachments.length >= 1, `Contains ${guidelinesAnn.attachments.length} attachment(s)`);
      const pdfAtt = guidelinesAnn.attachments.find(att => att.name === 'Project_Guidelines.pdf');
      assert(!!pdfAtt, 'Attachment Project_Guidelines.pdf is present');
      assert(typeof guidelinesAnn.isRead === 'boolean', `Computed isRead property present: ${guidelinesAnn.isRead}`);
    }

    // Verify announcements in CS541 (where student has no team yet)
    const cs541Res = await axios.get(`${GATEWAY_URL}/api/courses/CS541/announcements`, { headers: alkaHeaders });
    assert(cs541Res.status === 200 && Array.isArray(cs541Res.data), 'Enrolled student can read announcements in CS541 before belonging to any team');
  } catch (err) {
    assert(false, `Announcements retrieval failed: ${err.message}`);
  }

  // 3. Test Course Scoping: Announcements belong to the correct course
  console.log('\n[3] Testing Course Scoping & Boundary Validation...');
  try {
    const cs543Res = await axios.get(`${GATEWAY_URL}/api/courses/CS543/announcements`, { headers: alkaHeaders });
    const all543Belong = cs543Res.data.every(a => a.courseCode === 'CS543');
    assert(all543Belong, 'All announcements in CS543 response belong exclusively to course CS543');

    const cs541Res = await axios.get(`${GATEWAY_URL}/api/courses/CS541/announcements`, { headers: alkaHeaders });
    const all541Belong = cs541Res.data.every(a => a.courseCode === 'CS541');
    assert(all541Belong, 'All announcements in CS541 response belong exclusively to course CS541');

    // Attempting to retrieve a CS541 announcement through the CS543 route must fail
    try {
      await axios.get(`${GATEWAY_URL}/api/courses/CS543/announcements/ann_cs541_deadline`, { headers: alkaHeaders });
      assert(false, 'Should reject mismatched announcement ID for wrong course');
    } catch (e) {
      assert(e.response && (e.response.status === 404 || e.response.status === 400), 'GET mismatched announcement correctly returned 404');
    }
  } catch (err) {
    assert(false, `Course scoping test failed: ${err.message}`);
  }

  // 4. Test Authorization: Student Cannot Publish or Modify Announcements (403 Forbidden)
  console.log('\n[4] Testing Authorization: Student Cannot Publish or Modify Announcements...');
  try {
    // Attempt POST as student
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/announcements`, {
        title: 'Unauthorized Student Announcement',
        content: 'This should fail.'
      }, { headers: alkaHeaders });
      assert(false, 'Student POST announcement should have been rejected');
    } catch (e) {
      assert(e.response && e.response.status === 403, `Student POST announcement rejected with 403 Forbidden (${e.response?.data?.error || ''})`);
    }

    // Attempt PUT as student
    try {
      await axios.put(`${GATEWAY_URL}/api/courses/CS543/announcements/ann_cs543_team_guidelines`, {
        title: 'Tampered Title'
      }, { headers: alkaHeaders });
      assert(false, 'Student PUT announcement should have been rejected');
    } catch (e) {
      assert(e.response && e.response.status === 403, `Student PUT announcement rejected with 403 Forbidden`);
    }

    // Attempt DELETE as student
    try {
      await axios.delete(`${GATEWAY_URL}/api/courses/CS543/announcements/ann_cs543_team_guidelines`, { headers: alkaHeaders });
      assert(false, 'Student DELETE announcement should have been rejected');
    } catch (e) {
      assert(e.response && e.response.status === 403, `Student DELETE announcement rejected with 403 Forbidden`);
    }
  } catch (err) {
    assert(false, `Student authorization test error: ${err.message}`);
  }

  // 5. Test Faculty Announcement Lifecycle (Publish, Update, Delete)
  console.log('\n[5] Testing Faculty Announcement Publishing Lifecycle...');
  let createdAnnouncementId = null;
  try {
    // Faculty posts announcement
    const postRes = await axios.post(`${GATEWAY_URL}/api/courses/CS543/announcements`, {
      title: 'Lab 3 Cloud Deployment Checklist',
      content: 'Please ensure your Dockerfile multi-stage build is pushed before Friday.',
      isPinned: false,
      isImportant: true,
      attachments: [
        { name: 'Cloud_Checklist.pdf', size: '540 KB', type: 'pdf' }
      ]
    }, { headers: sharmaHeaders });

    assert(postRes.status === 201, 'Faculty POST /api/courses/CS543/announcements returns 201 Created');
    createdAnnouncementId = postRes.data.id || postRes.data._id;
    assert(!!createdAnnouncementId, `Created announcement ID: ${createdAnnouncementId}`);

    // Faculty updates announcement
    const putRes = await axios.put(`${GATEWAY_URL}/api/courses/CS543/announcements/${createdAnnouncementId}`, {
      title: 'Lab 3 Cloud Deployment Checklist (Updated)',
      isPinned: true
    }, { headers: sharmaHeaders });
    assert(putRes.status === 200 && putRes.data.title.includes('Updated'), 'Faculty PUT /api/courses/CS543/announcements/:id returns 200 OK');

    // Faculty deletes announcement
    const delRes = await axios.delete(`${GATEWAY_URL}/api/courses/CS543/announcements/${createdAnnouncementId}`, { headers: sharmaHeaders });
    assert(delRes.status === 200, 'Faculty DELETE /api/courses/CS543/announcements/:id returns 200 OK');
  } catch (err) {
    assert(false, `Faculty lifecycle test failed: ${err.message}`);
  }

  // 6. Test Read/Unread Status Toggle for Enrolled Student
  console.log('\n[6] Testing Read/Unread Status Toggle for Student...');
  try {
    const targetAnnId = 'ann_cs543_team_guidelines';

    // Mark as read
    const markReadRes = await axios.put(
      `${GATEWAY_URL}/api/courses/CS543/announcements/${targetAnnId}/read`,
      { unread: false },
      { headers: alkaHeaders }
    );
    assert(markReadRes.status === 200 && markReadRes.data.isRead === true, 'Mark as read returns isRead: true');

    // Verify via list endpoint
    let listRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/announcements`, { headers: alkaHeaders });
    let annItem = listRes.data.find(a => (a.id === targetAnnId || a._id === targetAnnId));
    assert(annItem && annItem.isRead === true, 'Feed reflects isRead: true for authenticated student');

    // Mark as unread
    const markUnreadRes = await axios.put(
      `${GATEWAY_URL}/api/courses/CS543/announcements/${targetAnnId}/read`,
      { unread: true },
      { headers: alkaHeaders }
    );
    assert(markUnreadRes.status === 200 && markUnreadRes.data.isRead === false, 'Mark as unread returns isRead: false');

    listRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/announcements`, { headers: alkaHeaders });
    annItem = listRes.data.find(a => (a.id === targetAnnId || a._id === targetAnnId));
    assert(annItem && annItem.isRead === false, 'Feed reflects isRead: false after marking unread');
  } catch (err) {
    assert(false, `Read/unread toggle test failed: ${err.message}`);
  }

  // 7. Test Attachment Access Control (Enrolled vs Non-Enrolled Users)
  console.log('\n[7] Testing Attachment Access Control...');
  try {
    // Authorized student (Alka is enrolled in CS543)
    const attRes = await axios.get(
      `${GATEWAY_URL}/api/courses/CS543/attachments/Project_Guidelines.pdf`,
      { headers: alkaHeaders, responseType: 'arraybuffer' }
    );
    assert(attRes.status === 200, 'Enrolled student successfully accesses attachment (200 OK)');
    assert(attRes.headers['content-type'] === 'application/pdf', `Content-Type header is application/pdf`);
    assert(attRes.headers['content-disposition']?.includes('Project_Guidelines.pdf'), `Content-Disposition header includes filename`);

    // Unauthorized student (Elena is NOT enrolled in CS543)
    try {
      await axios.get(
        `${GATEWAY_URL}/api/courses/CS543/attachments/Project_Guidelines.pdf`,
        { headers: elenaHeaders }
      );
      assert(false, 'Non-enrolled student should be rejected with 403');
    } catch (e) {
      assert(e.response && e.response.status === 403, `Non-enrolled student attachment access rejected with 403 Forbidden (${e.response?.data?.error || ''})`);
    }
  } catch (err) {
    assert(false, `Attachment access control test error: ${err.message}`);
  }

  // 8. Test Course Teams Preview Listing
  console.log('\n[8] Testing Course Teams Preview Listing (Without Team Prerequisite)...');
  try {
    const teamsRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams`, { headers: alkaHeaders });
    assert(teamsRes.status === 200, 'GET /api/courses/CS543/teams returns 200 OK');
    assert(Array.isArray(teamsRes.data) && teamsRes.data.length >= 4, `Returned ${teamsRes.data.length} preview teams`);

    const alphaTeam = teamsRes.data.find(t => t.name === 'Team Alpha');
    assert(!!alphaTeam, 'Team Alpha preview found');
    if (alphaTeam) {
      assert(alphaTeam.status === 'Joined', 'Team Alpha shows status: Joined for member Alka Jha');
      assert(alphaTeam.isUserMember === true, 'Team Alpha shows isUserMember: true for Alka Jha');
    }

    const innovTeam = teamsRes.data.find(t => t.name === 'Team Innovators');
    assert(!!innovTeam, 'Team Innovators preview found');
    if (innovTeam) {
      assert(innovTeam.status === 'Full', 'Team Innovators shows status: Full');
      assert(innovTeam.memberCount === 5, 'Team Innovators shows capacity 5/5');
    }

    const codecraftTeam = teamsRes.data.find(t => t.name === 'Team CodeCraft');
    assert(!!codecraftTeam, 'Team CodeCraft preview found');
    if (codecraftTeam) {
      assert(codecraftTeam.status === 'Open', 'Team CodeCraft shows status: Open');
    }
  } catch (err) {
    assert(false, `Teams preview test failed: ${err.message}`);
  }

  // 9. Test Existing Course Navigation
  console.log('\n[9] Testing Existing Course Navigation Continuance...');
  try {
    const coursesRes = await axios.get(`${GATEWAY_URL}/api/courses?search=Web`, { headers: alkaHeaders });
    assert(coursesRes.status === 200 && coursesRes.data.length >= 1, 'GET /api/courses?search=Web returns filtered courses');

    const singleCourseRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543`, { headers: alkaHeaders });
    assert(singleCourseRes.status === 200 && singleCourseRes.data.code === 'CS543', 'GET /api/courses/CS543 returns course details');

    const broadcastsRes = await axios.get(`${GATEWAY_URL}/api/courses/broadcasts`, { headers: alkaHeaders });
    assert(broadcastsRes.status === 200 && Array.isArray(broadcastsRes.data), 'GET /api/courses/broadcasts returns aggregated broadcasts');
  } catch (err) {
    assert(false, `Existing course navigation test error: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (servicesProcess) {
    console.log('Stopping spawned backend process...');
    servicesProcess.kill();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

async function main() {
  try {
    await ensureBackendRunning();
    await runTests();
  } catch (err) {
    console.error('Test execution failed:', err);
    if (servicesProcess) servicesProcess.kill();
    process.exit(1);
  }
}

main();
