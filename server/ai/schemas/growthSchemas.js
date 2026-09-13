import { z } from "zod";

export const CompanyProfileSchema = z.object({
  companyName: z.string().default("Unknown Company"),
  industry: z.string().default("Technology / SaaS"),
  description: z.string().default(""),
  products: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
  buyerPersonas: z.array(z.object({
    name: z.string(),
    role: z.string(),
    painPoints: z.array(z.string()).default([]),
    goals: z.array(z.string()).default([]),
  })).default([]),
  competitors: z.array(z.object({
    name: z.string(),
    domain: z.string().optional(),
    differentiation: z.string().optional(),
  })).default([]),
  valueProposition: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  brandEntities: z.array(z.string()).default([]),
  contentTopics: z.array(z.string()).default([]),
  growthBottlenecks: z.array(z.string()).default([]),
});

const toScore = (def) =>
  z.preprocess((val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const n = parseFloat(val);
      return isNaN(n) ? def : n;
    }
    if (val && typeof val === "object" && "overall" in val) {
      const n = parseFloat(val.overall);
      return isNaN(n) ? def : n;
    }
    return def;
  }, z.number().min(0).max(100).default(def));

const toPosition = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
  }
  return null;
}, z.number().nullable());

const VALID_OPP_TYPES = [
  "TECHNICAL_SEO",
  "ON_PAGE_SEO",
  "CONTENT",
  "GEO",
  "CONVERSION",
  "COMPETITOR",
  "BACKLINK",
  "SOCIAL",
  "OUTREACH",
  "EXPERIMENT",
  "RETENTION",
  "STRATEGY",
];

const toOppType = z.preprocess((val) => {
  if (typeof val !== "string") return "CONTENT";
  const upper = val.toUpperCase().trim().replace(/[\s-]+/g, "_");
  if (VALID_OPP_TYPES.includes(upper)) return upper;
  if (upper.includes("TECH")) return "TECHNICAL_SEO";
  if (upper.includes("GEO") || upper.includes("AI_SEARCH")) return "GEO";
  if (upper.includes("CONV") || upper.includes("CRO")) return "CONVERSION";
  if (upper.includes("COMPET")) return "COMPETITOR";
  if (upper.includes("LINK") || upper.includes("BACKLINK")) return "BACKLINK";
  if (upper.includes("PAGE")) return "ON_PAGE_SEO";
  if (upper.includes("STRAT")) return "STRATEGY";
  return "CONTENT";
}, z.enum(VALID_OPP_TYPES).default("CONTENT"));

const toConfidence = z.preprocess((val) => {
  if (typeof val === "number") {
    if (val > 1.0 && val <= 100) return Number((val / 100).toFixed(2));
    return Math.min(1.0, Math.max(0.1, val));
  }
  if (typeof val === "string") {
    const parsed = parseFloat(val.replace("%", ""));
    if (!isNaN(parsed)) {
      if (parsed > 1.0) return Number((parsed / 100).toFixed(2));
      return Math.min(1.0, Math.max(0.1, parsed));
    }
  }
  return 0.7;
}, z.number().min(0.0).max(1.0).default(0.7));

const toScore10 = (def = 5) =>
  z.preprocess((val) => {
    if (typeof val === "number") return Math.min(10, Math.max(1, Math.round(val)));
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) return Math.min(10, Math.max(1, Math.round(parsed)));
    }
    return def;
  }, z.number().min(1).max(10).default(def));

const VALID_AGENTS = [
  "Growth Brain",
  "Intelligence Agent",
  "SEO Agent",
  "GEO Agent",
  "Content Agent",
  "Growth Analyst",
];

const toAgent = z.preprocess((val) => {
  if (typeof val !== "string") return "Growth Analyst";
  const trimmed = val.trim();
  const match = VALID_AGENTS.find(a => a.toLowerCase() === trimmed.toLowerCase() || a.toLowerCase().startsWith(trimmed.toLowerCase()));
  return match || "Growth Analyst";
}, z.enum(VALID_AGENTS).default("Growth Analyst"));

const toAutomationLevel = z.preprocess((val) => {
  if (typeof val !== "string") return "Autopilot";
  const str = val.trim().toLowerCase();
  if (str === "copilot") return "Copilot";
  if (str === "autopilot") return "Autopilot";
  if (str === "autonomous") return "Autonomous";
  if (str.includes("semi")) return "Semi-Autonomous";
  return "Autopilot";
}, z.enum(["Copilot", "Autopilot", "Autonomous", "Semi-Autonomous"]).default("Autopilot"));

export const OpportunityItemSchema = z.object({
  type: toOppType,
  title: z.string(),
  description: z.string(),
  evidence: z.array(z.string()).or(z.string()),
  impactScore: toScore10(5),
  effortScore: toScore10(5),
  confidenceScore: toConfidence,
  estimatedValue: z.string().default("Medium"),
  recommendedAction: z.string(),
  automationLevel: toAutomationLevel,
  requiresApproval: z.boolean().default(true),
  assignedAgent: toAgent,
});

export const OpportunitiesListSchema = z.object({
  opportunities: z.array(OpportunityItemSchema),
  overallGrowthHealth: toScore(65),
  scores: z.object({
    visibility: toScore(60),
    seo: toScore(60),
    geo: toScore(50),
    conversion: toScore(55),
    content: toScore(60),
  }),
});

export const GEOResultsSchema = z.object({
  geoScore: toScore(50),
  citationScore: toScore(45),
  brandVisibilityScore: toScore(55),
  competitorVisibilityScore: toScore(70),
  brandMentionRate: toScore(40),
  queries: z.array(z.object({
    query: z.string(),
    chatgpt: z.object({ mentioned: z.boolean().default(false), position: toPosition }),
    perplexity: z.object({ mentioned: z.boolean().default(false), position: toPosition }),
    gemini: z.object({ mentioned: z.boolean().default(false), position: toPosition }),
    google_ai: z.object({ mentioned: z.boolean().default(false), position: toPosition }),
    competitorMentions: z.array(z.string()).default([]),
    missingTopics: z.array(z.string()).default([]),
  })).default([]),
  citationDomains: z.array(z.object({
    domain: z.string(),
    authority: z.string().optional(),
    count: z.number().default(1),
  })).default([]),
  missingAuthoritySignals: z.array(z.string()).default([]),
});

export const ContentBriefSchema = z.object({
  title: z.string(),
  topic: z.string(),
  searchIntent: z.string(),
  targetAudience: z.string(),
  businessValue: z.string(),
  primaryKeyword: z.string(),
  secondaryKeywords: z.array(z.string()),
  recommendedFormat: z.string(),
  structureOutline: z.array(z.string()),
  internalLinks: z.array(z.string()).default([]),
  externalSources: z.array(z.string()).default([]),
  cta: z.string(),
  geoObjective: z.string(),
  draftContent: z.string().optional(),
});

export const ExperimentPlanSchema = z.object({
  hypothesis: z.string(),
  type: z.enum([
    "Landing page test",
    "CTA test",
    "Content test",
    "SEO test",
    "Internal-linking test",
    "GEO content test",
    "Pricing-page test"
  ]),
  metric: z.string(),
  baseline: z.string(),
  target: z.string(),
  expectedImpact: z.string(),
  recommendedAction: z.string(),
});
