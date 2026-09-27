/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target, Plus, Trash2, TrendingUp, TrendingDown,
  Minus, ExternalLink, Clock, Loader2, X, Search, Globe,
  AlertCircle, Filter, ArrowUpDown, BarChart2,
} from "lucide-react";
import { rankAPI } from "../services/api";
import toast from "react-hot-toast";
import ScheduleSelector from "../components/ScheduleSelector";
import KeywordCannibalizationGraph from "../components/features/KeywordCannibalizationGraph";
import GSCQuickWinsDetector from "../components/features/GSCQuickWinsDetector";

interface RankEntry {
  date: string;
  position: number | null;
}

interface KeywordItem {
  _id: string;
  keyword: string;
  targetUrl: string;
  history: RankEntry[];
  lastChecked: string | null;
  createdAt?: string;
}

// Derived helpers
const currentPosition = (kw: KeywordItem): number | null =>
  kw.history.length ? kw.history[kw.history.length - 1].position : null;

const prevPosition = (kw: KeywordItem): number | null =>
  kw.history.length >= 2 ? kw.history[kw.history.length - 2].position : null;

const positionChange = (kw: KeywordItem): number => {
  const cur = currentPosition(kw);
  const prev = prevPosition(kw);
  if (cur === null || prev === null) return 0;
  return prev - cur; // positive = moved UP (improved)
};

const bestPosition = (kw: KeywordItem): number | null => {
  const positions = kw.history.map((h) => h.position).filter((p): p is number => p !== null);
  return positions.length ? Math.min(...positions) : null;
};

const getDomain = (url: string) => {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

export default function RankTracker() {
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [schedulePreference, setSchedulePreference] = useState<string>("daily");
  const [activeTab, setActiveTab] = useState<"rankings" | "cannibalization" | "gsc_quick_wins">("rankings");

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const data = await rankAPI.getKeywords();
      setKeywords(data.trackers || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load keywords");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user schedule preference on mount
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiBase = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "").replace(/\/+$/, "");
      const res = await fetch(`${apiBase}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.user?.schedulePreference) {
        setSchedulePreference(data.user.schedulePreference);
      }
    } catch {
      // silently fail — schedule selector will use default "daily"
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      const data = await rankAPI.addKeyword(newKeyword.trim(), newUrl.trim());
      setKeywords((prev) => [data.tracker, ...prev]);
      setShowAddModal(false);
      setNewKeyword("");
      setNewUrl("");
      toast.success(`Now tracking "${newKeyword}"`);
    } catch (err: any) {
      setAddError(err.message || "Failed to add keyword");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this keyword from tracking?")) return;
    setDeleting(id);
    try {
      await rankAPI.deleteKeyword(id);
      setKeywords((prev) => prev.filter((k) => k._id !== id));
      toast.success("Keyword removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };



  const getChangeIndicator = (change: number) => {
    if (change > 0) return { icon: <TrendingUp size={13} />, text: `+${change}`, cls: "text-success" };
    if (change < 0) return { icon: <TrendingDown size={13} />, text: `${change}`, cls: "text-danger" };
    return { icon: <Minus size={13} />, text: "—", cls: "text-muted-foreground" };
  };

  // Filter + sort
  let processed = [...keywords];

  if (searchQuery) {
    processed = processed.filter(
      (k) =>
        k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDomain(k.targetUrl).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  processed.sort((a: any, b: any) => {
    if (sortBy === "newest") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sortBy === "rank_asc") return (currentPosition(a) || 999) - (currentPosition(b) || 999);
    if (sortBy === "rank_desc") return (currentPosition(b) || 0) - (currentPosition(a) || 0);
    if (sortBy === "change") return positionChange(b) - positionChange(a);
    return 0;
  });

  // Stats for summary bar
  const top10 = keywords.filter((k) => { const p = currentPosition(k); return p !== null && p <= 10; }).length;
  const improved = keywords.filter((k) => positionChange(k) > 0).length;

  useEffect(() => {
    fetchKeywords();
    fetchUserProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
            <Target size={13} />
            Search Engine Position Index
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            Rank Tracker
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Track daily keyword positions on Google · Auto-refreshed on scheduled intervals.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          id="add-keyword-btn"
        >
          <Plus size={15} />
          Track Keyword
        </button>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
        <button
          onClick={() => setActiveTab("rankings")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
            activeTab === "rankings"
              ? "btn-primary font-semibold"
              : "btn-secondary text-text-muted"
          }`}
        >
          <Target size={13} /> Keyword Rankings
        </button>
        <button
          onClick={() => setActiveTab("cannibalization")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
            activeTab === "cannibalization"
              ? "btn-primary font-semibold"
              : "btn-secondary text-text-muted"
          }`}
        >
          <AlertCircle size={13} /> Cannibalization Graph (ML)
        </button>
        <button
          onClick={() => setActiveTab("gsc_quick_wins")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
            activeTab === "gsc_quick_wins"
              ? "btn-primary font-semibold"
              : "btn-secondary text-text-muted"
          }`}
        >
          <TrendingUp size={13} /> GSC Quick Wins (ML)
        </button>
      </div>

      {activeTab === "cannibalization" && (
        <div className="animate-in fade-in duration-200">
          <KeywordCannibalizationGraph />
        </div>
      )}

      {activeTab === "gsc_quick_wins" && (
        <div className="animate-in fade-in duration-200">
          <GSCQuickWinsDetector />
        </div>
      )}

      {activeTab === "rankings" && (
        <>
          {/* ── Schedule Selector ── */}
          <div className="bg-surface border border-border rounded-xl px-5 py-4 mb-4">
            <ScheduleSelector
              current={schedulePreference}
              onChange={(val) => setSchedulePreference(val)}
            />
          </div>

          {/* ── Summary Stats ── */}
          {keywords.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Total Tracked", value: keywords.length, icon: <Target size={14} />, color: "text-text-primary" },
                { label: "In Top 10", value: top10, icon: <BarChart2 size={14} />, color: "text-accent" },
                { label: "Improved", value: improved, icon: <TrendingUp size={14} />, color: "text-emerald-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between">
                  <div className={`flex items-center gap-2 mb-1 text-xs font-mono text-text-muted`}>
                    {stat.icon}
                    <span>{stat.label}</span>
                  </div>
                  <p className={`font-mono text-2xl font-bold tracking-tight ${stat.color} tabular-nums`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters Row ── */}
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="bg-surface border border-border rounded-lg px-3.5 py-2 flex items-center gap-2 flex-1">
              <Search size={14} className="text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords or domains..."
                className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none flex-1 font-sans"
              />
            </div>
            <div className="flex gap-3">
              <div className="bg-surface border border-border rounded-lg px-3.5 py-2 flex items-center gap-2 text-xs">
                <ArrowUpDown size={13} className="text-text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort keywords by"
                  className="bg-transparent text-xs text-text-primary outline-none appearance-none pr-2 cursor-pointer font-mono"
                >
                  <option value="newest" className="bg-surface text-text-primary">Newest First</option>
                  <option value="rank_asc" className="bg-surface text-text-primary">Best Ranked</option>
                  <option value="rank_desc" className="bg-surface text-text-primary">Worst Ranked</option>
                  <option value="change" className="bg-surface text-text-primary">Biggest Gain</option>
                </select>
              </div>
            </div>
          </div>

        {/* ── Keywords List ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : processed.length === 0 && keywords.length === 0 ? (
          /* Empty State */
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <div className="w-12 h-12 rounded-lg bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3 text-accent">
              <Target size={24} />
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-1">No keywords tracked yet</h3>
            <p className="text-xs text-text-muted mb-5 max-w-sm mx-auto font-sans">
              Add your target search terms and domain to monitor Google search positioning and cannibalization.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              Track First Keyword
            </button>
          </div>
        ) : processed.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Filter size={28} className="mx-auto text-text-muted mb-2 opacity-50" />
            <p className="text-xs text-text-muted font-sans">No keywords match your search query.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {processed.map((kw) => {
              const pos = currentPosition(kw);
              const change = positionChange(kw);
              const best = bestPosition(kw);
              const changeInfo = getChangeIndicator(change);
              const domain = getDomain(kw.targetUrl);

              return (
                <div
                  key={kw._id}
                  className="bg-surface border border-border rounded-xl p-4 hover:border-accent/40 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                    {/* Position Badge */}
                    <div className="flex items-center gap-3 lg:w-32 shrink-0">
                      <div className={`w-12 h-12 rounded-lg border border-border bg-surface-raised flex items-center justify-center font-mono text-base font-bold tabular-nums ${pos && pos <= 10 ? 'text-accent' : 'text-text-primary'}`}>
                        {pos !== null ? `#${pos}` : "—"}
                      </div>
                      {pos !== null && (
                        <div>
                          <div className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${changeInfo.cls}`}>
                            {changeInfo.icon}
                            {changeInfo.text}
                          </div>
                          <p className="text-[10px] font-mono text-text-muted">delta</p>
                        </div>
                      )}
                    </div>

                    {/* Keyword + Domain */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/rank/${kw._id}`}
                        className="text-sm font-semibold text-text-primary hover:text-accent transition-colors block truncate"
                      >
                        "{kw.keyword}"
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe size={11} className="text-text-muted" />
                        <span className="text-xs font-mono text-text-muted truncate">{domain}</span>
                      </div>
                      {kw.lastChecked && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-text-muted">
                          <Clock size={10} />
                          {new Date(kw.lastChecked).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Best Rank + History count */}
                    <div className="hidden md:flex items-center gap-6 shrink-0 font-mono text-xs">
                      <div className="text-center">
                        <p className="font-bold text-text-primary tabular-nums">{best !== null ? `#${best}` : "—"}</p>
                        <p className="text-[10px] text-text-muted uppercase">Peak</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-accent tabular-nums">{kw.history.length}</p>
                        <p className="text-[10px] text-text-muted uppercase">Crawls</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to={`/rank/${kw._id}`}
                        className="p-1.5 rounded-lg hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
                        title="View Details"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(kw._id)}
                        disabled={deleting === kw._id}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Remove"
                      >
                        {deleting === kw._id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
      )}

      {/* ── Add Keyword Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-text-primary">Track New Keyword</h2>
                <p className="text-xs text-text-muted mt-0.5 font-sans">We'll check Google and find your position.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setAddError(""); }}
                className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-surface-raised transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {addError && (
              <div className="mb-4 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {addError}
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="modal-keyword" className="block text-xs font-mono font-medium text-text-secondary mb-1">
                  Keyword Target
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    id="modal-keyword"
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder='e.g., "ai code assistant"'
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent transition-colors text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-url" className="block text-xs font-mono font-medium text-text-secondary mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    id="modal-url"
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g., example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-text-primary placeholder-text-muted outline-none focus:border-accent transition-colors text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-raised border border-border text-xs text-text-muted font-sans leading-relaxed">
                We query Google Search for your keyword and locate your domain's exact rank up to position 100 on your chosen schedule.
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-2.5 rounded-lg btn-primary font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {adding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Target size={14} />
                    Start Tracking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}