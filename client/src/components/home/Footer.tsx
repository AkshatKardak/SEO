import { Link } from "react-router-dom";
import { Twitter, Mail, Zap } from "lucide-react";

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

const GithubSVG = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
);

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
                            <a
                                href="https://github.com/AkshatKardak/SEO"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                                aria-label="GitHub"
                            >
                                <GithubSVG />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter size={15} />
                            </a>
                            <a
                                href="mailto:hello@serpoai.dev"
                                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                                aria-label="Email"
                            >
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
                    <p className="text-xs text-muted-foreground">
                        Built with ❤️ by{" "}
                        <a
                            href="https://github.com/AkshatKardak"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Akshat Kardak
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
