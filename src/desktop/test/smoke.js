const fs = require("fs");
const path = require("path");

const readme = path.resolve(__dirname, "..", "README.md");
const builtApp = path.resolve(__dirname, "..", "dist", "App.js");

if (!fs.existsSync(readme)) {
  console.error("Desktop smoke test failed: README.md is missing");
  process.exit(1);
}

if (!fs.existsSync(builtApp)) {
  console.error("Desktop smoke test failed: built desktop output is missing");
  process.exit(1);
}

console.log("Desktop smoke test passed");
