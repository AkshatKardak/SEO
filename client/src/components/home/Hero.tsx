import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
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
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ── Left Column: Precision Headline & Immediate Action (55% = 7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-surface text-[11px] font-mono text-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
            <span>CONTINUOUS SEARCH TELEMETRY · DISCOVER → PRIORITIZE → EXECUTE</span>
          </div>

          {/* Precision Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[44px] font-normal text-text-primary tracking-tight leading-[1.12]">
            Turn search data into <span className="italic text-accent">measurable</span> growth.
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl">
            SerpoAI discovers your highest-impact SEO and AI-search opportunities, predicts what matters with mathematical ICE scoring, and opens verified git pull requests that move actual conversions.
          </p>

          {/* Input & Direct Action */}
          <div className="max-w-xl space-y-2.5">
            <form
              onSubmit={handleAnalyze}
              className="p-1 rounded-md border border-border bg-surface shadow-xs flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 w-full bg-transparent">
                <Globe size={15} className="text-text-muted shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto h-9 px-4 text-xs font-semibold shrink-0 gap-1.5"
              >
                <span>Analyze</span>
                <ArrowRight size={13} />
              </button>
            </form>

            {/* Quiet Links */}
            <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-sans text-text-muted">
              <a
                href="#platform-showcase"
                className="hover:text-text-primary transition-colors flex items-center gap-1"
              >
                <span>Read the documentation</span>
                <span>→</span>
              </a>
              <a
                href="#growth-loop"
                className="hover:text-text-primary transition-colors flex items-center gap-1"
              >
                <span>View architecture & pipelines</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Vector Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-text-muted">
            <span className="uppercase text-text-secondary text-[10px]">PIPELINES:</span>
            {["SEO Signals", "GEO Citations", "ICE Regressor", "Cannibalization Graph", "Git PR Bot"].map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 rounded border border-border bg-surface text-text-secondary text-[10px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right Column: Live Instrument Terminal Simulation (45% = 5 cols) ── */}
        <div className="lg:col-span-5">
          <div className="surface-instrument rounded-md border border-border bg-[#10151B] text-[#E8EDF2] shadow-2xl overflow-hidden font-mono text-xs">
            {/* Terminal Window Chrome */}
            <div className="h-9 px-3.5 bg-[#151C24] border-b border-white/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F08A78]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F2C05C]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6FD98F]" />
                </div>
                <span className="text-[11px] text-white/50 pl-1">
                  serpo-telemetry-daemon --stream
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
                <span>ACTIVE</span>
              </div>
            </div>

            {/* Terminal Log Stream */}
            <div className="p-4 space-y-2.5 text-[11px] leading-relaxed">
              <div className="text-white/40 text-[10px]">
                # Engine Loop: SCAN → PRIORITIZE → EXECUTE → MEASURE
              </div>

              <div className="text-white/70">
                <span className="text-white/40">[06:18:01.042]</span> <span className="text-accent">SCAN</span>: 18 striking-distance keywords detected (Pos 4–10)
              </div>

              <div className="text-white/70">
                <span className="text-white/40">[06:18:01.218]</span> <span className="text-data-1">ML REGRESSOR</span>: Traffic lift potential: +14,200 visits/mo
              </div>

              <div className="text-white/70">
                <span className="text-white/40">[06:18:01.401]</span> <span className="text-warning">ICE ENGINE</span>: Priority #1 → JSON-LD Schema (Score: 94.2)
              </div>

              {/* Code Patch Diff Box */}
              <div className="my-2 p-2 rounded bg-[#0A0E12] border border-white/10 text-[10px] space-y-0.5">
                <div className="text-white/40 flex items-center justify-between pb-1 border-b border-white/5">
                  <span>PATCH PREVIEW: Header.tsx</span>
                  <span className="text-accent">AST Safe: 99.8%</span>
                </div>
                <div className="text-negative font-mono">- &lt;meta name="description" content="Old description" /&gt;</div>
                <div className="text-positive font-mono">+ &lt;script type="application/ld+json"&gt;</div>
                <div className="text-positive font-mono">+   &#123; "@context": "https://schema.org", "@type": "SoftwareApplication" &#125;</div>
                <div className="text-positive font-mono">+ &lt;/script&gt;</div>
              </div>

              <div className="text-white/70">
                <span className="text-white/40">[06:18:01.835]</span> <span className="text-accent">PR DISPATCHER</span>: Opened branch <code className="text-accent">serpo/schema-fix</code>
              </div>

              <div className="text-white/70">
                <span className="text-white/40">[06:18:02.040]</span> <span className="text-[#6FD98F]">CLOSED LOOP</span>: Verification passed. Telemetry active.
              </div>
            </div>

            {/* Oscilloscope Latency Strip */}
            <div className="px-4 py-2 border-t border-white/10 bg-[#151C24]/80 flex items-center justify-between text-[10px] text-white/50 tabular-nums">
              <div className="flex items-center gap-2">
                <span>P99: 142ms</span>
                <span>·</span>
                <span>ANOMALIES: 0</span>
              </div>
              <div className="flex items-center gap-1.5 text-accent">
                <span>GEO CITATIONS: 68.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

