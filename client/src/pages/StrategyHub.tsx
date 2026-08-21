import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Compass,
  Target,
  Download,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function StrategyHub() {
  const { currentProject } = useProject();
  const [strategy, setStrategy] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStrategy = async () => {
    if (!currentProject) return;
    try {
      setLoading(true);
      const res = await growthAPI.getStrategy(currentProject._id);
      setStrategy(res.strategy || null);
    } catch (err: any) {
      toast.error(err.message || "Failed to load strategy roadmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, [currentProject]);

  const handleExportMarkdown = () => {
    if (!strategy) return;
    const content = `# Growth Strategy Plan - ${currentProject?.domain}
**North Star Metric:** ${strategy.northStarMetric?.name} (${strategy.northStarMetric?.currentValue} → Target: ${strategy.northStarMetric?.target90Day})

## Executive Summary
${strategy.executiveSummary}

## 30-Day Plan (Conversion & Quick Wins)
${(strategy.roadmapPhases?.days30 || []).map((t: any) => `- [ ] ${t.task} (Owner: ${t.ownerAgent}) -> Expected: ${t.expectedImpact}`).join("\n")}

## 60-Day Plan (Authority & GEO Scaling)
${(strategy.roadmapPhases?.days60 || []).map((t: any) => `- [ ] ${t.task} (Owner: ${t.ownerAgent}) -> Expected: ${t.expectedImpact}`).join("\n")}

## 90-Day Plan (Programmatic Growth & Retention)
${(strategy.roadmapPhases?.days90 || []).map((t: any) => `- [ ] ${t.task} (Owner: ${t.ownerAgent}) -> Expected: ${t.expectedImpact}`).join("\n")}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `growth-strategy-${currentProject?.domain || "plan"}.md`;
    a.click();
    toast.success("Strategy markdown plan downloaded!");
  };

  const phases = [
    { title: "Day 1 – 30", subtitle: "Conversion & High-Intent Assets", tasks: strategy?.roadmapPhases?.days30 || [], color: "border-primary/30" },
    { title: "Day 31 – 60", subtitle: "GEO Citation & Entity Authority", tasks: strategy?.roadmapPhases?.days60 || [], color: "border-accent/30" },
    { title: "Day 61 – 90", subtitle: "Programmatic Scaling & Retention", tasks: strategy?.roadmapPhases?.days90 || [], color: "border-success/30" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
              <Compass size={14} />
              Strategic Growth Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              30-60-90 Day Growth Roadmap
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Goal-driven execution milestones synthesized by the Growth Brain and updated via continuous learning.
            </p>
          </div>

          <button
            onClick={handleExportMarkdown}
            disabled={!strategy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-glow text-xs font-bold transition-all self-start disabled:opacity-50"
          >
            <Download size={14} /> Export Strategy Plan (.md)
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 h-36 animate-pulse bg-muted/40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl p-6 h-72 animate-pulse bg-muted/40" />
              ))}
            </div>
          </div>
        ) : !strategy ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3">
            <Compass size={40} className="mx-auto text-primary mb-2 opacity-60" />
            <h3 className="text-base font-bold text-foreground">No Strategy Roadmap Generated</h3>
            <p className="text-xs text-muted-foreground">
              Re-analyze your website from the Dashboard to formulate your strategic growth plan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* North Star & Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 border border-primary/30 flex flex-col justify-between space-y-4 bg-gradient-to-br from-card to-primary/5">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-primary mb-2">
                    <span>NORTH STAR METRIC</span>
                    <Target size={18} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{strategy.northStarMetric?.name}</h3>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Current Baseline</span>
                    <span className="text-sm font-bold text-foreground font-mono">{strategy.northStarMetric?.currentValue}</span>
                  </div>
                  <ArrowRight size={16} className="text-primary" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">90-Day Target</span>
                    <span className="text-sm font-extrabold text-success font-mono">{strategy.northStarMetric?.target90Day}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 glass rounded-2xl p-6 border border-border space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Executive Strategic Directives
                </h3>
                <p className="text-xs text-foreground leading-relaxed">{strategy.executiveSummary}</p>

                {strategy.strategicThemes?.length > 0 && (
                  <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {strategy.strategicThemes.map((theme: any, i: number) => (
                      <div key={i} className="p-2.5 rounded-xl bg-card/60 border border-border/60 text-[11px] space-y-0.5">
                        <span className="font-bold text-primary block">{theme.name}</span>
                        <p className="text-muted-foreground text-[10px]">{theme.objective}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 30-60-90 Day 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {phases.map((phase, idx) => (
                <div
                  key={idx}
                  className={`glass rounded-2xl p-5 border ${phase.color} flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-3">
                    <div className="pb-3 border-b border-border/60">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        {phase.title}
                      </span>
                      <h3 className="text-sm font-bold text-foreground mt-2">{phase.subtitle}</h3>
                    </div>

                    <div className="space-y-3">
                      {phase.tasks.map((t: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-card/70 border border-border/70 text-xs space-y-2">
                          <p className="font-semibold text-foreground">{t.task}</p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                            <span className="font-bold text-primary">{t.ownerAgent}</span>
                            <span className="text-success font-semibold">{t.expectedImpact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
                    <span>{phase.tasks.length} Milestone Tasks</span>
                    <span className="font-semibold text-foreground">Active Phase</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
