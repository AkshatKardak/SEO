import { useProject } from "../context/ProjectContext";
import {
  Sparkles,
  Users,
  AlertTriangle,
  Building,
} from "lucide-react";

export default function CompanyProfileView() {
  const { currentProject } = useProject();
  const profile = currentProject?.activeProfileId;

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center px-4">
        <div className="glass max-w-md p-8 rounded-2xl text-center space-y-3">
          <Building size={36} className="mx-auto text-primary opacity-60" />
          <h3 className="text-base font-bold text-foreground">No Knowledge Graph Available</h3>
          <p className="text-xs text-muted-foreground">
            Run a website scan from the Dashboard or Onboarding to automatically generate the Company Knowledge Graph.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
            <Sparkles size={14} />
            Company Knowledge Graph & Positioning
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {profile.companyName || currentProject?.name || "Company Intelligence"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Industry: <strong className="text-foreground">{profile.industry}</strong> · Synthesized from website crawling + LLM reasoning.
          </p>
        </div>

        <div className="space-y-6">
          {/* Overview & Value Prop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass rounded-2xl p-6 border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Company Description
              </h3>
              <p className="text-sm text-foreground leading-relaxed">{profile.description}</p>

              <div className="pt-3 border-t border-border/60">
                <span className="text-xs font-bold text-primary block mb-1">Core Value Proposition:</span>
                <p className="text-xs font-semibold text-foreground italic">"{profile.valueProposition}"</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-border space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Products & Services
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(profile.products || []).concat(profile.services || []).map((prod: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Buyer Personas */}
          <div className="glass rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Target Buyer Personas</h3>
                <p className="text-xs text-muted-foreground">Identified core customer archetypes and motivations</p>
              </div>
              <Users size={18} className="text-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile.buyerPersonas || []).map((persona: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-card/70 border border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{persona.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {persona.role}
                    </span>
                  </div>

                  {persona.painPoints?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-danger uppercase block">Core Pain Points:</span>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {persona.painPoints.map((pt: string, j: number) => (
                          <li key={j} className="flex items-start gap-1.5">
                            <span className="text-danger mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {persona.goals?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-success uppercase block">Goals & Desires:</span>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {persona.goals.map((g: string, j: number) => (
                          <li key={j} className="flex items-start gap-1.5">
                            <span className="text-success mt-0.5">•</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Competitors & Growth Bottlenecks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Competitors */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="text-sm font-bold text-foreground mb-3">Key Market Competitors</h3>
              <div className="space-y-2.5">
                {(profile.competitors || []).map((comp: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-card/60 border border-border/60 text-xs space-y-1">
                    <span className="font-bold text-foreground block">{comp.name}</span>
                    {comp.differentiation && (
                      <p className="text-muted-foreground text-[11px]">{comp.differentiation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Bottlenecks */}
            <div className="glass rounded-2xl p-6 border border-border">
              <h3 className="text-sm font-bold text-foreground mb-3">Identified Growth Bottlenecks</h3>
              <div className="space-y-2">
                {(profile.growthBottlenecks || []).map((bot: string, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-warning/5 border border-warning/20 text-xs text-foreground flex items-start gap-2"
                  >
                    <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
                    <span>{bot}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
