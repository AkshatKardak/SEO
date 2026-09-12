import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function FinalCTASection() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/analyze?url=${encodeURIComponent(url.trim())}`);
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="surface-card p-8 sm:p-14 rounded-3xl border border-border bg-card text-center max-w-4xl mx-auto space-y-6 shadow-xl relative overflow-hidden hover-lift">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-elevated text-xs font-mono font-semibold text-primary">
          <Sparkles size={13} />
          Ready to scale search traffic & AI citations?
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl mx-auto leading-tight">
          Turn Search Data <br />
          <span className="text-primary">Into Measurable Growth.</span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Connect your domain in seconds. Discover ICE-ranked opportunities, deploy verified code patches, and start compounding your organic search velocity.
        </p>

        {/* URL Input Form */}
        <div className="pt-2 max-w-lg mx-auto">
          <form
            onSubmit={handleScan}
            className="p-1.5 rounded-2xl bg-surface-elevated border border-border flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3.5 py-2 w-full bg-transparent">
              <Globe size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-primary text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
            >
              Run Growth Scan <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary" /> SSRF-Safe Cloud Crawler
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-primary" /> 1-Click Code Verification
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" /> GEO Answer Engine Support
          </span>
        </div>
      </div>
    </section>
  );
}
