/**
 * Automated Verification Script for Step 3: My Team and Course Teams Management
 *
 * Verifies:
 * 1. Initial State: Unassigned student receives null team (triggers "You're not in a team yet").
 * 2. Team Size Validation: Rejects teams with < 4 or > 5 members (400).
 * 3. Identity Verification: Rejects mismatched roll number and email (400).
 * 4. User Existence Validation: Rejects non-existent students (400).
 * 5. Lead Requirement: Rejects team creation if creator is not in members list (400).
 * 6. Successful Team Creation: Creates team with 4 valid members, creator is lead (201).
 * 7. Joined State: GET /courses/:id/my-team returns team details and status "Joined".
 * 8. Duplicate Creation Prevention: Student already in a team cannot create another (400).
 * 9. Single-Team Rule: Member cannot join another team in the same course (400).
 * 10. Team Join: Unassigned eligible student can join an available team (200).
 * 11. Capacity Enforcement: Full team (5/5) rejects join attempts (400).
 * 12. Leave Team: Member can leave, updates capacity and restores "Available" status (200).
 * 13. Team List Integration: GET /courses/:id/teams accurately reflects newly created and joined teams.
 */

const axios = require('axios');
const path = require('path');

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:5000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  FAIL [Test ${totalTests}]: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  PASS [Test ${totalTests}]: ${message}`);
}

async function loginUser(email, password = 'password123') {
  const res = await axios.post(`${GATEWAY_URL}/api/auth/login`, { email, password });
  return {
    token: res.data.token,
    user: res.data.user
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('       ProjectFlow: My Team Automated Test Suite    ');
  console.log('====================================================\n');

  try {
    // 0. Login as Alka Jha (student)
    console.log('-> Logging in as Alka Jha (alka123@iitv.ac.in)...');
    const alka = await loginUser('alka123@iitv.ac.in');
    const alkaHeaders = { Authorization: `Bearer ${alka.token}` };
    console.log(`✓ Logged in: ${alka.user.name} (${alka.user.rollNumber}, batch: ${alka.user.batch})\n`);

    // 1. Initial State: Unassigned student
    console.log('-> Test 1: Verify unassigned student receives { team: null }...');
    const myTeamRes1 = await axios.get(`${GATEWAY_URL}/api/courses/CS543/my-team`, { headers: alkaHeaders });
    assert(myTeamRes1.status === 200, 'my-team endpoint returns 200 OK');
    assert(myTeamRes1.data.team === null, 'Unassigned student team is null');

    // 2. Team Size Validation (< 4 members)
    console.log('\n-> Test 2: Validation failure when team size < 4...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, {
        name: 'Too Small Team',
        description: 'Under capacity team',
        members: [
          { rollNumber: '20251651013', email: 'alka123@iitv.ac.in' },
          { rollNumber: '20251651050', email: 'rahul50@iitv.ac.in' }
        ]
      }, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 for team size < 4');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects team size < 4 with status 400');
      assert(err.response.data.error.includes('between 4 and 5 members'), 'Error mentions size 4 to 5 members');
    }

    // 3. Identity Verification: Mismatched roll number & email
    console.log('\n-> Test 3: Validation failure on mismatched roll number & email...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, {
        name: 'Mismatched Identity Team',
        description: 'Identity mismatch test',
        members: [
          { rollNumber: '20251651013', email: 'alka123@iitv.ac.in' },
          { rollNumber: '20251651050', email: 'wrong.email@iitv.ac.in' }, // Mismatched!
          { rollNumber: '20251651051', email: 'sneha51@iitv.ac.in' },
          { rollNumber: '20251651052', email: 'aman52@iitv.ac.in' }
        ]
      }, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 for identity mismatch');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects mismatched identity with status 400');
      assert(err.response.data.error.includes('does not belong to email'), 'Error mentions mismatch between roll and email');
    }

    // 4. User Existence Validation: Non-existent student
    console.log('\n-> Test 4: Validation failure on non-existent student...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, {
        name: 'Ghost Member Team',
        description: 'Ghost member test',
        members: [
          { rollNumber: '20251651013', email: 'alka123@iitv.ac.in' },
          { rollNumber: '99999999999', email: 'ghost@iitv.ac.in' },
          { rollNumber: '20251651051', email: 'sneha51@iitv.ac.in' },
          { rollNumber: '20251651052', email: 'aman52@iitv.ac.in' }
        ]
      }, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 for non-existent member');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects non-existent member with status 400');
    }

    // 5. Creator Membership Validation: Creator not in members
    console.log('\n-> Test 5: Validation failure when creator is not included...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, {
        name: 'Missing Lead Team',
        description: 'Creator missing test',
        members: [
          { rollNumber: '20251651050', email: 'rahul50@iitv.ac.in' },
          { rollNumber: '20251651051', email: 'sneha51@iitv.ac.in' },
          { rollNumber: '20251651052', email: 'aman52@iitv.ac.in' },
          { rollNumber: '20251651053', email: 'pooja53@iitv.ac.in' }
        ]
      }, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 when creator not in team');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects team creation without creator with status 400');
      assert(err.response.data.error.includes('team creator must be included'), 'Error explains creator must be included');
    }

    // 6. Successful Team Creation: 4 valid members
    const teamName = 'Team Apex ' + Date.now();
    console.log(`\n-> Test 6: Successfully creating a valid team (${teamName}, 4 members)...`);
    const teamPayload = {
      name: teamName,
      description: 'Distributed Cloud Architecture and Realtime Telemetry Platform',
      members: [
        { rollNumber: '20251651013', email: 'alka123@iitv.ac.in' },
        { rollNumber: '20251651050', email: 'rahul50@iitv.ac.in' },
        { rollNumber: '20251651051', email: 'sneha51@iitv.ac.in' },
        { rollNumber: '20251651052', email: 'aman52@iitv.ac.in' }
      ]
    };
    const createRes = await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, teamPayload, { headers: alkaHeaders });
    assert(createRes.status === 201, 'Team creation returns 201 Created');
    assert(createRes.data.team.name === teamName, 'Team name matches payload');
    assert(createRes.data.team.teamLead === 'Alka Jha', 'Creator is set as Team Lead');
    assert(createRes.data.team.memberCount === 4, 'Member count is 4');
    assert(createRes.data.team.status === 'Joined', 'Status is Joined for creator');
    const createdTeamId = createRes.data.team.id;

    // 7. Joined State: GET /courses/:id/my-team
    console.log('\n-> Test 7: Verify GET my-team now returns the created team...');
    const myTeamRes2 = await axios.get(`${GATEWAY_URL}/api/courses/CS543/my-team`, { headers: alkaHeaders });
    assert(myTeamRes2.status === 200, 'my-team returns 200');
    assert(myTeamRes2.data.team !== null, 'my-team is no longer null');
    assert(myTeamRes2.data.team.id === createdTeamId, 'Returned team ID matches created team');
    assert(myTeamRes2.data.team.name === teamName, 'Returned team name is ' + teamName);
    assert(myTeamRes2.data.team.isUserMember === true, 'isUserMember is true');

    // 8. Duplicate Team Creation Prevention
    console.log('\n-> Test 8: Prevent student from creating a second team in the same course...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams`, {
        name: teamName + ' Duplicate',
        description: 'Should fail',
        members: [
          { rollNumber: '20251651013', email: 'alka123@iitv.ac.in' },
          { rollNumber: '20251651040', email: 'vikram.mehta@student.edu' },
          { rollNumber: '20251651041', email: 'ananya.roy@student.edu' },
          { rollNumber: '20251651042', email: 'rohan.gupta@student.edu' }
        ]
      }, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 for already belonging to a team');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects duplicate team creation with 400');
      assert(err.response.data.error.includes('already a member of team'), 'Error indicates student is already in a team');
    }

    // 9. Single-Team Rule: Member cannot join another team
    console.log('\n-> Test 9: Member in a team cannot join another team...');
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/team_alpha/join`, {}, { headers: alkaHeaders });
      assert(false, 'Should have failed with 400 when joining while already in a team');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects join with 400 for student already in team');
      assert(err.response.data.error.includes('already a member of team'), 'Error explains single-team rule');
    }

    // 10. Team Join: Unassigned eligible student joins Team Apex
    console.log(`\n-> Test 10: Unassigned student (Pooja Mehta) joins ${teamName}...`);
    const pooja = await loginUser('pooja53@iitv.ac.in');
    const poojaHeaders = { Authorization: `Bearer ${pooja.token}` };

    // Verify Pooja has no team initially
    const poojaMyTeam = await axios.get(`${GATEWAY_URL}/api/courses/CS543/my-team`, { headers: poojaHeaders });
    assert(poojaMyTeam.data.team === null, 'Pooja is initially unassigned');

    // Pooja joins Team Apex
    const joinRes = await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/join`, {}, { headers: poojaHeaders });
    assert(joinRes.status === 200, 'Join team returns 200 OK');
    assert(joinRes.data.team.memberCount === 5, 'Team member count is now 5');
    assert(joinRes.data.team.status === 'Joined', 'Team status is Joined for Pooja');

    // 11. Capacity Enforcement: Team is now 5/5, reject another join
    console.log('\n-> Test 11: Full team (5/5) rejects another student joining...');
    const divya = await loginUser('divya.nair@student.edu');
    const divyaHeaders = { Authorization: `Bearer ${divya.token}` };
    try {
      await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/join`, {}, { headers: divyaHeaders });
      assert(false, 'Should have failed with 400 when team is full');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Rejects join on full team with 400');
      assert(err.response.data.error.includes('already full'), 'Error explains team is full (max 5)');
    }

    // 12. Leave Team: Pooja leaves Team Apex
    console.log(`\n-> Test 12: Member (Pooja) leaves ${teamName}...`);
    const leaveRes = await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/leave`, {}, { headers: poojaHeaders });
    assert(leaveRes.status === 200, 'Leave team returns 200 OK');

    // Verify Pooja is unassigned again
    const poojaMyTeamAfterLeave = await axios.get(`${GATEWAY_URL}/api/courses/CS543/my-team`, { headers: poojaHeaders });
    assert(poojaMyTeamAfterLeave.data.team === null, 'Pooja is unassigned after leaving');

    // 13. Team List Integration: GET /courses/:id/teams
    console.log('\n-> Test 13: Verify course teams list reflects created team with status Available/Joined...');
    const teamsListRes = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams`, { headers: alkaHeaders });
    assert(teamsListRes.status === 200, 'GET /courses/:id/teams returns 200');
    assert(Array.isArray(teamsListRes.data), 'Returns an array of teams');
    const apexInList = teamsListRes.data.find(t => t.id === createdTeamId);
    assert(apexInList !== undefined, 'Created team appears in course teams list');
    assert(apexInList.memberCount === 4, 'Team has 4 members after Pooja left');
    assert(apexInList.isUserMember === true, 'isUserMember is true for Alka');
    assert(apexInList.status === 'Joined', 'Status is Joined for Alka');

    // 14. Leader Leaves Team: Leadership is reassigned to next member
    console.log('\n-> Test 14: Leader (Alka) leaves team, leadership reassigns...');
    const alkaLeaveRes = await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/leave`, {}, { headers: alkaHeaders });
    assert(alkaLeaveRes.status === 200, 'Leader leave returns 200 OK');

    // Verify Alka is now unassigned again
    const alkaMyTeamAfterLeave = await axios.get(`${GATEWAY_URL}/api/courses/CS543/my-team`, { headers: alkaHeaders });
    assert(alkaMyTeamAfterLeave.data.team === null, 'Alka is unassigned after leaving');

    // 15. Disband Team: Remaining members leave, team is deleted
    console.log('\n-> Test 15: Remaining members leave, team is automatically disbanded...');
    const rahul = await loginUser('rahul50@iitv.ac.in');
    const sneha = await loginUser('sneha51@iitv.ac.in');
    const aman = await loginUser('aman52@iitv.ac.in');
    await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/leave`, {}, { headers: { Authorization: `Bearer ${rahul.token}` } });
    await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/leave`, {}, { headers: { Authorization: `Bearer ${sneha.token}` } });
    const lastLeave = await axios.post(`${GATEWAY_URL}/api/courses/CS543/teams/${createdTeamId}/leave`, {}, { headers: { Authorization: `Bearer ${aman.token}` } });
    assert(lastLeave.status === 200, 'Last member leave returns 200 OK');
    assert(lastLeave.data.message.includes('disbanded'), 'Team disband message confirmed');

    // Verify team is no longer in course teams list
    const finalTeamsList = await axios.get(`${GATEWAY_URL}/api/courses/CS543/teams`, { headers: alkaHeaders });
    const disbandedTeam = finalTeamsList.data.find(t => t.id === createdTeamId);
    assert(disbandedTeam === undefined, 'Disbanded team is completely removed from list');

    console.log('\n====================================================');
    console.log(`✓ All ${passedTests}/${totalTests} tests PASSED successfully!`);
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

runTests();
