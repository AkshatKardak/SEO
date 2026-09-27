import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  GitPullRequest,
  ArrowRight,
  Layers,
  Code2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function GrowthPlatformShowcase() {
  const [activeTab, setActiveTab] = useState<"seo_ice" | "geo_search" | "autonomous_pr">("seo_ice");

  return (
    <section id="platform-showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border select-none">
      {/* ── SECTION HEADER ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-4 mb-14"
      >
        <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
          <Layers size={11} />
          Unified Search Growth Operating System
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-text-primary tracking-tight leading-tight">
          Everything required to grow, <br />
          <span className="italic text-accent">without 10 fragmented dashboards.</span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Traditional workflows require separate tools for site audits, rank tracking, AI search citations, and developer tickets. SerpoAI coordinates discovery, scoring, and Git dispatch in a single closed loop.
        </p>
      </motion.div>

      {/* ── PILLAR TAB SWITCHER ── */}
      <div className="flex justify-center mb-10">
        <div className="p-1 rounded bg-surface border border-border flex flex-wrap items-center justify-center gap-1 max-w-2xl w-full">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("seo_ice")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "seo_ice"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Cpu size={14} className={activeTab === "seo_ice" ? "text-accent" : "text-text-muted"} />
            <span>01. Deterministic ICE Fixes</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("geo_search")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "geo_search"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Sparkles size={14} className={activeTab === "geo_search" ? "text-accent" : "text-text-muted"} />
            <span>02. AI Citations (GEO)</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("autonomous_pr")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "autonomous_pr"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <GitPullRequest size={14} className={activeTab === "autonomous_pr" ? "text-accent" : "text-text-muted"} />
            <span>03. Serpo Bot PR Dispatch</span>
          </motion.button>
        </div>
      </div>

      {/* ── PILLAR CONTENT PANELS ── */}
      <div className="surface-instrument rounded-md border border-border bg-surface p-6 sm:p-9 shadow-xs transition-all overflow-hidden">
        <AnimatePresence mode="wait">
          {/* TAB 1: Smart SEO & ICE Scoring */}
          {activeTab === "seo_ice" && (
            <motion.div
              key="seo_ice"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  Pillar 01 · Mathematical Prioritization
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal leading-snug">
                  Fix what actually drives conversions with verified ICE ranking.
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Stop guessing which SEO issues move needle metrics. SerpoAI calculates an exact ICE score (Impact × Confidence ÷ Effort) for every discovered anomaly, and synthesizes syntactically verified code patches with zero hallucination.
                </p>

                <div className="space-y-2 pt-1 text-xs font-sans text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Mathematical ICE score orders backlog by expected revenue velocity</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Trained ML regressor estimates exact expected traffic and CVR lift</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Automated AST syntax guardian validates TypeScript/JSON-LD diffs</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/opportunities"
                    className="btn-primary h-9 px-4 text-xs font-semibold gap-1.5"
                  >
                    <span>View ICE Opportunities</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="terminal-panel lg:col-span-6 p-4 rounded-xl border border-border text-text-primary space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2.5 text-[10px]">
                  <span className="font-bold text-text-primary flex items-center gap-1.5">
                    <Code2 size={13} className="text-accent" />
                    <span>ICE Scoring Engine</span>
                  </span>
                  <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                    Confidence: 94.2%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-primary font-medium">SoftwareApplication Schema Injection</span>
                      <span className="text-accent font-bold tabular-nums">ICE 9.2</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>Impact: 9.0 · Conf: 0.95 · Effort: 2.0</span>
                      <span className="text-positive">+18–26% Traffic Lift</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-primary font-medium">Core Web Vitals LCP Optimization</span>
                      <span className="text-accent font-bold tabular-nums">ICE 8.6</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>Impact: 8.5 · Conf: 0.90 · Effort: 3.0</span>
                      <span className="text-positive">+12–18% Traffic Lift</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-primary font-medium">Meta Canonical Consolidation</span>
                      <span className="text-accent font-bold tabular-nums">ICE 7.9</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span>Impact: 7.0 · Conf: 0.88 · Effort: 1.5</span>
                      <span className="text-positive">+8–14% Traffic Lift</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-background border border-border text-[10px] text-text-secondary flex items-center justify-between">
                  <span>Engine: Bayesian ICE Calibrator v2.4</span>
                  <span className="text-positive">Status: Calibrated ✓</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Generative Engine Optimization (GEO) */}
          {activeTab === "geo_search" && (
            <motion.div
              key="geo_search"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  Pillar 02 · Generative Engine Optimization
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal leading-snug">
                  Benchmark your brand citations inside Perplexity, ChatGPT & Google AI.
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Search is shifting from ten blue links to direct synthesized answers. SerpoAI continuously queries major LLM search models to track your brand citation share, entity triple accuracy, and competitor quotation frequency.
                </p>

                <div className="space-y-2 pt-1 text-xs font-sans text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Real-time citation probability index across top AI search models</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Knowledge graph entity extraction to eliminate brand hallucination</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Competitor quotation share benchmarking on high-intent buyer prompts</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/geo"
                    className="btn-primary h-9 px-4 text-xs font-semibold gap-1.5"
                  >
                    <span>Inspect GEO Radar</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="terminal-panel lg:col-span-6 p-4 rounded-xl border border-border text-text-primary space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2.5 text-[10px]">
                  <span className="font-bold text-text-primary flex items-center gap-1.5">
                    <Sparkles size={13} className="text-accent" />
                    <span>AI Citation Telemetry</span>
                  </span>
                  <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                    82% Authority Index
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border flex items-center justify-between">
                    <div>
                      <div className="text-text-primary text-xs font-semibold">Perplexity AI</div>
                      <div className="text-text-muted text-[10px]">Top 3 Primary Cited Source</div>
                    </div>
                    <span className="text-positive font-bold tabular-nums text-xs">96% Cited</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border flex items-center justify-between">
                    <div>
                      <div className="text-text-primary text-xs font-semibold">ChatGPT Search</div>
                      <div className="text-text-muted text-[10px]">Quoted in 4/5 summary answers</div>
                    </div>
                    <span className="text-positive font-bold tabular-nums text-xs">88% Quoted</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-muted border border-border flex items-center justify-between">
                    <div>
                      <div className="text-text-primary text-xs font-semibold">Google AI Overviews</div>
                      <div className="text-text-muted text-[10px]">Featured Snippet Anchor Entity</div>
                    </div>
                    <span className="text-accent font-bold tabular-nums text-xs">Primary</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-background border border-border text-[10px] text-text-secondary flex items-center justify-between">
                  <span>Knowledge Graph Entity Triple: Verified</span>
                  <ShieldCheck size={12} className="text-accent" />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Autonomous Actions & Serpo Bot */}
          {activeTab === "autonomous_pr" && (
            <motion.div
              key="autonomous_pr"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                  Pillar 03 · Autonomous Execution
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal leading-snug">
                  From detection to verified GitHub Pull Request in 1 click.
                </h3>
                <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Instead of emailing audit checklists to developers that sit in backlogs for quarters, Serpo Bot dispatches production-grade Pull Requests directly into your GitHub repository with automated syntax validation and zero deployment risk.
                </p>

                <div className="space-y-2 pt-1 text-xs font-sans text-text-secondary">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Serpo Bot branches, commits verified AST patches, and opens GitHub PR</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Keyword Cannibalization Graph surfaces competing URLs fighting for same intent</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>Google Search Console Striking Distance scanner uncovers immediate CTR leaps</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/actions"
                    className="btn-primary h-9 px-4 text-xs font-semibold gap-1.5"
                  >
                    <span>Open Action Center</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <div className="terminal-panel lg:col-span-6 p-4 rounded-xl border border-border text-text-primary space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2.5 text-[10px]">
                  <span className="font-bold text-text-primary flex items-center gap-1.5">
                    <GitPullRequest size={13} className="text-accent" />
                    <span>Serpo Bot Dispatch Terminal</span>
                  </span>
                  <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                    PR #42 Dispatch Ready
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Branch:</span>
                    <code className="text-accent font-bold">serpo/seo-patch-schema</code>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Commit:</span>
                    <span className="text-text-primary font-medium">fix(seo): inject Organization schema</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>AST Safety Score:</span>
                    <span className="text-positive font-bold tabular-nums">99.8% Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>CI Validation:</span>
                    <span className="text-positive font-bold">Passing (3/3)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-accent-soft text-accent border border-accent/20 text-xs font-semibold flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Ready to Merge</span>
                  </span>
                  <span className="text-[10px] text-text-secondary">Human Operator Approved ✓</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}