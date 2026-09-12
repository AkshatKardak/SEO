export default function CompetitorSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          Competitor Intelligence & Content Gap Matrix
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Where competitors are beating you—and how to win.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          SerpoAI scans competitor domains across Google search and AI answer engines, revealing exact unranked high-intent keyword gaps and citation advantages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* ── Left: Competitor Comparison Table ── */}
        <div className="lg:col-span-7 surface-card p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              COMPETITOR DOMAIN BENCHMARK
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">3 Competitors Scanned</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { domain: "Your Domain (cloudflow.io)", topics: 48, aiCitations: "64%", cwScore: 91, isUser: true },
              { domain: "rival-growth.com", topics: 83, aiCitations: "78%", cwScore: 84, isUser: false },
              { domain: "market-lead.io", topics: 72, aiCitations: "71%", cwScore: 88, isUser: false },
            ].map((row) => (
              <div
                key={row.domain}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 hover-slide-right cursor-pointer transition-all ${
                  row.isUser
                    ? "bg-primary/5 border-primary/40 hover:border-primary/60 text-foreground shadow-sm"
                    : "bg-surface-elevated border-border hover:border-primary/40 text-muted-foreground"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-foreground">{row.domain}</span>
                    {row.isUser && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary text-primary-foreground font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    {row.topics} Core Topics Covered
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">{row.aiCitations} AI Cited</span>
                  <span className="text-[10px] text-muted-foreground">CWV: {row.cwScore}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border text-xs font-mono flex items-center justify-between hover-lift cursor-pointer">
            <span className="text-muted-foreground">Identified Topic Gap:</span>
            <span className="text-primary font-bold">35 High-Intent Topics Unranked</span>
          </div>
        </div>

        {/* ── Right: Actionable Opportunity Generated ── */}
        <div className="lg:col-span-5 surface-card p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                SURFACED GROWTH OPPORTUNITY
              </span>
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                Score 9.1
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2 hover-lift cursor-pointer">
              <h4 className="text-xs font-bold text-foreground">
                Publish 6 High-Intent Comparison Hub Pages
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Rival domains are capturing 4,200 monthly high-intent search visits with comparison pages. Content Agent has drafted 3 ready-to-publish comparison briefs.
              </p>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Estimated Monthly Search Lift:</span>
                <span className="text-primary font-bold">+2,400 Visits</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Predicted Conversion Rate:</span>
                <span className="text-foreground font-bold">6.8% (Bottom-Funnel)</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#ice-engine"
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold text-center block"
            >
              Review Surfaced Opportunity
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
