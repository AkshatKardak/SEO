import { useState } from "react";
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
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
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
      </div>

      {/* ── PILLAR TAB SWITCHER ── */}
      <div className="flex justify-center mb-10">
        <div className="p-1 rounded bg-surface border border-border flex flex-wrap items-center justify-center gap-1 max-w-2xl w-full">
          <button
            type="button"
            onClick={() => setActiveTab("seo_ice")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "seo_ice"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Cpu size={14} className={activeTab === "seo_ice" ? "text-accent" : "text-text-muted"} />
            <span>01. Deterministic ICE Fixes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("geo_search")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "geo_search"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <Sparkles size={14} className={activeTab === "geo_search" ? "text-accent" : "text-text-muted"} />
            <span>02. AI Citations (GEO)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("autonomous_pr")}
            className={`flex-1 min-w-[170px] py-2 px-3.5 rounded text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "autonomous_pr"
                ? "bg-surface-muted text-text-primary border border-border-strong shadow-2xs font-semibold"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <GitPullRequest size={14} className={activeTab === "autonomous_pr" ? "text-accent" : "text-text-muted"} />
            <span>03. Serpo Bot PR Dispatch</span>
          </button>
        </div>
      </div>

      {/* ── PILLAR CONTENT PANELS ── */}
      <div className="surface-instrument rounded-md border border-border bg-surface p-6 sm:p-9 shadow-xs transition-all">
        {/* TAB 1: Smart SEO & ICE Scoring */}
        {activeTab === "seo_ice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
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
                  <span>Synthesizes Schema.org JSON-LD (SoftwareApplication, FAQ, Article, Organization)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                  <span>Sub-second local ML rules with zero third-party latency</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/analyze"
                  className="btn-primary h-9 px-4 text-xs font-semibold gap-1.5"
                >
                  <span>Launch Site Analysis</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded border border-border bg-[#10151B] text-[#E8EDF2] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Code2 size={13} className="text-accent" />
                  <span>AST Code Patch Preview</span>
                </span>
                <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                  Priority Score: 8.8 / 10
                </span>
              </div>

              <div className="p-3 rounded bg-black/40 border border-white/5 text-[11px] font-mono space-y-1 overflow-x-auto">
                <div className="text-white/40 text-[10px] pb-1">// app/routes/pricing.tsx · Injected verified schema</div>
                <div className="text-[#6FD98F]">+ &lt;script type="application/ld+json"&gt;</div>
                <div className="text-[#6FD98F]">+   &#123; "@context": "https://schema.org", "@type": "SoftwareApplication",</div>
                <div className="text-[#6FD98F]">+     "name": "SerpoAI", "applicationCategory": "BusinessApplication" &#125;</div>
                <div className="text-[#6FD98F]">+ &lt;/script&gt;</div>
                <div className="text-[#6FD98F]">+ &lt;link rel="canonical" href="https://example.com/pricing" /&gt;</div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-[9px] text-white/50 uppercase block font-mono">Impact</span>
                  <span className="font-bold text-white font-mono tabular-nums text-xs">9 / 10</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-[9px] text-white/50 uppercase block font-mono">Confidence</span>
                  <span className="font-bold text-[#6FD98F] font-mono tabular-nums text-xs">94.2%</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5">
                  <span className="text-[9px] text-white/50 uppercase block font-mono">Effort</span>
                  <span className="font-bold text-accent font-mono text-xs">1-Click</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI Search & GEO Radar */}
        {activeTab === "geo_search" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                Pillar 02 · Generative Engine Optimization
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-text-primary font-normal leading-snug">
                Win verified citations in ChatGPT, Perplexity & Google AI Overviews.
              </h3>
              <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                Over 40% of queries now resolve directly within AI answer engines without traditional link clicks. Generative Engine Optimization (GEO) audits your brand entity mentions, citation footprint, and answer probability against top competitors.
              </p>

              <div className="space-y-2 pt-1 text-xs font-sans text-text-secondary">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                  <span>Tracks real citation share across Perplexity, ChatGPT Search, and Gemini</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                  <span>Synthesizes structured entity triples to feed AI knowledge representations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                  <span>Competitor teardown reveals exact citation gaps and primary sources</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/geo"
                  className="btn-primary h-9 px-4 text-xs font-semibold gap-1.5"
                >
                  <span>Explore GEO Radar</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-4 rounded border border-border bg-[#10151B] text-[#E8EDF2] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-accent" />
                  <span>AI Citation Telemetry</span>
                </span>
                <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                  82% Authority Index
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white text-xs font-semibold">Perplexity AI</div>
                    <div className="text-white/40 text-[10px]">Top 3 Primary Cited Source</div>
                  </div>
                  <span className="text-[#6FD98F] font-bold tabular-nums text-xs">96% Cited</span>
                </div>

                <div className="p-2.5 rounded bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white text-xs font-semibold">ChatGPT Search</div>
                    <div className="text-white/40 text-[10px]">Quoted in 4/5 summary answers</div>
                  </div>
                  <span className="text-[#6FD98F] font-bold tabular-nums text-xs">88% Quoted</span>
                </div>

                <div className="p-2.5 rounded bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white text-xs font-semibold">Google AI Overviews</div>
                    <div className="text-white/40 text-[10px]">Featured Snippet Anchor Entity</div>
                  </div>
                  <span className="text-accent font-bold tabular-nums text-xs">Primary</span>
                </div>
              </div>

              <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] text-white/60 flex items-center justify-between">
                <span>Knowledge Graph Entity Triple: Verified</span>
                <ShieldCheck size={12} className="text-accent" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Autonomous Actions & Serpo Bot */}
        {activeTab === "autonomous_pr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-150">
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

            <div className="lg:col-span-6 p-4 rounded border border-border bg-[#10151B] text-[#E8EDF2] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px]">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <GitPullRequest size={13} className="text-accent" />
                  <span>Serpo Bot Dispatch Terminal</span>
                </span>
                <span className="badge-instrument text-[9px] py-0 px-1 text-accent border-accent/20">
                  PR #42 Dispatch Ready
                </span>
              </div>

              <div className="p-3 rounded bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span>Branch:</span>
                  <code className="text-accent font-bold">serpo/seo-patch-schema</code>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span>Commit:</span>
                  <span className="text-white font-medium">fix(seo): inject Organization schema</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span>AST Safety Score:</span>
                  <span className="text-[#6FD98F] font-bold tabular-nums">99.8% Verified</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span>CI Validation:</span>
                  <span className="text-[#6FD98F] font-bold">Passing (3/3)</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-accent-soft text-accent border border-accent/20 text-xs font-semibold flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Ready to Merge</span>
                </span>
                <span className="text-[10px] text-text-secondary">Human Operator Approved ✓</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}