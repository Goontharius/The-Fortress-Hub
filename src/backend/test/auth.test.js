const assert = require("assert");

function createMockResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function runAuthCheck(headers, expectedStatus, expectedBody) {
  delete process.env.API_TOKEN;
  const { authMiddleware } = require("../dist/middleware/auth");
  const req = { headers };
  const res = createMockResponse();
  let nextCalled = false;

  authMiddleware(req, res, () => {
    nextCalled = true;
  });

  assert.strictEqual(res.statusCode, expectedStatus, `Expected status ${expectedStatus}, got ${res.statusCode}`);
  assert.deepStrictEqual(res.body, expectedBody);
  assert.strictEqual(nextCalled, false);
}

runAuthCheck({}, 500, { error: "Authentication is not configured on server" });
console.log("Auth regression test passed");
