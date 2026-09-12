import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Sparkles,
  FileText,
  BarChart3,
  Terminal,
} from "lucide-react";

interface AgentDef {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  purpose: string;
  inputs: string[];
  outputs: string[];
  status: string;
  exampleTask: string;
}

const AGENTS: AgentDef[] = [
  {
    id: "intelligence",
    name: "Intelligence Agent",
    category: "Knowledge Graph & Entity Extraction",
    icon: <Brain size={20} className="text-primary" />,
    purpose: "Constructs deep domain models, buyer personas, value propositions, and growth bottlenecks from crawled pages.",
    inputs: ["Raw DOM text", "Meta signals", "Competitor domains", "Company profile"],
    outputs: ["Company Knowledge Graph", "Target Personas", "Bottleneck Hierarchy"],
    status: "Active · 1,420 tokens / run",
    exampleTask: "Synthesizing full entity graph and key value propositions for cloudflow.io",
  },
  {
    id: "seo",
    name: "SEO Agent",
    category: "Technical & On-Page Execution",
    icon: <ShieldCheck size={20} className="text-primary" />,
    purpose: "Detects technical hygiene defects, formats structured JSON-LD schemas, optimizes Core Web Vitals, and resolves indexation conflicts.",
    inputs: ["DOM tree", "Lighthouse metrics", "Canonical headers", "Robots.txt"],
    outputs: ["1-Click JSON-LD code diffs", "LCP / CLS code patches", "Meta title/desc rewrites"],
    status: "Active · 0.94s execution latency",
    exampleTask: "Generating SoftwareApplication JSON-LD schema patch for pricing page",
  },
  {
    id: "geo",
    name: "GEO Agent",
    category: "Generative Engine Optimization",
    icon: <Sparkles size={20} className="text-primary" />,
    purpose: "Simulates citation likelihood across Google AI Overviews, Gemini, and Generative Answer Engines, optimizing brand entity coverage.",
    inputs: ["High-intent search queries", "Answer engine citations", "Competitor mentions"],
    outputs: ["Citation gap analysis", "Entity claim blueprints", "AI search authority fixes"],
    status: "Active · 74% citation rate target",
    exampleTask: "Analyzing AI search citation footprint for query 'best SaaS growth engine'",
  },
  {
    id: "content",
    name: "Content Agent",
    category: "High-Intent Editorial Briefs",
    icon: <FileText size={20} className="text-primary" />,
    purpose: "Synthesizes bottom-funnel comparison matrices, feature alternative guides, and programmatic SEO outlines focused strictly on conversions.",
    inputs: ["Topic gaps", "Competitor keyword overlaps", "User search intent"],
    outputs: ["Comparison article briefs", "Programmatic template outlines", "Conversion CTA placement"],
    status: "Active · 3 briefs synthesized",
    exampleTask: "Creating complete /vs/competitor technical breakdown and comparison matrix",
  },
  {
    id: "analyst",
    name: "Growth Analyst Agent",
    category: "Attribution & Outcome Learning",
    icon: <BarChart3 size={20} className="text-primary" />,
    purpose: "Measures closed-loop attribution from organic search to revenue, extracts verified experiment learnings into Growth Memory, and feeds the ML engine.",
    inputs: ["Search Console telemetry", "Conversion events", "Historical experiment logs"],
    outputs: ["Growth Graph attribution", "Verified Growth Memory rules", "Anomaly alerts"],
    status: "Active · Closed-loop active",
    exampleTask: "Calculating MRR delta attributed to schema patch deployed 14 days ago",
  },
];

export default function AIAgentsSection() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDef>(AGENTS[0]);

  return (
    <section id="agents" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <div className="badge-subtle font-mono text-xs">
          Multi-Agent Autonomous Execution Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Specialized AI agents for every layer of search growth.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Instead of a generic chatbot, SerpoAI orchestrates 5 dedicated agents with precise inputs, rigorous safety constraints, and verifiable code outputs.
        </p>
      </div>

      {/* ── Agent System Selector ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {AGENTS.map((agent) => {
          const isSelected = selectedAgent.id === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover-lift ${
                isSelected
                  ? "bg-card border-primary shadow-md ring-1 ring-primary/40"
                  : "bg-surface-elevated border-border hover:border-primary/50 hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {agent.icon}
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </div>
              <div className="text-xs font-bold text-foreground truncate">{agent.name}</div>
              <div className="text-[10px] font-mono text-muted-foreground truncate">{agent.category}</div>
            </button>
          );
        })}
      </div>

      {/* ── Agent Detail Surface ── */}
      <div className="surface-card p-6 sm:p-8 rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                {selectedAgent.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">{selectedAgent.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    SYSTEM COMPONENT
                  </span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">{selectedAgent.category}</p>
              </div>
            </div>

            <p className="text-sm text-foreground font-medium leading-relaxed">
              {selectedAgent.purpose}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 hover-lift cursor-pointer">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                  Data Inputs
                </span>
                <div className="space-y-1 text-xs font-mono text-foreground font-medium">
                  {selectedAgent.inputs.map((inp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-primary font-bold">›</span>
                      <span>{inp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 hover-lift cursor-pointer">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                  Generated Artifacts
                </span>
                <div className="space-y-1 text-xs font-mono text-foreground font-medium">
                  {selectedAgent.outputs.map((out, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-primary font-bold">✓</span>
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Terminal & Task State */}
          <div className="lg:col-span-5 p-5 rounded-xl border border-border bg-surface-elevated font-mono text-xs space-y-3 hover-lift">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border pb-2">
              <span className="flex items-center gap-1.5 text-foreground font-bold">
                <Terminal size={14} className="text-primary" /> AGENT RUN TELEMETRY
              </span>
              <span className="text-primary font-bold">{selectedAgent.status}</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <span className="text-muted-foreground uppercase block text-[10px]">Current In-Flight Task:</span>
              <div className="p-2.5 rounded-lg bg-card border border-border text-foreground font-mono">
                {selectedAgent.exampleTask}
              </div>
            </div>

            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Verification Check:</span>
                <span className="text-primary font-bold">Passed (0 errors)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Approval Safety Level:</span>
                <span className="text-foreground">Human Review Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
