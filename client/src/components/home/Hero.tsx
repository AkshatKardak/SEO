import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle2,
  Globe,
  Bot,
  ArrowUpRight,
  Play,
  Loader2,
} from "lucide-react";

const stats = [
  { value: "60+", label: "Technical Signals" },
  { value: "1.8s", label: "Multi-Agent Scan" },
  { value: "98.4%", label: "Fix Precision" },
  { value: "1-Click", label: "Code Deployment" },
];

const samplePresets = [
  "stripe.com",
  "linear.app",
  "supabase.com",
  "shopify.com",
];

export default function Hero() {
  const [inputUrl, setInputUrl] = useState("https://cloudflow.io");
  const [isScanning, setIsScanning] = useState(false);

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const el = document.getElementById("sample-response");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 900);
  };

  const handleSelectPreset = (domain: string) => {
    setInputUrl(`https://${domain}`);
    const el = document.getElementById("sample-response");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4 pt-28 pb-16">
      {/* Background Radial Glow & Aurora Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[350px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-violet-500/8 blur-3xl" />
      </div>

      {/* Single status eyebrow — one clean pill instead of three stacked badges */}
      <div className="relative mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-card/70 backdrop-blur-md text-xs font-semibold shadow-sm">
        <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse inline-block" />
          Multi-agent engine online
        </span>
        <span className="w-px h-3 bg-border" />
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Bot size={12} className="text-primary" /> Autonomous SEO &amp; GEO intelligence
        </span>
      </div>

      {/* Main Heading */}
      <h1
        className="relative text-center font-extrabold leading-[1.08] tracking-tight text-foreground max-w-4xl"
        style={{ fontSize: "clamp(2.4rem, 5.8vw, 4.8rem)" }}
      >
        Dominate Search Rankings & AI Answer Engines{" "}
        <span className="block mt-1 gradient-text">With Autonomous Intelligence</span>
      </h1>

      {/* Subtitle */}
      <p className="relative mt-6 text-center text-muted-foreground max-w-2xl text-base sm:text-lg leading-relaxed">
        <strong>SerpoAI</strong> replaces disjointed SEO tools with a unified multi-agent system.
        Audit 60+ technical signals, prioritize fixes by mathematical ICE score, and deploy production-ready code diffs in seconds.
      </p>

      {/* ── INTERACTIVE INSTANT URL TESTER BAR ── */}
      <div id="instant-scan-bar" className="relative mt-9 w-full max-w-2xl">
        <form
          onSubmit={handleSimulateScan}
          className="glass-strong p-2 sm:p-2.5 rounded-2xl border border-primary/30 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-2 w-full bg-background/80 rounded-xl border border-border/60">
            <Search size={16} className="text-primary shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter any website URL (e.g. stripe.com)..."
              className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="w-full sm:w-auto px-6 py-3 rounded-xl btn-glow text-xs sm:text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
          >
            {isScanning ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Scanning Signals...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Run Live Preview
              </>
            )}
          </button>
        </form>

        {/* Preset quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <span className="text-[11px] font-medium">Or test sample domain:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-0.5 rounded-full bg-card hover:bg-muted border border-border/70 text-foreground text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="relative mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/register"
          className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-sm font-bold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
          style={{ color: "var(--background)" }}
        >
          Start Free Audit <ArrowRight size={16} />
        </Link>
        <a
          href="#how-it-works"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all"
        >
          <Play size={14} className="text-primary fill-primary" /> See How It Works
        </a>
      </div>

      {/* Trust Badges */}
      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Shield size={12} className="text-primary" /> Zero Credit Card Required
        </span>
        <span className="w-px h-3 bg-border hidden sm:inline" />
        <span className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-primary" /> Free 14-Day Full Access
        </span>
        <span className="w-px h-3 bg-border hidden sm:inline" />
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-primary" /> SSRF-Safe Cloud Crawler
        </span>
      </div>

      {/* Stats Bar */}
      <div className="relative mt-12 w-full max-w-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-4 px-2 text-center">
              <span className="text-2xl font-black text-foreground">{s.value}</span>
              <span className="text-[11px] font-semibold text-muted-foreground mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO FLOATING LIVE SCORE & ACTION TEASER CARD ── */}
      <div className="relative mt-10 w-full max-w-xl glass rounded-2xl border border-border/80 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              <Globe size={16} />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground">https://cloudflow.io</p>
              <p className="text-xs font-bold text-foreground">Live Telemetry & SEO Health</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Overall Score</span>
            <div className="text-3xl font-black gradient-text">89</div>
          </div>
        </div>

        {/* 4 Pillars Mini-bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "SEO", score: 94, color: "bg-emerald-500" },
            { label: "Perf", score: 82, color: "bg-blue-500" },
            { label: "A11y", score: 96, color: "bg-violet-500" },
            { label: "Best Pr.", score: 90, color: "bg-amber-500" },
          ].map((c) => (
            <div key={c.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground font-semibold">{c.label}</span>
                <span className="font-bold text-foreground">{c.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mini Fix Snippet Teaser */}
        <div className="p-3 rounded-xl bg-background/80 border border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate mr-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
              ICE 9.2
            </span>
            <span className="text-[11px] text-foreground font-medium truncate">
              Auto-generated FAQ schema for Perplexity citations
            </span>
          </div>
          <a
            href="#sample-response"
            className="text-[11px] text-primary hover:underline font-bold flex items-center gap-0.5 shrink-0"
          >
            Preview Output <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
