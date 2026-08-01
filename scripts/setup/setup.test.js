const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { setupWorkspace } = require("./setup");

function withTempWorkspace(testFn) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fortress-setup-"));

  try {
    testFn(tempDir);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

withTempWorkspace((tempDir) => {
  fs.writeFileSync(
    path.join(tempDir, ".env.example"),
    "API_TOKEN=test-token\n",
    "utf8",
  );

  setupWorkspace({ rootDir: tempDir, skipInstall: true });

  const envPath = path.join(tempDir, ".env");
  assert.ok(
    fs.existsSync(envPath),
    "Expected .env to be created from .env.example",
  );
  assert.strictEqual(
    fs.readFileSync(envPath, "utf8"),
    "API_TOKEN=test-token\n",
  );
});

console.log("setup script test passed");
