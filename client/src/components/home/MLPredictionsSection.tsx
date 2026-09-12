import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function MLPredictionsSection() {
  const [activeTab, setActiveTab] = useState<"ranking" | "anomaly" | "forecasting">("ranking");

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          Interpretable Machine Learning Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Machine learning designed for real business decisions.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          SerpoAI doesn't use AI just for marketing hype. Three dedicated ML engines predict outcomes, detect anomalies before they damage revenue, and forecast search growth.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-surface-elevated border border-border">
          {[
            { id: "ranking" as const, label: "1. Smart Opportunity Ranking" },
            { id: "anomaly" as const, label: "2. SEO Anomaly Radar" },
            { id: "forecasting" as const, label: "3. 30-Day Growth Forecast" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm font-bold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab 1: Smart Opportunity Ranking ── */}
      {activeTab === "ranking" && (
        <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary block">ML PREDICTION ENGINE</span>
              <h3 className="text-lg font-bold text-foreground">Opportunity: "Improve pricing comparison section"</h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold shrink-0">
              82% Success Probability
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 hover-lift cursor-pointer hover:border-primary/50 transition-all">
              <span className="text-[10px] text-muted-foreground block">Expected Traffic Lift</span>
              <div className="text-2xl font-bold text-primary">+8–15%</div>
              <p className="text-[11px] text-muted-foreground">Within 30 days of schema indexation</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 hover-lift cursor-pointer hover:border-primary/50 transition-all">
              <span className="text-[10px] text-muted-foreground block">Expected Conversion Lift</span>
              <div className="text-2xl font-bold text-primary">+3–7%</div>
              <p className="text-[11px] text-muted-foreground">High-intent comparison visitors</p>
            </div>
          </div>

          {/* Contributing Signals Teardown */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">
              Top Contributing Signal Attribution:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between hover-slide-right cursor-pointer hover:border-primary/50 transition-all">
                <span className="text-foreground">✓ Strong search demand for comparison terms</span>
                <span className="text-primary font-bold">+18%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between hover-slide-right cursor-pointer hover:border-primary/50 transition-all">
                <span className="text-foreground">✓ High existing domain authority on subpages</span>
                <span className="text-primary font-bold">+14%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between hover-slide-right cursor-pointer hover:border-primary/50 transition-all">
                <span className="text-foreground">✓ Low engineering friction (1-click patch)</span>
                <span className="text-primary font-bold">+20%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between hover-slide-right cursor-pointer hover:border-warning/50 transition-all">
                <span className="text-muted-foreground">✕ Limited historical conversion sample</span>
                <span className="text-warning font-bold">-6%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: SEO Anomaly Radar ── */}
      {activeTab === "anomaly" && (
        <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-danger block flex items-center gap-1.5">
                <AlertTriangle size={14} /> ANOMALY DETECTED BY RADAR
              </span>
              <h3 className="text-lg font-bold text-foreground">Metric: Organic Search Traffic</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-danger/10 text-danger font-mono text-xs font-bold">
              -25.2% Variance (Severity: Critical)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-center">
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border hover-lift cursor-pointer transition-all">
              <span className="text-[10px] text-muted-foreground block">Expected Baseline</span>
              <div className="text-xl font-bold text-foreground">42,000 / mo</div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border hover-lift cursor-pointer transition-all">
              <span className="text-[10px] text-muted-foreground block">Actual Observed</span>
              <div className="text-xl font-bold text-danger">31,400 / mo</div>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border hover-lift cursor-pointer transition-all">
              <span className="text-[10px] text-muted-foreground block">Statistical Confidence</span>
              <div className="text-xl font-bold text-primary">94.8%</div>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase block">
              Likely Contributing Factors:
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-border flex items-center gap-2 hover-slide-right cursor-pointer transition-all">
                <span className="text-danger font-bold">›</span>
                <span>3 high-volume pricing URLs dropped 4 positions after recent navigation change</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-border flex items-center gap-2 hover-slide-right cursor-pointer transition-all">
                <span className="text-danger font-bold">›</span>
                <span>CTR dropped by 1.8% for primary search queries due to losing review schema</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-elevated border border-border flex items-center gap-2 hover-slide-right cursor-pointer transition-all">
                <span className="text-warning font-bold">›</span>
                <span>Rival domain launched a competitor comparison campaign targeting brand terms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: 30-Day Growth Forecasting ── */}
      {activeTab === "forecasting" && (
        <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary block">TIME-SERIES FORECAST</span>
              <h3 className="text-lg font-bold text-foreground">30-Day Organic Growth Forecast</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
              78% Confidence Band
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 hover-lift cursor-pointer transition-all">
              <span className="text-[10px] text-muted-foreground block">Current Monthly Traffic</span>
              <div className="text-2xl font-bold text-foreground">32,400</div>
              <span className="text-[10px] text-muted-foreground">Historical verified baseline</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 hover-lift cursor-pointer transition-all">
              <span className="text-[10px] text-muted-foreground block">30-Day Forecast Range</span>
              <div className="text-2xl font-bold text-primary">36,100 – 39,800</div>
              <span className="text-[10px] text-primary font-semibold">+11.4% to +22.8% projected</span>
            </div>
          </div>

          {/* Visual Forecast Timeline Representation */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border font-mono text-xs space-y-3 hover-lift cursor-pointer transition-all">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>DAY -30 (ACTUAL)</span>
              <span>TODAY (32,400)</span>
              <span className="text-primary font-bold">DAY +30 (38,200 FORECAST)</span>
            </div>

            <div className="relative h-4 bg-card rounded-full overflow-hidden border border-border">
              <div className="absolute left-0 top-0 bottom-0 bg-muted-foreground/30 w-1/2" />
              <div className="absolute left-1/2 top-0 bottom-0 bg-primary/70 w-1/2 animate-pulse" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
              <span>Model: Autoregressive Holt-Winters</span>
              <span className="text-primary font-semibold">Distinguishes ACTUAL vs FORECAST</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
