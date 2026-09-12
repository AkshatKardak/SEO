import { useState } from "react";
import {
  Compass,
  Target,
  FileCode2,
  BarChart3,
  Brain,
  RefreshCw,
} from "lucide-react";

interface Stage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  techEngine: string;
  icon: React.ReactNode;
  details: string[];
  output: string;
}

const STAGES: Stage[] = [
  {
    id: "discover",
    step: "01",
    title: "DISCOVER",
    subtitle: "Full-Spectrum Crawl & Knowledge Graph Synthesis",
    techEngine: "Crawler + Knowledge Graph",
    icon: <Compass size={20} className="text-primary" />,
    details: [
      "Crawls 60+ technical DOM hygiene vectors and schema structures",
      "Synthesizes company knowledge graph, audience personas, and value props",
      "Discovers competitor citation presence across AI answer engines",
    ],
    output: "Clean entity model and raw opportunity vector database",
  },
  {
    id: "prioritize",
    step: "02",
    title: "PRIORITIZE",
    subtitle: "Mathematical ICE Scoring + ML Outcome Prediction",
    techEngine: "ICE Engine + ML Predictor",
    icon: <Target size={20} className="text-primary" />,
    details: [
      "Calculates (Impact × Confidence ÷ Effort) tailored to your specific business goal",
      "Ensemble ML model estimates expected traffic and conversion lift ranges",
      "Weights cold-start signals with Bayesian priors to eliminate noise",
    ],
    output: "Sorted high-ROI execution backlog with risk classification",
  },
  {
    id: "execute",
    step: "03",
    title: "EXECUTE",
    subtitle: "Autonomous AI Agents + Human-in-the-Loop Action Center",
    techEngine: "AI Agents + Action Center",
    icon: <FileCode2 size={20} className="text-primary" />,
    details: [
      "5 specialized agents generate verified code diffs, JSON-LD schemas, and briefs",
      "Low-risk hygiene tasks deploy in 1-click with immediate DOM verification",
      "High-risk structural changes require explicit human approval",
    ],
    output: "Ready-to-deploy code diffs and publishable high-intent briefs",
  },
  {
    id: "measure",
    step: "04",
    title: "MEASURE",
    subtitle: "Closed-Loop Attribution & Growth Graph Tracking",
    techEngine: "Analytics + Growth Graph",
    icon: <BarChart3 size={20} className="text-primary" />,
    details: [
      "Tracks end-to-end outcome chain: Impressions → Clicks → Signups → MRR",
      "Monitors daily keyword positions and Google AI Overview citations",
      "SEO Anomaly Radar flags unusual shifts and surfaces contributing signals",
    ],
    output: "Multi-touch search attribution and verified metric deltas",
  },
  {
    id: "learn",
    step: "05",
    title: "LEARN",
    subtitle: "Persistent Growth Memory & Knowledge Extraction",
    techEngine: "Experiments + Growth Memory",
    icon: <Brain size={20} className="text-primary" />,
    details: [
      "Stores verified learnings from every executed experiment and code patch",
      "Feeds domain-specific outcomes back into the ML feature store",
      "Permanently eliminates repeating unproven or low-impact strategies",
    ],
    output: "Permanent organizational intelligence and refined priors",
  },
  {
    id: "repeat",
    step: "06",
    title: "REPEAT",
    subtitle: "Continuous Compounding Search Velocity",
    techEngine: "Autonomous Growth Loop",
    icon: <RefreshCw size={20} className="text-primary" />,
    details: [
      "Automatically triggers fresh discovery runs based on learned signals",
      "Continuously recalibrates priority scores as market conditions change",
      "Compounds organic traffic and AI citation authority quarter-over-quarter",
    ],
    output: "Unstoppable, compounding organic growth engine",
  },
];

export default function GrowthLoopSection() {
  const [selectedStage, setSelectedStage] = useState<Stage>(STAGES[0]);

  return (
    <section id="growth-loop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <div className="badge-subtle font-mono text-xs">
          The SerpoAI Operating Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          SEO should be a growth loop, not a checklist.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Information flows continuously through 6 interconnected intelligence stages, turning raw search signals into verified business revenue.
        </p>
      </div>

      {/* ── 6 Stages Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {STAGES.map((s) => {
          const isSelected = selectedStage.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover-lift ${
                isSelected
                  ? "bg-card border-primary shadow-md ring-1 ring-primary/40"
                  : "bg-surface-elevated border-border hover:border-primary/50 hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-muted-foreground">{s.step}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </div>
              <div className="text-xs font-extrabold text-foreground tracking-wider mb-1">{s.title}</div>
              <div className="text-[11px] font-mono text-muted-foreground truncate">{s.techEngine}</div>
            </button>
          );
        })}
      </div>

      {/* ── Active Stage Interactive Viewer ── */}
      <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                {selectedStage.icon}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-primary block">STAGE {selectedStage.step} OF 06</span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{selectedStage.subtitle}</h3>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {selectedStage.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-foreground font-medium">
                  <span className="text-primary font-bold mt-0.5 font-mono">0{idx + 1}.</span>
                  <span className="leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-muted-foreground uppercase text-[11px]">Primary Output:</span>
              <span className="font-semibold text-primary">{selectedStage.output}</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl border border-border bg-surface-elevated space-y-3 font-mono text-xs hover-lift">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border pb-2">
              <span>ACTIVE SYSTEM PIPELINE</span>
              <span className="text-primary font-bold">STATE: NOMINAL</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Core Subsystem:</span>
                <span className="text-foreground font-semibold">{selectedStage.techEngine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Execution Model:</span>
                <span className="text-foreground font-semibold">Autonomous + Human Oversight</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Learning Feedback:</span>
                <span className="text-primary font-semibold">Closed-Loop Memory</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-lg bg-card border border-border text-[11px] text-foreground leading-relaxed">
                <span className="text-primary font-bold">SerpoAI Engine: </span>
                Every action in {selectedStage.title} feeds directly into subsequent stages, creating a self-reinforcing compound growth moat.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
