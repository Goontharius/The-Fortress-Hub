const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function setupWorkspace(options = {}) {
  const rootDir = options.rootDir || process.cwd();
  const skipInstall = options.skipInstall || false;

  console.log("Bootstrapping The Fortress Hub workspace...");

  const envExamplePath = path.join(rootDir, ".env.example");
  const envPath = path.join(rootDir, ".env");

  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    const envExample = fs.readFileSync(envExamplePath, "utf8");
    fs.writeFileSync(envPath, envExample, "utf8");
    console.log(`Created ${path.relative(rootDir, envPath)} from .env.example`);
  }

  if (!skipInstall) {
    execSync("npm install", { cwd: rootDir, stdio: "inherit" });
  }

  console.log("Workspace bootstrap complete.");
}

if (require.main === module) {
  setupWorkspace();
}

module.exports = { setupWorkspace };
