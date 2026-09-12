import { Check, X, Bot } from "lucide-react";

export default function GEOPresenceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          Generative Engine Optimization (GEO)
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Rank on Google. Get cited by AI.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Over 40% of high-intent search traffic is shifting to AI answer engines. SerpoAI continuously simulates and measures how modern AI engines cite your brand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
        {/* ── Left: AI Search Presence Graph ── */}
        <div className="lg:col-span-6 surface-card p-6 sm:p-7 rounded-2xl border border-border bg-card space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-foreground flex items-center gap-1.5">
              <Bot size={15} className="text-primary" />
              AI SEARCH PRESENCE GRAPH
            </span>
            <span className="text-[11px] font-mono text-primary font-bold">74% Entity Authority</span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {[
              { engine: "Google Search & AI Overviews", rate: 82, status: "Dominant Source", color: "bg-primary" },
              { engine: "Google Gemini AI Search", rate: 74, status: "Top Recommendation", color: "bg-primary" },
              { engine: "Generative Answer Engines", rate: 71, status: "Primary Citation", color: "bg-primary" },
              { engine: "AI Research & Citations", rate: 64, status: "Growing Citation", color: "bg-primary" },
            ].map((item) => (
              <div
                key={item.engine}
                className="space-y-1.5 p-3 rounded-xl bg-surface-elevated border border-border hover-slide-right cursor-pointer hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{item.engine}</span>
                  <span className="font-bold text-primary">{item.rate}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${item.rate}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground block">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Citation Gap Teardown ── */}
        <div className="lg:col-span-6 surface-card p-6 sm:p-7 rounded-2xl border border-border bg-card space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
              HIGH-INTENT CITATION GAP ANALYSIS
            </span>
            <span className="text-[10px] font-mono text-warning bg-warning/10 px-2 py-0.5 rounded font-bold">
              1 Gap Detected
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border font-mono text-xs space-y-1.5">
            <span className="text-[10px] text-muted-foreground uppercase block">Analyzed High-Intent Query:</span>
            <div className="text-foreground font-bold">"Best autonomous search growth platforms for SaaS"</div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <span className="text-[11px] text-muted-foreground uppercase block">Answer Engine Citations:</span>
            {[
              { name: "Competitor A (Ahrefs)", cited: true, reason: "Extensive /vs comparison hub" },
              { name: "Competitor B (Semrush)", cited: true, reason: "Structured product schemas" },
              { name: "Your Domain", cited: false, reason: "Missing structured comparison matrix & entity citations" },
            ].map((c) => (
              <div
                key={c.name}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 hover-slide-right cursor-pointer transition-all ${
                  c.cited ? "bg-card border-border hover:border-primary/40" : "bg-danger/5 border-danger/30 hover:border-danger/60"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {c.cited ? (
                      <Check size={14} className="text-primary font-bold" />
                    ) : (
                      <X size={14} className="text-danger font-bold" />
                    )}
                    <span className="font-bold text-xs">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground block">{c.reason}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    c.cited ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"
                  }`}
                >
                  {c.cited ? "Cited" : "Not Cited"}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
            <span className="font-bold text-primary font-mono block">Recommended GEO Action:</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              GEO Agent can generate an authoritative comparison blueprint and publish JSON-LD entity claims to capture this missing citation within 14 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
