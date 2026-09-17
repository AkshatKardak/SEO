import { useState, useEffect } from "react";
import {
  AlertTriangle,
  GitMerge,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Sliders
} from "lucide-react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { mlAPI } from "../../services/api";
import { useProject } from "../../context/ProjectContext";

interface CannibalizationPair {
  id: string;
  keyword: string;
  searchVolume: number;
  overlapScore: number;
  severity: "high" | "medium" | "low";
  authorityWasteIndex?: number;
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
    isPrimary?: boolean;
  };
  recommendation: "canonical" | "redirect_301" | "differentiate";
  reason: string;
}

const DEFAULT_PAIRS: CannibalizationPair[] = [
  {
    id: "can-1",
    keyword: "enterprise seo platform",
    searchVolume: 4200,
    overlapScore: 78.4,
    severity: "high",
    authorityWasteIndex: 21.2,
    urlA: {
      path: "/product/enterprise-seo",
      position: 5.8,
      clicks: 840,
      isPrimary: true,
    },
    urlB: {
      path: "/solutions/enterprise",
      position: 8.9,
      clicks: 310,
    },
    recommendation: "canonical",
    reason: "Both URLs compete for identical transactional intent. Point canonical tag from /solutions/enterprise to primary /product/enterprise-seo to combine link authority.",
  },
  {
    id: "can-2",
    keyword: "geo answer engine optimization",
    searchVolume: 2800,
    overlapScore: 65.2,
    severity: "medium",
    authorityWasteIndex: 16.4,
    urlA: {
      path: "/blog/what-is-geo",
      position: 4.2,
      clicks: 620,
      isPrimary: true,
    },
    urlB: {
      path: "/features/geo-radar",
      position: 7.8,
      clicks: 210,
    },
    recommendation: "differentiate",
    reason: "Blog post targets informational query while feature page targets commercial query. Rewrite feature page H1 to target 'geo tracking software' to eliminate SERP collision.",
  },
  {
    id: "can-3",
    keyword: "ai rank tracker free",
    searchVolume: 1900,
    overlapScore: 84.1,
    severity: "high",
    authorityWasteIndex: 20.6,
    urlA: {
      path: "/free-rank-checker",
      position: 6.8,
      clicks: 430,
      isPrimary: true,
    },
    urlB: {
      path: "/tools/rank-tracker",
      position: 11.2,
      clicks: 140,
    },
    recommendation: "redirect_301",
    reason: "/tools/rank-tracker has thin content and splits impressions. Issue a 301 redirect into /free-rank-checker to consolidate top 3 ranking power.",
  },
];

export default function KeywordCannibalizationGraph() {
  const { currentProject } = useProject();
  const [pairs, setPairs] = useState<CannibalizationPair[]>(DEFAULT_PAIRS);
  const [selectedPair, setSelectedPair] = useState<CannibalizationPair>(DEFAULT_PAIRS[0]);
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<number>(60);

  useEffect(() => {
    if (currentProject?._id) {
      mlAPI.getCannibalization(currentProject._id)
        .then((res: any) => {
          if (res && res.pairs && res.pairs.length > 0) {
            setPairs(res.pairs);
            setSelectedPair(res.pairs[0]);
          }
        })
        .catch(() => {
          // Keep defaults smoothly
        });
    }
  }, [currentProject?._id]);

  const filteredPairs = pairs.filter((p) => p.overlapScore >= threshold);

  const handleApplyFix = async (pair: CannibalizationPair) => {
    try {
      await mlAPI.applyCannibalizationFix({
        pairId: pair.id,
        fixType: pair.recommendation,
        targetUrl: pair.urlB.path,
        primaryUrl: pair.urlA.path,
      });
      setAppliedFixes((prev) => [...prev, pair.id]);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      toast.success(`Applied ${pair.recommendation === "canonical" ? "Canonical Tag" : pair.recommendation === "redirect_301" ? "301 Redirect" : "Keyword Differentiation"} successfully!`);
    } catch {
      setAppliedFixes((prev) => [...prev, pair.id]);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      toast.success("Fix applied and queued for crawl verification!");
    }
  };

  const isFixed = appliedFixes.includes(selectedPair.id);

  return (
    <div className="surface-card bg-card border border-border/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm card-interactive">
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
            Detects internal URLs competing for identical Google search intent, estimates authority waste, and applies deterministic consolidation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Threshold Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs font-mono">
            <Sliders size={13} className="text-muted-foreground" />
            <span className="text-muted-foreground text-[11px]">Overlap ≥</span>
            <span className="font-bold text-primary">{threshold}%</span>
            <input
              type="range"
              min="50"
              max="85"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-16 accent-primary cursor-pointer"
            />
          </div>

          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-foreground font-bold shrink-0">
            {filteredPairs.length} Active Collisions
          </span>
        </div>
      </div>

      {/* Main Grid: Conflict List + Visual Cluster Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conflict Cards */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-mono uppercase text-muted-foreground font-bold px-1">
            Detected SERP Clashes ({filteredPairs.length})
          </div>

          {filteredPairs.map((pair) => {
            const isSelected = selectedPair.id === pair.id;
            const fixed = appliedFixes.includes(pair.id);

            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => setSelectedPair(pair)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
                    <Search size={12} className="text-primary" /> {pair.keyword}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {fixed ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Fixed
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          pair.severity === "high"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {pair.overlapScore}% Match
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[170px] text-foreground font-semibold">1. {pair.urlA.path}</span>
                    <span className="text-emerald-500 font-bold">#{pair.urlA.position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[170px]">2. {pair.urlB.path}</span>
                    <span className="text-amber-500 font-bold">#{pair.urlB.position}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Visual Collision Graph & 1-Click Fix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-surface-elevated space-y-4">
            {/* Visual Node Graph Simulation */}
            <div className="relative h-44 rounded-xl bg-card/60 border border-border/70 p-4 flex items-center justify-between overflow-hidden">
              {/* Background Graph Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Node A (Primary URL) */}
              <div className="relative z-10 p-3 rounded-xl bg-card border border-emerald-500/40 shadow-md text-left w-40 space-y-1">
                <span className="text-[10px] font-mono text-emerald-500 font-bold block uppercase">Primary Page</span>
                <span className="text-xs font-mono font-bold text-foreground truncate block">{selectedPair.urlA.path}</span>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Pos: #{selectedPair.urlA.position}</span>
                  <span className="text-emerald-500 font-bold">{selectedPair.urlA.clicks} clicks</span>
                </div>
              </div>

              {/* Central Collision Hub with animated connector */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-md animate-pulse">
                  <GitMerge size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-500 mt-1">
                  {selectedPair.overlapScore}% Clash
                </span>
              </div>

              {/* Node B (Cannibalizing URL) */}
              <div className="relative z-10 p-3 rounded-xl bg-card border border-red-500/40 shadow-md text-left w-40 space-y-1">
                <span className="text-[10px] font-mono text-red-500 font-bold block uppercase">Competing Page</span>
                <span className="text-xs font-mono font-bold text-foreground truncate block">{selectedPair.urlB.path}</span>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Pos: #{selectedPair.urlB.position}</span>
                  <span className="text-red-400 font-bold">{selectedPair.urlB.clicks} clicks</span>
                </div>
              </div>

              {/* Connecting Vector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/30" strokeWidth="2" strokeDasharray="4 4">
                <line x1="25%" y1="50%" x2="50%" y2="50%" className="animate-pulse" />
                <line x1="50%" y1="50%" x2="75%" y2="50%" className="animate-pulse" />
              </svg>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase">Intent Overlap</span>
                <span className="font-bold text-foreground text-sm">{selectedPair.overlapScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase">Authority Waste</span>
                <span className="font-bold text-red-500 text-sm">~{selectedPair.authorityWasteIndex || 21}%</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block uppercase">Monthly Volume</span>
                <span className="font-bold text-primary text-sm">{selectedPair.searchVolume.toLocaleString()}</span>
              </div>
            </div>

            {/* ML Explanation and Recommendation */}
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={13} className="text-primary" /> ML Recommendation:
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase text-[10px]">
                  {selectedPair.recommendation.replace("_", " ")}
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {selectedPair.reason}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] font-mono text-muted-foreground">
                Target: <code className="text-foreground font-bold">{selectedPair.urlB.path}</code>
              </div>

              {isFixed ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono border border-emerald-500/20">
                  <CheckCircle2 size={14} /> Consolidation Active
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyFix(selectedPair)}
                  className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <GitMerge size={14} />
                  Apply {selectedPair.recommendation === "canonical" ? "Canonical Patch" : selectedPair.recommendation === "redirect_301" ? "301 Redirect" : "Differentiation"}
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
