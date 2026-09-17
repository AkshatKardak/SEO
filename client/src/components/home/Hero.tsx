import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Target,
  Globe,
} from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url.trim())}`);
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* ── Radiant Ambient Glow Orbs ── */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/15 rounded-full blur-[110px] pointer-events-none opacity-60 animate-pulse-glow" />
      <div className="absolute top-48 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-60 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Floating Badges ── */}
      <div className="hidden xl:flex absolute top-36 right-8 z-20 animate-float items-center gap-2 px-3.5 py-2 rounded-2xl glass-card border border-primary/30 shadow-xl text-xs font-mono">
        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
        <span className="font-bold text-foreground">Serpo Bot:</span>
        <span className="text-primary font-semibold">99.8% AST Safe</span>
      </div>

      <div className="hidden xl:flex absolute top-72 left-8 z-20 animate-float-delayed items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-card border border-primary/30 shadow-xl text-xs font-mono">
        <Sparkles size={14} className="text-primary" />
        <span className="font-bold text-foreground">GSC Quick Wins:</span>
        <span className="text-emerald-500 font-semibold">+142% CTR Lift</span>
      </div>
      {/* ── Headline & Positioning ── */}
      <div className="max-w-3xl mx-auto text-center space-y-5">
        {/* Restrained Subheading Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="text-foreground font-semibold">Autonomous Search Growth OS</span>
          <span className="text-muted-foreground">·</span>
          <span>DISCOVER → PRIORITIZE → EXECUTE</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
          Turn Search Data <br />
          <span className="text-primary font-black">Into Measurable Growth.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          SerpoAI discovers your highest-impact SEO and AI-search opportunities, predicts what matters,
          helps execute approved fixes, and measures what actually moves traffic, conversions and revenue.
        </p>

        {/* ── Input & Immediate Action Bar ── */}
        <div className="pt-2 max-w-xl mx-auto">
          <form
            onSubmit={handleAnalyze}
            className="p-1.5 rounded-2xl bg-card border border-border shadow-md flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3.5 py-2 w-full bg-transparent">
              <Globe size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-primary text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              Analyze Website <ArrowRight size={14} />
            </button>
          </form>

          {/* Core Engine Vectors */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-foreground/80">Vectors:</span>
            {["SEO", "GEO", "Technical", "Content", "Competitors", "Analytics"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-md bg-muted text-[11px] font-mono font-medium text-foreground/80 border border-border hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/onboarding"
            className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            Run Growth Scan <ArrowRight size={14} />
          </Link>
          <a
            href="#growth-loop"
            className="px-5 py-2.5 rounded-xl btn-secondary text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* ── 03. REALISTIC HERO PRODUCT PREVIEW ── */}
      <div className="mt-14 max-w-5xl mx-auto">
        <div className="surface-card rounded-2xl border border-border/80 shadow-2xl overflow-hidden bg-card card-interactive glow-emerald transition-all">
          {/* Dashboard Window Chrome */}
          <div className="px-4 py-3 bg-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-border inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-border inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-border inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                <span className="text-primary font-bold">SERPOAI</span> GROWTH ENGINE · <span className="text-muted-foreground font-normal">cloudflow.io</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Autonomous Telemetry Active
              </span>
            </div>
          </div>

          {/* Top 4 Metric Cards */}
          <div className="p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 border-b border-border bg-card">
            {[
              { label: "Growth Score", value: "82", delta: "+6.4%", desc: "Composite health index" },
              { label: "AI Visibility (GEO)", value: "74%", delta: "+12%", desc: "Generative engine citations" },
              { label: "Technical Health", value: "91", delta: "Good", desc: "Core Web Vitals & schema" },
              { label: "Growth Opportunity", value: "88", delta: "High ROI", desc: "ICE-prioritized backlog" },
            ].map((m) => (
              <div
                key={m.label}
                className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1 hover-lift cursor-pointer hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{m.label}</span>
                  <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded">
                    {m.delta}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-foreground tracking-tight">{m.value}</div>
                <p className="text-[11px] text-muted-foreground truncate">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Preview Body */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: High-Impact Opportunities */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Target size={14} className="text-primary" />
                  HIGH-IMPACT OPPORTUNITIES (ICE RANKED)
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">ML Prioritized</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "Inject SoftwareApplication JSON-LD schema on pricing page",
                    type: "Structured Data",
                    ice: "Score 9.4",
                    impact: "+14% CTR",
                    agent: "SEO Agent",
                  },
                  {
                    title: "Publish Brand vs Competitor comparison matrix (/vs/competitor)",
                    type: "Content & GEO",
                    ice: "Score 9.1",
                    impact: "+32% CVR",
                    agent: "Content Agent",
                  },
                  {
                    title: "Resolve 4 canonical conflicts & compress above-the-fold hero",
                    type: "Technical SEO",
                    ice: "Score 8.7",
                    impact: "-210ms LCP",
                    agent: "SEO Agent",
                  },
                ].map((opp, idx) => (
                  <div
                    key={opp.title}
                    className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-3 hover-lift cursor-pointer hover:border-primary/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-primary">{idx + 1}.</span>
                        <span className="text-xs font-bold text-foreground">{opp.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono text-muted-foreground">{opp.type}</span>
                        <span>·</span>
                        <span className="text-primary font-medium">{opp.agent}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-foreground block">{opp.ice}</span>
                      <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                        {opp.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Search Visibility & Growth Graph */}
            <div className="lg:col-span-5 space-y-4">
              {/* AI Search Presence */}
              <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3 hover-lift transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" />
                    AI SEARCH VISIBILITY
                  </span>
                  <span className="text-[11px] font-mono text-primary font-bold">74% Avg Citation</span>
                </div>

                <div className="space-y-2">
                  {[
                    { engine: "Google AI Overviews", score: "78%", width: "78%" },
                    { engine: "Gemini AI Search", score: "74%", width: "74%" },
                    { engine: "Generative Answer Engines", score: "71%", width: "71%" },
                    { engine: "AI Research & Citations", score: "66%", width: "66%" },
                  ].map((e) => (
                    <div key={e.engine} className="space-y-1 hover:translate-x-1 transition-transform cursor-pointer">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{e.engine}</span>
                        <span className="font-mono font-semibold text-foreground">{e.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: e.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Graph Chain */}
              <div className="p-3.5 rounded-xl border border-border bg-card space-y-2 hover-lift transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  GROWTH GRAPH ATTRIBUTION CHAIN
                </span>
                <div className="flex items-center justify-between text-[11px] font-mono text-foreground font-semibold">
                  <span>Impressions</span>
                  <span className="text-muted-foreground">→</span>
                  <span>Traffic</span>
                  <span className="text-muted-foreground">→</span>
                  <span>Engagement</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary font-bold">Revenue</span>
                </div>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between border-t border-border/50">
                  <span>Closed-loop tracking</span>
                  <span className="text-primary font-semibold">+18.4% MRR Attribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
