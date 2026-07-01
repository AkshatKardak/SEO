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
  register: (name: string, email: string, password: string) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getUser: () => request("/api/auth/user"),
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
};

// ─── Rank Tracker ─────────────────────────────────────────
export const rankAPI = {
  addKeyword: (keyword: string, targetUrl: string) =>
    request("/api/rank/add", {
      method: "POST",
      body: JSON.stringify({ keyword, targetUrl }),
    }),

  getKeywords: () => request("/api/rank/list"),

  deleteKeyword: (id: string) =>
    request(`/api/rank/${id}`, { method: "DELETE" }),
};