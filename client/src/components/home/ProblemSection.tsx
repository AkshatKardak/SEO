import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center space-y-3 mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-border bg-surface text-[11px] font-mono text-warning">
          <span>PARADIGM SHIFT · OBSERVABILITY VS CHECKLISTS</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight">
          Search optimization was built for <span className="italic text-negative">checklists</span>, not revenue attribution.
        </h2>

        <p className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl mx-auto">
          Legacy tools dump 200+ disconnected warnings into Jira, leave execution to busy developers, and remain completely blind to AI Overviews and answer citations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* The Old Way */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="surface-instrument p-6 sm:p-7 rounded-md border border-border bg-surface space-y-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-negative">
              LEGACY AUDIT DUMPS
            </span>
            <span className="badge-instrument text-[10px] text-negative bg-negative/10 border-negative/20">
              UNATTRIBUTED
            </span>
          </div>

          <div className="space-y-3 text-xs text-text-secondary font-sans">
            {[
              "Hundreds of trivial warnings with zero mathematical priority",
              "No regression model to predict if a fix will drive conversions",
              "Completely blind to Google AI Overviews and answer engine citations",
              "Manual copy-pasting code snippets into engineering backlogs",
              "No closed-loop memory to learn from previous successes or failures",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <XCircle size={14} className="text-negative shrink-0 mt-0.5" />
                <span className="leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The SerpoAI Way */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="surface-instrument p-6 sm:p-7 rounded-md border border-accent/40 bg-surface space-y-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              SERPOAI AUTONOMOUS ENGINE
            </span>
            <span className="badge-instrument text-[10px] text-accent bg-accent-soft/30 border-accent/20">
              CLOSED-LOOP
            </span>
          </div>

          <div className="space-y-3 text-xs text-text-primary font-sans">
            {[
              "ICE-prioritized backlog ranked by mathematical (Impact × Confidence ÷ Effort)",
              "Machine learning regressors predicting expected traffic & conversion lift",
              "Generative Engine Optimization (GEO) tracking citations in AI search models",
              "1-click verified code patches opened as native GitHub Pull Requests",
              "Persistent growth graph memory continuously measuring attribution",
            ].map((text) => (
              <div key={text} className="flex items-start gap-2.5">
                <CheckCircle2 size={14} className="text-positive shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
