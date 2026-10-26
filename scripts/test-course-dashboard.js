const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const GATEWAY_URL = 'http://127.0.0.1:5000/api';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCourseDashboardTests() {
  console.log('====================================================');
  console.log('  ProjectFlow — Step 1: Course Dashboard Test Suite  ');
  console.log('====================================================\n');

  // Launch background services for the test: Auth (5001), Project (5002), Gateway (5000)
  console.log('1. Booting Auth Service (5001), Project Service (5002), and Gateway (5000)...');
  const projectRoot = path.resolve(__dirname, '..');
  const spawnOpts = { cwd: projectRoot, env: { ...process.env } };

  const authProc = spawn(process.execPath, [path.resolve(projectRoot, 'services/auth/server.js')], spawnOpts);
  const projectProc = spawn(process.execPath, [path.resolve(projectRoot, 'services/project/server.js')], spawnOpts);
  const gatewayProc = spawn(process.execPath, [path.resolve(projectRoot, 'gateway/server.js')], spawnOpts);

  const cleanup = () => {
    try { authProc.kill(); } catch (e) {}
    try { projectProc.kill(); } catch (e) {}
    try { gatewayProc.kill(); } catch (e) {}
  };

  process.on('SIGINT', cleanup);
  process.on('exit', cleanup);

  // Wait for servers to spin up and report healthy
  let ready = false;
  for (let i = 0; i < 20; i++) {
    await wait(1000);
    try {
      const h = await axios.get('http://127.0.0.1:5000/health', { timeout: 1500 });
      if (h.data && h.data.gateway === 'healthy' && h.data.services?.auth === 'healthy' && h.data.services?.project === 'healthy') {
        ready = true;
        break;
      }
    } catch (e) {}
  }

  if (!ready) {
    console.error('❌ Failed to connect to API Gateway on port 5000.');
    cleanup();
    process.exit(1);
  }
  console.log('✓ API Gateway & Microservices operational!\n');

  try {
    // 2. Authentication: Student Login
    console.log('2. Testing Student Login (Alka Jha & Alex Chen)...');
    const loginAlka = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: 'alka123@iitv.ac.in',
      password: 'password123'
    });
    console.log(`✓ Student logged in: ${loginAlka.data.user.name} (${loginAlka.data.user.email}) [Role: ${loginAlka.data.user.role}]`);
    const alkaToken = loginAlka.data.token;
    const alkaHeaders = { Authorization: `Bearer ${alkaToken}` };

    const loginAlex = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: 'alex.chen@student.edu',
      password: 'password123'
    });
    const alexHeaders = { Authorization: `Bearer ${loginAlex.data.token}` };

    // 3. Authorized Courses Fetching
    console.log('\n3. Testing Authorized Courses Retrieval (GET /api/courses)...');
    const coursesRes = await axios.get(`${GATEWAY_URL}/courses`, { headers: alkaHeaders });
    const courses = coursesRes.data;
    console.log(`✓ Retrieved ${courses.length} authorized courses for student Alka Jha:`);
    courses.forEach(c => {
      console.log(`  - [${c.code}] ${c.name} | Faculty: ${c.facultyName} | Batch: ${c.batch} (${c.semester})`);
    });

    if (courses.length < 4) {
      throw new Error(`Expected at least 4 authorized courses, got ${courses.length}`);
    }

    // Verify course fields
    const cs543 = courses.find(c => c.code === 'CS543');
    if (!cs543 || cs543.facultyName !== 'Dr. R. Sharma' || cs543.batch !== '2026-2028') {
      throw new Error('Course metadata for CS543 does not match expected faculty and batch.');
    }
    console.log('✓ Course codes, names, faculty, batch, and semester validated successfully.');

    // 4. Course Real-time Search
    console.log('\n4. Testing Real-time Course Search API...');
    const searchRes1 = await axios.get(`${GATEWAY_URL}/courses?search=Web`, { headers: alkaHeaders });
    console.log(`✓ Search for "Web": Found ${searchRes1.data.length} course(s) -> [${searchRes1.data.map(c => c.code).join(', ')}]`);
    if (searchRes1.data.length !== 1 || searchRes1.data[0].code !== 'CS543') {
      throw new Error('Search for "Web" failed to return CS543');
    }

    const searchRes2 = await axios.get(`${GATEWAY_URL}/courses?search=Algorithms`, { headers: alkaHeaders });
    console.log(`✓ Search for "Algorithms": Found ${searchRes2.data.length} course(s) -> [${searchRes2.data.map(c => c.code).join(', ')}]`);
    if (searchRes2.data.length !== 1 || searchRes2.data[0].code !== 'CS541') {
      throw new Error('Search for "Algorithms" failed to return CS541');
    }

    const searchRes3 = await axios.get(`${GATEWAY_URL}/courses?search=Dr.+M.+Verma`, { headers: alkaHeaders });
    console.log(`✓ Search for faculty "Dr. M. Verma": Found ${searchRes3.data.length} course(s) -> [${searchRes3.data.map(c => c.code).join(', ')}]`);
    if (searchRes3.data.length !== 1 || searchRes3.data[0].code !== 'CS542') {
      throw new Error('Search for "Dr. M. Verma" failed to return CS542');
    }

    const searchRes4 = await axios.get(`${GATEWAY_URL}/courses?search=NonExistentCourseXYZ`, { headers: alkaHeaders });
    console.log(`✓ Search for non-existent course: Correctly returned ${searchRes4.data.length} items (empty state).`);

    // 5. Course Details Navigation
    console.log('\n5. Testing Course Navigation & Details (GET /api/courses/:id)...');
    const courseDetailRes = await axios.get(`${GATEWAY_URL}/courses/CS543`, { headers: alkaHeaders });
    const detail = courseDetailRes.data;
    console.log(`✓ Fetched course detail for "${detail.code} - ${detail.name}"`);
    console.log(`✓ Instructor: ${detail.facultyName} (${detail.facultyEmail})`);
    console.log(`✓ Instructor Message: "${detail.instructorMessage?.title}" (${detail.instructorMessage?.date})`);
    console.log(`✓ Attached Guidelines: ${detail.instructorMessage?.attachments?.[0]?.name}`);
    console.log(`✓ Active Announcements count: ${detail.announcements?.length}`);

    if (!detail.instructorMessage || !detail.instructorMessage.attachments) {
      throw new Error('Course details missing instructor message or attachments.');
    }

    // 6. Role-based Authorization Enforcement (Access Denied 403 Verification)
    console.log('\n6. Testing Strict Student Authorization Enforcement (403 Forbidden)...');
    // Marcus Vance is enrolled in CS543 and CS542, NOT CS541
    const loginMarcus = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: 'marcus.vance@student.edu',
      password: 'password123'
    });
    const marcusHeaders = { Authorization: `Bearer ${loginMarcus.data.token}` };

    const marcusCourses = await axios.get(`${GATEWAY_URL}/courses`, { headers: marcusHeaders });
    console.log(`✓ Marcus Vance authorized courses: [${marcusCourses.data.map(c => c.code).join(', ')}] (CS541 excluded)`);
    if (marcusCourses.data.some(c => c.code === 'CS541')) {
      throw new Error('Marcus Vance should not have access to CS541.');
    }

    try {
      await axios.get(`${GATEWAY_URL}/courses/CS541`, { headers: marcusHeaders });
      throw new Error('Unauthorized student was unexpectedly allowed to access CS541!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log(`✓ Confirmed 403 Forbidden when unauthorized student accesses CS541: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // 7. Course Broadcast Announcements
    console.log('\n7. Testing Aggregated Course Broadcasts (GET /api/courses/broadcasts)...');
    const broadcastsRes = await axios.get(`${GATEWAY_URL}/courses/broadcasts`, { headers: alkaHeaders });
    console.log(`✓ Retrieved ${broadcastsRes.data.length} broadcast announcements for Alka Jha:`);
    broadcastsRes.data.forEach(b => {
      console.log(`  - [${b.courseCode}] ${b.title} (${b.facultyName} • ${b.date})`);
    });

    // 8. Error handling for non-existent course (404)
    console.log('\n8. Testing Non-existent Course Error Handling (404 Not Found)...');
    try {
      await axios.get(`${GATEWAY_URL}/courses/CS999`, { headers: alkaHeaders });
      throw new Error('Expected 404 for CS999');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log(`✓ Confirmed 404 Not Found for invalid course code: "${err.response.data.error}"`);
      } else {
        throw err;
      }
    }

    // 9. Unauthenticated request protection (401)
    console.log('\n9. Testing Unauthenticated Request Protection (401 Unauthorized)...');
    try {
      await axios.get(`${GATEWAY_URL}/courses`);
      throw new Error('Expected 401 without auth token');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('✓ Confirmed 401 Unauthorized when authorization token is omitted.');
      } else {
        throw err;
      }
    }

    console.log('\n====================================================');
    console.log('  ALL STEP 1 STUDENT COURSE DASHBOARD TESTS PASSED!  ');
    console.log('====================================================');
    cleanup();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test suite failed:', err.response?.data || err.message);
    cleanup();
    process.exit(1);
  }
}

runCourseDashboardTests();
