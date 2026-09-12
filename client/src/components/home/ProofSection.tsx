import { Check } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  traditional: string;
  serpoAI: string;
}

const COMPARISON: ComparisonRow[] = [
  {
    dimension: "Core Operating Philosophy",
    traditional: "Static 200-page issue checklists with no execution mechanism",
    serpoAI: "Closed-loop autonomous growth loop: Discover → Prioritize → Execute → Measure → Learn",
  },
  {
    dimension: "Search & Visibility Scope",
    traditional: "Google keyword rankings only (blind to AI answer engines)",
    serpoAI: "Full-spectrum SEO + GEO (Google AI Overviews, Gemini, Generative Answer Engines)",
  },
  {
    dimension: "Task Prioritization",
    traditional: "Arbitrary high/med/low labels with zero business calibration",
    serpoAI: "Mathematical ICE Scoring + ML-predicted traffic and conversion lift",
  },
  {
    dimension: "Execution & Code Output",
    traditional: "Manual tickets dumped onto developers",
    serpoAI: "High-trust Action Center with verified code diffs, JSON-LD schemas, and human approval",
  },
  {
    dimension: "Attribution & Revenue",
    traditional: "Vague ranking reports disconnected from business revenue",
    serpoAI: "Multi-touch Growth Graph tracking Impressions → Clicks → Signups → MRR",
  },
  {
    dimension: "Organizational Learning",
    traditional: "Zero memory; starts from scratch every audit cycle",
    serpoAI: "Permanent Growth Memory storing verified experiment wins and failure teardowns",
  },
];

export default function ProofSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          Engineered for Modern B2B Growth Teams
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          How SerpoAI compares to traditional SEO tools.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          SerpoAI is purpose-built as an Autonomous Search Growth Operating System, not another reporting dashboard.
        </p>
      </div>

      <div className="surface-card rounded-2xl border border-border bg-card max-w-5xl mx-auto overflow-hidden shadow-sm hover-lift">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-foreground">
                <th className="p-4 sm:p-5 font-bold uppercase text-[11px] w-1/4">Capability</th>
                <th className="p-4 sm:p-5 font-bold uppercase text-[11px] text-muted-foreground w-3/8">
                  Traditional SEO Tools
                </th>
                <th className="p-4 sm:p-5 font-bold uppercase text-[11px] text-primary w-3/8 bg-primary/5">
                  SerpoAI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/60 transition-colors cursor-pointer">
                  <td className="p-4 sm:p-5 font-bold text-foreground">{row.dimension}</td>
                  <td className="p-4 sm:p-5 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="text-danger font-bold text-xs mt-0.5">✕</span>
                      <span className="leading-relaxed font-sans">{row.traditional}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-foreground bg-primary/5">
                    <div className="flex items-start gap-2">
                      <Check size={14} className="text-primary font-bold shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-sans font-medium">{row.serpoAI}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
