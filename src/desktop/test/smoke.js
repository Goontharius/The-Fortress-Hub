const fs = require('fs');
const path = require('path');

const readme = path.resolve(__dirname, '..', 'README.md');

if (!fs.existsSync(readme)) {
  console.error('Desktop smoke test failed: README.md is missing');
  process.exit(1);
}

console.log('Desktop smoke test passed');
