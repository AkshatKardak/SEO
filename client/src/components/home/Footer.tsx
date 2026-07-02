import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Logo from "../../assets/Logo.png";

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
        <footer className="bg-background border-t border-border/40 pt-16 pb-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 w-fit group">
                            <img
                                src={Logo}
                                alt="SerpoAI Logo"
                                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
                            />
                        </Link>

                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
                            AI-powered SEO analysis that turns raw Lighthouse data into clear, prioritised action plans.
                        </p>

                        <a
                            href="mailto:hello@serpoai.dev"
                            className="inline-flex items-center gap-2 w-8 h-8 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all justify-center"
                            aria-label="Email us"
                        >
                            <Mail size={15} />
                        </a>
                    </div>

                    {/* Nav Links */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                {section}
                            </p>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.to}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border/40">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} SerpoAI. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Built with Love by{" "}
                        <a
                            href="https://github.com/AkshatKardak"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline underline-offset-2 transition-colors"
                        >
                            Akshat Kardak
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}