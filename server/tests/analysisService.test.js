import { test } from "node:test";
import assert from "node:assert/strict";
import {
  WEIGHTS,
  labelFor,
  enforceGrowthScore,
  computeSignals,
  runAnalyses,
} from "../services/analysisService.js";

/* helper: fully-healthy deterministic signals (no cap should fire) */
const goodSignals = (over = {}) => ({
  hasHttps: true,
  hasViewport: true,
  hasTitle: true,
  hasMetaDescription: true,
  scraped: true,
  wordCount: 500,
  ...over,
});

const weighted = (cs) =>
  Math.round(
    cs.technicalSeo * WEIGHTS.technicalSeo +
      cs.onPageSeo * WEIGHTS.onPageSeo +
      cs.contentQuality * WEIGHTS.contentQuality +
      cs.discoverability * WEIGHTS.discoverability +
      cs.conversionReadiness * WEIGHTS.conversionReadiness
  );

/* ───────────────────────── WEIGHTS + labelFor ───────────────────────── */

test("WEIGHTS sum to exactly 1.0", () => {
  const sum = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `weights sum to ${sum}`);
});

test("labelFor bands", () => {
  assert.equal(labelFor(85), "Excellent");
  assert.equal(labelFor(84), "Strong");
  assert.equal(labelFor(70), "Strong");
  assert.equal(labelFor(69), "Fair");
  assert.equal(labelFor(55), "Fair");
  assert.equal(labelFor(54), "Needs Work");
  assert.equal(labelFor(40), "Needs Work");
  assert.equal(labelFor(39), "Critical");
  assert.equal(labelFor(0), "Critical");
});

/* ───────────────────────── #11 Growth Score == weighted formula ───────────────────────── */

test("#11 overallScore equals the weighted formula (uniform)", () => {
  const cs = { technicalSeo: 80, onPageSeo: 80, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals() }, { provider: "Groq", model: "m" });
  assert.equal(out.overallScore, 80);
  assert.equal(out.overallScore, weighted(cs));
  assert.equal(out.scoreLabel, "Strong");
  assert.deepEqual(out.generatedBy, { provider: "Groq", model: "m" });
});

test("#11 overallScore equals the weighted formula (non-uniform)", () => {
  const cs = { technicalSeo: 90, onPageSeo: 70, contentQuality: 60, discoverability: 50, conversionReadiness: 40 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals() }, {});
  assert.equal(out.overallScore, weighted(cs));
  assert.equal(out.overallScore, 66);
  assert.equal(out.scoreLabel, "Fair");
});

test("#11 category scores are clamped to 0–100 before scoring", () => {
  const cs = { technicalSeo: 999, onPageSeo: -5, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals() }, {});
  assert.equal(out.categoryScores.technicalSeo, 100);
  assert.equal(out.categoryScores.onPageSeo, 0);
  assert.ok(out.overallScore >= 0 && out.overallScore <= 100);
  assert.equal(out.overallScore, weighted(out.categoryScores));
});

test("#11 missing categories default to 0, never perfect", () => {
  const out = enforceGrowthScore({ categoryScores: {}, limitations: [] }, { signals: goodSignals() }, {});
  for (const k of Object.keys(WEIGHTS)) assert.equal(out.categoryScores[k], 0, k);
  assert.equal(out.overallScore, 0);
  assert.equal(out.scoreLabel, "Critical");
});

test("#11 overallScore stays within 0–100 across extreme inputs", () => {
  const combos = [
    { technicalSeo: 1e9, onPageSeo: 1e9, contentQuality: 1e9, discoverability: 1e9, conversionReadiness: 1e9 },
    { technicalSeo: -1e9, onPageSeo: -50, contentQuality: -1, discoverability: -100, conversionReadiness: -7 },
    { technicalSeo: NaN, onPageSeo: undefined, contentQuality: "x", discoverability: null, conversionReadiness: 50 },
  ];
  for (const cs of combos) {
    const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals() }, {});
    assert.ok(out.overallScore >= 0 && out.overallScore <= 100, JSON.stringify(cs));
    assert.ok(["Excellent", "Strong", "Fair", "Needs Work", "Critical"].includes(out.scoreLabel));
  }
});

/* ───────────────────────── deterministic caps the model cannot override ───────────────────────── */

test("no HTTPS caps technicalSeo at 60 and records a limitation", () => {
  const cs = { technicalSeo: 100, onPageSeo: 80, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals({ hasHttps: false }) }, {});
  assert.equal(out.categoryScores.technicalSeo, 60);
  assert.ok(out.limitations.some((l) => /HTTPS/i.test(l)));
});

test("missing viewport caps technicalSeo at 80", () => {
  const cs = { technicalSeo: 100, onPageSeo: 80, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals({ hasViewport: false }) }, {});
  assert.equal(out.categoryScores.technicalSeo, 80);
});

test("missing title/meta description caps onPageSeo at 50", () => {
  const cs = { technicalSeo: 80, onPageSeo: 100, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore(
    { categoryScores: cs, limitations: [] },
    { signals: goodSignals({ hasTitle: false, hasMetaDescription: false }) },
    {}
  );
  assert.equal(out.categoryScores.onPageSeo, 50);
});

test("thin content caps contentQuality at 45", () => {
  const cs = { technicalSeo: 80, onPageSeo: 80, contentQuality: 100, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals({ wordCount: 50 }) }, {});
  assert.equal(out.categoryScores.contentQuality, 45);
});

test("unscraped page caps on-page/content/discoverability and records a limitation", () => {
  const cs = { technicalSeo: 100, onPageSeo: 100, contentQuality: 100, discoverability: 100, conversionReadiness: 100 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals({ scraped: false, wordCount: 0 }) }, {});
  assert.equal(out.categoryScores.onPageSeo, 40);
  assert.equal(out.categoryScores.contentQuality, 40);
  assert.equal(out.categoryScores.discoverability, 45);
  assert.ok(out.limitations.some((l) => /could not be fetched/i.test(l)));
});

test("generatedBy defaults to empty strings when meta is absent (no leakage)", () => {
  const cs = { technicalSeo: 80, onPageSeo: 80, contentQuality: 80, discoverability: 80, conversionReadiness: 80 };
  const out = enforceGrowthScore({ categoryScores: cs, limitations: [] }, { signals: goodSignals() });
  assert.deepEqual(out.generatedBy, { provider: "", model: "" });
});

/* ───────────────────────── computeSignals sanity ───────────────────────── */

test("computeSignals derives hasHttps from the URL and reads root page facts", () => {
  const crawl = { pagesScanned: 1, pages: [{ scraped: true, title: "T", description: "D", viewport: "w", wordCount: 300 }] };
  const s = computeSignals(crawl, "https://example.com");
  assert.equal(s.hasHttps, true);
  assert.equal(s.hasTitle, true);
  assert.equal(s.hasMetaDescription, true);
  assert.equal(s.hasViewport, true);
  assert.equal(s.wordCount, 300);

  const insecure = computeSignals(crawl, "http://example.com");
  assert.equal(insecure.hasHttps, false);
});

/* ───────────────────────── #14 partial results (crawl + llm injected) ───────────────────────── */

test("#14 one analysis failing does not kill the others (partial results)", async () => {
  const crawl = {
    rootUrl: "https://example.com",
    pagesScanned: 1,
    pages: [
      {
        url: "https://example.com",
        scraped: true,
        title: "Example Domain",
        description: "An example site used for testing.",
        viewport: "width=device-width, initial-scale=1",
        canonical: "https://example.com",
        robots: "",
        h1: ["Example"],
        h2: ["About"],
        images: { total: 2, missingAlt: 0, withAlt: 2 },
        links: { internal: ["/a"], external: ["https://x.com"], total: 2 },
        wordCount: 500,
        schemaTypes: ["Organization"],
        ogTitle: "Example",
        ogImage: "https://example.com/og.png",
        bodyTextSnippet: "Example body text for the page.",
      },
    ],
  };

  const llmImpl = {
    calls: 0,
    async generateStructured({ systemPrompt }) {
      this.calls++;
      // ai_growth_score's instruction is the only one mentioning "five categories".
      if (/five categories/i.test(systemPrompt)) {
        return {
          data: {
            categoryScores: { technicalSeo: 80, onPageSeo: 80, contentQuality: 80, discoverability: 80, conversionReadiness: 80 },
            strengths: [],
            weaknesses: [],
          },
          meta: { provider: "Groq", model: "llama-3.1-8b-instant" },
        };
      }
      throw new Error("simulated provider outage for this analysis");
    },
  };

  const report = await runAnalyses("https://example.com", ["ai_growth_score", "site_audit"], {
    crawlImpl: async () => crawl,
    llmImpl,
  });

  assert.equal(report.url, "https://example.com");
  assert.equal(report.pagesScanned, 1);
  assert.equal(report.scraped, true);
  assert.ok(report.evidence && typeof report.evidence === "object");

  const growth = report.results.find((r) => r.type === "ai_growth_score");
  const audit = report.results.find((r) => r.type === "site_audit");

  assert.equal(growth.status, "completed");
  assert.equal(growth.provider, "Groq");
  assert.equal(growth.data.overallScore, 80);
  assert.equal(growth.data.generatedBy.provider, "Groq");

  assert.equal(audit.status, "failed");
  assert.equal(typeof audit.error, "string");
  assert.ok(audit.error.length > 0);
  assert.ok(!("data" in audit), "a failed analysis must not carry data");
});
