import { crawlWebsite } from "./crawlerService.js";
import { llm } from "../ai/providers/LLMProvider.js";
import { schemaForType } from "../ai/schemas/analysisSchemas.js";

/**
 * Multi-analysis service (plan §I / §J).
 *
 * Deterministic-first: the site is crawled once and turned into a compact
 * facts sheet. The AI is used for INTERPRETATION only. Numbers that must be
 * trustworthy — the AI Growth Score and its category scores — are clamped and
 * recomputed in code here (never trusted verbatim from the model), and
 * deterministic checks (HTTPS, viewport, title, scrape success) cap categories
 * so the AI cannot score an obviously-broken area as perfect.
 */

// Growth Score weights (§J). Must sum to 1.0.
export const WEIGHTS = {
  technicalSeo: 0.25,
  onPageSeo: 0.25,
  contentQuality: 0.2,
  discoverability: 0.15,
  conversionReadiness: 0.15,
};

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Number.isFinite(+n) ? Math.round(+n) : 0));

export function labelFor(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Critical";
}

/** Sanitize a thrown error into a short, key-free string for the client. */
function safeErr(reason) {
  const msg = (reason && (reason.message || String(reason))) || "Analysis failed.";
  return String(msg).slice(0, 300);
}

/* -------------------------------------------------- deterministic signals */

export function computeSignals(crawl, url) {
  const root = (crawl.pages && crawl.pages[0]) || {};
  const images = root.images || { total: 0, missingAlt: 0, withAlt: 0 };
  const links = root.links || { internal: [], external: [], total: 0 };
  return {
    hasHttps: /^https:/i.test(url),
    scraped: Boolean(root.scraped),
    title: root.title || "",
    hasTitle: Boolean(root.title),
    titleLength: (root.title || "").length,
    hasMetaDescription: Boolean(root.description),
    metaDescriptionLength: (root.description || "").length,
    hasViewport: Boolean(root.viewport),
    hasCanonical: Boolean(root.canonical),
    robots: root.robots || "",
    h1Count: (root.h1 || []).length,
    h2Count: (root.h2 || []).length,
    imagesTotal: images.total || 0,
    imagesMissingAlt: images.missingAlt || 0,
    internalLinks: (links.internal || []).length,
    externalLinks: (links.external || []).length,
    wordCount: root.wordCount || 0,
    schemaTypes: root.schemaTypes || [],
    hasStructuredData: (root.schemaTypes || []).length > 0,
    hasOpenGraph: Boolean(root.ogTitle || root.ogImage),
    pagesScanned: crawl.pagesScanned || 0,
  };
}

/** Compact facts sheet fed to every analysis prompt. Bounded for token safety. */
function buildFactsText(crawl, s, url) {
  const root = (crawl.pages && crawl.pages[0]) || {};
  const subpages = (crawl.pages || [])
    .slice(1)
    .map((p) => `- ${p.url} — "${(p.title || "").slice(0, 80)}"`)
    .join("\n");

  return [
    `URL: ${url}`,
    `Protocol: ${s.hasHttps ? "HTTPS" : "HTTP (not secure)"}`,
    `Pages scanned: ${s.pagesScanned}`,
    `Content fetched: ${s.scraped ? "yes" : "NO (JS-only or blocked — content facts are limited)"}`,
    `Title (${s.titleLength} chars): ${root.title || "(missing)"}`,
    `Meta description (${s.metaDescriptionLength} chars): ${root.description || "(missing)"}`,
    `Canonical: ${root.canonical || "(missing)"}`,
    `Robots meta: ${root.robots || "(none)"}`,
    `Viewport (mobile) tag: ${s.hasViewport ? "present" : "MISSING"}`,
    `Open Graph tags: ${s.hasOpenGraph ? "present" : "missing"}`,
    `Structured data (JSON-LD types): ${s.schemaTypes.join(", ") || "none"}`,
    `H1 count: ${s.h1Count} ${root.h1 ? "→ " + root.h1.slice(0, 3).join(" | ") : ""}`,
    `H2 sample: ${(root.h2 || []).slice(0, 6).join(" | ") || "(none)"}`,
    `Images: ${s.imagesTotal} total, ${s.imagesMissingAlt} missing alt text`,
    `Links: ${s.internalLinks} internal, ${s.externalLinks} external`,
    `Word count (home): ${s.wordCount}`,
    subpages ? `Subpages scanned:\n${subpages}` : "",
    "",
    "Page text excerpt (truncated):",
    (root.bodyTextSnippet || "(no text extracted)").slice(0, 1500),
  ]
    .filter(Boolean)
    .join("\n");
}

/* -------------------------------------------------- per-type prompts */

const BASE_RULES =
  "You are a precise SEO/GEO analyst. Base your analysis ONLY on the provided page facts. " +
  "Do not invent metrics, traffic numbers, or rankings you were not given. If the page could not be " +
  "fetched, say so and keep claims conservative. Respond with a single valid JSON object matching the schema — no markdown, no prose.";

const TYPE_INSTRUCTIONS = {
  ai_growth_score:
    "Score five categories from 0-100 based strictly on the evidence: technicalSeo, onPageSeo, contentQuality, " +
    "discoverability, conversionReadiness. Lower a category when evidence is missing or broken (e.g. no HTTPS, no " +
    "title, no viewport, thin content). Provide categoryScores plus evidence, strengths, weaknesses, quickWins, and " +
    "prioritizedActions (each with priority, issue, recommendation, category, impact, effort, reason), and any " +
    "limitations. Do NOT compute overallScore — it is calculated separately.",
  site_audit:
    "Produce an overall site audit: a summary, a healthScore (0-100), criticalIssues, warnings, passedChecks, and recommendations.",
  technical_seo:
    "Assess technical SEO: crawlability, indexability, HTTPS, canonicalization, mobile viewport, structured data. " +
    "Return a summary, findings (area, status pass/warn/fail, detail, fix), indexabilityNotes, recommendations.",
  seo_opportunities:
    "Identify concrete SEO opportunities. Return a summary and an opportunities array (title, category, impact, effort, description, recommendedAction).",
  content_analysis:
    "Analyze content quality: readability, tone, content gaps, topic suggestions, keyword coverage, and E-E-A-T signals. Return the schema fields with actionable recommendations.",
  keyword_ideas:
    "Propose keyword ideas grounded in the page's topic. Return seedThemes, keywords (keyword, intent, priority, rationale), question queries, and topical clusters.",
  competitor_strategy:
    "Infer the competitive landscape from the page's positioning. Return a summary, likelyCompetitors (name, domain, why), differentiationOpportunities, contentAngles, and recommendations. Mark competitors as inferred, not confirmed.",
  geo_visibility:
    "Assess readiness for AI answer engines and local/GEO visibility: entity clarity, citations needed, structured-data gaps. Return a summary, geoReadinessScore (0-100), and the recommendation arrays.",
};

function promptFor(type, ctx) {
  const instruction = TYPE_INSTRUCTIONS[type] || "Analyze the page and return the requested JSON.";
  return {
    systemPrompt: `${BASE_RULES}\n\nTask: ${instruction}`,
    prompt: `Website facts:\n\n${ctx.factsText}`,
  };
}

/* -------------------------------------------------- growth score enforcement */

export function enforceGrowthScore(data, ctx, meta) {
  const s = ctx.signals;
  const cs = { ...(data.categoryScores || {}) };
  for (const k of Object.keys(WEIGHTS)) cs[k] = clamp(cs[k]);

  const limitations = new Set(data.limitations || []);

  // Deterministic checks the AI must not override (§J).
  if (!s.hasHttps) {
    cs.technicalSeo = Math.min(cs.technicalSeo, 60);
    limitations.add("Site is not served over HTTPS — technical SEO is capped accordingly.");
  }
  if (!s.hasViewport) cs.technicalSeo = Math.min(cs.technicalSeo, 80);
  if (!s.hasTitle) cs.onPageSeo = Math.min(cs.onPageSeo, 50);
  if (!s.hasMetaDescription) cs.onPageSeo = Math.min(cs.onPageSeo, 82);
  if (s.scraped && s.wordCount < 120) cs.contentQuality = Math.min(cs.contentQuality, 45);
  if (!s.scraped) {
    cs.onPageSeo = Math.min(cs.onPageSeo, 40);
    cs.contentQuality = Math.min(cs.contentQuality, 40);
    cs.discoverability = Math.min(cs.discoverability, 45);
    limitations.add(
      "Page content could not be fetched (JS-only or blocked); on-page, content, and discoverability were assessed with limited data and are not scored as complete."
    );
  }

  const overallScore = clamp(
    cs.technicalSeo * WEIGHTS.technicalSeo +
      cs.onPageSeo * WEIGHTS.onPageSeo +
      cs.contentQuality * WEIGHTS.contentQuality +
      cs.discoverability * WEIGHTS.discoverability +
      cs.conversionReadiness * WEIGHTS.conversionReadiness
  );

  return {
    ...data,
    categoryScores: cs,
    overallScore,
    scoreLabel: labelFor(overallScore),
    limitations: Array.from(limitations),
    generatedBy: { provider: meta?.provider || "", model: meta?.model || "" },
  };
}

/* -------------------------------------------------- runners */

async function runSingleAnalysis(type, ctx, llmImpl = llm) {
  const schema = schemaForType(type);
  if (!schema) throw new Error(`Unknown analysis type: ${type}`);

  const { systemPrompt, prompt } = promptFor(type, ctx);
  const result = await llmImpl.generateStructured({ systemPrompt, prompt, schema, maxTokens: 2200, temperature: 0.2 });

  const data = type === "ai_growth_score" ? enforceGrowthScore(result.data, ctx, result.meta) : result.data;
  return { data, meta: result.meta };
}

/**
 * Crawl once, then run the requested analyses independently so one failure
 * does not kill the rest (plan §I partial results).
 * @param {string} url        - already SSRF-validated by the controller
 * @param {string[]} types    - deduped, capped list of analysis types
 * @param {object} [deps]     - test seam: { crawlImpl, llmImpl }
 * @returns {Promise<object>} report with per-type results
 */
export async function runAnalyses(url, types, deps = {}) {
  const crawlImpl = deps.crawlImpl || crawlWebsite;
  const llmImpl = deps.llmImpl || llm;

  const crawl = await crawlImpl(url, 3); // throws on SSRF; caught by controller
  const signals = computeSignals(crawl, url);
  const factsText = buildFactsText(crawl, signals, url);
  const ctx = { url, crawl, signals, factsText };

  const settled = await Promise.allSettled(types.map((t) => runSingleAnalysis(t, ctx, llmImpl)));

  const results = settled.map((outcome, i) => {
    const type = types[i];
    if (outcome.status === "fulfilled") {
      return {
        type,
        status: "completed",
        provider: outcome.value.meta?.provider || null,
        model: outcome.value.meta?.model || null,
        data: outcome.value.data,
      };
    }
    return { type, status: "failed", error: safeErr(outcome.reason) };
  });

  return {
    url: crawl.rootUrl,
    pagesScanned: crawl.pagesScanned,
    scraped: signals.scraped,
    evidence: signals, // deterministic facts for the "Raw evidence" tab (no secrets)
    results,
  };
}

// Re-export for the controller's validation layer.
export { ANALYSIS_TYPES } from "../ai/schemas/analysisSchemas.js";
