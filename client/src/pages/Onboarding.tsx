import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProject } from "../context/ProjectContext";
import {
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  FileCode2,
  Compass,
  Check,
  GitBranch,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProcessOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
  icon: React.ReactNode;
}

const AVAILABLE_PROCESSES: ProcessOption[] = [
  {
    id: "technical-seo",
    name: "Technical SEO & Schema Health",
    desc: "Crawl 60+ technical signals, JSON-LD schemas, Core Web Vitals, and viewport hygiene.",
    badge: "LIGHTHOUSE & DOM",
    icon: <ShieldCheck size={16} className="text-accent" />,
  },
  {
    id: "rank-tracking",
    name: "Keyword Rank & SERP Tracking",
    desc: "Discover keyword rankings, search volume, position changes, and Google AI Overview captures.",
    badge: "SERP & DELTA",
    icon: <Target size={16} className="text-warning" />,
  },
  {
    id: "geo-visibility",
    name: "Generative Engine Optimization (GEO)",
    desc: "Simulate brand citation authority across Google AI Overviews, Gemini, and Perplexity.",
    badge: "AI CITATIONS",
    icon: <Sparkles size={16} className="text-accent" />,
  },
  {
    id: "competitor-gap",
    name: "Competitor Gaps & Cannibalization",
    desc: "Benchmark top competitor domains and detect keyword cannibalization across your URLs.",
    badge: "GRAPH & GAPS",
    icon: <Globe size={16} className="text-data-1" />,
  },
  {
    id: "action-center",
    name: "Autonomous ICE Action Center",
    desc: "Calculate mathematical (Impact × Confidence / Effort) scores and generate ready-to-deploy git diffs.",
    badge: "GIT PATCHES",
    icon: <FileCode2 size={16} className="text-data-2" />,
  },
  {
    id: "strategy-roadmap",
    name: "30-60-90 Day Strategic Plan",
    desc: "Synthesize a phased quarterly execution roadmap aligned with your company's North Star metric.",
    badge: "ROADMAP",
    icon: <Compass size={16} className="text-data-3" />,
  },
];

const GOALS = [
  { id: "Increase SaaS signups", label: "Increase SaaS Signups", desc: "Prioritizes signup funnel, comparison pages, and CTA conversion", icon: "🚀" },
  { id: "Increase revenue", label: "Increase Revenue", desc: "Optimizes pricing page proof, high-ticket landing pages, and retention", icon: "💰" },
  { id: "Improve AI visibility", label: "Improve AI Visibility (GEO)", desc: "Optimizes citations & entity authority across modern AI search engines", icon: "🤖" },
  { id: "Increase organic traffic", label: "Increase Organic Traffic", desc: "Focuses on high-volume keyword themes and content gap expansion", icon: "📈" },
  { id: "Beat competitors", label: "Outrank Competitors", desc: "Identifies competitor weak points and authoritative citation gaps", icon: "⚔️" },
];

const FRAMEWORKS = [
  "Next.js (App Router)",
  "Next.js (Pages Router)",
  "Astro",
  "Remix / React Router",
  "Shopify / Liquid",
  "WordPress / Headless",
  "Custom HTML / Static",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { createProject } = useProject();

  // Environment Mode: Production vs Private Repo / Staging
  const [envType, setEnvType] = useState<"production" | "staging">("production");

  // Core Inputs
  const [url, setUrl] = useState("");
  const [sitemapPath, setSitemapPath] = useState("/sitemap.xml");

  // Private Repo & Staging Fields
  const [githubRepo, setGithubRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [githubToken, setGithubToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [stagingUrl, setStagingUrl] = useState("");
  const [bypassHeader, setBypassHeader] = useState("");
  const [framework, setFramework] = useState("Next.js (App Router)");

  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([
    "technical-seo",
    "rank-tracking",
    "geo-visibility",
    "competitor-gap",
    "action-center",
    "strategy-roadmap",
  ]);
  const [selectedGoal, setSelectedGoal] = useState("Increase SaaS signups");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [currentProgressText, setCurrentProgressText] = useState("Initializing SerpoAI crawler...");

  const toggleProcess = (processId: string) => {
    setSelectedProcesses((prev) => {
      if (prev.includes(processId)) {
        if (prev.length === 1) {
          toast.error("Keep at least one process selected");
          return prev;
        }
        return prev.filter((p) => p !== processId);
      } else {
        return [...prev, processId];
      }
    });
  };

  const handleSelectAllProcesses = () => {
    if (selectedProcesses.length === AVAILABLE_PROCESSES.length) {
      setSelectedProcesses(["technical-seo", "rank-tracking"]);
    } else {
      setSelectedProcesses(AVAILABLE_PROCESSES.map((p) => p.id));
    }
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = envType === "production" ? url.trim() : (stagingUrl.trim() || url.trim());
    if (!targetUrl) {
      toast.error("Please enter a valid website or staging URL");
      return;
    }

    setError("");
    setAnalyzing(true);
    setCurrentProgressText(`1/${selectedProcesses.length}: Crawling ${targetUrl} and extracting DOM entities...`);

    const progressTimer1 = setTimeout(() => {
      setCurrentProgressText(`2/${selectedProcesses.length}: Analyzing selected growth vectors & technical SEO signals...`);
    }, 4000);

    const progressTimer2 = setTimeout(() => {
      setCurrentProgressText(`3/${selectedProcesses.length}: Synthesizing knowledge graph and citation authority...`);
    }, 10000);

    const progressTimer3 = setTimeout(() => {
      setCurrentProgressText(`Finalizing: Growth Brain prioritizing high-ROI actions via ICE scoring...`);
    }, 17000);

    try {
      await createProject(targetUrl, undefined, selectedGoal);
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      toast.success("Domain connected & telemetry initialized!");
      navigate("/dashboard");
    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      setAnalyzing(false);
      const msg = err.message || "Failed to analyze target. Please verify the URL.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-6 sm:py-10 max-w-4xl mx-auto select-none"
    >
      {/* ── Header ── */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-border bg-surface-muted text-[11px] font-mono text-text-secondary">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
          <span>CONNECT ENVIRONMENT · PRE-RELEASE & PRODUCTION</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary tracking-tight">
          Connect Your System to Serpo<span className="italic text-accent">AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
          Configure continuous search telemetry, private git repository access for pre-release validation, and deterministic patch generation.
        </p>
      </div>

      {/* ── Instrument Card ── */}
      <div className="surface-instrument p-6 sm:p-8 border border-border bg-surface rounded-md shadow-lg relative">
        {error && (
          <div className="mb-6 p-3 rounded bg-negative/10 border border-negative/30 text-negative font-mono text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!analyzing ? (
          <form onSubmit={handleStartAnalysis} className="space-y-8 font-sans">
            {/* ── Step 1: Environment Selection Tabs ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-secondary uppercase">
                  1. Select Target Environment
                </span>
                <span className="badge-instrument text-[10px]">
                  {envType === "production" ? "PUBLIC PRODUCTION" : "PRIVATE GIT / PRE-RELEASE"}
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 rounded bg-surface-muted border border-border">
                <button
                  type="button"
                  onClick={() => setEnvType("production")}
                  className={`p-3 rounded text-left transition-colors flex items-start gap-2.5 ${
                    envType === "production"
                      ? "bg-surface text-text-primary border border-border shadow-xs font-medium"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Globe size={16} className={envType === "production" ? "text-accent" : "text-text-muted"} />
                  <div>
                    <div className="text-xs font-semibold">Production Website</div>
                    <div className="text-[11px] text-text-muted">Public domain live on Google & AI search engines</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEnvType("staging")}
                  className={`p-3 rounded text-left transition-colors flex items-start gap-2.5 ${
                    envType === "staging"
                      ? "bg-surface text-text-primary border border-border shadow-xs font-medium"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Lock size={16} className={envType === "staging" ? "text-accent" : "text-text-muted"} />
                  <div>
                    <div className="text-xs font-semibold">Private Repo / Staging (Pre-Release)</div>
                    <div className="text-[11px] text-text-muted">Test & validate private repos or staging before public launch</div>
                  </div>
                </button>
              </div>

              {/* Production Form Fields */}
              {envType === "production" ? (
                <div className="space-y-3 pt-2">
                  <label className="block space-y-1">
                    <span className="font-mono text-[11px] text-text-secondary uppercase">Website URL or Domain</span>
                    <div className="relative">
                      <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://company.com or company.com"
                        required
                        className="w-full pl-10 pr-3 py-2.5 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block space-y-1">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">Sitemap Path (Optional)</span>
                      <input
                        type="text"
                        value={sitemapPath}
                        onChange={(e) => setSitemapPath(e.target.value)}
                        placeholder="/sitemap.xml"
                        className="w-full px-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">Tech Stack Preset</span>
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-sans text-xs focus:outline-none focus:border-accent transition-colors"
                      >
                        {FRAMEWORKS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ) : (
                /* Private Repo & Staging Fields */
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block space-y-1 sm:col-span-2">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">
                        GitHub Repository (owner/repo)
                      </span>
                      <div className="relative">
                        <GitBranch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="text"
                          value={githubRepo}
                          onChange={(e) => setGithubRepo(e.target.value)}
                          placeholder="acme-corp/marketing-frontend"
                          className="w-full pl-10 pr-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </label>

                    <label className="block space-y-1">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">Branch</span>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="main / staging"
                        className="w-full px-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1">
                    <span className="font-mono text-[11px] text-text-secondary uppercase">
                      GitHub Personal Access Token (PAT) for Private Repos
                    </span>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type={showToken ? "text" : "password"}
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_••••••••••••••••••••••••••••••••••••"
                        className="w-full pl-10 pr-10 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      >
                        {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      Requires <code className="font-mono">repo</code> scope for private repo code inspection and Serpo Bot PR opening.
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block space-y-1">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">
                        Staging URL / Preview Deployment
                      </span>
                      <input
                        type="text"
                        value={stagingUrl}
                        onChange={(e) => setStagingUrl(e.target.value)}
                        placeholder="https://staging.acme.com or Vercel preview"
                        className="w-full px-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="font-mono text-[11px] text-text-secondary uppercase">
                        Custom Bypass / Basic Auth Header
                      </span>
                      <input
                        type="text"
                        value={bypassHeader}
                        onChange={(e) => setBypassHeader(e.target.value)}
                        placeholder="X-Bypass-Key: secret or Basic token"
                        className="w-full px-3 py-2 rounded bg-surface-muted border border-border text-text-primary font-mono text-xs placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ── Step 2: Growth & Analysis Pipelines ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-text-secondary uppercase">
                    2. Select Autonomous Pipelines ({selectedProcesses.length}/6 Active)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllProcesses}
                  className="font-mono text-xs text-accent hover:underline font-medium"
                >
                  {selectedProcesses.length === AVAILABLE_PROCESSES.length ? "Minimal Core" : "Select All (6)"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_PROCESSES.map((proc) => {
                  const isSelected = selectedProcesses.includes(proc.id);
                  return (
                    <div
                      key={proc.id}
                      onClick={() => toggleProcess(proc.id)}
                      className={`p-3 rounded border transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-surface border-border-strong text-text-primary shadow-xs"
                          : "bg-surface-muted/40 border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? "bg-accent-fill text-[#111508] border-transparent font-bold"
                            : "border-border bg-surface"
                        }`}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-text-primary">{proc.name}</span>
                          <span className="badge-instrument text-[9px] py-0 px-1">{proc.badge}</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-normal">{proc.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Step 3: North Star Objective ── */}
            <div className="space-y-3">
              <span className="font-mono text-xs text-text-secondary uppercase">
                3. Primary Growth Metric
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      type="button"
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-2.5 rounded text-left border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-surface border-accent text-text-primary font-medium shadow-xs"
                          : "bg-surface-muted/40 border-border text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold mb-0.5 text-text-primary">
                        <span>{goal.icon}</span>
                        <span>{goal.label}</span>
                      </div>
                      <p className="text-[10px] text-text-muted">{goal.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Action CTA ── */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={(!url.trim() && !stagingUrl.trim()) || selectedProcesses.length === 0}
                className="btn-primary w-full py-3 text-xs sm:text-sm font-semibold gap-2 disabled:opacity-40"
              >
                <Zap size={15} />
                <span>Initialize SerpoAI Telemetry ({selectedProcesses.length} Pipelines)</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-positive" /> SSRF-Safe Cloud Crawler
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-accent" /> Closed-Loop Learning
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-data-2" /> Mathematical ICE Prioritization
                </span>
              </div>
            </div>
          </form>
        ) : (
          /* Telemetry Scanning State */
          <div className="py-12 text-center space-y-5">
            <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-normal text-text-primary">
                Connecting Telemetry Stream
              </h3>
              <p className="font-mono text-xs text-accent">{currentProgressText}</p>
            </div>

            <div className="max-w-xs mx-auto bg-surface-muted rounded-full h-1.5 overflow-hidden border border-border">
              <div className="h-full bg-accent animate-pulse w-2/3 rounded-full" />
            </div>

            <p className="text-[11px] font-mono text-text-muted">
              Executing {selectedProcesses.length} pipelines across organic SERP, entity graph, and generative answer models.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

