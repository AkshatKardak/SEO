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
  BookOpen,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface GlossaryItem {
  term: string;
  definition: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Basics",
    question: "What is SerpoAI?",
    answer:
      "SerpoAI is an autonomous search growth operating system. It continuously audits technical DOM health, predicts high-yield ranking fixes using mathematical ICE scoring and local ML models, and opens syntactically verified GitHub Pull Requests with zero production risk.",
  },
  {
    category: "Architecture",
    question: "How does SerpoAI differ from legacy suites like Semrush or Ahrefs?",
    answer:
      "Legacy SEO platforms are retrospective reporting dashboards: they tell you what dropped last week and dump a 200-item checklist into your Jira backlog. SerpoAI is an execution engine: it ranks fixes by predictive revenue yield, generates verified AST code patches (JSON-LD schemas, canonicals, redirect graphs), and dispatches pull requests through Serpo Bot in 1 click.",
  },
  {
    category: "GEO & AI Search",
    question: "What is GEO and how does SerpoAI track citations?",
    answer:
      "Generative Engine Optimization (GEO) audits how frequently AI answer engines (ChatGPT Search, Perplexity AI, Google AI Overviews, Gemini) cite and anchor your brand as a primary source. SerpoAI measures citation share, entity triple consistency, and competitor presence.",
  },
  {
    category: "Safety",
    question: "Will Serpo Bot commit code without my team's approval?",
    answer:
      "Never. We follow a strict 'Human-in-the-Loop' governance protocol. Serpo Bot generates isolated feature branches and opens GitHub Pull Requests with automated AST syntax validation. Nothing merges into your production branch without explicit engineering sign-off.",
  },
  {
    category: "Compatibility",
    question: "Can non-developers use SerpoAI?",
    answer:
      "Yes. In addition to direct GitHub PR dispatching, SerpoAI provides copy-paste ready code diffs, JSON-LD schemas, and high-intent content briefs that can be deployed into WordPress, Webflow, Shopify, or custom headless CMS platforms.",
  },
  {
    category: "Security",
    question: "How is telemetry data and repository access secured?",
    answer:
      "Crawler runs enforce strict SSRF protection (never accessing private subnet ranges). Authentication is verified via Clerk, and repository integrations use scoped OAuth tokens with zero persistent write privileges beyond opening PR branches.",
  },
];

const GLOSSARY_TERMS: GlossaryItem[] = [
  {
    term: "ICE Scoring",
    definition: "A mathematical prioritization formula (Impact × Confidence ÷ Effort) from 1 to 10 that orders search fixes by net expected traffic and conversion yield.",
  },
  {
    term: "GEO (Generative Engine Optimization)",
    definition: "Techniques for structuring website knowledge triples and schema entities so LLM answer engines (Perplexity, ChatGPT) cite your company as an authority source.",
  },
  {
    term: "JSON-LD Schema",
    definition: "Structured data conforming to Schema.org standards embedded in the DOM, enabling search engines and AI agents to ingest explicit entity facts.",
  },
  {
    term: "Keyword Cannibalization",
    definition: "An anomaly where two or more URLs on the same domain compete for identical query intent, diluting click-through potential across both pages.",
  },
  {
    term: "Striking Distance Keywords",
    definition: "Queries currently ranking on positions #4 through #15 with established impression volume, requiring low-effort technical optimization to reach top-3 CTR leaps.",
  },
  {
    term: "AST Verification",
    definition: "Abstract Syntax Tree analysis ensuring that injected code snippets and structured tags are mathematically valid and free of syntax errors prior to git dispatch.",
  },
  {
    term: "SSRF Protection",
    definition: "Server-Side Request Forgery filtering that prevents crawler processes from targeting private internal IP addresses, subnets, or loopbacks.",
  },
  {
    term: "Attributed MRR",
    definition: "Closed-loop growth telemetry connecting initial search query impressions to final product signups and recognized recurring revenue.",
  },
];

const TRUST_PILLARS = [
  {
    icon: Cpu,
    title: "Instant Smart Audits",
    description: "Local scikit-learn models evaluate 60+ DOM hygiene vectors in sub-second iterations.",
    tag: "Deterministic ML",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop",
    description: "Every code patch is presented as a verifiable AST diff. Zero unreviewed commits.",
    tag: "Zero Prod Risk",
  },
  {
    icon: Sparkles,
    title: "GEO Citation Radar",
    description: "Audit entity citation frequency across Perplexity, ChatGPT Search, and Google AI Overviews.",
    tag: "Next-Gen GEO",
  },
  {
    icon: Lock,
    title: "Hardened Security",
    description: "SSRF-protected crawlers, Clerk authentication, and isolated sandboxed execution.",
    tag: "Enterprise Safe",
  },
];

export default function FinalCTASection() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border select-none">
      {/* ── SECTION HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
          <HelpCircle size={11} />
          Architecture & System Knowledge
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-text-primary tracking-tight leading-tight">
          Autonomous search, <br />
          <span className="italic text-accent">engineered for precision.</span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          How SerpoAI coordinates deterministic ML rule sets, generative answer engine optimization, and human-in-the-loop GitHub dispatch.
        </p>
      </div>

      {/* ── ARCHITECTURE TRUST PILLARS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-14">
        {TRUST_PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="surface-instrument p-4.5 rounded-md border border-border bg-surface flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded bg-accent-soft text-accent border border-accent/20 flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <span className="badge-instrument text-[9px] font-mono text-text-muted">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-text-primary text-xs tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-[11px] font-sans text-text-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── INTERACTIVE FAQ ACCORDION ── */}
      <div className="max-w-3xl mx-auto space-y-2 mb-14">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-md border transition-all duration-150 overflow-hidden bg-surface ${
                isOpen ? "border-border-strong shadow-2xs" : "border-border hover:border-border-strong"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="badge-instrument text-[9px] font-mono text-accent border-accent/20 shrink-0">
                    {faq.category}
                  </span>
                  <span className="text-xs font-semibold text-text-primary tracking-tight truncate">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-text-muted shrink-0 transition-transform duration-150 ${
                    isOpen ? "rotate-180 text-text-primary" : ""
                  }`}
                >
                  <ChevronDown size={14} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs font-sans text-text-secondary leading-relaxed border-t border-border/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── PLAIN-ENGLISH GLOSSARY OF TERMS ── */}
      <div className="max-w-4xl mx-auto mb-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="badge-instrument text-[10px] font-mono uppercase tracking-wider text-accent border-accent/20">
            <BookOpen size={11} />
            Search & Machine Learning Lexicon
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-text-primary">
            Key terminology, strictly defined.
          </h3>
          <p className="font-sans text-xs text-text-secondary max-w-md mx-auto">
            Clear definitions of search engineering concepts and machine learning primitives used across SerpoAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded border border-border bg-surface hover:border-border-strong transition-colors space-y-1"
            >
              <div className="font-mono text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{item.term}</span>
              </div>
              <p className="text-xs font-sans text-text-secondary leading-relaxed pl-3">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── REFINED LAUNCHPAD (PRECISION INSTRUMENT) ── */}
      <div className="surface-instrument p-8 sm:p-12 rounded-md border border-border bg-surface text-center max-w-4xl mx-auto space-y-5 shadow-xs relative overflow-hidden">
        <div className="badge-instrument text-[10px] font-mono text-accent border-accent/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
          <span>SERPO ENGINE · READY FOR URL INGESTION</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal text-text-primary tracking-tight leading-tight max-w-xl mx-auto">
          Accelerate your organic velocity with <span className="italic text-accent">SerpoAI</span>.
        </h3>

        <p className="font-sans text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
          Unlock prioritized ICE opportunities, inspect generative engine citation visibility, and deploy verified code patches across your digital properties.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => navigate("/analyze")}
            className="btn-primary w-full sm:w-auto h-9 px-5 text-xs font-semibold gap-1.5"
          >
            <span>Launch Growth Engine</span>
            <ArrowRight size={13} />
          </button>

          <a
            href="#growth-loop"
            className="btn-secondary w-full sm:w-auto h-9 px-4 text-xs font-medium gap-1.5"
          >
            <Layers size={13} className="text-text-muted" />
            <span>Review Operating Architecture</span>
          </a>
        </div>

        {/* System Trust Subtext */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-[11px] text-text-muted font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-accent" /> 100% Free Initial Telemetry
          </span>
          <span className="flex items-center gap-1.5">
            <GitPullRequest size={12} className="text-accent" /> GitHub PR Webhook Dispatch
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={12} className="text-accent" /> Zero Production Risk
          </span>
        </div>
      </div>
    </section>
  );
}


