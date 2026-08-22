import { z } from "zod";

/**
 * Zod schemas for the multi-analysis endpoint (plan §I / §J).
 *
 * These validate the AI's INTERPRETATION output only. Deterministic facts are
 * extracted in code (crawlerService) and passed into the prompt; numbers that
 * must be trustworthy (the Growth Score math) are recomputed/clamped in the
 * service and never trusted verbatim from the model.
 */

// The 8 supported analysis types (plan §I).
export const ANALYSIS_TYPES = [
  "ai_growth_score",
  "site_audit",
  "technical_seo",
  "seo_opportunities",
  "content_analysis",
  "keyword_ideas",
  "competitor_strategy",
  "geo_visibility",
];

const Score = z.number().min(0).max(100);
const StrList = z.array(z.string()).default([]);

/* ---------------------------------------------------------------- Growth Score (§J) */

export const PrioritizedActionSchema = z.object({
  priority: z.number().int().min(1).default(1),
  issue: z.string(),
  recommendation: z.string(),
  category: z
    .enum(["technicalSeo", "onPageSeo", "contentQuality", "discoverability", "conversionReadiness"])
    .default("technicalSeo"),
  impact: z.enum(["High", "Medium", "Low"]).default("Medium"),
  effort: z.enum(["High", "Medium", "Low"]).default("Medium"),
  reason: z.string().default(""),
});

// The model returns category scores + qualitative fields. overallScore /
// scoreLabel / generatedBy are (re)computed in the service — kept optional here.
export const GrowthScoreSchema = z.object({
  overallScore: Score.optional(),
  scoreLabel: z.string().optional(),
  categoryScores: z.object({
    technicalSeo: Score,
    onPageSeo: Score,
    contentQuality: Score,
    discoverability: Score,
    conversionReadiness: Score,
  }),
  evidence: StrList,
  strengths: StrList,
  weaknesses: StrList,
  quickWins: StrList,
  prioritizedActions: z.array(PrioritizedActionSchema).default([]),
  limitations: StrList,
  generatedBy: z
    .object({ provider: z.string().default(""), model: z.string().default("") })
    .default({ provider: "", model: "" }),
});

/* ---------------------------------------------------------------- Site audit */

export const SiteAuditSchema = z.object({
  summary: z.string(),
  healthScore: Score.default(60),
  criticalIssues: StrList,
  warnings: StrList,
  passedChecks: StrList,
  recommendations: StrList,
});

/* ---------------------------------------------------------------- Technical SEO */

export const TechnicalSeoSchema = z.object({
  summary: z.string(),
  findings: z
    .array(
      z.object({
        area: z.string(),
        status: z.enum(["pass", "warn", "fail"]).default("warn"),
        detail: z.string().default(""),
        fix: z.string().default(""),
      })
    )
    .default([]),
  indexabilityNotes: StrList,
  recommendations: StrList,
});

/* ---------------------------------------------------------------- SEO opportunities */

export const SeoOpportunitiesSchema = z.object({
  summary: z.string(),
  opportunities: z
    .array(
      z.object({
        title: z.string(),
        category: z.string().default("On-page SEO"),
        impact: z.enum(["High", "Medium", "Low"]).default("Medium"),
        effort: z.enum(["High", "Medium", "Low"]).default("Medium"),
        description: z.string().default(""),
        recommendedAction: z.string().default(""),
      })
    )
    .default([]),
});

/* ---------------------------------------------------------------- Content analysis */

export const ContentAnalysisSchema = z.object({
  summary: z.string(),
  readability: z.string().default(""),
  tone: z.string().default(""),
  contentGaps: StrList,
  topicSuggestions: StrList,
  keywordCoverage: StrList,
  eeatSignals: StrList,
  recommendations: StrList,
});

/* ---------------------------------------------------------------- Keyword ideas */

export const KeywordIdeasSchema = z.object({
  seedThemes: StrList,
  keywords: z
    .array(
      z.object({
        keyword: z.string(),
        intent: z
          .enum(["informational", "commercial", "transactional", "navigational"])
          .default("informational"),
        priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
        rationale: z.string().default(""),
      })
    )
    .default([]),
  questions: StrList,
  clusters: z
    .array(z.object({ cluster: z.string(), keywords: StrList }))
    .default([]),
});

/* ---------------------------------------------------------------- Competitor strategy */

export const CompetitorStrategySchema = z.object({
  summary: z.string(),
  likelyCompetitors: z
    .array(z.object({ name: z.string(), domain: z.string().default(""), why: z.string().default("") }))
    .default([]),
  differentiationOpportunities: StrList,
  contentAngles: StrList,
  recommendations: StrList,
});

/* ---------------------------------------------------------------- GEO / answer-engine visibility */

export const GeoVisibilitySchema = z.object({
  summary: z.string(),
  geoReadinessScore: Score.default(50),
  entityClarity: StrList,
  citationsNeeded: StrList,
  structuredDataGaps: StrList,
  recommendations: StrList,
});

/* ---------------------------------------------------------------- lookup */

export const SCHEMA_BY_TYPE = {
  ai_growth_score: GrowthScoreSchema,
  site_audit: SiteAuditSchema,
  technical_seo: TechnicalSeoSchema,
  seo_opportunities: SeoOpportunitiesSchema,
  content_analysis: ContentAnalysisSchema,
  keyword_ideas: KeywordIdeasSchema,
  competitor_strategy: CompetitorStrategySchema,
  geo_visibility: GeoVisibilitySchema,
};

export function schemaForType(type) {
  return SCHEMA_BY_TYPE[type] || null;
}
