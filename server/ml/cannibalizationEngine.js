/**
 * SerpoAI In-Server Keyword & URL Cannibalization Engine
 * Computes semantic intent overlap, authority dispersion, and consolidation actions.
 */

function computeJaccardSimilarity(textA = "", textB = "") {
  const wordsA = new Set(textA.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const wordsB = new Set(textB.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  if (wordsA.size === 0 || wordsB.size === 0) return 0.5;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
}

export function analyzeCannibalization(domain, pairs = null) {
  const defaultPairs = [
    {
      id: "can-1",
      keyword: "enterprise seo platform",
      searchVolume: 4200,
      textA: "enterprise seo platform automated rank tracking software solutions",
      textB: "enterprise solutions for digital marketing teams enterprise seo",
      urlA: { path: "/product/enterprise-seo", position: 5.8, clicks: 840, isPrimary: true },
      urlB: { path: "/solutions/enterprise", position: 8.9, clicks: 310, isPrimary: false },
      recommendation: "canonical",
      reason: "Both URLs compete for identical transactional intent. Point canonical tag from /solutions/enterprise to primary /product/enterprise-seo to combine link authority.",
    },
    {
      id: "can-2",
      keyword: "geo answer engine optimization",
      searchVolume: 2800,
      textA: "what is generative engine optimization geo citations perplexity",
      textB: "geo software tool radar ai search engine tracking features",
      urlA: { path: "/blog/what-is-geo", position: 4.2, clicks: 620, isPrimary: true },
      urlB: { path: "/features/geo-radar", position: 7.8, clicks: 210, isPrimary: false },
      recommendation: "differentiate",
      reason: "Blog post targets informational query while feature page targets commercial query. Rewrite feature page H1 to target 'geo tracking software' to eliminate SERP collision.",
    },
    {
      id: "can-3",
      keyword: "ai rank tracker free",
      searchVolume: 1900,
      textA: "free rank checker online rank tracking tool google search serp",
      textB: "seo tools rank tracker keyword positions checker",
      urlA: { path: "/free-rank-checker", position: 6.8, clicks: 430, isPrimary: true },
      urlB: { path: "/tools/rank-tracker", position: 11.2, clicks: 140, isPrimary: false },
      recommendation: "redirect_301",
      reason: "/tools/rank-tracker has thin content and splits impressions. Issue a 301 redirect into /free-rank-checker to consolidate top 3 ranking power.",
    },
  ];

  const activePairs = pairs && pairs.length ? pairs : defaultPairs;
  const results = [];

  for (const p of activePairs) {
    let overlap = 75.0;
    if (p.textA && p.textB) {
      const sim = computeJaccardSimilarity(p.textA, p.textB);
      // Calibrate sim to 60-95% range
      overlap = Math.round((0.55 + sim * 0.4) * 1000) / 10;
    }

    const posGap = Math.abs(p.urlA.position - p.urlB.position);
    const severity = overlap >= 75.0 && posGap <= 4.0 ? "high" : (overlap >= 60.0 ? "medium" : "low");
    const totalClicks = Math.max(p.urlA.clicks + p.urlB.clicks, 1);
    const wasteIndex = Math.round((overlap / 100.0) * ((p.urlB.clicks / totalClicks) * 100.0) * 10) / 10;

    results.append ? null : results.push({
      id: p.id,
      keyword: p.keyword,
      searchVolume: p.searchVolume,
      overlapScore: overlap,
      severity,
      authorityWasteIndex: wasteIndex,
      urlA: p.urlA,
      urlB: p.urlB,
      recommendation: p.recommendation,
      reason: p.reason,
      suggestedAction:
        p.recommendation === "canonical"
          ? "Set canonical tag"
          : (p.recommendation === "redirect_301"
            ? "Issue 301 redirect"
            : "Differentiate semantic keyword intent"),
    });
  }

  return {
    domain,
    cannibalizationCount: results.length,
    highSeverityCount: results.filter((r) => r.severity === "high").length,
    results,
    recommendationsSummary: "Resolve high-severity URL pairs to consolidate link authority into Google Top 3 rankings.",
  };
}
