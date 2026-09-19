const axios = require('axios');

const GATEWAY_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('=== Starting ProjectFlow Automated E2E Verification ===\n');

  try {
    // 1. Health check
    console.log('1. Checking Gateway & Microservices Health...');
    const health = await axios.get('http://127.0.0.1:5000/health');
    console.log('✓ Gateway status:', health.data.gateway);
    console.log('✓ Service statuses:', JSON.stringify(health.data.services));

    // 2. Auth Flow (Student login)
    console.log('\n2. Testing Authentication (Student Login)...');
    const loginRes = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: 'alex.chen@student.edu',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('✓ Student logged in:', loginRes.data.user.name, `[Role: ${loginRes.data.user.role}]`);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Project & Milestones
    console.log('\n3. Testing Project & Milestones Fetch...');
    const projRes = await axios.get(`${GATEWAY_URL}/projects`, { headers: authHeaders });
    const project = projRes.data[0];
    console.log(`✓ Fetched project: "${project.name}" (ID: ${project.id})`);
    console.log(`✓ Overall progress: ${project.progressPercentage}%`);

    // 4. Requirements
    console.log('\n4. Testing Student Requirements CRUD...');
    const reqsRes = await axios.get(`${GATEWAY_URL}/projects/${project.id}/requirements`, { headers: authHeaders });
    console.log(`✓ Found ${reqsRes.data.length} requirements. REQ-01 status: ${reqsRes.data[0]?.status}`);

    // 5. GitHub Integration & Sync
    console.log('\n5. Testing GitHub Synchronization Engine...');
    const syncRes = await axios.post(`${GATEWAY_URL}/github/${project.id}/sync`, {}, { headers: authHeaders });
    console.log('✓ Sync triggered successfully!');
    console.log('✓ Synced Commits:', syncRes.data.stats.totalCommits);
    console.log('✓ Synced PRs:', syncRes.data.stats.totalPRs);
    console.log('✓ Synced Contributors:', syncRes.data.stats.totalContributors);

    // 6. Milestone Engine Recalculation based on GitHub facts
    console.log('\n6. Testing Milestone Engine Recalculation...');
    const msRes = await axios.get(`${GATEWAY_URL}/projects/${project.id}/milestones`, { headers: authHeaders });
    console.log(`✓ Milestones evaluated: ${msRes.data.length} active milestones`);
    msRes.data.forEach(ms => {
      console.log(`  - [${ms.criteriaCode}] ${ms.name}: ${ms.percentage}% (${ms.status})`);
      console.log(`    Evidence: ${ms.evidenceList?.[0]} | ${ms.evidenceList?.[1]}`);
    });

    // 7. Faculty Login & Rubric Evaluation
    console.log('\n7. Testing Faculty Rubric Evaluation Submission...');
    const facLogin = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: 'dr.harrison@projectflow.edu',
      password: 'password123'
    });
    const facHeaders = { Authorization: `Bearer ${facLogin.data.token}` };

    const evalRes = await axios.post(`${GATEWAY_URL}/evaluations`, {
      projectId: project.id,
      projectName: project.name,
      scores: {
        requirements: 20,
        implementation: 24,
        githubDevelopment: 25,
        documentation: 15,
        projectProgress: 15
      },
      feedback: 'E2E Automated test evaluation: Architecture and Git hygiene satisfy all criteria.',
      recommendations: 'Deploy to staging cluster.',
      status: 'submitted'
    }, { headers: facHeaders });

    console.log(`✓ Rubric evaluation recorded: Score ${evalRes.data.totalScore}/${evalRes.data.maxScore} (${evalRes.data.percentage}%)`);

    // 8. Notifications
    console.log('\n8. Testing Notification Service Event Capture...');
    const notifsRes = await axios.get(`${GATEWAY_URL}/notifications`, { headers: authHeaders });
    console.log(`✓ Discovered ${notifsRes.data.length} notifications in stream.`);
    console.log(`✓ Most recent event: "${notifsRes.data[0]?.title}" - ${notifsRes.data[0]?.message}`);

    console.log('\n=== ALL PROJECTFLOW E2E TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test execution failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();
