import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-surface-elevated/50 text-foreground py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        {/* Brand Column */}
        <div className="col-span-2 space-y-3">
          <Link to="/" className="flex items-center group">
            <img src={Logo} alt="SerpoAI" className="brand-logo" />
          </Link>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            The Autonomous Search Growth Operating System. Discovers, prioritizes, executes, measures, and learns from what actually moves search revenue.
          </p>
          <div className="text-[11px] font-mono text-muted-foreground pt-1">
            Loop: DISCOVER → PRIORITIZE → EXECUTE → MEASURE → LEARN
          </div>
        </div>

        {/* Operating System */}
        <div className="space-y-2.5 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-muted-foreground text-[11px] block">
            Operating System
          </span>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><a href="#growth-loop" className="hover:text-foreground transition-colors">Growth Loop</a></li>
            <li><a href="#ice-engine" className="hover:text-foreground transition-colors">ICE Opportunity Engine</a></li>
            <li><a href="#agents" className="hover:text-foreground transition-colors">Autonomous AI Agents</a></li>
            <li><a href="#ml-predictions" className="hover:text-foreground transition-colors">ML Predictions & Radar</a></li>
            <li><a href="#growth-graph" className="hover:text-foreground transition-colors">Growth Graph</a></li>
          </ul>
        </div>

        {/* Capabilities */}
        <div className="space-y-2.5 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-muted-foreground text-[11px] block">
            Intelligence
          </span>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><a href="#geo-presence" className="hover:text-foreground transition-colors">GEO Visibility</a></li>
            <li><a href="#competitors" className="hover:text-foreground transition-colors">Competitor Intelligence</a></li>
            <li><a href="#action-center" className="hover:text-foreground transition-colors">Action Center</a></li>
            <li><a href="#growth-memory" className="hover:text-foreground transition-colors">Growth Memory</a></li>
            <li><a href="#strategy" className="hover:text-foreground transition-colors">30/60/90 Strategy</a></li>
          </ul>
        </div>

        {/* Technical Tools */}
        <div className="space-y-2.5 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-muted-foreground text-[11px] block">
            SEO Tools
          </span>
          <ul className="space-y-1.5 text-muted-foreground">
            <li><Link to="/analyze" className="hover:text-foreground transition-colors">Single URL Audit</Link></li>
            <li><Link to="/rank-tracker" className="hover:text-foreground transition-colors">Rank Tracker</Link></li>
            <li><Link to="/site-audit" className="hover:text-foreground transition-colors">Technical Crawl</Link></li>
            <li><Link to="/onboarding" className="hover:text-foreground transition-colors">Connect Domain</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground font-mono gap-4">
        <div>© {currentYear} SerpoAI Inc. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <span>Autonomous Search Growth OS</span>
          <span>·</span>
          <span>Privacy & Security</span>
          <span>·</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}