const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting FamiPrint development server...');
console.log('📁 Project directory:', __dirname);

const server = spawn('npm', ['run', 'dev', '--', '--port', '3003'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`🔸 Server process exited with code ${code}`);
});

console.log('🌐 Server should be available at: http://localhost:3003');
console.log('⏹️  Press Ctrl+C to stop the server');