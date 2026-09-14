import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  GitPullRequest,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Architecture",
    question: "How is SerpoAI different from legacy SEO tools like Ahrefs or Semrush?",
    answer:
      "Traditional SEO platforms are passive dashboards: they crawl pages once a week and show historical charts of what already dropped. SerpoAI is an active closed-loop growth engine. It executes real-time code audits, computes deterministic ICE scores (Impact, Confidence, Ease), generates production-ready code patches (JSON-LD schemas, OpenGraph, semantic tags), and measures post-deploy ranking velocity automatically.",
  },
  {
    category: "Safety",
    question: "Will SerpoAI automatically deploy code changes without my permission?",
    answer:
      "Never. SerpoAI operates on a strict Human-in-the-Loop guarantee. Every optimization is presented as a visual git diff with linter verification and unit test predictions. You retain 100% control to review, edit, copy, or dispatch changes via GitHub Pull Request with a single click.",
  },
  {
    category: "Performance",
    question: "Why does SerpoAI use local ML rule sets alongside LLMs?",
    answer:
      "Speed, reliability, and zero hallucination risk. Over 85% of structural SEO analysis—including schema hierarchy validation, heading tree depth, keyword cannibalization, and ICE formula rankings—executes in <5ms locally using our deterministic ML rule engine with zero API latency. LLMs (Gemini, Groq, OpenRouter) are strictly reserved for generative synthesis and natural language rewrites, supported by automatic 3-tier fallbacks.",
  },
  {
    category: "GEO & AI Search",
    question: "What is GEO (Generative Engine Optimization) and why is it critical in 2025?",
    answer:
      "More than 40% of search queries now resolve directly in AI Answer Engines like Perplexity, Google AI Overviews, and ChatGPT Search without users clicking through to websites. GEO optimizes your content structure, entity relationship triples, and structured schema so your brand is cited as the authoritative canonical source inside AI-generated summaries.",
  },
  {
    category: "Integrations",
    question: "Which web frameworks and CMS platforms are supported?",
    answer:
      "SerpoAI produces framework-agnostic, web-standards compliant code. You can deploy generated patches directly into Next.js (App & Pages Router), React, Nuxt, Astro, Remix, SvelteKit, WordPress, Shopify, or plain static HTML.",
  },
  {
    category: "Security",
    question: "How does SerpoAI protect against SSRF and unauthorized crawler abuse?",
    answer:
      "Our crawler architecture runs in an isolated sandbox with comprehensive SSRF defenses: private IP range blacklisting (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, link-local metadata endpoints), strict DNS rebinding checks, TLS verification, and token bucket rate limiters.",
  },
];

const TRUST_PILLARS = [
  {
    icon: Cpu,
    title: "<5ms Deterministic Rules",
    description: "Instantaneous local machine learning audit with zero external LLM API downtime or token bottlenecks.",
    tag: "High Throughput",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop Safeguard",
    description: "Visual diffs, schema syntax verification, and manual approval safeguards before any patch is committed.",
    tag: "Zero Risk",
  },
  {
    icon: Sparkles,
    title: "GEO Answer Engine Audits",
    description: "Synthetic entity triples and citation probability scoring for Perplexity, ChatGPT, and Google SGE.",
    tag: "Next-Gen SEO",
  },
  {
    icon: Lock,
    title: "SSRF & Sandbox Protected",
    description: "Enterprise crawler with private DNS blocking, ephemeral token storage, and secure Clerk authentication.",
    tag: "Enterprise Ready",
  },
];

export default function FinalCTASection() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/70">
      {/* ── SECTION HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-elevated text-xs font-mono font-semibold text-primary">
          <HelpCircle size={13} />
          Frequently Asked Questions & Architecture
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Autonomous Growth, <br />
          <span className="text-primary">Engineered for Precision.</span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Everything you need to know about how SerpoAI combines deterministic ML rule sets, generative AI cascades, and human-in-the-loop safety.
        </p>
      </div>

      {/* ── ARCHITECTURE TRUST PILLARS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {TRUST_PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="surface-card p-6 rounded-2xl border border-border bg-card flex flex-col justify-between hover-lift transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm tracking-tight">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── INTERACTIVE FAQ ACCORDION ── */}
      <div className="max-w-3xl mx-auto space-y-3 mb-16">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-primary/40 bg-card shadow-md"
                  : "border-border bg-card/60 hover:border-border/80"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-elevated text-primary border border-primary/20 shrink-0">
                    {faq.category}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary border-primary/30" : ""
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── REFINED LAUNCHPAD (NO DUPLICATE INPUT BOX) ── */}
      <div className="surface-card p-8 sm:p-12 rounded-3xl border border-primary/30 bg-gradient-to-b from-card to-surface-elevated text-center max-w-4xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-mono font-semibold text-primary">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Live Architecture: Ready For Ingestion
        </div>

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight max-w-xl mx-auto leading-tight">
          Accelerate Your Organic Velocity with SerpoAI
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Unlock prioritized ICE opportunities, inspect generative engine citation visibility, and deploy verified fixes across your digital properties.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/analyze")}
            className="w-full sm:w-auto px-7 py-3 rounded-xl btn-primary text-xs font-bold whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            Launch Growth Engine <ArrowRight size={15} />
          </button>

          <a
            href="#growth-loop"
            className="w-full sm:w-auto px-6 py-3 rounded-xl btn-secondary text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 hover:border-primary/40"
          >
            <Layers size={14} className="text-primary" /> Review Autonomous Loop
          </a>
        </div>

        {/* System Trust Subtext */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[11px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-primary" /> 100% Free Quick Audit
          </span>
          <span className="flex items-center gap-1.5">
            <GitPullRequest size={13} className="text-primary" /> Git PR Integration
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-primary" /> Zero Production Risk
          </span>
        </div>
      </div>
    </section>
  );
}

