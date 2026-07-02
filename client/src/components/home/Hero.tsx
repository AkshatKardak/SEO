import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

const stats = [
    { value: "98%", label: "Accuracy" },
    { value: "2.4s", label: "Avg. Audit Time" },
    { value: "12K+", label: "Sites Analysed" },
];

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4 pt-24 pb-16">
            {/* Radial glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/8 blur-3xl" />
            </div>

            {/* Badge */}
            <div className="relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-semibold tracking-wide uppercase">
                <Zap size={12} className="fill-primary" />
                AI-Powered SEO Intelligence
            </div>

            {/* Heading */}
            <h1 className="relative text-center font-bold leading-tight tracking-tight text-foreground" style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", maxWidth: 900 }}>
                Dominate Search Rankings
                <span className="block mt-1 gradient-text">With AI Precision</span>
            </h1>

            <p className="relative mt-6 text-center text-muted-foreground max-w-xl text-base sm:text-lg leading-relaxed">
                SerpoAI audits your website in seconds, uncovers hidden SEO gaps, and delivers actionable fixes — powered by Gemini AI.
            </p>

            {/* CTAs */}
            <div className="relative mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link
                    to="/register"
                    className="flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
                    style={{ color: "var(--background)" }}
                >
                    Start Free Audit <ArrowRight size={16} />
                </Link>
                <Link
                    to="/login"
                    className="flex items-center gap-2 px-7 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-all"
                >
                    Sign In
                </Link>
            </div>

            {/* Trust badges */}
            <div className="relative mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-primary" /> No credit card required</span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-primary" /> Free plan available</span>
            </div>

            {/* Stats bar */}
            <div className="relative mt-14 w-full max-w-lg">
                <div className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
                    {stats.map((s) => (
                        <div key={s.label} className="flex flex-col items-center py-5">
                            <span className="text-2xl font-bold text-foreground">{s.value}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating score card */}
            <div className="relative mt-10 w-full max-w-md glass rounded-2xl border border-border/60 p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-muted-foreground">example.com</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">Overall SEO Score</p>
                    </div>
                    <div className="text-3xl font-black gradient-text">87</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: "SEO", score: 91, color: "bg-emerald-500" },
                        { label: "Perf", score: 78, color: "bg-blue-500" },
                        { label: "A11y", score: 94, color: "bg-violet-500" },
                        { label: "BP", score: 85, color: "bg-amber-500" },
                    ].map((c) => (
                        <div key={c.label} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">{c.label}</span>
                                <span className="font-semibold text-foreground">{c.score}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.score}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
