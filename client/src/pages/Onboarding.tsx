import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    name: "Technical SEO & Health Audit",
    desc: "Crawl 60+ technical signals, Core Web Vitals, JSON-LD schemas, and viewport hygiene.",
    badge: "Lighthouse & DOM",
    icon: <ShieldCheck size={18} className="text-emerald-400" />,
  },
  {
    id: "rank-tracking",
    name: "Keyword Rank & SERP Tracking",
    desc: "Discover keyword rankings, search volume, position changes, and Google AI Overview captures.",
    badge: "SERP & Delta",
    icon: <Target size={18} className="text-amber-400" />,
  },
  {
    id: "geo-visibility",
    name: "Generative Engine Optimization (GEO)",
    desc: "Simulate brand citation authority across Google AI Overviews, Gemini, and Generative Answer Engines.",
    badge: "AI Citations",
    icon: <Sparkles size={18} className="text-primary" />,
  },
  {
    id: "competitor-gap",
    name: "Competitor Intelligence & Gaps",
    desc: "Benchmark top competitor domains and discover high-intent unranked content opportunities.",
    badge: "Market Gaps",
    icon: <Globe size={18} className="text-sky-400" />,
  },
  {
    id: "action-center",
    name: "Autonomous ICE Action Center",
    desc: "Calculate mathematical (Impact × Confidence / Effort) scores and generate ready-to-deploy code diffs.",
    badge: "1-Click Patches",
    icon: <FileCode2 size={18} className="text-violet-400" />,
  },
  {
    id: "strategy-roadmap",
    name: "30-60-90 Day Strategic Plan",
    desc: "Synthesize a phased quarterly execution roadmap aligned with your company's North Star metric.",
    badge: "Phased Roadmap",
    icon: <Compass size={18} className="text-rose-400" />,
  },
];

const GOALS = [
  { id: "Increase SaaS signups", label: "Increase SaaS Signups", desc: "Prioritizes signup funnel, comparison pages, and CTA conversion", icon: "🚀" },
  { id: "Increase revenue", label: "Increase Revenue", desc: "Optimizes pricing page proof, high-ticket landing pages, and retention", icon: "💰" },
  { id: "Improve AI visibility", label: "Improve AI Visibility (GEO)", desc: "Optimizes citations & entity authority across modern AI search engines", icon: "🤖" },
  { id: "Increase organic traffic", label: "Increase Organic Traffic", desc: "Focuses on high-volume keyword themes and content gap expansion", icon: "📈" },
  { id: "Beat competitors", label: "Outrank Competitors", desc: "Identifies competitor weak points and authoritative citation gaps", icon: "⚔️" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { createProject } = useProject();

  const [url, setUrl] = useState("");
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
          toast.error("Please keep at least one process selected");
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
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    setError("");
    setAnalyzing(true);
    setCurrentProgressText(`1/${selectedProcesses.length}: Crawling ${url.trim()} and extracting DOM entities...`);

    const progressTimer1 = setTimeout(() => {
      setCurrentProgressText(`2/${selectedProcesses.length}: Analyzing selected growth vectors & technical SEO signals...`);
    }, 4000);

    const progressTimer2 = setTimeout(() => {
      setCurrentProgressText(`3/${selectedProcesses.length}: Multi-agent AI synthesizing knowledge graph and citation authority...`);
    }, 10000);

    const progressTimer3 = setTimeout(() => {
      setCurrentProgressText(`Finalizing: Growth Brain prioritizing high-ROI actions via ICE scoring...`);
    }, 17000);

    try {
      await createProject(url.trim(), undefined, selectedGoal);
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      toast.success("SerpoAI initialized successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      setAnalyzing(false);
      const msg = err.message || "Failed to analyze website. Please check the URL.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
            <Sparkles size={13} />
            Autonomous Growth & SEO Onboarding
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Connect Your Website to <span className="gradient-text">SerpoAI</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Customize which growth processes to run, discover high-ROI bottlenecks, and deploy verified code fixes with specialized AI agents.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6 sm:p-9 border border-border/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl severity-critical text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!analyzing ? (
            <form onSubmit={handleStartAnalysis} className="space-y-8">
              {/* Step 1: URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Enter Your Website URL or Domain
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourcompany.com or yoursite.com"
                    required
                    autoFocus
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/60 transition-colors text-sm font-medium shadow-sm"
                  />
                </div>
              </div>

              {/* Step 2: Multi-Option Process Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      2. Choose Growth & Analysis Processes
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Select which pipelines to execute for your website ({selectedProcesses.length} selected).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllProcesses}
                    className="text-xs text-primary hover:underline font-bold cursor-pointer"
                  >
                    {selectedProcesses.length === AVAILABLE_PROCESSES.length ? "Deselect Extra" : "Select All (6)"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_PROCESSES.map((proc) => {
                    const isSelected = selectedProcesses.includes(proc.id);
                    return (
                      <div
                        key={proc.id}
                        onClick={() => toggleProcess(proc.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none hover-lift ${
                          isSelected
                            ? "bg-card border-primary/60 shadow-md ring-1 ring-primary/30"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground font-bold shadow-sm"
                              : "border border-border bg-surface-elevated"
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-foreground">{proc.name}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-muted font-mono text-muted-foreground font-semibold">
                              {proc.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{proc.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Goal Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  3. Select Primary Growth Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer hover-lift ${
                          isSelected
                            ? "bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary/30"
                            : "bg-card border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs text-foreground mb-1">
                          <span>{goal.icon}</span>
                          <span>{goal.label}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{goal.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={!url.trim() || selectedProcesses.length === 0}
                  className="w-full py-4 rounded-2xl btn-glow font-bold text-sm flex items-center justify-center gap-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Zap size={18} />
                  Initialize SerpoAI Growth Engine ({selectedProcesses.length} Processes)
                  <ArrowRight size={16} />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-success" /> SSRF-Safe Cloud Crawler
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-primary" /> Closed-Loop Learning
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-accent" /> ICE Score Prioritization
                  </span>
                </div>
              </div>
            </form>
          ) : (
            /* Loading State */
            <div className="py-14 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Building Your SerpoAI Growth Engine</h3>
                <p className="text-xs text-primary font-mono">{currentProgressText}</p>
              </div>

              <div className="max-w-md mx-auto bg-muted/60 rounded-full h-2 overflow-hidden border border-border/50">
                <div className="h-full bg-primary animate-pulse w-3/4 rounded-full" />
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <span>Executing {selectedProcesses.length} selected processes in parallel</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
