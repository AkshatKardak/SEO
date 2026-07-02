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

// ─── SEO Analysis ─────────────────────────────────────────
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

// ─── Rank Tracker ─────────────────────────────────────────
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
