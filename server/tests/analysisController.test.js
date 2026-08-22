import { test } from "node:test";
import assert from "node:assert/strict";
import { analyzeUrl, getProviderStatus } from "../controllers/analysisController.js";
import { ANALYSIS_TYPES } from "../ai/schemas/analysisSchemas.js";

/* minimal Express req/res doubles */
function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
  };
}
const call = async (body) => {
  const res = mockRes();
  await analyzeUrl({ body }, res);
  return res;
};

/* ───────────────────────── request-shape validation ───────────────────────── */

test("missing url → 400", async () => {
  const res = await call({});
  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /url/i);
});

test("non-string url → 400", async () => {
  const res = await call({ url: 123 });
  assert.equal(res.statusCode, 400);
});

test("analyses not an array → 400", async () => {
  const res = await call({ url: "https://example.com", analyses: "seo_opportunities" });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /array/i);
});

/* ───────────────────────── #12 unknown analysis type rejected (before any network) ───────────────────────── */

test("#12 unknown analysis type → 400 listing valid types", async () => {
  const res = await call({ url: "https://example.com", analyses: ["totally_bogus_type"] });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /Unknown analysis type/i);
});

test("#12 a mix of valid and unknown types → 400 (fails closed)", async () => {
  const res = await call({ url: "https://example.com", analyses: [ANALYSIS_TYPES[0], "nope_not_real"] });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /nope_not_real/);
});

/* ───────────────────────── #13 unsafe URLs rejected (offline: protocol + literal hosts) ───────────────────────── */

test("#13 non-http(s) protocol → 400", async () => {
  const res = await call({ url: "ftp://example.com/resource" });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /URL rejected/i);
});

test("#13 cloud metadata IP → 400", async () => {
  const res = await call({ url: "http://169.254.169.254/latest/meta-data/" });
  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /URL rejected/i);
});

test("#13 loopback host → 400", async () => {
  const res = await call({ url: "http://127.0.0.1:8080/" });
  assert.equal(res.statusCode, 400);
});

test("#13 localhost → 400", async () => {
  const res = await call({ url: "http://localhost/admin" });
  assert.equal(res.statusCode, 400);
});

test("#13 malformed URL → 400", async () => {
  const res = await call({ url: "not-a-valid-url" });
  assert.equal(res.statusCode, 400);
});

/* ───────────────────────── #16 provider status leaks no key material ───────────────────────── */

test("#16 GET status returns only provider/enabled/model and no secrets", () => {
  const res = mockRes();
  getProviderStatus({}, res);

  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.providers));
  assert.ok(res.body.providers.length >= 1);
  assert.deepEqual(res.body.availableTypes, ANALYSIS_TYPES);

  for (const entry of res.body.providers) {
    assert.deepEqual(Object.keys(entry).sort(), ["enabled", "model", "provider"]);
    assert.equal(typeof entry.provider, "string");
    assert.equal(typeof entry.enabled, "boolean");
  }

  // No API-key-shaped material anywhere in the serialized status payload.
  const serialized = JSON.stringify(res.body);
  assert.doesNotMatch(serialized, /(sk-[A-Za-z0-9]{8}|gsk_[A-Za-z0-9]{8}|AIza[A-Za-z0-9]{8})/);
  assert.doesNotMatch(serialized, /_API_KEY"\s*:\s*"[^"]+/);
});
