import {
  Target,
  Sparkles,
  Bot,
  FileCode2,
  Compass,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles size={22} />,
    title: "Generative Engine Optimization (GEO)",
    desc: "Ensure your brand is cited and recommended as the primary source in Google AI Overviews, Gemini, and Generative Answer Engines.",
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: <Bot size={22} />,
    title: "5 Autonomous Growth Agents",
    desc: "Specialized AI agents for technical SEO, GEO blueprints, conversion comparison content, knowledge graph synthesis, and metric analysis.",
    accent: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: <Cpu size={22} />,
    title: "ICE Mathematical Prioritization",
    desc: "No more 100-page unranked audit dumps. Fixes are scored by (Impact × Confidence) ÷ Effort to pinpoint maximum revenue ROI.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: <Target size={22} />,
    title: "Keyword Rank & SERP Delta Tracker",
    desc: "Track daily rankings, keyword position changes, search volume, and AI Overview captures across Google and modern search engines.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: <FileCode2 size={22} />,
    title: "1-Click Code & Schema Deployment",
    desc: "Receive production-ready JSON-LD structured data, metadata tags, and Core Web Vitals speed optimizations ready to copy and deploy.",
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: <Compass size={22} />,
    title: "30-60-90 Day Strategic Roadmaps",
    desc: "Automated phased growth roadmaps tied to your North Star metric, with closed-loop organizational memory that learns from every test.",
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-muted/20 border-t border-border/40">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Next-Gen SEO Architecture</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
            Built for modern search & <span className="gradient-text">AI Answer Engines</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            From high-growth startups to enterprise engineering teams — SerpoAI turns complex search data into automated, measurable growth.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border ${f.border} bg-card p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="space-y-4">
                <div className={`w-11 h-11 rounded-xl ${f.bg} ${f.accent} flex items-center justify-center shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-primary">
                <span>Autonomous Capability</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Included Free →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
