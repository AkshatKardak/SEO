import { useState } from "react";
import {
  Sparkles,
  Cpu,
  GitPullRequest,
  ArrowRight,
  Layers,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function GrowthPlatformShowcase() {
  const [activeTab, setActiveTab] = useState<"seo_ice" | "geo_search" | "autonomous_pr">("seo_ice");

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      {/* ── SECTION HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-elevated text-xs font-mono font-semibold text-primary">
          <Layers size={13} />
          Unified Growth Platform
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Everything You Need to Grow, <br />
          <span className="text-primary">Without 10 Different Tools.</span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Traditional workflows require five different dashboards for site audits, rank tracking, AI overviews, and developer tickets. SerpoAI brings it all together in one unified system.
        </p>
      </div>

      {/* ── PILLAR TAB SWITCHER ── */}
      <div className="flex justify-center mb-10">
        <div className="p-1.5 rounded-2xl bg-surface-elevated border border-border flex flex-wrap items-center justify-center gap-1.5 max-w-2xl w-full">
          <button
            type="button"
            onClick={() => setActiveTab("seo_ice")}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "seo_ice"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu size={15} /> 1. Smart SEO & ICE Fixes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("geo_search")}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "geo_search"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={15} /> 2. AI Search & Citations (GEO)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("autonomous_pr")}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "autonomous_pr"
                ? "bg-card text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitPullRequest size={15} /> 3. Serpo Bot & Execution
          </button>
        </div>
      </div>

      {/* ── PILLAR CONTENT PANELS ── */}
      <div className="surface-card p-6 sm:p-10 rounded-3xl border border-border bg-card shadow-xl transition-all">
        {/* TAB 1: Smart SEO & ICE Scoring */}
        {activeTab === "seo_ice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Pillar 01 • Deterministic Prioritization
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Fix What Actually Moves The Needle with ICE Scoring
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Stop guessing which SEO issues matter. SerpoAI calculates an exact ICE score (Impact × Confidence ÷ Effort) for every crawled page. It automatically generates ready-to-deploy JSON-LD schemas, robots.txt directives, and canonical tags.
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Mathematical ICE formula ranks highest traffic-yield fixes first</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Automatic schema generation (Organization, FAQ, Article, Product)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Sub-second local ML rules with zero external API lag</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
                >
                  Test Free Site Scan <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-surface-elevated border border-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <Code2 size={15} className="text-primary" /> Recommended Code Patch
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  Priority Score: 8.8 / 10
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-background border border-border text-[11px] text-muted-foreground space-y-1 overflow-x-auto">
                <div className="text-emerald-500 font-bold">+ &lt;script type="application/ld+json"&gt;</div>
                <div className="text-emerald-500 font-bold">+   &#123; "@context": "https://schema.org", "@type": "SoftwareApplication" &#125;</div>
                <div className="text-emerald-500 font-bold">+ &lt;/script&gt;</div>
                <div className="text-emerald-500 font-bold">+ &lt;link rel="canonical" href="https://example.com/pricing" /&gt;</div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Impact</span>
                  <span className="font-bold text-foreground">9 / 10</span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Confidence</span>
                  <span className="font-bold text-emerald-500">95%</span>
                </div>
                <div className="p-2 rounded-lg bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase block">Effort</span>
                  <span className="font-bold text-primary">1 Click</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI Search & GEO Radar */}
        {activeTab === "geo_search" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Pillar 02 • Next-Gen AI Visibility
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Get Cited by ChatGPT, Perplexity & Google AI Overviews
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Over 40% of search traffic now resolves in AI Answer Engines without users clicking through to websites. Generative Engine Optimization (GEO) audits your brand mentions, entity citations, and answer probability.
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Measure real citation share across Perplexity, ChatGPT & Gemini</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Build structured entity triples to feed AI Knowledge Graphs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Teardown competitor citation advantages and win primary sources</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/geo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
                >
                  Explore GEO Radar <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-surface-elevated border border-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <Sparkles size={15} className="text-primary" /> AI Citation Presence
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                  82% Brand Authority
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
                  <span className="text-foreground font-semibold">Perplexity AI</span>
                  <span className="text-emerald-500 font-bold">Primary Cited Source (Top 3)</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
                  <span className="text-foreground font-semibold">ChatGPT Search</span>
                  <span className="text-emerald-500 font-bold">Quoted in 4/5 Summaries</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
                  <span className="text-foreground font-semibold">Google AI Overviews</span>
                  <span className="text-primary font-bold">Featured Snippet Anchor</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Autonomous Actions & Serpo Bot */}
        {activeTab === "autonomous_pr" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Pillar 03 • Closed-Loop Execution
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                From Detection to GitHub Pull Request in 1 Click
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Instead of emailing tickets to developers that get lost for months, Serpo Bot dispatches production-ready Pull Requests directly to your repository with automated validation tests and zero production risk.
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Serpo Bot opens branch, commits fix, and opens GitHub PR</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Automated Keyword Cannibalization graph detects competing internal URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  <span>Google Search Console Striking Distance scanner finds easy CTR wins</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/actions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
                >
                  View Action Center <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-5 rounded-2xl bg-surface-elevated border border-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-bold text-foreground flex items-center gap-2">
                  <GitPullRequest size={15} className="text-primary" /> Serpo Bot Dispatch
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                  PR #42 Ready
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Branch:</span> <code className="text-primary font-bold">serpo/seo-patch-schema</code>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Commit:</span> <span className="text-foreground">fix(seo): inject Organization schema</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>ML Safety Score:</span> <span className="text-emerald-500 font-bold">99.4% Safe</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary font-bold flex items-center justify-between">
                <span>1-Click Merge Ready</span>
                <span>Human Approved ✓</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}