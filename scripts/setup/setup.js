const { execSync } = require('child_process');
console.log('Bootstrapping The Fortress Hub workspace...');
execSync('npm install', { stdio: 'inherit' });
console.log('Workspace bootstrap complete.');
