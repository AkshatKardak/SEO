import { useState } from "react";
import { Sparkles, ArrowUpDown, Cpu } from "lucide-react";

interface OpportunityItem {
  id: string;
  title: string;
  type: string;
  impact: number;
  confidence: number;
  effort: number;
  priority: number;
  mlTrafficLift: string;
  mlCvrLift: string;
  mlSuccessProb: number;
  signals: string[];
}

const SAMPLE_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-1",
    title: "Inject SoftwareApplication & Review JSON-LD Schema",
    type: "TECHNICAL_SEO",
    impact: 9.4,
    confidence: 0.92,
    effort: 2.0,
    priority: 43.2,
    mlTrafficLift: "+12–18%",
    mlCvrLift: "+4–8%",
    mlSuccessProb: 91,
    signals: ["Rich snippet eligibility", "High search demand", "1-click patch"],
  },
  {
    id: "opp-2",
    title: "Build High-Intent Comparison Hub (/vs/top-competitor)",
    type: "CONTENT_GEO",
    impact: 9.1,
    confidence: 0.88,
    effort: 3.5,
    priority: 22.9,
    mlTrafficLift: "+18–26%",
    mlCvrLift: "+14–22%",
    mlSuccessProb: 88,
    signals: ["Bottom-funnel buyer intent", "AI search citation gap", "High LTV intent"],
  },
  {
    id: "opp-3",
    title: "Resolve Canonical Conflicts on Pricing and Feature Subpages",
    type: "TECHNICAL_SEO",
    impact: 8.7,
    confidence: 0.95,
    effort: 1.5,
    priority: 55.1,
    mlTrafficLift: "+8–14%",
    mlCvrLift: "+3–6%",
    mlSuccessProb: 94,
    signals: ["Indexation leak fix", "Zero engineering friction", "High certainty"],
  },
  {
    id: "opp-4",
    title: "Synthesize Entity Knowledge Graph for AI Answer Engines",
    type: "GEO",
    impact: 8.9,
    confidence: 0.84,
    effort: 3.0,
    priority: 24.9,
    mlTrafficLift: "+15–22%",
    mlCvrLift: "+6–10%",
    mlSuccessProb: 84,
    signals: ["AI citation authority", "Brand entity synthesis", "Unranked query capture"],
  },
];

type SortMode = "priority" | "impact" | "confidence" | "effort" | "mlProb";

export default function ICEOpportunitySection() {
  const [sortMode, setSortMode] = useState<SortMode>("priority");

  const sortedOpportunities = [...SAMPLE_OPPORTUNITIES].sort((a, b) => {
    if (sortMode === "priority") return b.priority - a.priority;
    if (sortMode === "impact") return b.impact - a.impact;
    if (sortMode === "confidence") return b.confidence - a.confidence;
    if (sortMode === "effort") return a.effort - b.effort; // lower effort is better
    if (sortMode === "mlProb") return b.mlSuccessProb - a.mlSuccessProb;
    return 0;
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          ICE Opportunity Engine + ML Outcome Scoring
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Stop fixing SEO in random order.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          SerpoAI replaces subjective opinions with mathematical prioritization. Every opportunity is weighted by Impact, Confidence, Effort, and calibrated by historical ML outcomes.
        </p>
      </div>

      {/* ── Formula Teardown Visual ── */}
      <div className="max-w-4xl mx-auto mb-10 p-5 rounded-2xl border border-border bg-card shadow-sm hover-lift cursor-pointer">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-foreground">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-primary" />
            <span className="font-bold text-foreground">MATHEMATICAL ICE FORMULA:</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-elevated px-4 py-2 rounded-xl border border-border">
            <span className="text-primary font-bold">Priority Score</span>
            <span className="text-muted-foreground">=</span>
            <span>(Impact × Confidence ÷ Effort) × 10</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Adjusted for your North Star metric</span>
        </div>
      </div>

      {/* ── Interactive Sorting Controls ── */}
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
          LIVE OPPORTUNITY BACKLOG ({sortedOpportunities.length})
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <span className="text-muted-foreground mr-1 text-[11px] flex items-center gap-1">
            <ArrowUpDown size={12} /> Sort:
          </span>
          {[
            { id: "priority" as SortMode, label: "Highest Priority" },
            { id: "impact" as SortMode, label: "Max Impact" },
            { id: "effort" as SortMode, label: "Lowest Effort" },
            { id: "mlProb" as SortMode, label: "ML Success %" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortMode(s.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                sortMode === s.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Opportunity Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {sortedOpportunities.map((opp) => (
          <div
            key={opp.id}
            className="surface-card p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 hover-lift cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                  {opp.type}
                </span>
                <h3 className="text-sm font-bold text-foreground leading-snug">{opp.title}</h3>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-primary block leading-none">
                  {opp.priority}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">ICE Score</span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-elevated/70 border border-border/70 text-center font-mono text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Impact</span>
                <span className="font-bold text-foreground">{opp.impact}/10</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Confidence</span>
                <span className="font-bold text-foreground">{opp.confidence * 100}%</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Effort</span>
                <span className="font-bold text-foreground">{opp.effort}/10</span>
              </div>
            </div>

            {/* ML Prediction Lift */}
            <div className="p-3 rounded-xl border border-border/80 bg-card space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles size={12} className="text-primary" /> ML Predicted Lift:
                </span>
                <span className="text-primary font-bold text-[11px]">{opp.mlSuccessProb}% Probability</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                <span className="text-foreground">Traffic: <strong className="text-primary">{opp.mlTrafficLift}</strong></span>
                <span className="text-foreground">CVR: <strong className="text-primary">{opp.mlCvrLift}</strong></span>
              </div>
            </div>

            {/* Signal Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {opp.signals.map((sig, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border/40"
                >
                  ✓ {sig}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
