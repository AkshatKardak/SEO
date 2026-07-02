import { Search, Cpu, TrendingUp } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: <Search size={24} />,
        title: "Enter Your URL",
        desc: "Paste any public URL — homepage, blog post, product page. SerpoAI accepts anything.",
        accent: "text-primary",
        bg: "bg-primary/10",
        line: "bg-primary/30",
    },
    {
        number: "02",
        icon: <Cpu size={24} />,
        title: "AI Runs the Audit",
        desc: "Gemini AI + Lighthouse analyse 60+ signals in real time — performance, SEO, a11y and more.",
        accent: "text-violet-400",
        bg: "bg-violet-500/10",
        line: "bg-violet-400/30",
    },
    {
        number: "03",
        icon: <TrendingUp size={24} />,
        title: "Act on Insights",
        desc: "Get a prioritised action plan with exact fixes. Re-audit anytime to verify your progress.",
        accent: "text-emerald-400",
        bg: "bg-emerald-500/10",
        line: "",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-24 px-4 bg-background">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Simple process</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
                        From URL to insight in <span className="gradient-text">3 steps</span>
                    </h2>
                </div>

                {/* Steps */}
                <div className="relative flex flex-col md:flex-row items-start gap-0 md:gap-0">
                    {steps.map((step, i) => (
                        <div key={step.number} className="relative flex flex-1 flex-col items-center text-center px-6">
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] right-0 h-px bg-border" />
                            )}

                            {/* Step icon */}
                            <div className={`relative z-10 w-20 h-20 rounded-2xl ${step.bg} ${step.accent} flex items-center justify-center mb-5 border border-border/60`}>
                                {step.icon}
                                <span className="absolute -top-2 -right-2 text-[10px] font-black text-muted-foreground bg-background border border-border rounded-full w-5 h-5 flex items-center justify-center">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
