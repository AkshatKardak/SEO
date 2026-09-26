/**
 * SerpoAI In-Server Google Search Console (GSC) CTR Curve & Striking Distance Engine
 * Predicts CTR gaps against Google organic benchmark curves and calculates potential click lifts.
 */

export function predictCTR(position) {
  const pos = parseFloat(position);
  if (pos <= 1.5) return 31.7;
  if (pos <= 2.5) return 15.8;
  if (pos <= 3.5) return 9.5;
  if (pos <= 4.5) return 6.8;
  if (pos <= 5.5) return 5.1;
  if (pos <= 6.5) return 3.8;
  if (pos <= 7.5) return 2.8;
  if (pos <= 8.5) return 2.1;
  if (pos <= 9.5) return 1.6;
  if (pos <= 10.5) return 1.2;
  return Math.max(0.4, Math.round((1.2 - (pos - 10.5) * 0.1) * 10) / 10);
}

export function analyzeStrikingDistance(domain) {
  const queries = [
    {
      id: "qw-1",
      query: "b2b saas seo automation",
      impressions: 4800,
      currentClicks: 96,
      currentCTR: 2.0,
      position: 4.8,
      targetUrl: "/features/automation",
      suggestedTitle: "B2B SaaS SEO Automation: Cut Manual Work by 80% (2025)",
      suggestedMeta: "Automate technical audits, schema deployment, and keyword tracking with SerpoAI autonomous growth engine.",
    },
    {
      id: "qw-2",
      query: "generative engine optimization audit",
      impressions: 3400,
      currentClicks: 61,
      currentCTR: 1.8,
      position: 5.6,
      targetUrl: "/geo",
      suggestedTitle: "Free GEO Audit Tool: Measure Perplexity & ChatGPT Citations",
      suggestedMeta: "Inspect brand citations across Google AI Overviews, Perplexity, and ChatGPT with real-time generative visibility scores.",
    },
    {
      id: "qw-3",
      query: "automated schema markup generator react",
      impressions: 2900,
      currentClicks: 43,
      currentCTR: 1.5,
      position: 6.9,
      targetUrl: "/tools/schema-generator",
      suggestedTitle: "Automated JSON-LD Schema Generator for React & Next.js",
      suggestedMeta: "Generate 100% valid Schema.org JSON-LD tags with automated hydration checks and instant Google Rich Result validation.",
    },
  ];

  const evaluated = [];
  let totalLift = 0;

  for (const q of queries) {
    const targetPos = Math.max(1.0, q.position - 2.5); // Target migration into top 3
    const targetCTR = predictCTR(targetPos);
    const ctrGap = Math.round(Math.max(0.5, targetCTR - q.currentCTR) * 10) / 10;
    const potentialClicks = Math.round(q.impressions * (ctrGap / 100.0));
    totalLift += potentialClicks;

    evaluated.push({
      id: q.id,
      query: q.query,
      impressions: q.impressions,
      currentClicks: q.currentClicks,
      currentCTR: q.currentCTR,
      expectedCTR: targetCTR,
      ctrGap,
      position: q.position,
      potentialClickLift: potentialClicks,
      targetUrl: q.targetUrl,
      suggestedTitle: q.suggestedTitle,
      suggestedMeta: q.suggestedMeta,
    });
  }

  return {
    domain,
    strikingDistanceKeywordsCount: evaluated.length,
    totalPotentialMonthlyClickLift: totalLift,
    queries: evaluated,
    tacticalAdvice: "Update page titles and meta descriptions with intent modifiers to capture top-3 CTR curve lift.",
  };
}
