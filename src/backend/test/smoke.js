const { spawn } = require("child_process");
const http = require("http");

const server = spawn("node", ["dist/index.js"], {
  cwd: __dirname + "/..",
  stdio: ["ignore", "inherit", "inherit"],
});

let timeout;

function cleanup(code) {
  clearTimeout(timeout);
  if (!server.killed) {
    server.kill("SIGTERM");
  }
  process.exit(code);
}

function fail(error) {
  console.error(error);
  cleanup(1);
}

function checkHealth(attempt = 0) {
  if (attempt >= 10) {
    return fail("Backend did not start in time");
  }

  const req = http.get("http://127.0.0.1:4000/health", (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      if (res.statusCode !== 200) {
        return setTimeout(() => checkHealth(attempt + 1), 500);
      }

      try {
        const parsed = JSON.parse(body);
        if (parsed.status !== "ok") {
          return fail("Health endpoint returned invalid payload");
        }
        console.log("Backend smoke test passed");
        cleanup(0);
      } catch (error) {
        fail(error);
      }
    });
  });

  req.on("error", () => setTimeout(() => checkHealth(attempt + 1), 500));
}

server.on("error", fail);
server.on("exit", (code) => {
  if (code && code !== 0) {
    fail(`Backend process exited with code ${code}`);
  }
});

timeout = setTimeout(() => fail("Timeout waiting for backend start"), 10000);
checkHealth();
