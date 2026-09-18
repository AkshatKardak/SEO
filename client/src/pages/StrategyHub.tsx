import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Compass,
  Target,
  Download,
  ArrowRight,
  CheckCircle2,
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
    { title: "Day 1 – 30", subtitle: "Conversion & High-Intent Assets", tasks: strategy?.roadmapPhases?.days30 || [] },
    { title: "Day 31 – 60", subtitle: "GEO Citation & Entity Authority", tasks: strategy?.roadmapPhases?.days60 || [] },
    { title: "Day 61 – 90", subtitle: "Programmatic Scaling & Retention", tasks: strategy?.roadmapPhases?.days90 || [] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
            <Compass size={13} />
            Strategic Growth Command
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            30-60-90 Day Growth Roadmap
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Goal-driven execution milestones synthesized by the Growth Brain and calibrated via continuous learning.
          </p>
        </div>

        <button
          onClick={handleExportMarkdown}
          disabled={!strategy}
          className="btn-secondary px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
        >
          <Download size={13} /> Export Strategy Plan (.md)
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="bg-surface rounded-xl p-6 h-36 animate-pulse bg-surface-raised/40 border border-border" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-xl p-6 h-72 animate-pulse bg-surface-raised/40 border border-border" />
            ))}
          </div>
        </div>
      ) : !strategy ? (
        <div className="bg-surface rounded-xl p-12 text-center space-y-3 border border-border">
          <Compass size={36} className="mx-auto text-accent mb-2 opacity-60" />
          <h3 className="text-sm font-semibold text-text-primary">No Strategy Roadmap Generated</h3>
          <p className="text-xs text-text-muted font-sans">
            Trigger a Growth Scan from the Dashboard to formulate your strategic roadmap.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* North Star & Executive Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface rounded-xl p-5 border border-border flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-accent mb-2">
                  <span>NORTH STAR METRIC</span>
                  <Target size={15} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{strategy.northStarMetric?.name}</h3>
              </div>

              <div className="p-3 rounded-lg bg-surface-raised border border-border flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block uppercase">Baseline</span>
                  <span className="text-xs font-bold text-text-primary tabular-nums">{strategy.northStarMetric?.currentValue}</span>
                </div>
                <ArrowRight size={14} className="text-accent" />
                <div>
                  <span className="text-[10px] text-text-muted block uppercase">90-Day Target</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{strategy.northStarMetric?.target90Day}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-surface rounded-xl p-5 border border-border space-y-2.5">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                Executive Strategic Directives
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                {strategy.executiveSummary || strategy.strategicSummary || "Directing organic focus toward high-margin transactional search queries while constructing authoritative entity footprints in generative search indexes."}
              </p>

              <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono text-text-muted">Primary Vector:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-accent">
                  AI Overview Citations & Technical Schema
                </span>
              </div>
            </div>
          </div>

          {/* 3-Phase Milestone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phases.map((phase) => (
              <div
                key={phase.title}
                className="bg-surface rounded-xl p-5 border border-border flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="pb-3 border-b border-border">
                    <span className="text-xs font-mono font-bold text-accent block">{phase.title}</span>
                    <h4 className="text-sm font-semibold text-text-primary mt-0.5">{phase.subtitle}</h4>
                  </div>

                  <div className="space-y-2">
                    {phase.tasks.map((task: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-text-secondary leading-relaxed font-sans">{task.task || task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border text-[10px] font-mono text-text-muted flex items-center justify-between">
                  <span>{phase.tasks.length} Milestone Tasks</span>
                  <span className="font-semibold text-text-primary uppercase">Active Phase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
