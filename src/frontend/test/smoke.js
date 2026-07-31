const fs = require("fs");
const path = require("path");

const distFile = path.resolve(__dirname, "..", "dist", "index.html");

if (!fs.existsSync(distFile)) {
  console.error("Frontend smoke test failed: dist/index.html not found");
  process.exit(1);
}

console.log("Frontend smoke test passed");
