// Base URL — set VITE_API_URL in client/.env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Helper ───────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register: ({ name, email, password }: { name: string; email: string; password: string }) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: ({ email, password }: { email: string; password: string }) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getUser: () => request("/api/auth/user"),

  updateSchedule: (schedulePreference: string) =>
    request("/api/auth/schedule", {
      method: "PUT",
      body: JSON.stringify({ schedulePreference }),
    }),
};

// ─── AI Growth OS v1 API ──────────────────────────────────
export const growthAPI = {
  // Projects & Website Intelligence
  createProject: (data: { url: string; name?: string; growthGoal?: string }) =>
    request("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProjects: () => request("/api/projects"),

  getProject: (id: string) => request(`/api/projects/${id}`),

  updateProjectGoal: (id: string, data: { growthGoal?: string; executionMode?: string }) =>
    request(`/api/projects/${id}/goal`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  reanalyzeProject: (id: string) =>
    request(`/api/projects/${id}/analyze`, {
      method: "POST",
    }),

  deleteProject: (id: string) =>
    request(`/api/projects/${id}`, {
      method: "DELETE",
    }),

  // Opportunities & Growth Brain
  getOpportunities: (projectId: string, params?: { category?: string; minImpact?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/api/opportunities/project/${projectId}${query ? `?${query}` : ""}`);
  },

  getOpportunity: (id: string) => request(`/api/opportunities/${id}`),

  executeOpportunity: (id: string, executionMode?: string) =>
    request(`/api/opportunities/${id}/execute`, {
      method: "POST",
      body: JSON.stringify({ executionMode }),
    }),

  dismissOpportunity: (id: string) =>
    request(`/api/opportunities/${id}/dismiss`, {
      method: "POST",
    }),

  // Action Center
  getActions: (projectId: string) => request(`/api/actions/project/${projectId}`),

  approveAction: (id: string) =>
    request(`/api/actions/${id}/approve`, {
      method: "POST",
    }),

  rejectAction: (id: string, reason?: string) =>
    request(`/api/actions/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // GEO Intelligence Engine
  getGEOQueries: (projectId: string) => request(`/api/geo/project/${projectId}`),

  triggerGEOAnalysis: (projectId: string) =>
    request(`/api/geo/project/${projectId}/analyze`, {
      method: "POST",
    }),

  // Agent Activity
  getAgentActivity: (projectId: string) => request(`/api/agents/project/${projectId}/activity`),

  // Growth Experiments
  getExperiments: (projectId: string) => request(`/api/experiments/project/${projectId}`),

  createExperiment: (projectId: string, data: {
    title: string;
    type: string;
    hypothesis: string;
    metric: string;
    baselineValue: string;
    targetValue: string;
    expectedImpact: string;
  }) =>
    request(`/api/experiments/project/${projectId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  evaluateExperiment: (id: string, data: { currentValue: string; winner?: string }) =>
    request(`/api/experiments/${id}/evaluate`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Growth Memory
  getGrowthMemory: (projectId: string) => request(`/api/memory/project/${projectId}`),

  // Analytics & Closed-Loop Funnel
  getAnalytics: (projectId: string) => request(`/api/analytics/project/${projectId}`),

  connectIntegration: (projectId: string, data: {
    provider: string;
    propertyId?: string;
    siteUrl?: string;
    apiKey?: string;
    projectId?: string;
  }) =>
    request(`/api/analytics/project/${projectId}/connect`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  disconnectIntegration: (projectId: string, provider: string) =>
    request(`/api/analytics/project/${projectId}/disconnect`, {
      method: "POST",
      body: JSON.stringify({ provider }),
    }),

  // Competitor Intelligence & Content Gaps
  getCompetitors: (projectId: string) => request(`/api/competitors/project/${projectId}`),

  runCompetitorAnalysis: (projectId: string, competitorDomain?: string) =>
    request(`/api/competitors/project/${projectId}/analyze`, {
      method: "POST",
      body: JSON.stringify({ competitorDomain }),
    }),

  // Strategic Growth Roadmap
  getStrategy: (projectId: string) => request(`/api/strategy/project/${projectId}`),

  // Technical Site Audit & Core Web Vitals
  getSiteAudit: (projectId: string) => request(`/api/audit/project/${projectId}`),

  triggerSiteAudit: (projectId: string) =>
    request(`/api/audit/project/${projectId}/audit`, {
      method: "POST",
    }),

  autoFixIssue: (projectId: string, issueId: string) =>
    request(`/api/audit/project/${projectId}/fix`, {
      method: "POST",
      body: JSON.stringify({ issueId }),
    }),

  // Executive Growth Reports
  getReports: (projectId: string) => request(`/api/reports/project/${projectId}`),

  generateReport: (projectId: string, period?: string) =>
    request(`/api/reports/project/${projectId}/generate`, {
      method: "POST",
      body: JSON.stringify({ period }),
    }),

  // AI Growth Co-Pilot Chat
  chatWithCoPilot: (projectId: string, message: string) =>
    request(`/api/agents/project/${projectId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

// ─── SEO Analysis (Preserved) ─────────────────────────────
export const seoAPI = {
  analyze: (url: string) =>
    request("/api/seo/analyze", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  getAnalyses: () => request("/api/seo/analyses"),

  getAnalysis: (id: string) => request(`/api/seo/analysis/${id}`),

  getScoreHistory: (url?: string) =>
    request(`/api/seo/score-history${url ? `?url=${encodeURIComponent(url)}` : ""}`),

  generateShareLink: (id: string) =>
    request(`/api/seo/${id}/share`, { method: "POST" }),

  getSharedReport: (token: string) => request(`/api/seo/share/${token}`),

  checkSitemap: (url: string) =>
    request(`/api/seo/sitemap-check?url=${encodeURIComponent(url)}`),

  getPageSpeed: (url: string, strategy: "mobile" | "desktop" = "mobile") =>
    request(`/api/seo/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`),

  analyzeBulk: (urls: string[]) =>
    request("/api/seo/analyze-bulk", {
      method: "POST",
      body: JSON.stringify({ urls }),
    }),
};

// ─── Multi-Analysis (URL) ─────────────────────────────────
export const analysisAPI = {
  analyzeUrl: (url: string, analyses?: string[]) =>
    request("/api/analysis/url", {
      method: "POST",
      body: JSON.stringify(analyses && analyses.length ? { url, analyses } : { url }),
    }),

  getProviderStatus: () => request("/api/analysis/status"),
};

// ─── Rank Tracker (Preserved) ─────────────────────────────
export const rankAPI = {
  addKeyword: (keyword: string, targetUrl: string) =>
    request("/api/rank/add", {
      method: "POST",
      body: JSON.stringify({ keyword, targetUrl }),
    }),

  getKeywords: () => request("/api/rank/list"),

  getTracker: (id: string) => request(`/api/rank/${id}`),

  refreshTracker: (id: string) =>
    request(`/api/rank/${id}/refresh`, { method: "POST" }),

  deleteKeyword: (id: string) =>
    request(`/api/rank/${id}`, { method: "DELETE" }),
};

// ─── Machine Learning API ─────────────────────────────────
export const mlAPI = {
  rankOpportunities: (projectId: string) =>
    request(`/api/ml/rank/${projectId}`),

  detectAnomalies: (projectId: string, metric?: string, currentValue?: number) =>
    request(`/api/ml/anomalies/${projectId}?metric=${metric || "organic_traffic"}&currentValue=${currentValue || 31400}`),

  getGrowthForecast: (projectId: string, metric?: string) =>
    request(`/api/ml/forecast/${projectId}?metric=${metric || "organic_traffic"}`),

  getPublicForecast: (domain?: string, metric?: string) =>
    request(`/api/ml/public-forecast?domain=${domain || "example.com"}&metric=${metric || "organic_traffic"}`),

  // ── 3 Unique ML Features ──
  evaluatePatch: (data: { opportunityId: string; patchCode: string; targetFile?: string }) =>
    request("/api/ml/serpo-bot/evaluate-patch", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  dispatchPR: (data: {
    repo?: string;
    baseBranch?: string;
    prBranch?: string;
    commitMessage?: string;
    opportunityId: string;
    patchCode: string;
  }) =>
    request("/api/ml/serpo-bot/dispatch-pr", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCannibalization: (projectId: string) =>
    request(`/api/ml/cannibalization/${projectId}`),

  applyCannibalizationFix: (data: {
    pairId: string;
    fixType: string;
    targetUrl?: string;
    primaryUrl?: string;
  }) =>
    request("/api/ml/cannibalization/apply-fix", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getGSCQuickWins: (projectId: string) =>
    request(`/api/ml/gsc-quick-wins/${projectId}`),

  optimizeGSCQuickWin: (data: {
    queryId: string;
    query: string;
    optimizedTitle: string;
    optimizedMeta: string;
    targetUrl?: string;
  }) =>
    request("/api/ml/gsc-quick-wins/optimize", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};


