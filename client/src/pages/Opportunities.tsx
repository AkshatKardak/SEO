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
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <Sparkles size={14} />
              Prioritized Opportunity Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Growth Backlog
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked by ICE formula: (Impact × Confidence) ÷ Effort
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground">
              {filtered.length} Opportunities
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
          {/* Search */}
          <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 flex-1 w-full">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities or agents..."
              className="bg-transparent text-xs text-foreground placeholder-muted-foreground outline-none w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
              <ArrowUpDown size={14} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
              >
                <option value="priority" className="bg-card">Highest Priority (ICE)</option>
                <option value="impact" className="bg-card">Highest Impact</option>
                <option value="effort" className="bg-card">Lowest Effort</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "glass text-muted-foreground hover:text-foreground"
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
              <div key={i} className="glass rounded-2xl p-6 h-28 animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Lightbulb size={40} className="mx-auto text-muted-foreground mb-3 opacity-50" />
            <h3 className="text-base font-bold text-foreground">No matching opportunities found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your category or search filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((opp) => (
              <div
                key={opp._id}
                className="glass rounded-xl p-5 hover:border-primary/40 transition-all border border-border/80"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: ICE Priority badge + Title */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-black text-primary">{opp.priorityScore}</span>
                      <span className="text-[8px] font-bold text-muted-foreground uppercase">ICE</span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {opp.type}
                        </span>
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                          <Bot size={12} /> {opp.assignedAgent}
                        </span>
                        {opp.requiresApproval && (
                          <span className="text-[10px] text-amber-500 font-semibold">
                            · Requires Human Approval
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{opp.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{opp.description}</p>
                    </div>
                  </div>

                  {/* Middle: ICE Breakdown */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0 px-4 py-2 bg-card/60 rounded-xl border border-border/40 text-[11px]">
                    <div className="text-center">
                      <span className="text-muted-foreground block text-[10px]">Impact</span>
                      <span className="font-extrabold text-foreground">{opp.impactScore}/10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-muted-foreground block text-[10px]">Effort</span>
                      <span className="font-extrabold text-foreground">{opp.effortScore}/10</span>
                    </div>
                    <div className="text-center">
                      <span className="text-muted-foreground block text-[10px]">Confidence</span>
                      <span className="font-extrabold text-foreground">{Math.round(opp.confidenceScore * 100)}%</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedOpp(opp)}
                      className="px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                    >
                      View Evidence
                    </button>
                    <button
                      onClick={() => handleExecute(opp)}
                      disabled={executingId === opp._id || opp.status === "executed"}
                      className="px-4 py-2 rounded-xl btn-glow text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {executingId === opp._id ? (
                        "Dispatching..."
                      ) : opp.status === "executed" ? (
                        "Executed"
                      ) : (
                        <>
                          <Play size={12} fill="currentColor" /> Execute
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence Inspection Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {selectedOpp.type}
                </span>
                <h3 className="text-base font-bold text-foreground mt-2">{selectedOpp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{selectedOpp.description}</p>

            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-2">
              <p className="text-xs font-bold text-foreground">Evidence Discovered on Site:</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {selectedOpp.evidence?.map((ev: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
              <p className="font-bold text-primary mb-1">Recommended Action:</p>
              <p className="text-foreground">{selectedOpp.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDismiss(selectedOpp._id)}
                className="py-2.5 px-4 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => setSelectedOpp(null)}
                className="flex-1 py-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExecute(selectedOpp);
                  setSelectedOpp(null);
                }}
                className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Play size={12} fill="currentColor" /> Deploy {selectedOpp.assignedAgent}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
