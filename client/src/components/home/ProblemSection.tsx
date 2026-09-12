import { CheckCircle2, Ban, Zap } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold font-mono uppercase">
          The Problem With Traditional SEO
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          SEO is broken into 100-page checklists with zero business attribution.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Traditional SEO tools dump hundreds of trivial warnings into your lap, leave execution to overworked engineers, and remain completely blind to modern AI search engines and answer citations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* The Old Way */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-5 hover-lift transition-all">
          <div className="flex items-center gap-2.5 text-danger font-bold text-sm uppercase tracking-wider font-mono">
            <Ban size={18} />
            The Old Way: Disconnected Audits
          </div>

          <div className="space-y-3.5 text-xs text-muted-foreground">
            {[
              "Endless lists of 200+ warnings with no mathematical priority",
              "Zero understanding of whether a fix will drive revenue or bounce",
              "Completely blind to AI answer engines and generative citations",
              "Requires manual copy-pasting into tickets for engineers to code",
              "No closed-loop memory to learn from previous wins and failures",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <span className="text-danger font-bold text-sm mt-0.5">✕</span>
                <span className="leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The SerpoAI Way */}
        <div className="p-6 sm:p-8 rounded-2xl border border-primary/40 bg-card space-y-5 shadow-sm hover-lift transition-all">
          <div className="flex items-center gap-2.5 text-primary font-bold text-sm uppercase tracking-wider font-mono">
            <Zap size={18} />
            The SerpoAI Way: Autonomous Growth OS
          </div>

          <div className="space-y-3.5 text-xs text-foreground">
            {[
              "ICE-prioritized backlog ranked by mathematical (Impact × Confidence ÷ Effort)",
              "Machine learning predictions on expected traffic and conversion lift",
              "Deep Generative Engine Optimization (GEO) across Google AI Overviews, Gemini, & Generative Search",
              "High-trust Action Center with 1-click verified code patches and human approval",
              "Persistent Growth Memory that learns which changes move actual revenue",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
