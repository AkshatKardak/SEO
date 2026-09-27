import { useState } from "react";
import {
  Globe,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
} from "lucide-react";

interface StepDetail {
  number: string;
  badge: string;
  title: string;
  shortDesc: string;
  agent: string;
  executionTime: string;
  highlights: string[];
  mockData: {
    input: string;
    processing: string;
    output: string;
  };
}

const workflowSteps: StepDetail[] = [
  {
    number: "01",
    badge: "Step 1 · Input & Ingestion",
    title: "Enter Your Domain & Growth Targets",
    shortDesc: "Provide your homepage or subpage URL. SerpoAI automatically discovers existing sitemaps, target keywords, and top competitors.",
    agent: "Intelligence Agent",
    executionTime: "< 0.5s",
    highlights: [
      "Zero manual setup — paste any public URL or connect Google Search Console",
      "Auto-detects page architecture, tech stack & existing meta tags",
      "Identifies top 3 competitor domains to establish baseline gap benchmarks",
    ],
    mockData: {
      input: "https://yourwebsite.com + Target: 'Top 3 Search Rankings'",
      processing: "Resolving DNS, verifying SSRF CIDR security & crawling sitemap.xml...",
      output: "Ingestion complete: 18 key routes mapped & competitor baseline indexed.",
    },
  },
  {
    number: "02",
    badge: "Step 2 · Multi-Vector Scan",
    title: "60+ Signal Technical & GEO Engine Audit",
    shortDesc: "SerpoAI's multi-agent crawler inspects technical SEO, Core Web Vitals, JSON-LD schemas, and AI search visibility in real time.",
    agent: "SEO & GEO Agents",
    executionTime: "1.8s",
    highlights: [
      "Full Lighthouse-grade audits: SEO, Performance, Accessibility & Best Practices",
      "Core Web Vitals telemetry (LCP, FID/INP, CLS, TTFB) with precise millisecond metrics",
      "Generative Engine Optimization (GEO) scans for Google AI Overviews, Gemini & answer engine citations",
    ],
    mockData: {
      input: "Crawling HTML DOM, JSON-LD scripts, asset sizes & search engine visibility...",
      processing: "Analyzing 64 technical signals + querying AI search engine citation graphs...",
      output: "Raw audit matrix assembled: 87/100 Health Score, 4 missing schemas, 2 LCP bottlenecks.",
    },
  },
  {
    number: "03",
    badge: "Step 3 · Prioritization",
    title: "ICE Formula AI Opportunity Ranking",
    shortDesc: "Eliminates vague 100-page error dumps. SerpoAI calculates (Impact × Confidence) ÷ Effort to pinpoint highest-ROI fixes.",
    agent: "Growth Brain Coordinator",
    executionTime: "0.8s",
    highlights: [
      "Rigorous ICE mathematical formula: Priority Score = (Impact × Confidence / Effort) × 10",
      "Filters out low-leverage noise to focus exclusively on ranking & revenue drivers",
      "Categorizes actions by risk tier (Low, Medium, High) with human-in-the-loop controls",
    ],
    mockData: {
      input: "Evaluating 28 raw audit findings across revenue impact and engineering effort...",
      processing: "Computing ICE priority scores: (Impact 9.0 × Confidence 0.9) / Effort 1.0 = ICE 8.1",
      output: "Top 3 High-Leverage Actions surfaced with expected +24% search CTR lift.",
    },
  },
  {
    number: "04",
    badge: "Step 4 · Deployment & Lift",
    title: "Deploy 1-Click Fixes & Track Rankings Lift",
    shortDesc: "Receive copyable production-ready code diffs, meta tags, and structured schemas, with automated weekly rank tracking.",
    agent: "Action Center & Tracker",
    executionTime: "Continuous",
    highlights: [
      "Pre-generated JSON-LD Schema markup & optimized meta descriptions ready to paste",
      "Automated daily/weekly rank tracking across Google & AI Overviews",
      "Closed-loop memory records what worked to refine future growth sprints",
    ],
    mockData: {
      input: "Generating production-ready schema patches and title/meta diff blocks...",
      processing: "Applying authorized patches & configuring automated rank tracking cron...",
      output: "Patches deployed successfully. Tracking 15 keywords with automated weekly audit reports.",
    },
  },
];

export default function HowItWorks() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = workflowSteps[activeStepIndex];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/20 relative overflow-hidden border-t border-b border-border/40">
      {/* Glow backgrounds */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Cpu size={13} />
            The Autonomous Engine Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            How SerpoAI Works: <span className="gradient-text">From URL to Rankings Lift</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            A closed-loop growth engineering architecture that discovers SEO gaps, prioritizes fixes by expected ROI,
            and generates production-ready code diffs in seconds.
          </p>
        </div>

        {/* 4 Steps Horizontal Progress Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {workflowSteps.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-card border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                    : "bg-card/60 hover:bg-card border-border/70 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold text-primary">{step.executionTime}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold block truncate text-foreground mb-0.5">{step.title}</span>
                  <span className="text-[10px] text-muted-foreground truncate block">{step.badge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Interactive Card */}
        <div className="glass rounded-3xl border border-border/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Details & Key Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-extrabold uppercase border border-primary/25">
                  {activeStep.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Bot size={13} className="text-primary" />
                  Orchestrated by: <strong className="text-foreground">{activeStep.agent}</strong>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {activeStep.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {activeStep.shortDesc}
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  What Happens Under The Hood:
                </span>
                {activeStep.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : workflowSteps.length - 1))}
                  className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev < workflowSteps.length - 1 ? prev + 1 : 0))}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {activeStepIndex === workflowSteps.length - 1 ? "Explore Sample Responses" : "Next Stage"}{" "}
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Right Column: High-Tech Processing Visual Terminal */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/80 bg-background/90 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono font-bold text-foreground">SerpoAI Engine Execution</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Stage {activeStep.number}/04
                  </span>
                </div>

                {/* Step Telemetry Mock */}
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                      <Globe size={11} className="text-primary" /> Input Stream
                    </span>
                    <p className="text-foreground text-[11px] font-semibold">{activeStep.mockData.input}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                      <Cpu size={11} className="text-primary animate-spin" /> Processing Engine
                    </span>
                    <p className="text-primary text-[11px] font-medium">{activeStep.mockData.processing}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles size={11} className="text-emerald-400" /> Output Intelligence
                    </span>
                    <p className="text-emerald-300 text-[11px] font-semibold">{activeStep.mockData.output}</p>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-muted-foreground flex items-center justify-between">
                  <span>Latency: {activeStep.executionTime}</span>
                  <span className="text-emerald-400 font-bold">100% Automated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
