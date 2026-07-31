const fs = require("fs");
const path = require("path");

const appFile = path.resolve(__dirname, "..", "App.tsx");
const mobileSrcFile = path.resolve(__dirname, "..", "src", "App.tsx");

if (!fs.existsSync(appFile) || !fs.existsSync(mobileSrcFile)) {
  console.error("Mobile smoke test failed: expected entry files not found");
  process.exit(1);
}

console.log("Mobile smoke test passed");
