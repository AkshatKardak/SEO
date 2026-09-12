import { useState } from "react";
import { BarChart3 } from "lucide-react";

interface FunnelTier {
  stage: string;
  metric: string;
  before: string;
  after: string;
  change: string;
  confidence: string;
}

const FUNNEL_DATA_30D: FunnelTier[] = [
  { stage: "01. Search Visibility", metric: "Total Impressions", before: "184,000", after: "238,000", change: "+29.3%", confidence: "98%" },
  { stage: "02. Organic Traffic", metric: "Search Clicks", before: "32,400", after: "41,200", change: "+27.1%", confidence: "96%" },
  { stage: "03. Engagement", metric: "Avg Session Duration", before: "1m 42s", after: "2m 18s", change: "+35.3%", confidence: "92%" },
  { stage: "04. Conversions", metric: "Free Trial Signups", before: "840", after: "1,120", change: "+33.3%", confidence: "94%" },
  { stage: "05. Activation", metric: "Product Qualified Leads", before: "410", after: "590", change: "+43.9%", confidence: "89%" },
  { stage: "06. Revenue", metric: "Attributed MRR Lift", before: "$18,400", after: "$26,200", change: "+42.4%", confidence: "91%" },
];

export default function GrowthGraphSection() {
  const [timeframe, setTimeframe] = useState<"30d" | "60d" | "90d">("30d");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          End-to-End Growth Graph Attribution
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Connect every search ranking to real revenue.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          SerpoAI bridges the disconnect between technical SEO audits and business outcomes, tracking the complete funnel from raw impressions to net-new monthly recurring revenue.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card max-w-5xl mx-auto space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              CLOSED-LOOP GROWTH FUNNEL ATTRIBUTION
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-muted-foreground text-[11px] mr-1">Timeframe:</span>
            {(["30d", "60d", "90d"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  timeframe === t
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-surface-elevated text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel Rows */}
        <div className="space-y-2.5 font-mono text-xs">
          {FUNNEL_DATA_30D.map((row) => (
            <div
              key={row.stage}
              className="p-3.5 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover-slide-right cursor-pointer hover:border-primary/50 transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase block">{row.stage}</span>
                <span className="font-bold text-sm text-foreground">{row.metric}</span>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 text-right shrink-0">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Before</span>
                  <span className="text-muted-foreground">{row.before}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">After</span>
                  <span className="text-foreground font-bold">{row.after}</span>
                </div>
                <div className="min-w-[80px]">
                  <span className="text-[10px] text-muted-foreground block">Lift</span>
                  <span className="text-primary font-bold text-sm">{row.change}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[10px] text-muted-foreground block">Confidence</span>
                  <span className="text-foreground">{row.confidence}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground border-t border-border/50 gap-2">
          <span>Attribution Model: Multi-Touch Bayesian Closed-Loop</span>
          <span className="text-primary font-bold font-mono">Total Verified MRR Lift: +$7,800/mo</span>
        </div>
      </div>
    </section>
  );
}
