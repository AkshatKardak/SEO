import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface text-text-primary py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
        {/* Brand Column */}
        <div className="col-span-2 space-y-3">
          <Link to="/" className="flex items-center group">
            <img src={Logo} alt="SerpoAI" className="brand-logo" />
          </Link>
          <p className="text-xs font-sans text-text-secondary max-w-sm leading-relaxed">
            The Autonomous Search Growth Operating System. Continuous Crawling → Mathematical ICE Prioritization → AST Code Patches → Git PR Dispatch → Closed-Loop Revenue Attribution.
          </p>
          <div className="text-[10px] font-mono text-text-muted pt-0.5">
            PIPELINE: DISCOVER → PRIORITIZE → SYNTHESIZE → EXECUTE → MEASURE → REPEAT
          </div>
        </div>

        {/* Operating System */}
        <div className="space-y-2 text-xs font-sans">
          <span className="font-mono font-bold uppercase tracking-wider text-text-muted text-[10px] block">
            Operating System
          </span>
          <ul className="space-y-1.5 text-text-secondary text-xs">
            <li><a href="#growth-loop" className="hover:text-text-primary transition-colors">Growth Loop</a></li>
            <li><a href="#platform-showcase" className="hover:text-text-primary transition-colors">ICE Opportunity Engine</a></li>
            <li><Link to="/actions" className="hover:text-text-primary transition-colors">Serpo Bot Actions</Link></li>
            <li><Link to="/opportunities" className="hover:text-text-primary transition-colors">ML Predictions</Link></li>
            <li><Link to="/analytics" className="hover:text-text-primary transition-colors">Growth Graph</Link></li>
          </ul>
        </div>

        {/* Capabilities */}
        <div className="space-y-2 text-xs font-sans">
          <span className="font-mono font-bold uppercase tracking-wider text-text-muted text-[10px] block">
            Intelligence
          </span>
          <ul className="space-y-1.5 text-text-secondary text-xs">
            <li><Link to="/geo" className="hover:text-text-primary transition-colors">GEO Citation Radar</Link></li>
            <li><Link to="/competitors" className="hover:text-text-primary transition-colors">Competitor Intel</Link></li>
            <li><Link to="/strategy" className="hover:text-text-primary transition-colors">30/60/90 Strategy</Link></li>
            <li><Link to="/experiments" className="hover:text-text-primary transition-colors">Growth Memory</Link></li>
            <li><Link to="/content" className="hover:text-text-primary transition-colors">Content Studio</Link></li>
          </ul>
        </div>

        {/* Technical Tools */}
        <div className="space-y-2 text-xs font-sans">
          <span className="font-mono font-bold uppercase tracking-wider text-text-muted text-[10px] block">
            Telemetry Tools
          </span>
          <ul className="space-y-1.5 text-text-secondary text-xs">
            <li><Link to="/analyze" className="hover:text-text-primary transition-colors">Single URL Audit</Link></li>
            <li><Link to="/rank-tracker" className="hover:text-text-primary transition-colors">Rank Tracker</Link></li>
            <li><Link to="/site-audit" className="hover:text-text-primary transition-colors">Technical Crawl</Link></li>
            <li><Link to="/onboarding" className="hover:text-text-primary transition-colors">Connect Domain</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted font-mono gap-4">
        <div>© {currentYear} SerpoAI Inc. Precision Search Telemetry.</div>
        <div className="flex items-center gap-5">
          <span>SSRF Protected</span>
          <span>·</span>
          <span>Clerk Verified</span>
          <span>·</span>
          <span>AST Safe</span>
        </div>
      </div>
    </footer>
  );
}