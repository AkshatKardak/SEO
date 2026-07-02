import { Zap, BarChart2, Target, RefreshCw, ShieldCheck, Brain } from "lucide-react";

const features = [
    {
        icon: <Brain size={22} />,
        title: "AI-Powered Recommendations",
        desc: "Gemini AI analyses your page and generates human-readable, prioritised fixes — not just raw numbers.",
        accent: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
    },
    {
        icon: <Zap size={22} />,
        title: "Instant Deep Audits",
        desc: "Lighthouse-grade audits in under 3 seconds. SEO, performance, accessibility and best practices — all at once.",
        accent: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
    {
        icon: <Target size={22} />,
        title: "Keyword Rank Tracker",
        desc: "Track exactly where your target URLs rank for chosen keywords and watch your progress over time.",
        accent: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20",
    },
    {
        icon: <BarChart2 size={22} />,
        title: "Score History & Trends",
        desc: "Every audit is saved. Compare before/after scores and visualise your SEO trajectory over weeks.",
        accent: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
    },
    {
        icon: <RefreshCw size={22} />,
        title: "Re-Audit on Demand",
        desc: "Push a fix and instantly re-audit the same URL to confirm your improvement without any manual effort.",
        accent: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        icon: <ShieldCheck size={22} />,
        title: "Best Practice Checks",
        desc: "Automated checks for HTTPS, Core Web Vitals, mobile-friendliness, meta tags and 40+ other signals.",
        accent: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
    },
];

export default function Features() {
    return (
        <section className="py-24 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Everything you need</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                        Built for modern SEO teams
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                        From solo bloggers to agencies — SerpoAI gives you enterprise-grade insight without the enterprise price tag.
                    </p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={`group relative rounded-2xl border ${f.border} bg-card p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                        >
                            <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.accent} flex items-center justify-center shrink-0`}>
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
