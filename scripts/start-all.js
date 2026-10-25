const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const SERVICES = [
  { name: 'Auth', script: 'services/auth/server.js', port: 5001, color: '\x1b[36m' },
  { name: 'Project', script: 'services/project/server.js', port: 5002, color: '\x1b[34m' },
  { name: 'Task', script: 'services/task/server.js', port: 5003, color: '\x1b[33m' },
  { name: 'Evaluation', script: 'services/evaluation/server.js', port: 5004, color: '\x1b[35m' },
  { name: 'Integration', script: 'services/integration/server.js', port: 5005, color: '\x1b[32m' },
  { name: 'Notification', script: 'services/notification/server.js', port: 5006, color: '\x1b[31m' },
  { name: 'Gateway', script: 'gateway/server.js', port: 5000, color: '\x1b[1m\x1b[37m' }
];

const RESET = '\x1b[0m';
const runningProcesses = [];

console.log('====================================================');
console.log('       Starting ProjectFlow Microservices Hub        ');
console.log('====================================================');

SERVICES.forEach(({ name, script, port, color }) => {
  const fullPath = path.resolve(__dirname, '..', script);
  const proc = spawn(process.execPath, [fullPath], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PORT: port }
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${color}[${name}:${port}]${RESET} ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.error(`${color}[${name}:${port}:ERR]${RESET} ${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`${color}[${name}] exited with code ${code}${RESET}`);
  });

  runningProcesses.push(proc);
});

function cleanup() {
  console.log('\nShutting down ProjectFlow microservices...');
  runningProcesses.forEach(p => {
    try {
      p.kill();
    } catch (e) {}
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
