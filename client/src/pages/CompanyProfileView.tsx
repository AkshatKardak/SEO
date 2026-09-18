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
      <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
        <Building size={36} className="mx-auto text-accent opacity-60" />
        <h3 className="text-base font-serif text-text-primary">No Knowledge Graph Available</h3>
        <p className="text-xs text-text-muted">
          Run a website scan from the Dashboard or Onboarding to automatically generate the Company Knowledge Graph.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent mb-1">
          <Sparkles size={14} />
          Company Knowledge Graph & Positioning
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-text-primary tracking-tight">
          {profile.companyName || currentProject?.name || "Company Intelligence"}
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Industry: <strong className="text-text-primary font-mono">{profile.industry}</strong> · Synthesized from website crawling + LLM reasoning.
        </p>
      </div>

      <div className="space-y-6">
        {/* Overview & Value Prop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-surface rounded-lg p-5 border border-border space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Company Description
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{profile.description}</p>

            <div className="pt-3 border-t border-border">
              <span className="text-xs font-mono uppercase text-accent block mb-1">Core Value Proposition:</span>
              <p className="text-xs text-text-primary italic">"{profile.valueProposition}"</p>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-5 border border-border space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
              Products & Services
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(profile.products || []).concat(profile.services || []).map((prod: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-surface-raised border border-border text-xs font-mono text-text-primary"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Buyer Personas */}
        <div className="bg-surface rounded-lg p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">Target Buyer Personas</h3>
              <p className="text-xs text-text-secondary mt-0.5">Identified core customer archetypes and motivations</p>
            </div>
            <Users size={16} className="text-accent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(profile.buyerPersonas || []).map((persona: any, i: number) => (
              <div key={i} className="p-4 rounded-md bg-surface-raised border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-text-primary">{persona.name}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                    {persona.role}
                  </span>
                </div>

                {persona.painPoints?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-danger block">Core Pain Points:</span>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {persona.painPoints.map((pt: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-danger mt-0.5 font-mono">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {persona.goals?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-success block">Goals & Desires:</span>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {persona.goals.map((g: string, j: number) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-success mt-0.5 font-mono">•</span>
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
          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">Key Market Competitors</h3>
            <div className="space-y-2">
              {(profile.competitors || []).map((comp: any, i: number) => (
                <div key={i} className="p-3 rounded-md bg-surface-raised border border-border text-xs space-y-1">
                  <span className="font-semibold text-text-primary block">{comp.name}</span>
                  {comp.differentiation && (
                    <p className="text-text-muted text-[11px]">{comp.differentiation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Growth Bottlenecks */}
          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">Identified Growth Bottlenecks</h3>
            <div className="space-y-2">
              {(profile.growthBottlenecks || []).map((bot: string, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-surface-raised border border-warning/30 text-xs text-text-primary flex items-start gap-2"
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
  );
}
