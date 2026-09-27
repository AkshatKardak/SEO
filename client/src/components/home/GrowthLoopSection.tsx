import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { sectionReveal, staggerContainer } from "./motion";

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
    techEngine: "SERP Radar + CTR Curves",
    icon: BarChart3,
    details: [
      "Tracks daily keyword rankings across mobile, desktop, and local SERPs",
      "Measures generative citation share across Google AI Overviews and answer engines",
      "Calculates revenue delta attributed directly to dispatched search optimizations",
    ],
    output: "Attribution time-series and real-time anomaly detection alerts",
    sampleLog: "serp::measure detected +4 positions for 8 primary keywords · +1,240 clicks/mo",
    metricLabel: "Attributed ROI Tracking",
    metricValue: "Closed-Loop",
  },
  {
    id: "repeat",
    step: "06",
    title: "REPEAT",
    subtitle: "Persistent Knowledge Graph Memory & Continuous Reinforcement",
    techEngine: "Growth Memory + RLHF",
    icon: Repeat,
    details: [
      "Stores every deployed patch, ranking movement, and algorithm update into institutional memory",
      "Calibrates future ICE scoring models using empirical historical success rates",
      "Powers autonomous continuous optimization loops that get smarter with every deployment",
    ],
    output: "Self-improving growth weights and continuous compound search visibility",
    sampleLog: "memory::record updated model weights (+2.4% confidence calibration on schema fixes)",
    metricLabel: "Autonomous Compounding",
    metricValue: "Continuous",
  },
];

export default function GrowthLoopSection() {
  const [selectedStage, setSelectedStage] = useState<Stage>(STAGES[0]);

  const Icon = selectedStage.icon;

  return (
    <section id="growth-loop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* ── Section Header ── */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="max-w-3xl mx-auto text-center space-y-4 mb-14"
      >
        <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
          Autonomous Operating Architecture
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[38px] font-normal text-text-primary tracking-tight leading-tight">
          SEO should be a <span className="italic text-accent">growth loop</span>, not a checklist.
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Information flows continuously through 6 deterministic intelligence stages, turning raw search signals into verified business revenue and compounding velocity.
        </p>
      </motion.div>

      {/* ── 6 Stages Pipeline Selector Grid ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8"
      >
        {STAGES.map((s) => {
          const isSelected = selectedStage.id === s.id;
          const StageIcon = s.icon;
          return (
            <motion.button
              key={s.id}
              type="button"
              variants={sectionReveal}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Active Stage Interactive Viewer ── */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="surface-instrument rounded-md border border-border bg-surface p-6 sm:p-8 shadow-xs"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
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

            {/* Stage Telemetry Preview Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="terminal-panel p-4 rounded-xl border border-border text-text-primary space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-text-muted pb-2 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <Terminal size={12} className="text-accent" />
                    <span>ENGINE TELEMETRY LOG</span>
                  </span>
                  <span className="text-accent text-[10px]">STAGE {selectedStage.step} ACTIVE</span>
                </div>

                <div className="text-[11px] text-positive leading-relaxed">
                  $ {selectedStage.sampleLog}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">{selectedStage.metricLabel}</span>
                  <span className="text-accent font-bold tabular-nums">
                    {selectedStage.metricValue}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-surface-muted border border-border flex items-center justify-between text-xs text-text-secondary font-sans">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <CheckCircle2 size={13} className="text-positive" />
                  Deterministic Engine Pipeline
                </span>
                <span className="font-mono text-[10px] text-text-muted uppercase">
                  Continuous Telemetry
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
