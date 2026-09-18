import { useState } from "react";
import {
  Compass,
  Target,
  FileCode2,
  GitPullRequest,
  BarChart3,
  Repeat,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface Stage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  techEngine: string;
  icon: typeof Compass;
  details: string[];
  output: string;
  sampleLog: string;
  metricLabel: string;
  metricValue: string;
}

const STAGES: Stage[] = [
  {
    id: "discover",
    step: "01",
    title: "DISCOVER",
    subtitle: "Continuous Full-Spectrum Crawl & Knowledge Graph Synthesis",
    techEngine: "Crawler + Entity Graph",
    icon: Compass,
    details: [
      "Audits 60+ technical DOM hygiene vectors, schema structures, and Core Web Vitals",
      "Extracts structured entity triples to benchmark brand presence against search knowledge graphs",
      "Scans competitor citation footprint across Google AI Overviews, ChatGPT, and Perplexity",
    ],
    output: "Clean entity model and raw opportunity vector database",
    sampleLog: "crawl::ingest completed 148 pages · 0 SSRF violations · 3,420 DOM nodes mapped",
    metricLabel: "Telemetry Crawl Coverage",
    metricValue: "100% DOM",
  },
  {
    id: "prioritize",
    step: "02",
    title: "PRIORITIZE",
    subtitle: "Mathematical ICE Scoring + ML Outcome Regression",
    techEngine: "ICE Engine + Scikit Regressor",
    icon: Target,
    details: [
      "Computes deterministic (Impact × Confidence ÷ Effort) tailored to your primary business objective",
      "Scikit-learn ensemble model predicts expected traffic and conversion lift per keyword cluster",
      "Applies Bayesian shrinkage to cold-start ranking signals to eliminate arbitrary checklist noise",
    ],
    output: "Rank-ordered high-ROI backlog with automated risk categorization",
    sampleLog: "ice::rank calculated 34 opportunities · Top candidate: ICE 8.9 (Confidence 94%)",
    metricLabel: "Prediction Accuracy",
    metricValue: "94.2% ML Fit",
  },
  {
    id: "synthesize",
    step: "03",
    title: "SYNTHESIZE",
    subtitle: "Deterministic AST Patches & Schema Generators",
    techEngine: "AST Diff Engine + Schema Synthesizer",
    icon: FileCode2,
    details: [
      "Generates syntactically verified JSON-LD schemas (SoftwareApp, FAQ, Organization, Breadcrumb)",
      "Resolves cannibalization clashes with deterministic canonical tags and 301 redirect trees",
      "Validates all code diffs through AST parsers before presenting to the operator",
    ],
    output: "Syntactically verified code diffs with DOM validation checks",
    sampleLog: "ast::synthesize generated 4 patches · schema/SoftwareApplication · 0 lint errors",
    metricLabel: "Syntax Safety Score",
    metricValue: "99.8% AST Safe",
  },
  {
    id: "execute",
    step: "04",
    title: "EXECUTE",
    subtitle: "Serpo Bot 1-Click GitHub PR Dispatcher",
    techEngine: "Serpo Bot + GitHub Webhooks",
    icon: GitPullRequest,
    details: [
      "Connects to GitHub repositories with 1-click OAuth integration (public or private repos)",
      "Dispatches isolated feature branches, commits verified diffs, and opens reviewable Pull Requests",
      "Strict Human-in-the-Loop safeguard: zero code touches production without explicit approval",
    ],
    output: "Reviewable GitHub Pull Requests with automated validation checks",
    sampleLog: "git::dispatch opened PR #42 (serpo/seo-patch-schema) · checks passed",
    metricLabel: "Deployment Latency",
    metricValue: "< 60 seconds",
  },
  {
    id: "measure",
    step: "05",
    title: "MEASURE",
    subtitle: "Closed-Loop Search Attribution & SERP Radar",
    techEngine: "Growth Graph + GSC OAuth",
    icon: BarChart3,
    details: [
      "Ingests Google Search Console CTR curves and actual average ranking positions via official API",
      "Maps end-to-end outcome chain: Impressions → Clicks → Signups → Attributed Revenue",
      "Anomaly Radar flags unexpected algorithmic fluctuations and pinpoints contributing factors",
    ],
    output: "Multi-touch search attribution and verified metric deltas",
    sampleLog: "telemetry::radar ingested 2,400 query curves · +18.4% CTR delta post-patch",
    metricLabel: "Attribution Fidelity",
    metricValue: "Full-Funnel MRR",
  },
  {
    id: "repeat",
    step: "06",
    title: "REPEAT",
    subtitle: "Persistent Growth Memory & Compounding Moat",
    techEngine: "Growth Memory + Adaptive Prior",
    icon: Repeat,
    details: [
      "Persists verified causal findings from every executed experiment and code deployment",
      "Feeds domain-specific outcomes back into the ML feature store to sharpen future scoring",
      "Compounds search authority and AI citation dominance cycle after cycle",
    ],
    output: "Permanent organizational search intelligence and refined priors",
    sampleLog: "memory::store updated 12 experiment priors · continuous feedback active",
    metricLabel: "Compounding Growth",
    metricValue: "Self-Reinforcing",
  },
];

export default function GrowthLoopSection() {
  const [selectedStage, setSelectedStage] = useState<Stage>(STAGES[0]);

  const Icon = selectedStage.icon;

  return (
    <section id="growth-loop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* ── Section Header ── */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
          Autonomous Operating Architecture
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[38px] font-normal text-text-primary tracking-tight leading-tight">
          SEO should be a <span className="italic text-accent">growth loop</span>, not a checklist.
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Information flows continuously through 6 deterministic intelligence stages, turning raw search signals into verified business revenue and compounding velocity.
        </p>
      </div>

      {/* ── 6 Stages Pipeline Selector Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {STAGES.map((s) => {
          const isSelected = selectedStage.id === s.id;
          const StageIcon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStage(s)}
              className={`p-3.5 rounded border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-surface border-accent shadow-xs ring-1 ring-accent/30"
                  : "bg-surface-muted/60 border-border hover:border-border-strong hover:bg-surface"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className={`font-bold ${isSelected ? "text-accent" : "text-text-muted"}`}>
                  {s.step}
                </span>
                <StageIcon size={13} className={isSelected ? "text-accent" : "text-text-muted"} />
              </div>
              <div className="text-[11px] font-mono font-bold text-text-primary tracking-wider mb-0.5">
                {s.title}
              </div>
              <div className="text-[10px] font-mono text-text-muted truncate">
                {s.techEngine}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Stage Interactive Viewer ── */}
      <div className="surface-instrument rounded-md border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Stage Details Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-accent-soft text-accent border border-accent/20 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  STAGE {selectedStage.step} OF 06 · {selectedStage.techEngine}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-text-primary font-normal leading-snug">
                  {selectedStage.subtitle}
                </h3>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {selectedStage.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-text-primary font-sans">
                  <span className="text-accent font-mono font-bold mt-0.5 text-[11px] tabular-nums shrink-0">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed text-text-secondary">{detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-text-muted">
                PRIMARY ARTIFACT:
              </span>
              <span className="font-mono text-xs font-semibold text-accent">
                {selectedStage.output}
              </span>
            </div>
          </div>

          {/* Telemetry Console Column */}
          <div className="lg:col-span-5 p-4 rounded border border-border bg-[#10151B] text-[#E8EDF2] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-white/50 border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <Terminal size={12} className="text-accent" />
                <span>TELEMETRY STAGE {selectedStage.step}</span>
              </div>
              <span className="text-accent font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
                ONLINE
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-white/40">Subsystem:</span>
                <span className="text-white/90 font-medium">{selectedStage.techEngine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">{selectedStage.metricLabel}:</span>
                <span className="text-accent font-bold tabular-nums">{selectedStage.metricValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Oversight Model:</span>
                <span className="text-white/90">Autonomous + Human-in-the-Loop</span>
              </div>
            </div>

            <div className="pt-1">
              <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[10px] text-white/70 space-y-1">
                <div className="text-white/40 text-[9px] uppercase tracking-wider">Console Output:</div>
                <div className="text-accent font-mono break-all">$ {selectedStage.sampleLog}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-white/40 pt-0.5">
              <CheckCircle2 size={11} className="text-accent shrink-0" />
              <span>Closed-loop memory writes feed into Stage 0{selectedStage.step === "06" ? "01" : `0${Number(selectedStage.step) + 1}`.slice(-2)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
