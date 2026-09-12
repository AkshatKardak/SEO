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
      toast.success("Content brief formulated by Content Agent!");
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
            <FileText size={14} />
            High-Impact Content Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Strategic Content Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formulate high-intent comparison pages, GEO authoritative resources, and conversion-focused assets.
          </p>
        </div>

        {/* Format Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
              className={`glass rounded-2xl p-4 text-left transition-all border ${
                activeFormat === fmt.id
                  ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                  : "border-border hover:border-border/80"
              }`}
            >
              <span className="text-xl mb-1 block">{fmt.icon}</span>
              <h3 className="text-sm font-bold text-foreground">{fmt.label}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{fmt.desc}</p>
            </button>
          ))}
        </div>

        {/* Builder Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="glass rounded-2xl p-6 border border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground">Configuration</h3>

            {activeFormat === "comparison" && (
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Target Competitor
                </label>
                <input
                  type="text"
                  value={competitorName}
                  onChange={(e) => setCompetitorName(e.target.value)}
                  placeholder="e.g., Competitor Brand"
                  className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Value Proposition Angle
              </label>
              <input
                type="text"
                value={profile?.valueProposition || "Faster and more automated"}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-muted/60 border border-border text-xs text-muted-foreground outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
              <span className="font-bold text-primary block">Quality Philosophy:</span>
              <span>
                SerpoAI favors fewer, higher-leverage pieces of content with measurable business outcomes over generic bulk AI text.
              </span>
            </div>

            <button
              onClick={handleGenerateBrief}
              disabled={generating}
              className="w-full py-3 rounded-xl btn-glow font-bold text-xs flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              {generating ? "Formulating Brief..." : "Generate Strategic Brief"}
            </button>
          </div>

          {/* Generated Brief Display */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Content Strategy Brief</h3>
              {generatedBrief && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(generatedBrief, null, 2));
                    toast.success("Copied brief to clipboard!");
                  }}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Copy size={12} /> Copy Brief
                </button>
              )}
            </div>

            {!generatedBrief ? (
              <div className="text-center py-16 text-xs text-muted-foreground space-y-2">
                <FileText size={36} className="mx-auto opacity-50 mb-1" />
                <p>Click "Generate Strategic Brief" to formulate an SEO + GEO optimized asset plan.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {generatedBrief.recommendedFormat}
                  </span>
                  <h2 className="text-base font-extrabold text-foreground">{generatedBrief.title}</h2>
                  <p className="text-muted-foreground">Search Intent: <strong className="text-foreground">{generatedBrief.searchIntent}</strong></p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Primary Keyword</span>
                    <strong className="text-foreground font-mono">{generatedBrief.primaryKeyword}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Conversion CTA</span>
                    <strong className="text-foreground">{generatedBrief.cta}</strong>
                  </div>
                </div>

                {/* Structure Outline */}
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <span className="font-bold text-foreground block">Recommended Structure & Headings:</span>
                  <ul className="space-y-1 text-muted-foreground">
                    {generatedBrief.structureOutline.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* GEO Signal */}
                <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-[11px] text-accent">
                  <strong>GEO Engine Alignment:</strong> {generatedBrief.geoObjective}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
