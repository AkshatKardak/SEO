import { Check, X } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  traditional: string;
  serpoAI: string;
}

const COMPARISON: ComparisonRow[] = [
  {
    dimension: "Core Operating Model",
    traditional: "Static 200-page audit checklists dumped into ticketing backlogs",
    serpoAI: "Autonomous closed loop: Discover → Prioritize → Synthesize → Execute → Measure → Repeat",
  },
  {
    dimension: "Search & Visibility Scope",
    traditional: "Traditional Google blue links only (blind to AI answer engines)",
    serpoAI: "Full-spectrum SEO + GEO (Google AI Overviews, ChatGPT Search, Perplexity, Gemini)",
  },
  {
    dimension: "Prioritization Mechanism",
    traditional: "Arbitrary High/Med/Low tags disconnected from business impact",
    serpoAI: "Mathematical ICE Scoring + Scikit-learn predicted traffic and conversion lift",
  },
  {
    dimension: "Execution & Code Output",
    traditional: "Operator copies manual suggestions and manually files engineering tickets",
    serpoAI: "Serpo Bot opens branches, commits verified AST patches, and creates reviewable GitHub PRs",
  },
  {
    dimension: "Attribution & Revenue Link",
    traditional: "Isolated position graphs with zero revenue correlation",
    serpoAI: "Multi-touch Growth Graph tracking Impressions → Clicks → Signups → Attributed MRR",
  },
  {
    dimension: "System Learning & Memory",
    traditional: "Zero memory; restarts from scratch on every recurring quarterly audit",
    serpoAI: "Persistent Growth Memory storing causal findings and updating ML priors automatically",
  },
];

export default function ProofSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border select-none">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
          Architectural Comparison
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal text-text-primary tracking-tight leading-tight">
          How SerpoAI compares to <span className="italic text-accent">traditional SEO tools</span>.
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Traditional software monitors search decline in retrospect. SerpoAI executes continuous engineering patches that defend and expand organic market share.
        </p>
      </div>

      <div className="surface-instrument rounded-md border border-border bg-surface max-w-5xl mx-auto overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-muted text-text-primary">
                <th className="p-4 sm:p-4.5 font-bold uppercase text-[10px] tracking-wider w-1/4">
                  Capability
                </th>
                <th className="p-4 sm:p-4.5 font-bold uppercase text-[10px] tracking-wider text-text-muted w-3/8">
                  Legacy SEO Suites
                </th>
                <th className="p-4 sm:p-4.5 font-bold uppercase text-[10px] tracking-wider text-accent w-3/8 bg-accent-soft/20 border-l border-border">
                  SerpoAI Engine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans text-xs">
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="p-4 sm:p-4.5 font-mono font-bold text-text-primary text-[11px]">
                    {row.dimension}
                  </td>
                  <td className="p-4 sm:p-4.5 text-text-secondary">
                    <div className="flex items-start gap-2">
                      <X size={13} className="text-negative shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{row.traditional}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-4.5 text-text-primary bg-accent-soft/10 border-l border-border">
                    <div className="flex items-start gap-2">
                      <Check size={13} className="text-accent shrink-0 mt-0.5 font-bold" />
                      <span className="leading-relaxed font-medium">{row.serpoAI}</span>
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

