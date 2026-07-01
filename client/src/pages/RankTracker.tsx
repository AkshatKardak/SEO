/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target, Plus, RefreshCw, Trash2, TrendingUp, TrendingDown,
  Minus, ExternalLink, Clock, Loader2, X, Search, Globe,
  AlertCircle, Filter, ArrowUpDown, BarChart2,
} from "lucide-react";
import { rankAPI } from "../services/api";
import toast from "react-hot-toast";

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

  const getPositionBadge = (pos: number | null) => {
    if (pos === null) return { text: "Not Ranked", cls: "text-muted-foreground bg-muted/50 border border-border" };
    if (pos <= 3)  return { text: `#${pos}`, cls: "text-success bg-success/10 border border-success/25" };
    if (pos <= 10) return { text: `#${pos}`, cls: "text-primary bg-primary/10 border border-primary/25" };
    if (pos <= 20) return { text: `#${pos}`, cls: "text-accent bg-accent/10 border border-accent/25" };
    return { text: `#${pos}`, cls: "text-danger bg-danger/10 border border-danger/25" };
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
  const ranked = keywords.filter((k) => currentPosition(k) !== null).length;
  const top10 = keywords.filter((k) => { const p = currentPosition(k); return p !== null && p <= 10; }).length;
  const improved = keywords.filter((k) => positionChange(k) > 0).length;

  useEffect(() => {
    fetchKeywords();
  }, []);

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              <span className="gradient-text">Rank Tracker</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track keyword positions on Google — auto-refreshed daily at 6 AM.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 self-start"
            id="add-keyword-btn"
          >
            <Plus size={18} />
            Track Keyword
          </button>
        </div>

        {/* ── Summary Stats ── */}
        {keywords.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Tracked", value: keywords.length, icon: <Target size={16} />, color: "text-accent" },
              { label: "In Top 10", value: top10, icon: <BarChart2 size={16} />, color: "text-primary" },
              { label: "Improved", value: improved, icon: <TrendingUp size={16} />, color: "text-success" },
            ].map((stat) => (
              <div key={stat.label} className="glass p-4">
                <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
                  {stat.icon}
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filters Row ── */}
        <div className="mb-5 flex flex-col md:flex-row gap-3">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords or domains..."
              className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none flex-1"
            />
          </div>
          <div className="flex gap-3">
            <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <ArrowUpDown size={14} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort keywords by"
                className="bg-transparent text-sm text-foreground outline-none appearance-none pr-2 cursor-pointer"
              >
                <option value="newest" className="bg-card">Newest First</option>
                <option value="rank_asc" className="bg-card">Best Ranked</option>
                <option value="rank_desc" className="bg-card">Worst Ranked</option>
                <option value="change" className="bg-card">Biggest Gain</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Keywords List ── */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : processed.length === 0 && keywords.length === 0 ? (
          /* Empty State */
          <div className="glass rounded-2xl p-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Target size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No keywords tracked yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Add your first keyword and website URL to start monitoring your Google rankings daily.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Track Your First Keyword
            </button>
          </div>
        ) : processed.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <Filter size={32} className="mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground text-sm">No keywords match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processed.map((kw) => {
              const pos = currentPosition(kw);
              const change = positionChange(kw);
              const best = bestPosition(kw);
              const badge = getPositionBadge(pos);
              const changeInfo = getChangeIndicator(change);
              const domain = getDomain(kw.targetUrl);

              return (
                <div
                  key={kw._id}
                  className="glass rounded-xl p-5 hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                    {/* Position Badge */}
                    <div className="flex items-center gap-4 lg:w-36 shrink-0">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold ${badge.cls}`}>
                        {pos !== null ? `#${pos}` : "—"}
                      </div>
                      {pos !== null && (
                        <div className="text-center">
                          <div className={`flex items-center gap-1 text-xs font-semibold ${changeInfo.cls}`}>
                            {changeInfo.icon}
                            {changeInfo.text}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">vs prev</p>
                        </div>
                      )}
                    </div>

                    {/* Keyword + Domain */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/rank/${kw._id}`}
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors block truncate"
                      >
                        "{kw.keyword}"
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe size={12} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">{domain}</span>
                      </div>
                      {kw.lastChecked && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock size={10} />
                          {new Date(kw.lastChecked).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Best Rank + History count */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary">{best !== null ? `#${best}` : "—"}</p>
                        <p className="text-[10px] text-muted-foreground">Best</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-accent">{kw.history.length}</p>
                        <p className="text-[10px] text-muted-foreground">Checks</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/rank/${kw._id}`}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(kw._id)}
                        disabled={deleting === kw._id}
                        className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all disabled:opacity-40"
                        title="Remove"
                      >
                        {deleting === kw._id
                          ? <Loader2 size={16} className="animate-spin" />
                          : <Trash2 size={16} />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Keyword Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Track New Keyword</h2>
                <p className="text-xs text-muted-foreground mt-0.5">We'll check Google and find your position.</p>
              </div>
              <button
  type="button"
  onClick={() => { setShowAddModal(false); setAddError(""); }}
  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
  title="Close"
>
                <X size={20} />
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
                <label htmlFor="modal-keyword" className="block text-sm font-medium text-foreground mb-1.5">
                  Keyword
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="modal-keyword"
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder='e.g., "best seo tools 2026"'
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-url" className="block text-sm font-medium text-foreground mb-1.5">
                  Your Website URL
                </label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="modal-url"
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g., yoursite.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="severity-info rounded-xl p-3 text-xs">
                💡 We'll search Google for your keyword and find your website's position (up to top 100 results). Updated every day at 6 AM.
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full py-3 rounded-xl btn-glow font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Target size={18} />
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