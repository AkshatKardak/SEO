import { Link } from "react-router-dom";
import { Check, Zap } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "/month",
        desc: "Perfect for getting started.",
        features: ["5 audits / month", "SEO + Performance scores", "AI recommendations (basic)", "7-day history"],
        cta: "Get Started Free",
        to: "/register",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        desc: "For professionals and growing sites.",
        features: ["Unlimited audits", "Full AI recommendations", "Rank Tracker (50 keywords)", "Unlimited history", "Priority processing", "Email reports"],
        cta: "Start Pro Trial",
        to: "/register",
        highlight: true,
        badge: "Most Popular",
    },
    {
        name: "Agency",
        price: "$49",
        period: "/month",
        desc: "For teams managing multiple clients.",
        features: ["Everything in Pro", "Unlimited keywords", "Bulk audit (100 URLs)", "White-label reports", "API access", "Dedicated support"],
        cta: "Contact Sales",
        to: "/register",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section className="py-24 px-4 bg-muted/30">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                        No hidden fees. Downgrade or cancel anytime.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl border p-7 flex flex-col gap-6 transition-all duration-300 ${
                                plan.highlight
                                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.03]"
                                    : "border-border bg-card hover:shadow-md"
                            }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-[11px] font-bold" style={{ color: "var(--background)" }}>
                                    <Zap size={10} className="fill-current" /> {plan.badge}
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{plan.name}</p>
                                <div className="flex items-end gap-1 mt-2">
                                    <span className="text-4xl font-black text-foreground">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground mb-1">{plan.period}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                            </div>

                            <ul className="space-y-2.5 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                                        <Check size={14} className={plan.highlight ? "text-primary" : "text-emerald-500"} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={plan.to}
                                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02] ${
                                    plan.highlight
                                        ? "bg-primary"
                                        : "border border-border hover:bg-muted"
                                }`}
                                style={plan.highlight ? { color: "var(--background)" } : {}}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
