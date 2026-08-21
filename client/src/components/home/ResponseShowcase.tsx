import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  Sparkles,
  Zap,
  Target,
  Bot,
  Code2,
  Copy,
  Check,
  Globe,
  Gauge,
  ShieldCheck,
  Search,
  ChevronRight,
  Compass,
} from "lucide-react";

interface PresetSite {
  id: string;
  name: string;
  url: string;
  category: string;
  overallScore: number;
  seoScore: number;
  perfScore: number;
  a11yScore: number;
  bpScore: number;
  lcp: string;
  fid: string;
  cls: string;
  ttfb: string;
  keywords: {
    keyword: string;
    rank: number;
    delta: number;
    volume: string;
    feature: string;
    url: string;
  }[];
  issues: {
    id: string;
    severity: "critical" | "warning" | "optimization";
    category: string;
    title: string;
    recommendation: string;
    impact: string;
    codeFix?: string;
  }[];
  geoVisibility: {
    citationRate: number;
    sentimentScore: number;
    perplexityStatus: string;
    chatgptStatus: string;
    geminiStatus: string;
    sampleCitation: string;
  };
  iceActions: {
    title: string;
    agent: string;
    iceScore: number;
    impact: string;
    effort: string;
    patch: string;
  }[];
}

const presetSites: PresetSite[] = [
  {
    id: "saas",
    name: "SaaS Platform",
    url: "https://cloudflow.io",
    category: "B2B Cloud SaaS",
    overallScore: 89,
    seoScore: 94,
    perfScore: 82,
    a11yScore: 96,
    bpScore: 90,
    lcp: "1.1s",
    fid: "12ms",
    cls: "0.01",
    ttfb: "185ms",
    keywords: [
      { keyword: "workflow automation platform", rank: 1, delta: 4, volume: "18.4K", feature: "AI Overview", url: "https://cloudflow.io" },
      { keyword: "cloud integration software", rank: 3, delta: 7, volume: "12.1K", feature: "Featured Snippet", url: "https://cloudflow.io/integrations" },
      { keyword: "ai data pipelines", rank: 2, delta: 2, volume: "9.8K", feature: "Knowledge Panel", url: "https://cloudflow.io/ai" },
      { keyword: "enterprise zapier alternative", rank: 4, delta: 5, volume: "6.5K", feature: "AI Overview", url: "https://cloudflow.io/vs/zapier" },
      { keyword: "secure api connectors", rank: 6, delta: 1, volume: "4.2K", feature: "Standard", url: "https://cloudflow.io/security" },
    ],
    issues: [
      {
        id: "iss-1",
        severity: "critical",
        category: "Structured Data",
        title: "Missing SoftwareApplication JSON-LD schema on pricing page",
        recommendation: "Inject schema markup with AggregateRating and offers to enable rich pricing snippets in Google search results.",
        impact: "+14% Search CTR",
        codeFix: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "CloudFlow",\n  "applicationCategory": "BusinessApplication",\n  "offers": {\n    "@type": "Offer",\n    "price": "29.00",\n    "priceCurrency": "USD"\n  }\n}\n</script>`,
      },
      {
        id: "iss-2",
        severity: "warning",
        category: "Meta Tags",
        title: "Suboptimal Meta Description length (192 chars, truncated on mobile)",
        recommendation: "SerpoAI AI Copilot condensed the description to 148 high-intent characters including primary target keywords.",
        impact: "+8% Mobile CTR",
        codeFix: `<meta name="description" content="Automate enterprise workflows with CloudFlow. Connect 500+ apps, build resilient AI data pipelines, and scale integrations securely in minutes." />`,
      },
      {
        id: "iss-3",
        severity: "optimization",
        category: "Performance",
        title: "Uncompressed hero WebP graphics causing 210ms LCP delay",
        recommendation: "Add width/height attributes and dynamic fetchpriority='high' on the above-the-fold hero asset.",
        impact: "-210ms LCP",
        codeFix: `<img src="/assets/hero-flow.webp" width="1200" height="630" fetchpriority="high" alt="CloudFlow Workflow Canvas" />`,
      },
    ],
    geoVisibility: {
      citationRate: 91,
      sentimentScore: 96,
      perplexityStatus: "Primary Cited Source (#1 Reference)",
      chatgptStatus: "Entity Recognized (High Authority)",
      geminiStatus: "Top 3 Recommended Workflow Tools",
      sampleCitation: `"According to CloudFlow's documentation, enterprise data pipelines can be deployed with SOC-2 compliant automated security validations..."`,
    },
    iceActions: [
      {
        title: "Deploy Automated FAQ JSON-LD for Perplexity Citation Blueprints",
        agent: "GEO Agent",
        iceScore: 9.2,
        impact: "High (+24% AI Engine Visibility)",
        effort: "Low (5 mins)",
        patch: `+ <script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does CloudFlow handle SOC-2?","acceptedAnswer":{"@type":"Answer","text":"CloudFlow enforces end-to-end encryption with zero data retention..."}}]}</script>`,
      },
      {
        title: "Publish Brand vs Competitor Comparison Matrix",
        agent: "Content Agent",
        iceScore: 8.8,
        impact: "High (+32% Bottom-Funnel CVR)",
        effort: "Medium (15 mins)",
        patch: `+ Route: /vs/make-vs-zapier\n+ Structured Feature Matrix with 18 automated criteria\n+ Live pricing comparison table with instant sandbox CTA`,
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    url: "https://urbankicks.co",
    category: "Direct-to-Consumer Retail",
    overallScore: 86,
    seoScore: 91,
    perfScore: 78,
    a11yScore: 92,
    bpScore: 88,
    lcp: "1.4s",
    fid: "18ms",
    cls: "0.03",
    ttfb: "240ms",
    keywords: [
      { keyword: "sustainable running sneakers", rank: 1, delta: 5, volume: "33.2K", feature: "AI Overview", url: "https://urbankicks.co/collections/runners" },
      { keyword: "lightweight barefoot trail shoes", rank: 2, delta: 8, volume: "14.5K", feature: "Product Carousel", url: "https://urbankicks.co/products/trail-zero" },
      { keyword: "recycled canvas skate shoes", rank: 4, delta: 3, volume: "8.7K", feature: "Image Pack", url: "https://urbankicks.co/products/canvas-eco" },
      { keyword: "best breathable walking shoes", rank: 5, delta: 6, volume: "22.0K", feature: "AI Overview", url: "https://urbankicks.co/guides/breathable-shoes" },
    ],
    issues: [
      {
        id: "iss-e1",
        severity: "critical",
        category: "E-Commerce SEO",
        title: "Missing Product Rich Snippet priceValidUntil & InStock schema",
        recommendation: "Add Product and MerchantReturnPolicy schemas to qualify for Google Shopping organic rich badges.",
        impact: "+22% Organic CVR",
        codeFix: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org/",\n  "@type": "Product",\n  "name": "UrbanKicks Runner Zero",\n  "offers": {\n    "@type": "Offer",\n    "price": "128.00",\n    "availability": "https://schema.org/InStock"\n  }\n}\n</script>`,
      },
      {
        id: "iss-e2",
        severity: "warning",
        category: "Images",
        title: "18 product thumbnails missing descriptive alt text",
        recommendation: "SerpoAI auto-generated contextual keyword-rich alt tags for all catalog images.",
        impact: "+15% Google Images Traffic",
        codeFix: `<img src="/products/runner-black.jpg" alt="UrbanKicks Runner Zero in Midnight Black - Recycled Mesh Sneaker" />`,
      },
    ],
    geoVisibility: {
      citationRate: 84,
      sentimentScore: 92,
      perplexityStatus: "Top Pick in 'Eco-Friendly Footwear 2026'",
      chatgptStatus: "Cited for Carbon-Neutral Manufacturing",
      geminiStatus: "Featured in Shopping Recommendation Cards",
      sampleCitation: `"UrbanKicks is ranked among the highest-rated sustainable footwear brands with 100% ocean plastic recycled uppers..."`,
    },
    iceActions: [
      {
        title: "Auto-Generate Product Comparison Tables for AI Search Engines",
        agent: "GEO Agent",
        iceScore: 9.0,
        impact: "High (+28% AI Search Traffic)",
        effort: "Low (8 mins)",
        patch: `+ Inserted Structured Material Specs (100% Recycled EVA, Carbon Footprint: 4.2kg CO2)`,
      },
    ],
  },
  {
    id: "agency",
    name: "Design & Dev Agency",
    url: "https://devstudio.agency",
    category: "Professional Services",
    overallScore: 93,
    seoScore: 98,
    perfScore: 89,
    a11yScore: 98,
    bpScore: 95,
    lcp: "0.8s",
    fid: "8ms",
    cls: "0.00",
    ttfb: "120ms",
    keywords: [
      { keyword: "react web development agency", rank: 1, delta: 3, volume: "14.2K", feature: "AI Overview", url: "https://devstudio.agency" },
      { keyword: "nextjs enterprise consulting", rank: 2, delta: 6, volume: "9.1K", feature: "Featured Snippet", url: "https://devstudio.agency/services/nextjs" },
      { keyword: "custom design systems agency", rank: 3, delta: 4, volume: "5.8K", feature: "Knowledge Panel", url: "https://devstudio.agency/case-studies" },
    ],
    issues: [
      {
        id: "iss-a1",
        severity: "warning",
        category: "Meta & Social",
        title: "Missing OpenGraph dynamic image tags on case study pages",
        recommendation: "SerpoAI injected automated Twitter Card & OpenGraph image meta tags for high social click-throughs.",
        impact: "+18% Social & Direct CTR",
        codeFix: `<meta property="og:image" content="https://devstudio.agency/og/fintech-case-study.png" />\n<meta name="twitter:card" content="summary_large_image" />`,
      },
    ],
    geoVisibility: {
      citationRate: 94,
      sentimentScore: 98,
      perplexityStatus: "Recommended Enterprise Frontend Partner",
      chatgptStatus: "Listed under 'Top Modern Web Agencies'",
      geminiStatus: "Primary Case Study Citation",
      sampleCitation: `"DevStudio is renowned for building high-performance web applications using modern edge architectures and strict Core Web Vitals compliance..."`,
    },
    iceActions: [
      {
        title: "Publish Interactive ROI Calculator for Enterprise Inquiries",
        agent: "Content Agent",
        iceScore: 8.9,
        impact: "High (+40% Qualified Inquiries)",
        effort: "Medium (20 mins)",
        patch: `+ Added /calculator with instant interactive engineering savings forecast`,
      },
    ],
  },
];

type ActiveTab = "audit" | "keywords" | "copilot" | "geo" | "roadmap";

export default function ResponseShowcase() {
  const [selectedSiteId, setSelectedSiteId] = useState("saas");
  const [activeTab, setActiveTab] = useState<ActiveTab>("audit");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const site = presetSites.find((s) => s.id === selectedSiteId) || presetSites[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <section id="sample-response" className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles size={13} />
            Live Platform Output Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            See the exact <span className="gradient-text">Intelligence & Responses</span> SerpoAI Delivers
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            No vague scores or confusing generic charts. SerpoAI provides actionable, production-ready code diffs,
            precise keyword rank delta tracking, and generative AI search authority reports.
          </p>
        </div>

        {/* Preset Website Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">
            Explore sample websites:
          </span>
          {presetSites.map((p) => {
            const isSelected = p.id === site.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedSiteId(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-102"
                    : "bg-card/80 hover:bg-card border border-border text-foreground hover:border-primary/40"
                }`}
              >
                <Globe size={13} className={isSelected ? "text-primary-foreground" : "text-primary"} />
                <span>{p.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white font-mono"
                      : "bg-primary/10 text-primary font-mono"
                  }`}
                >
                  Score {p.overallScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Terminal / Report Showcase Box */}
        <div className="glass rounded-3xl border border-border/80 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Window Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-card/90 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
            {/* Window Dots & Active URL */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background/80 border border-border/60 text-xs font-mono text-foreground">
                <Globe size={12} className="text-primary shrink-0" />
                <span className="font-semibold text-primary">{site.url}</span>
                <span className="text-muted-foreground text-[10px]">({site.category})</span>
              </div>
            </div>

            {/* Audit Status Telemetry */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Audit Completed in 1.8s
              </span>
              <span className="text-border hidden sm:inline">|</span>
              <span className="text-muted-foreground text-[11px] hidden sm:inline">
                Gemini 2.0 Flash + Lighthouse Engine
              </span>
            </div>
          </div>

          {/* Interactive Response Navigation Tabs */}
          <div className="bg-muted/40 border-b border-border/50 px-3 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "audit" as ActiveTab, label: "Full SEO Audit", icon: <Gauge size={14} />, badge: `${site.overallScore}/100` },
              { id: "keywords" as ActiveTab, label: "Rank Tracker & SERP", icon: <Target size={14} />, badge: `${site.keywords.length} Keywords` },
              { id: "copilot" as ActiveTab, label: "AI Action Center & Code Fixes", icon: <Code2 size={14} />, badge: "ICE Priority" },
              { id: "geo" as ActiveTab, label: "GEO & AI Search Visibility", icon: <Sparkles size={14} />, badge: `${site.geoVisibility.citationRate}% Cited` },
              { id: "roadmap" as ActiveTab, label: "30-60-90 Strategy Plan", icon: <Compass size={14} />, badge: "3 Sprints" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-card text-foreground border border-border shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                  }`}
                >
                  <span className={isActive ? "text-primary" : "text-muted-foreground"}>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-primary/15 text-primary font-bold" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: FULL SEO AUDIT & HEALTH SCORES */}
          {activeTab === "audit" && (
            <div className="p-5 sm:p-8 space-y-6">
              {/* Scorecard Hero Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {/* Overall Score */}
                <div className="col-span-2 sm:col-span-1 rounded-2xl p-4 bg-primary/10 border border-primary/25 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Overall Health</span>
                  <div className="text-4xl font-black gradient-text my-1">{site.overallScore}</div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Top 5% in Category
                  </span>
                </div>

                {/* Individual Pillars */}
                {[
                  { label: "SEO Technical", score: site.seoScore, desc: "Crawlability & Schema" },
                  { label: "Performance", score: site.perfScore, desc: "Speed & Core Web Vitals" },
                  { label: "Accessibility", score: site.a11yScore, desc: "A11y Standards & ARIA" },
                  { label: "Best Practices", score: site.bpScore, desc: "HTTPS, Security & CSP" },
                ].map((pillar) => (
                  <div key={pillar.label} className="rounded-2xl p-4 bg-card/80 border border-border/70 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">{pillar.label}</span>
                        <span className={`text-lg font-black ${getScoreColor(pillar.score)}`}>{pillar.score}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{pillar.desc}</p>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full ${
                          pillar.score >= 90 ? "bg-emerald-500" : pillar.score >= 75 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Core Web Vitals & Real-Time Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { metric: "LCP (Largest Contentful Paint)", value: site.lcp, status: "Good (< 2.5s)", color: "text-emerald-400" },
                  { metric: "FID / INP (Interactivity)", value: site.fid, status: "Instant (< 50ms)", color: "text-emerald-400" },
                  { metric: "CLS (Layout Shift)", value: site.cls, status: "Stable (< 0.1)", color: "text-emerald-400" },
                  { metric: "TTFB (Server Response)", value: site.ttfb, status: "Fast (< 300ms)", color: "text-emerald-400" },
                ].map((cwv) => (
                  <div key={cwv.metric} className="p-3.5 rounded-xl bg-card/60 border border-border/60">
                    <span className="text-[11px] text-muted-foreground font-medium block truncate">{cwv.metric}</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className={`text-xl font-bold ${cwv.color}`}>{cwv.value}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{cwv.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Issue Cards with 1-Click Code Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    Prioritized Technical SEO Findings & Fixes
                  </h3>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {site.issues.length} Identified Issues
                  </span>
                </div>

                <div className="space-y-3">
                  {site.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-2xl border border-border/80 bg-card/90 p-4 sm:p-5 space-y-3 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {issue.severity === "critical" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                              <XCircle size={11} /> Critical Fix
                            </span>
                          )}
                          {issue.severity === "warning" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                              <AlertTriangle size={11} /> Warning
                            </span>
                          )}
                          {issue.severity === "optimization" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                              <Zap size={11} /> Speed Optimization
                            </span>
                          )}
                          <span className="text-xs font-semibold text-muted-foreground">{issue.category}</span>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
                          Expected Lift: {issue.impact}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-foreground">{issue.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{issue.recommendation}</p>
                      </div>

                      {issue.codeFix && (
                        <div className="rounded-xl bg-background border border-border p-3 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-mono text-primary font-semibold">
                              <Code2 size={12} /> SerpoAI Recommended Code Patch
                            </span>
                            <button
                              onClick={() => copyToClipboard(issue.codeFix!, issue.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-[10px] font-bold transition-all cursor-pointer"
                            >
                              {copiedCodeId === issue.id ? (
                                <>
                                  <Check size={10} className="text-emerald-400" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={10} /> Copy Patch
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre p-2 bg-card/60 rounded-lg border border-border/40">
                            {issue.codeFix}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: KEYWORD RANK TRACKER & SERP DELTAS */}
          {activeTab === "keywords" && (
            <div className="p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Target size={18} className="text-primary" />
                    Target Keyword Rankings & SERP Visibility
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live rank tracker results with historical position changes and AI Overview capture badges.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    +18 Positions Gained This Month
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-border/80 bg-card/60 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3.5 px-4">Target Keyword</th>
                      <th className="py-3.5 px-4 text-center">Google Rank</th>
                      <th className="py-3.5 px-4 text-center">30-Day Delta</th>
                      <th className="py-3.5 px-4 text-center">Search Vol</th>
                      <th className="py-3.5 px-4">SERP Feature</th>
                      <th className="py-3.5 px-4">Ranking URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {site.keywords.map((kw) => (
                      <tr key={kw.keyword} className="hover:bg-card transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                          <Search size={13} className="text-primary shrink-0" />
                          <span>{kw.keyword}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs ${
                              kw.rank === 1
                                ? "bg-emerald-500 text-slate-900 font-extrabold shadow-sm"
                                : kw.rank <= 3
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            #{kw.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={12} /> +{kw.delta}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">{kw.volume}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                            <Sparkles size={10} /> {kw.feature}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground text-[11px] truncate max-w-[200px]">
                          {kw.url}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: AI COPILOT FIXES & CODE PATCHES */}
          {activeTab === "copilot" && (
            <div className="p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Bot size={18} className="text-primary" />
                    ICE-Prioritized AI Action Center & Code Patches
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ranked by the ICE Formula: <span className="font-mono text-primary font-bold">(Impact × Confidence) ÷ Effort</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                  Human-In-The-Loop Authorized
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {site.iceActions.map((action, idx) => (
                  <div
                    key={action.title}
                    className="rounded-2xl border border-border/80 bg-card/80 p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                          {action.agent}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground font-semibold">ICE Score:</span>
                          <span className="text-sm font-black gradient-text">{action.iceScore}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-foreground">{action.title}</h4>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-background border border-border/50">
                          <span className="text-muted-foreground block text-[10px]">Impact</span>
                          <span className="font-bold text-emerald-400">{action.impact}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-background border border-border/50">
                          <span className="text-muted-foreground block text-[10px]">Effort</span>
                          <span className="font-bold text-foreground">{action.effort}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-background border border-border/60 p-3">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                          <span className="font-mono font-semibold text-foreground">Action Patch Diff</span>
                          <button
                            onClick={() => copyToClipboard(action.patch, `act-${idx}`)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] text-foreground font-bold cursor-pointer"
                          >
                            {copiedCodeId === `act-${idx}` ? (
                              <>
                                <Check size={10} className="text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy size={10} /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono text-emerald-400 bg-card/80 p-2 rounded-lg border border-border/40 overflow-x-auto whitespace-pre">
                          {action.patch}
                        </pre>
                      </div>
                    </div>

                    <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md">
                      <Zap size={14} /> Deploy Fix in 1-Click
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: GEO & AI SEARCH ENGINE VISIBILITY */}
          {activeTab === "geo" && (
            <div className="p-5 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    Generative Engine Optimization (GEO) Citations
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How AI answer engines (Perplexity, ChatGPT Search, Gemini) cite your website as an authoritative source.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                    Citation Confidence: {site.geoVisibility.citationRate}%
                  </span>
                </div>
              </div>

              {/* Status Cards across AI Engines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-card/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Perplexity AI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-400">{site.geoVisibility.perplexityStatus}</p>
                  <p className="text-[11px] text-muted-foreground">Synthesized across 42 intent queries.</p>
                </div>

                <div className="p-4 rounded-2xl bg-card/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">ChatGPT Search</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-400">{site.geoVisibility.chatgptStatus}</p>
                  <p className="text-[11px] text-muted-foreground">Entity knowledge graph verified.</p>
                </div>

                <div className="p-4 rounded-2xl bg-card/80 border border-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Google AI Overviews</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-400">{site.geoVisibility.geminiStatus}</p>
                  <p className="text-[11px] text-muted-foreground">Ranked in top 3 structured summaries.</p>
                </div>
              </div>

              {/* Simulated AI Answer citation */}
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Bot size={14} /> Simulated AI Answer Citation Extract
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">Source Authority: 9.4/10</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-foreground/90 italic font-serif leading-relaxed border-l-2 border-primary pl-4">
                  {site.geoVisibility.sampleCitation}
                </blockquote>
              </div>
            </div>
          )}

          {/* Tab 5: 30-60-90 STRATEGY ROADMAP */}
          {activeTab === "roadmap" && (
            <div className="p-5 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Compass size={18} className="text-primary" />
                  Autonomous 30-60-90 Day SEO Growth Roadmap
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phased growth sprints generated by SerpoAI's Intelligence Agent to systematically dominate search rankings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    phase: "Sprint 1: Days 1-30",
                    theme: "Conversion Quick Wins & Technical Hygiene",
                    tasks: [
                      "Fix Schema JSON-LD on high-intent pages",
                      "Optimize LCP assets to < 1.2s",
                      "Compress metadata and rewrite mobile snippets",
                    ],
                    status: "Completed (100%)",
                    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  },
                  {
                    phase: "Sprint 2: Days 31-60",
                    theme: "GEO AI Authority & Comparison Pages",
                    tasks: [
                      "Publish 4 high-intent Competitor vs Brand pages",
                      "Deploy structured FAQ data for Perplexity citations",
                      "Build entity citation links across authoritative domains",
                    ],
                    status: "In Progress (65%)",
                    badgeColor: "bg-primary/10 text-primary border-primary/20",
                  },
                  {
                    phase: "Sprint 3: Days 61-90",
                    theme: "Programmatic Scale & SERP Domination",
                    tasks: [
                      "Scale long-tail programmatic landing pages",
                      "Activate automated weekly re-audit & rank tracking cron",
                      "Extract closed-loop attribution into Growth Memory",
                    ],
                    status: "Scheduled",
                    badgeColor: "bg-muted text-muted-foreground border-border",
                  },
                ].map((sprint) => (
                  <div key={sprint.phase} className="rounded-2xl border border-border/80 bg-card/80 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">{sprint.phase}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sprint.badgeColor}`}>
                        {sprint.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{sprint.theme}</h4>
                    <ul className="space-y-2 pt-2">
                      {sprint.tasks.map((task) => (
                        <li key={task} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Interactive CTA Bar */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground text-center sm:text-left">
              <Sparkles size={14} className="text-primary shrink-0" />
              <span>
                Want to see the live report for <strong>your</strong> website? Run an instant scan in under 3 seconds.
              </span>
            </div>
            <a
              href="#instant-scan-bar"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              Test Your URL Now <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
