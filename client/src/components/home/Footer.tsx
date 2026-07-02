import { Link } from "react-router-dom";
import { Github, Twitter, Mail, Zap } from "lucide-react";

const links = {
    Product: [
        { label: "Features", to: "/#features" },
        { label: "Pricing", to: "/#pricing" },
        { label: "Changelog", to: "/" },
    ],
    Legal: [
        { label: "Privacy Policy", to: "/" },
        { label: "Terms of Service", to: "/" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border/60 pt-14 pb-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                                <Zap size={14} className="fill-current" style={{ color: "var(--background)" }} />
                            </div>
                            <span className="font-bold text-foreground text-lg">SerpoAI</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            AI-powered SEO analysis that turns raw Lighthouse data into clear, prioritised action plans.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a href="https://github.com/AkshatKardak/SEO" target="_blank" rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                                <Github size={15} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                                <Twitter size={15} />
                            </a>
                            <a href="mailto:hello@serpoai.dev" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                                <Mail size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{section}</p>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <Link to={item.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SerpoAI. All rights reserved.</p>
                    <p className="text-xs text-muted-foreground">Built with ❤️ by <a href="https://github.com/AkshatKardak" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Akshat Kardak</a></p>
                </div>
            </div>
        </footer>
    );
}
