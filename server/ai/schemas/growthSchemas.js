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

export const OpportunityItemSchema = z.object({
  type: z.enum([
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
    "RETENTION"
  ]),
  title: z.string(),
  description: z.string(),
  evidence: z.array(z.string()).or(z.string()),
  impactScore: z.number().min(1).max(10).default(5),
  effortScore: z.number().min(1).max(10).default(5),
  confidenceScore: z.number().min(0.0).max(1.0).default(0.7),
  estimatedValue: z.string().default("Medium"),
  recommendedAction: z.string(),
  automationLevel: z.enum(["Copilot", "Autopilot", "Autonomous"]).default("Autopilot"),
  requiresApproval: z.boolean().default(true),
  assignedAgent: z.enum([
    "Intelligence Agent",
    "SEO Agent",
    "GEO Agent",
    "Content Agent",
    "Growth Analyst"
  ]).default("Growth Analyst"),
});

export const OpportunitiesListSchema = z.object({
  opportunities: z.array(OpportunityItemSchema),
  overallGrowthHealth: z.number().min(0).max(100).default(65),
  scores: z.object({
    visibility: z.number().min(0).max(100).default(60),
    seo: z.number().min(0).max(100).default(60),
    geo: z.number().min(0).max(100).default(50),
    conversion: z.number().min(0).max(100).default(55),
    content: z.number().min(0).max(100).default(60),
  }),
});

export const GEOResultsSchema = z.object({
  geoScore: z.number().min(0).max(100).default(50),
  citationScore: z.number().min(0).max(100).default(45),
  brandVisibilityScore: z.number().min(0).max(100).default(55),
  competitorVisibilityScore: z.number().min(0).max(100).default(70),
  brandMentionRate: z.number().min(0).max(100).default(40),
  queries: z.array(z.object({
    query: z.string(),
    chatgpt: z.object({ mentioned: z.boolean(), position: z.number().nullable() }),
    perplexity: z.object({ mentioned: z.boolean(), position: z.number().nullable() }),
    gemini: z.object({ mentioned: z.boolean(), position: z.number().nullable() }),
    google_ai: z.object({ mentioned: z.boolean(), position: z.number().nullable() }),
    competitorMentions: z.array(z.string()).default([]),
    missingTopics: z.array(z.string()).default([]),
  })).default([]),
  citationDomains: z.array(z.object({
    domain: z.string(),
    authority: z.string().optional(),
    count: z.number(),
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
