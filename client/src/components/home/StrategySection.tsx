import { CheckCircle2 } from "lucide-react";

interface Milestone {
  phase: string;
  days: string;
  title: string;
  focus: string;
  expectedMetric: string;
  tasks: string[];
}

const ROADMAP: Milestone[] = [
  {
    phase: "PHASE 1",
    days: "Days 1–30",
    title: "Conversion Quick Wins & Technical DOM Hygiene",
    focus: "Resolve indexing conflicts, inject rich JSON-LD schemas, and optimize pricing page LCP.",
    expectedMetric: "+14–22% Organic CTR Lift",
    tasks: [
      "Inject SoftwareApplication & Review JSON-LD schema sitewide",
      "Fix 4 canonical tag mismatches across subpages",
      "Preload above-the-fold hero WebP assets to achieve sub-350ms LCP",
      "Deploy 1-click metadata optimization for high-intent queries",
    ],
  },
  {
    phase: "PHASE 2",
    days: "Days 31–60",
    title: "GEO Authority & Bottom-Funnel Comparison Moats",
    focus: "Capture answer engine citations across Google AI, Gemini, and Generative Engines with authoritative comparison hubs.",
    expectedMetric: "+35% AI Search Citations",
    tasks: [
      "Publish 6 structured /vs/competitor technical comparison matrices",
      "Synthesize brand entity knowledge graph to resolve citation gaps",
      "Optimize FAQ and definition schemas for AI answer engines",
      "Launch bottom-funnel pricing proof & interactive ROI calculator",
    ],
  },
  {
    phase: "PHASE 3",
    days: "Days 61–90",
    title: "Programmatic Scale & Compounding Revenue Growth",
    focus: "Scale programmatic landing pages and automate continuous closed-loop learning.",
    expectedMetric: "+40–65% Attributed MRR",
    tasks: [
      "Generate 24 high-intent use-case templates via Content Agent",
      "Activate autonomous SEO Anomaly Radar with real-time alerting",
      "Integrate verified Growth Memory into weekly automated discovery runs",
      "Conduct quarterly executive growth attribution teardown",
    ],
  },
];

export default function StrategySection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="badge-subtle font-mono text-xs">
          30 / 60 / 90 Day Phased Execution Roadmap
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          A structured roadmap aligned to your North Star metric.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Growth doesn't happen randomly. SerpoAI organizes prioritized tasks into structured 30-day sprint milestones designed to compound traffic, citations, and conversions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {ROADMAP.map((mile) => (
          <div
            key={mile.phase}
            className="surface-card p-6 rounded-2xl border border-border bg-card space-y-4 flex flex-col justify-between hover-lift cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-primary font-bold text-[11px] bg-primary/10 px-2 py-0.5 rounded">
                  {mile.phase}
                </span>
                <span className="text-muted-foreground font-semibold">{mile.days}</span>
              </div>

              <h3 className="text-sm font-bold text-foreground leading-snug">{mile.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{mile.focus}</p>

              <div className="space-y-2 pt-2 border-t border-border/60">
                {mile.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-foreground font-medium">
                    <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 text-xs font-mono">
              <span className="text-[10px] text-muted-foreground block uppercase">Expected Milestone Outcome:</span>
              <span className="text-primary font-bold">{mile.expectedMetric}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
