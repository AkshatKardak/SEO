import { useState } from "react";
import {
  AlertTriangle,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
} from "lucide-react";

interface CannibalizationPair {
  id: string;
  keyword: string;
  searchVolume: number;
  overlapScore: number;
  severity: "high" | "medium" | "low";
  urlA: {
    path: string;
    position: number;
    clicks: number;
    isPrimary: boolean;
  };
  urlB: {
    path: string;
    position: number;
    clicks: number;
  };
  recommendation: "canonical" | "redirect_301" | "differentiate";
  reason: string;
}

const MOCK_PAIRS: CannibalizationPair[] = [
  {
    id: "can-1",
    keyword: "enterprise seo platform",
    searchVolume: 4200,
    overlapScore: 78,
    severity: "high",
    urlA: {
      path: "/product/enterprise-seo",
      position: 6,
      clicks: 840,
      isPrimary: true,
    },
    urlB: {
      path: "/solutions/enterprise",
      position: 9,
      clicks: 310,
    },
    recommendation: "canonical",
    reason: "Both URLs compete for identical transactional intent. Point canonical tag from /solutions/enterprise to primary /product/enterprise-seo to combine link authority.",
  },
  {
    id: "can-2",
    keyword: "geo answer engine optimization",
    searchVolume: 2800,
    overlapScore: 65,
    severity: "medium",
    urlA: {
      path: "/blog/what-is-geo",
      position: 4,
      clicks: 620,
      isPrimary: true,
    },
    urlB: {
      path: "/features/geo-radar",
      position: 8,
      clicks: 210,
    },
    recommendation: "differentiate",
    reason: "Blog post targets informational query while feature page targets commercial query. Rewrite feature page H1 to target 'geo tracking software' to eliminate SERP collision.",
  },
  {
    id: "can-3",
    keyword: "ai rank tracker free",
    searchVolume: 1900,
    overlapScore: 84,
    severity: "high",
    urlA: {
      path: "/free-rank-checker",
      position: 7,
      clicks: 430,
      isPrimary: true,
    },
    urlB: {
      path: "/tools/rank-tracker",
      position: 11,
      clicks: 140,
    },
    recommendation: "redirect_301",
    reason: "/tools/rank-tracker has thin content and splits impressions. Issue a 301 redirect into /free-rank-checker to consolidate top 3 ranking power.",
  },
];

export default function KeywordCannibalizationGraph() {
  const [selectedPair, setSelectedPair] = useState<CannibalizationPair>(MOCK_PAIRS[0]);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);

  const handleApplyFix = (id: string) => {
    if (!appliedFixes.includes(id)) {
      setAppliedFixes([...appliedFixes, id]);
    }
  };

  return (
    <div className="surface-card bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1.5">
            <AlertTriangle size={12} />
            ML Intent Collision Detector
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Automated Keyword Cannibalization Graph
          </h3>
          <p className="text-xs text-muted-foreground">
            Detects multiple pages on your website competing for identical Google search terms and provides 1-click consolidation patches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-foreground font-bold">
            {MOCK_PAIRS.length} Conflicts Found
          </span>
        </div>
      </div>

      {/* Main Grid: Conflict List + Visual Cluster Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conflict Cards */}
        <div className="lg:col-span-5 space-y-3">
          {MOCK_PAIRS.map((pair) => {
            const isSelected = selectedPair.id === pair.id;
            const isFixed = appliedFixes.includes(pair.id);

            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => setSelectedPair(pair)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary/50 bg-primary/5 shadow-sm"
                    : "border-border bg-card/60 hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
                    <Search size={12} className="text-primary" /> {pair.keyword}
                  </span>
                  <div className="flex items-center gap-2">
                    {isFixed ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Resolved
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          pair.severity === "high"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {pair.overlapScore}% Overlap
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[170px] text-foreground font-semibold">{pair.urlA.path}</span>
                    <span className="text-emerald-500">Pos #{pair.urlA.position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[170px]">{pair.urlB.path}</span>
                    <span className="text-amber-500">Pos #{pair.urlB.position}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Interactive Resolution & Graph View */}
        <div className="lg:col-span-7 surface-card p-5 rounded-xl border border-border bg-surface-elevated space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Target Keyword
              </span>
              <span className="text-sm font-bold text-foreground font-mono flex items-center gap-1.5">
                "{selectedPair.keyword}" ({selectedPair.searchVolume.toLocaleString()} searches/mo)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Intent Overlap
              </span>
              <span className="text-sm font-mono font-black text-amber-500">
                {selectedPair.overlapScore}% Semantic Match
              </span>
            </div>
          </div>

          {/* Visual Conflict Node Diagram */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <span className="text-xs font-semibold text-muted-foreground block">Colliding SERP URLs</span>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* URL A (Primary) */}
              <div className="w-full sm:w-1/2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Primary Authority</span>
                  <span className="text-xs font-mono font-black text-emerald-500">Pos #{selectedPair.urlA.position}</span>
                </div>
                <div className="font-mono text-xs text-foreground font-bold truncate">{selectedPair.urlA.path}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{selectedPair.urlA.clicks} estimated monthly clicks</div>
              </div>

              <div className="shrink-0 p-2 rounded-full bg-surface-elevated border border-border text-muted-foreground">
                <GitMerge size={16} className="rotate-90 sm:rotate-0 text-amber-500" />
              </div>

              {/* URL B (Secondary) */}
              <div className="w-full sm:w-1/2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Colliding Secondary</span>
                  <span className="text-xs font-mono font-black text-amber-500">Pos #{selectedPair.urlB.position}</span>
                </div>
                <div className="font-mono text-xs text-foreground font-bold truncate">{selectedPair.urlB.path}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{selectedPair.urlB.clicks} split clicks</div>
              </div>
            </div>
          </div>

          {/* Recommended ML Fix */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                ML Consolidation Strategy: {selectedPair.recommendation.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedPair.reason}
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Status: {appliedFixes.includes(selectedPair.id) ? "Resolved" : "Pending Action"}
            </span>

            <button
              type="button"
              disabled={appliedFixes.includes(selectedPair.id)}
              onClick={() => handleApplyFix(selectedPair.id)}
              className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {appliedFixes.includes(selectedPair.id) ? (
                <>
                  <CheckCircle2 size={13} /> Fix Applied
                </>
              ) : (
                <>
                  Apply {selectedPair.recommendation === "canonical" ? "Canonical Tag" : selectedPair.recommendation === "redirect_301" ? "301 Redirect" : "Title Rewrite"} <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}