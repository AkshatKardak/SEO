import confetti from "canvas-confetti";
import { useState } from "react";
import { useProject } from "../context/ProjectContext";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContentStudio() {
  const { currentProject } = useProject();
  const profile = currentProject?.activeProfileId;

  const [activeFormat, setActiveFormat] = useState("comparison");
  const [competitorName, setCompetitorName] = useState(profile?.competitors?.[0]?.name || "Competitor");
  const [generatedBrief, setGeneratedBrief] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateBrief = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedBrief({
        title: activeFormat === "comparison"
          ? `${profile?.companyName || currentProject?.domain} vs ${competitorName}: Complete 2026 Comparison`
          : `How to Maximize Growth with ${profile?.products?.[0] || 'Modern Growth Tools'}`,
        searchIntent: "High-Commercial Intent (Ready to Buy / Evaluate)",
        targetAudience: profile?.targetAudience?.[0] || "Founders and Growth Leaders",
        businessValue: "Drives direct qualified signups by capturing high-intent searchers comparing solutions.",
        primaryKeyword: activeFormat === "comparison"
          ? `${(profile?.companyName || currentProject?.domain || "our-brand").toLowerCase()} vs ${competitorName.toLowerCase()}`
          : `best ${profile?.industry?.toLowerCase() || 'saas'} tools`,
        secondaryKeywords: [
          "pricing comparison",
          "feature matrix",
          "alternatives 2026",
          "pros and cons",
        ],
        recommendedFormat: activeFormat === "comparison" ? "Comparison Page & Feature Matrix" : "Authoritative Pillar Guide",
        structureOutline: [
          "1. Quick Summary & Verdict Table",
          `2. Core Strengths of ${profile?.companyName || 'Our Solution'}`,
          `3. Where ${competitorName} Falls Short`,
          "4. In-Depth Pricing Breakdown & Total Cost of Ownership",
          "5. Real Customer Migration Case Studies",
          "6. Final Recommendation by Company Size",
        ],
        cta: `Start Free Trial with ${profile?.companyName || 'Us'}`,
        geoObjective: "Structured to win top citation position in AI search and generative answer queries.",
      });
      try { confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"] }); } catch(e){} 
      toast.success("Content brief formulated by Content Agent!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
          <FileText size={14} />
          High-Impact Content Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-text-primary tracking-tight">
          Strategic Content <span className="italic text-accent">Engine</span>
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Formulate high-intent comparison pages, GEO authoritative resources, and conversion-focused assets.
        </p>
      </div>

      {/* Format Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: "comparison", label: "Comparison Page", desc: "Target 'Brand vs Competitor' high-intent searchers", icon: "⚔️" },
          { id: "geo_authority", label: "GEO Authority Entity", desc: "Data-rich guide designed for AI engine citation", icon: "🤖" },
          { id: "pricing_proof", label: "Pricing & ROI Page", desc: "Conversion proof asset to reduce pricing drop-off", icon: "💎" },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => {
              setActiveFormat(fmt.id);
              setGeneratedBrief(null);
            }}
            className={`rounded-lg p-4 text-left transition-all border ${
              activeFormat === fmt.id
                ? "border-accent bg-accent/10 shadow-sm"
                : "bg-surface border-border hover:border-border-strong"
            }`}
          >
            <span className="text-lg mb-1 block">{fmt.icon}</span>
            <h3 className="text-sm font-serif text-text-primary">{fmt.label}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">{fmt.desc}</p>
          </button>
        ))}
      </div>

      {/* Builder Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="bg-surface rounded-lg p-5 border border-border space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">Configuration</h3>

          {activeFormat === "comparison" && (
            <div>
              <label className="text-xs font-mono uppercase text-text-muted block mb-1">
                Target Competitor
              </label>
              <input
                type="text"
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                placeholder="e.g., Competitor Brand"
                className="w-full px-3 py-2 rounded-md bg-surface-raised border border-border text-xs text-text-primary outline-none focus:border-accent font-mono"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-mono uppercase text-text-muted block mb-1">
              Value Proposition Angle
            </label>
            <input
              type="text"
              value={profile?.valueProposition || "Faster and more automated"}
              readOnly
              className="w-full px-3 py-2 rounded-md bg-surface-raised/50 border border-border text-xs text-text-muted outline-none"
            />
          </div>

          <div className="p-3 rounded-md bg-surface-raised border border-border text-xs text-text-secondary space-y-1">
            <span className="font-mono text-accent block uppercase text-[10px]">Quality Philosophy</span>
            <span className="text-[11px] text-text-muted">
              SerpoAI favors fewer, higher-leverage pieces of content with measurable business outcomes over generic bulk AI text.
            </span>
          </div>

          <button
            onClick={handleGenerateBrief}
            disabled={generating}
            className="w-full py-2.5 rounded-md btn-primary font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            {generating ? "Formulating..." : "Generate Strategic Brief"}
          </button>
        </div>

        {/* Generated Brief Display */}
        <div className="lg:col-span-2 bg-surface rounded-lg p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">Content Strategy Brief</h3>
            {generatedBrief && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(generatedBrief, null, 2));
                  toast.success("Copied brief to clipboard!");
                }}
                className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
              >
                <Copy size={12} /> Copy Brief
              </button>
            )}
          </div>

          {!generatedBrief ? (
            <div className="text-center py-16 text-xs text-text-muted space-y-2">
              <FileText size={36} className="mx-auto opacity-40 mb-1 text-accent" />
              <p>Click "Generate Strategic Brief" to formulate an SEO + GEO optimized asset plan.</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-md bg-surface-raised border border-border space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent">
                  {generatedBrief.recommendedFormat}
                </span>
                <h2 className="text-base font-serif text-text-primary">{generatedBrief.title}</h2>
                <p className="text-text-muted">Search Intent: <strong className="text-text-primary">{generatedBrief.searchIntent}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-md bg-surface-raised border border-border font-mono">
                  <span className="text-text-muted block text-[10px] uppercase">Primary Keyword</span>
                  <strong className="text-text-primary">{generatedBrief.primaryKeyword}</strong>
                </div>
                <div className="p-3 rounded-md bg-surface-raised border border-border">
                  <span className="text-text-muted block text-[10px] uppercase font-mono">Conversion CTA</span>
                  <strong className="text-text-primary">{generatedBrief.cta}</strong>
                </div>
              </div>

              {/* Structure Outline */}
              <div className="p-4 rounded-md bg-surface-raised border border-border space-y-2">
                <span className="font-mono text-text-primary block text-xs uppercase tracking-wide">Recommended Structure &amp; Headings:</span>
                <ul className="space-y-1 text-text-secondary">
                  {generatedBrief.structureOutline.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-accent shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GEO Signal */}
              <div className="p-3 rounded-md bg-surface-raised border border-accent/30 text-[11px] text-text-secondary font-mono">
                <strong className="text-accent">GEO Engine Alignment:</strong> {generatedBrief.geoObjective}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
