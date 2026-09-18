import confetti from "canvas-confetti";
import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Lightbulb,
  CheckCircle2,
  Play,
  X,
  Search,
  ArrowUpDown,
  Sparkles,
  Bot,
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "ALL",
  "TECHNICAL_SEO",
  "ON_PAGE_SEO",
  "CONTENT",
  "GEO",
  "CONVERSION",
  "COMPETITOR",
  "BACKLINK",
  "EXPERIMENT",
  "RETENTION",
];

export default function Opportunities() {
  const { currentProject } = useProject();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "impact" | "effort">("priority");
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const fetchOpps = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getOpportunities(currentProject._id);
      setOpportunities(res.opportunities || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, [currentProject]);

  const handleExecute = async (opp: any) => {
    setExecutingId(opp._id);
    try {
      await growthAPI.executeOpportunity(opp._id);
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"] }); } catch(e){} 
      toast.success(`${opp.assignedAgent} dispatched successfully!`);
      await fetchOpps();
    } catch (err: any) {
      toast.error(err.message || "Failed to execute opportunity");
    } finally {
      setExecutingId(null);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await growthAPI.dismissOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => o._id !== id));
      toast.success("Opportunity dismissed");
      if (selectedOpp?._id === id) setSelectedOpp(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to dismiss");
    }
  };

  // Filter & Sort
  const filtered = opportunities
    .filter((o) => {
      if (selectedCategory !== "ALL" && o.type !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          o.title.toLowerCase().includes(query) ||
          o.description.toLowerCase().includes(query) ||
          o.assignedAgent.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") return b.priorityScore - a.priorityScore;
      if (sortBy === "impact") return b.impactScore - a.impactScore;
      if (sortBy === "effort") return a.effortScore - b.effortScore;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
            <Sparkles size={13} />
            Prioritized Opportunity Engine
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            Growth Backlog
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Ranked by mathematical ICE formula: (Impact × Confidence) ÷ Effort
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-surface border border-border text-text-primary">
            {filtered.length} Opportunities
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="bg-surface border border-border rounded-lg px-3 py-2 flex items-center gap-2 flex-1 w-full">
          <Search size={14} className="text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities or agents..."
            className="bg-transparent text-xs text-text-primary placeholder-text-muted outline-none w-full font-sans"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="bg-surface border border-border rounded-lg px-3 py-2 flex items-center gap-2 text-xs">
            <ArrowUpDown size={13} className="text-text-muted" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-text-primary outline-none cursor-pointer font-mono"
            >
              <option value="priority" className="bg-surface text-text-primary">Highest Priority (ICE)</option>
              <option value="impact" className="bg-surface text-text-primary">Highest Impact</option>
              <option value="effort" className="bg-surface text-text-primary">Lowest Effort</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono shrink-0 transition-all ${
              selectedCategory === cat
                ? "bg-surface text-text-primary border border-border shadow-xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 h-28 animate-pulse bg-surface-raised/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <Lightbulb size={36} className="mx-auto text-text-muted mb-3 opacity-50" />
          <h3 className="text-sm font-semibold text-text-primary">No matching opportunities found</h3>
          <p className="text-xs text-text-muted mt-1 font-sans">Try resetting your category or search filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((opp) => (
            <div
              key={opp._id}
              className="bg-surface rounded-xl p-5 border border-border hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: ICE Priority badge + Title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-surface-raised border border-border flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-mono font-bold text-accent tabular-nums">{opp.priorityScore}</span>
                    <span className="text-[8px] font-mono text-text-muted uppercase">ICE</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
                        {opp.type}
                      </span>
                      <span className="text-[10px] font-mono text-accent flex items-center gap-1">
                        <Bot size={11} /> {opp.assignedAgent}
                      </span>
                      {opp.requiresApproval && (
                        <span className="text-[10px] font-mono text-amber-500">
                          · Requires Approval
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">{opp.title}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-sans">{opp.description}</p>
                  </div>
                </div>

                {/* Middle: ICE Breakdown */}
                <div className="hidden sm:flex items-center gap-4 shrink-0 px-3.5 py-1.5 bg-surface-raised rounded-lg border border-border text-[10px] font-mono">
                  <div className="text-center">
                    <span className="text-text-muted block text-[9px] uppercase">Impact</span>
                    <span className="font-bold text-text-primary tabular-nums">{opp.impactScore}/10</span>
                  </div>
                  <div className="text-center">
                    <span className="text-text-muted block text-[9px] uppercase">Effort</span>
                    <span className="font-bold text-text-primary tabular-nums">{opp.effortScore}/10</span>
                  </div>
                  <div className="text-center">
                    <span className="text-text-muted block text-[9px] uppercase">Confidence</span>
                    <span className="font-bold text-text-primary tabular-nums">{Math.round(opp.confidenceScore * 100)}%</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs"
                  >
                    View Evidence
                  </button>
                  <button
                    onClick={() => handleExecute(opp)}
                    disabled={executingId === opp._id || opp.status === "executed"}
                    className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    {executingId === opp._id ? (
                      "Dispatching..."
                    ) : opp.status === "executed" ? (
                      "Executed"
                    ) : (
                      <>
                        <Play size={11} fill="currentColor" /> Execute
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Evidence Inspection Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-border bg-surface-raised text-accent">
                  {selectedOpp.type}
                </span>
                <h3 className="text-base font-semibold text-text-primary mt-2">{selectedOpp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed font-sans">{selectedOpp.description}</p>

            <div className="p-3.5 rounded-lg bg-surface-raised border border-border space-y-2">
              <p className="text-xs font-mono font-semibold text-text-primary">Evidence Discovered on Site:</p>
              <ul className="space-y-1.5 text-xs text-text-secondary font-sans">
                {selectedOpp.evidence?.map((ev: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface text-xs font-sans">
              <p className="font-mono text-[10px] text-accent font-semibold uppercase mb-1">Recommended Action</p>
              <p className="text-text-primary">{selectedOpp.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDismiss(selectedOpp._id)}
                className="py-2 px-3 rounded-lg border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => setSelectedOpp(null)}
                className="btn-secondary flex-1 py-2 rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExecute(selectedOpp);
                  setSelectedOpp(null);
                }}
                className="btn-primary flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Play size={11} fill="currentColor" /> Deploy {selectedOpp.assignedAgent}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
