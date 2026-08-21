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
} from "lucide-react";
import toast from "react-hot-toast";

const GOALS = [
  { id: "Increase SaaS signups", label: "Increase SaaS Signups", desc: "Prioritizes signup funnel, comparison pages, and CTA conversion", icon: "🚀" },
  { id: "Increase revenue", label: "Increase Revenue", desc: "Optimizes pricing page proof, high-ticket landing pages, and retention", icon: "💰" },
  { id: "Improve AI visibility", label: "Improve AI Visibility (GEO)", desc: "Optimizes citations & entity authority across ChatGPT, Perplexity, Gemini", icon: "🤖" },
  { id: "Increase organic traffic", label: "Increase Organic Traffic", desc: "Focuses on high-volume keyword themes and content gap expansion", icon: "📈" },
  { id: "Beat competitors", label: "Outrank Competitors", desc: "Identifies competitor weak points and authoritative citation gaps", icon: "⚔️" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { createProject } = useProject();

  const [url, setUrl] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("Increase SaaS signups");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [currentProgressText, setCurrentProgressText] = useState("Initializing crawler...");

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError("");
    setAnalyzing(true);
    setCurrentProgressText("1/4: Crawling website and discovering internal pages...");

    const progressTimer1 = setTimeout(() => {
      setCurrentProgressText("2/4: Extracting DOM entities, metadata, and headings...");
    }, 4000);

    const progressTimer2 = setTimeout(() => {
      setCurrentProgressText("3/4: Synthesizing Company Knowledge Graph and Personas via Intelligence Agent...");
    }, 10000);

    const progressTimer3 = setTimeout(() => {
      setCurrentProgressText("4/4: Growth Brain is prioritizing high-impact opportunities with ICE scoring...");
    }, 18000);

    try {
      await createProject(url.trim(), undefined, selectedGoal);
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      clearTimeout(progressTimer3);
      toast.success("AI Growth OS initialized successfully!");
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
    <div className="min-h-screen pt-20 pb-16 bg-background bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
            <Sparkles size={13} />
            AI Growth Operating System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Connect Your Website to <span className="gradient-text">SerpoAI</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
            Discover your highest-impact growth opportunities, execute actions with specialized AI agents, and measure real business outcomes.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-border/70 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 rounded-xl severity-critical text-xs flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!analyzing ? (
            <form onSubmit={handleStartAnalysis} className="space-y-6">
              {/* Step 1: URL Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  1. Enter Your Website or Startup URL
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com or yoursite.com"
                    required
                    autoFocus
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/60 transition-colors text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 2: Goal Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  2. Select Primary Growth Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.id;
                    return (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={`p-3.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? "bg-primary/10 border-primary text-foreground shadow-sm ring-1 ring-primary/40"
                            : "bg-card/60 border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
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
              <button
                type="submit"
                disabled={!url.trim()}
                className="w-full py-4 rounded-xl btn-glow font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={18} />
                Generate AI Growth Plan
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-success" /> SSRF Protected
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary" /> Closed-Loop Learning
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent" /> ICE Scoring
                </span>
              </div>
            </form>
          ) : (
            /* Loading State */
            <div className="py-12 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Building Your AI Growth Engine</h3>
                <p className="text-xs text-primary font-mono">{currentProgressText}</p>
              </div>

              <div className="max-w-md mx-auto bg-muted/60 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-primary animate-pulse w-3/4 rounded-full" />
              </div>

              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Our Intelligence Agent and Growth Brain are extracting your buyer personas, competitive gaps, and ranking immediate high-ROI actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
