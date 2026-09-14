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

interface GlossaryItem {
  term: string;
  definition: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Basics",
    question: "What is SerpoAI?",
    answer:
      "SerpoAI is an all-in-one search growth tool that helps your website rank higher on Google and get cited by AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. It automatically finds what is slowing down your search traffic and writes the exact code fixes for you.",
  },
  {
    category: "Audience",
    question: "Who is SerpoAI for?",
    answer:
      "SerpoAI is built for founders, developers, product teams, and marketers who want more organic search traffic without hiring expensive agencies or spending hours manually writing SEO code.",
  },
  {
    category: "Comparison",
    question: "How is SerpoAI different from tools like Ahrefs or Semrush?",
    answer:
      "Traditional SEO tools only show you charts and tell you what already went wrong in the past. SerpoAI is an execution engine: it finds your highest-priority fixes, generates the exact code changes (like JSON-LD schemas and meta tags), and lets you open a GitHub Pull Request with one click.",
  },
  {
    category: "Safety",
    question: "Will SerpoAI change my code or website without my permission?",
    answer:
      "Never. We follow a strict 'Human-in-the-Loop' rule. You always see the exact code preview before anything happens. Nothing is merged or committed without your explicit approval.",
  },
  {
    category: "Simplicity",
    question: "Do I need to know how to code to use SerpoAI?",
    answer:
      "No. SerpoAI creates ready-to-use snippets that you can copy and paste into any website builder (WordPress, Webflow, Shopify) or dispatch directly to GitHub if you are a developer.",
  },
  {
    category: "Pricing",
    question: "How much does it cost to get started?",
    answer:
      "You can run your first website scan completely free with zero credit card required.",
  },
];

const GLOSSARY_TERMS: GlossaryItem[] = [
  {
    term: "SEO (Search Engine Optimization)",
    definition: "The practice of improving your website so it ranks higher in organic Google search results.",
  },
  {
    term: "GEO (Generative Engine Optimization)",
    definition: "Optimizing your content so AI engines like ChatGPT and Perplexity quote and link to your website in their answers.",
  },
  {
    term: "ICE Score",
    definition: "A simple formula (Impact × Confidence ÷ Effort) from 1 to 10 that tells you which SEO task will give you the fastest results.",
  },
  {
    term: "JSON-LD Schema",
    definition: "A clean snippet of code hidden on your page that tells Google and AI bots exact facts about your company, products, and articles.",
  },
  {
    term: "Canonical Tag",
    definition: "An HTML tag that tells Google which version of a page is the original one when you have similar or duplicate pages.",
  },
  {
    term: "CTR (Click-Through Rate)",
    definition: "The percentage of people who see your website in search results and actually click on it.",
  },
  {
    term: "SERP",
    definition: "Search Engine Results Page — the page of results Google displays after someone searches for a query.",
  },
  {
    term: "AI Overviews",
    definition: "The AI-generated answer box that appears at the top of Google search results before regular web links.",
  },
  {
    term: "Crawling",
    definition: "When an automated program reads your website's pages to find errors, missing tags, and traffic opportunities.",
  },
  {
    term: "Keyword Cannibalization",
    definition: "When two or more pages on your own website fight against each other for the exact same search term, hurting both pages.",
  },
  {
    term: "SSRF Protection",
    definition: "A security protection that ensures our crawler only scans public websites and can never access private internal networks.",
  },
  {
    term: "Pull Request (PR)",
    definition: "A proposal to merge code changes into a software project on GitHub so your team can review it.",
  },
];

const TRUST_PILLARS = [
  {
    icon: Cpu,
    title: "Instant Smart Audits",
    description: "Our machine learning rules check your entire website in seconds with zero waiting.",
    tag: "Fast & Reliable",
  },
  {
    icon: ShieldCheck,
    title: "You Are Always In Control",
    description: "Every code change is shown as a visual preview. Nothing touches your website without your approval.",
    tag: "100% Safe",
  },
  {
    icon: Sparkles,
    title: "AI Search & Citations (GEO)",
    description: "Get discovered and cited when people ask questions on ChatGPT, Perplexity, and Google AI.",
    tag: "Next-Gen Search",
  },
  {
    icon: Lock,
    title: "Safe & Secure by Default",
    description: "Isolated cloud crawler with Clerk authentication and enterprise-grade data protection.",
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

      {/* ── PLAIN-ENGLISH GLOSSARY OF TERMS ── */}
      <div className="max-w-4xl mx-auto mb-20 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface-elevated text-xs font-mono font-semibold text-primary">
            <Sparkles size={12} />
            Plain-English Glossary
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Key Terms, Explained Simply
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            A quick dictionary of every search and AI term used across SerpoAI, written in plain English with zero confusing buzzwords.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/30 transition-all space-y-1"
            >
              <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item.term}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-3.5">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
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

