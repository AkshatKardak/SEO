import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchIcon,
  ArrowRightIcon,
  BarChart3Icon,
  GlobeIcon,
  TrendingUpIcon,
  RefreshCwIcon,
  AlertCircleIcon,
} from "lucide-react";
import AnalysesCard from "../components/AnalysesCard";
import { authAPI, seoAPI } from "../services/api";

interface AnalysisSummary {
  _id: string;
  url: string;
  overallScore: number;
  status: string;
  createdAt: string;
  categories: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
}

interface UserData {
  name: string;
  email: string;
  plan: string;
  analysisCount: number;
  dailyAnalysisCount: number;
}

const DAILY_FREE_LIMIT = 5;

export default function Dashboard() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch logged-in user info
  const fetchUser = useCallback(async () => {
    try {
      setUserLoading(true);
      const data = await authAPI.getUser();
      setUser(data.user ?? data);
    } catch (err: any) {
      // Token expired / invalid → redirect to login
      if (err.message?.includes("401") || err.message?.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setUserLoading(false);
    }
  }, [navigate]);

  // Fetch recent analyses
  const fetchAnalyses = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const data = await seoAPI.getAnalyses();
      // API returns { analyses: [...] } or direct array
      const list: AnalysisSummary[] = Array.isArray(data) ? data : data.analyses ?? [];
      // Show only the 6 most recent on dashboard
      setAnalyses(list.slice(0, 6));
    } catch (err: any) {
      setError(err.message || "Failed to load analyses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
    fetchAnalyses();
  }, [fetchUser, fetchAnalyses, navigate]);

  // Auto-refresh every 30s to catch in-progress analyses
  useEffect(() => {
    const hasProcessing = analyses.some((a) => a.status === "processing");
    if (!hasProcessing) return;
    const interval = setInterval(() => fetchAnalyses(true), 10000);
    return () => clearInterval(interval);
  }, [analyses, fetchAnalyses]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url.trim())}`);
    }
  };

  const completedAnalyses = analyses.filter((a) => a.status === "completed");
  const avgScore = completedAnalyses.length
    ? Math.round(
        completedAnalyses.reduce((sum, a) => sum + a.overallScore, 0) /
          completedAnalyses.length
      )
    : 0;

  const scansLeft =
    user?.plan === "free"
      ? Math.max(0, DAILY_FREE_LIMIT - (user?.dailyAnalysisCount ?? 0))
      : null; // null = unlimited

  const getScoreClass = (s: number) => {
    if (s >= 80) return "score-good";
    if (s >= 50) return "score-medium";
    return "score-poor";
  };

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-1">
              Welcome back,{" "}
              <span className="gradient-text">
                {userLoading ? "..." : user?.name ?? "there"}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Analyze websites and boost your SEO performance.
            </p>
          </div>

          {/* Manual refresh */}
          <button
            onClick={() => fetchAnalyses(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCwIcon size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Quick Analyze ──────────────────────────────── */}
        <form onSubmit={handleAnalyze} className="mb-10">
          <div className="border border-primary/20 rounded-full p-2 flex items-center gap-2 max-w-2xl">
            <div className="flex items-center gap-3 flex-1 px-3">
              <SearchIcon size={20} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter a URL to analyze..."
                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm py-3"
                id="dashboard-url-input"
              />
            </div>
            <button
              type="submit"
              disabled={!url.trim() || (user?.plan === "free" && scansLeft === 0)}
              className="bg-primary px-5 py-3 rounded-full text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "var(--background)" }}
              id="dashboard-analyze-btn"
            >
              Analyze
              <ArrowRightIcon size={16} />
            </button>
          </div>
          {user?.plan === "free" && scansLeft === 0 && (
            <p className="text-xs text-danger mt-2 ml-4">
              Daily limit reached. Upgrade to Pro for unlimited scans.
            </p>
          )}
        </form>

        {/* ── Stats Cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {/* Total scans */}
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <GlobeIcon size={22} />
            </div>
            <div>
              {loading ? (
                <div className="skeleton skeleton-text w-8 h-7 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{analyses.length}</p>
              )}
              <p className="text-xs text-muted-foreground">Total Scans</p>
            </div>
          </div>

          {/* Avg Score */}
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUpIcon size={22} />
            </div>
            <div>
              {loading ? (
                <div className="skeleton skeleton-text w-10 h-7 mb-1" />
              ) : (
                <p className={`text-2xl font-bold ${getScoreClass(avgScore)}`}>{avgScore || "—"}</p>
              )}
              <p className="text-xs text-muted-foreground">Avg SEO Score</p>
            </div>
          </div>

          {/* Scans left */}
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <BarChart3Icon size={22} />
            </div>
            <div>
              {userLoading ? (
                <div className="skeleton skeleton-text w-8 h-7 mb-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {user?.plan === "free" ? scansLeft : "∞"}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {user?.plan === "free" ? "Scans Left Today" : "Unlimited (Pro)"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Recent Analyses ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Analyses</h2>
            {analyses.length > 0 && (
              <Link
                to="/history"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRightIcon size={14} />
              </Link>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm mb-4">
              <AlertCircleIcon size={16} className="shrink-0" />
              {error}
              <button
                onClick={() => fetchAnalyses()}
                className="ml-auto underline text-xs hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 flex-1">
                      <div className="skeleton skeleton-text w-3/4 h-4" />
                      <div className="skeleton skeleton-text w-1/2 h-3" />
                    </div>
                    <div className="skeleton skeleton-avatar w-14 h-14 rounded-full" />
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="skeleton skeleton-text h-6 rounded" />
                    ))}
                  </div>
                  <div className="skeleton skeleton-text w-24 h-3" />
                </div>
              ))}
            </div>
          ) : analyses.length === 0 ? (
            /* Empty state */
            <div className="glass rounded-2xl p-12 text-center">
              <SearchIcon size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter a URL above to run your first SEO analysis.
              </p>
            </div>
          ) : (
            /* Real data grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((a) => (
                <AnalysesCard key={a._id} analysis={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}