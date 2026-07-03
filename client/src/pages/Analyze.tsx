/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SearchIcon, GlobeIcon, FileSearchIcon, BrainIcon,
  CheckCircleIcon, AlertCircle, Loader2, ArrowRightIcon, Zap,
} from "lucide-react";
import { seoAPI } from "../services/api";
import toast from "react-hot-toast";

const STEPS = [
  {
    icon: <GlobeIcon size={22} />,
    label: "Connecting to browser",
    desc: "Creating cloud browser session via Browserbase...",
  },
  {
    icon: <FileSearchIcon size={22} />,
    label: "Scanning website",
    desc: "Extracting meta tags, links, images, headings...",
  },
  {
    icon: <BrainIcon size={22} />,
    label: "AI Analysis",
    desc: "Gemini is generating your SEO report...",
  },
  {
    icon: <CheckCircleIcon size={22} />,
    label: "Report Ready",
    desc: "Your SEO report is complete!",
  },
];

const EXAMPLES = ["github.com", "stripe.com", "vercel.com"];

export default function Analyze() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const stepTimers = useRef<any[]>([]);
  const navigate = useNavigate();

  const clearTimers = () => {
    stepTimers.current.forEach(clearTimeout);
    stepTimers.current = [];
  };

  const handleAnalyze = async (submitUrl?: string) => {
    const targetUrl = submitUrl || url;
    if (!targetUrl.trim()) return;

    const fullUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;

    setError("");
    setAnalyzing(true);
    setCurrentStep(0);

    stepTimers.current.push(setTimeout(() => setCurrentStep(1), 2000));
    stepTimers.current.push(setTimeout(() => setCurrentStep(2), 6000));
    stepTimers.current.push(setTimeout(() => setCurrentStep(3), 12000));

    try {
      const data = await seoAPI.analyze(fullUrl);

      stepTimers.current.push(
        setTimeout(() => {
          setAnalyzing(false);
          navigate(`/report/${data.analysis._id}`);
        }, 14000)
      );
    } catch (err: any) {
      clearTimers();
      setAnalyzing(false);
      const msg = err.message || "Analysis failed. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  useEffect(() => {
    const prefillUrl = searchParams.get("url");
    if (prefillUrl) {
      setUrl(prefillUrl);
      setTimeout(() => handleAnalyze(prefillUrl), 500);
    }
    return () => clearTimers();
  }, []);

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background bg-grid">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {!analyzing ? (
          <div>
            {/* Hero Header */}
            <div className="text-center mb-10 mt-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                <Zap size={12} />
                AI-Powered SEO Audit
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium text-foreground mb-3">
                Analyze <span className="gradient-text">Any Website</span>
              </h1>
              <p className="text-muted-foreground">
                Get a comprehensive AI-powered SEO audit report in under 30 seconds.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl severity-critical text-sm flex items-center gap-2 max-w-xl mx-auto">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* URL Input Form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="border border-primary/25 rounded-2xl p-1.5 px-2 flex items-center gap-2 bg-card shadow-lg shadow-black/20 focus-within:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 px-3">
                  <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com)"
                    className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-3"
                    id="analyze-url-input"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="btn-glow px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyze <ArrowRightIcon size={16} />
                </button>
              </div>
            </form>

            {/* Example URLs */}
            <div className="mt-5 text-center text-sm text-muted-foreground">
              Try:{" "}
              {EXAMPLES.map((ex, i) => (
                <span key={ex}>
                  <button
                    onClick={() => setUrl(ex)}
                    className="text-primary hover:underline hover:text-primary/80 transition-colors"
                  >
                    {ex}
                  </button>
                  {i < EXAMPLES.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>

            {/* Feature Hints */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                { icon: "🔍", label: "Meta tag analysis" },
                { icon: "🤖", label: "Gemini AI report" },
                { icon: "📊", label: "Score breakdown" },
              ].map((f) => (
                <div key={f.label} className="glass p-3 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <span>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ── Analyzing State ── */
          <div>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-medium text-foreground">Analyzing Your Website</h2>
              <div className="flex justify-center items-center gap-2 mt-2">
                <Loader2 size={16} className="text-primary/70 animate-spin" />
                <p className="text-muted-foreground font-mono text-sm">{url}</p>
              </div>
            </div>

            {/* Step Progress */}
            <div className="max-w-md mx-auto space-y-3">
              {STEPS.map((step, i) => {
                const isComplete = i < currentStep;
                const isCurrent = i === currentStep;
                const isPending = i > currentStep;

                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                      isCurrent
                        ? "bg-primary/5 border-primary/30 shadow-md shadow-primary/10"
                        : isComplete
                        ? "bg-card border-success/20 opacity-70"
                        : "bg-card border-border opacity-30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isComplete
                          ? "bg-success/15 text-success"
                          : isCurrent
                          ? "bg-primary text-primary-foreground pulse-glow"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? <CheckCircleIcon size={20} /> : step.icon}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>

                    {isCurrent && (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                    {isComplete && (
                      <div className="text-success text-xs font-medium">Done</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mt-6">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">
                This takes 15–30 seconds depending on the website size.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}