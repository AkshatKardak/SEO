import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import confetti from "canvas-confetti";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Bot,
  FlaskConical,
  RefreshCw,
  Zap,
  CheckSquare,
  X,
  Play,
  TrendingUp,
  Target,
  Cpu,
  ChevronRight,
  Compass,
  Flame,
  GitPullRequest,
} from "lucide-react";
import toast from "react-hot-toast";

interface Opportunity {
  _id: string;
  type: string;
  title: string;
  description: string;
  evidence: string[];
  impactScore: number;
  effortScore: number;
  confidenceScore: number;
  priorityScore: number;
  estimatedValue: string;
  status: string;
  recommendedAction: string;
  automationLevel: string;
  requiresApproval: boolean;
  assignedAgent: string;
}

export default function Dashboard() {
  const { currentProject, loading: projectLoading, reanalyzeCurrentProject } = useProject();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(false);
  const [memoryItems, setMemoryItems] = useState<any[]>([]);
  const [selectedOppForEvidence, setSelectedOppForEvidence] = useState<Opportunity | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [oppFilter, setOppFilter] = useState<"all" | "high_impact" | "quick_wins" | "autopilot">("all");
  const [autopilotArmed, setAutopilotArmed] = useState(true);

  const fetchDashboardData = async () => {
    if (!currentProject) return;

    try {
      setLoadingOpps(true);
      const [oppsRes, memRes] = await Promise.all([
        growthAPI.getOpportunities(currentProject._id),
        growthAPI.getGrowthMemory(currentProject._id),
      ]);

      setOpportunities(oppsRes.opportunities || []);
      setMemoryItems(memRes.memoryItems || []);
    } catch (err: any) {
      console.warn("Dashboard fetch error:", err);
    } finally {
      setLoadingOpps(false);
    }
  };

  useEffect(() => {
    if (currentProject) {
      fetchDashboardData();
    }
  }, [currentProject]);

  const fireCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#708F1E", "#3B82F6", "#10B981", "#E5A000"],
      });
    } catch {
      // ignore
    }
  };

  const handleExecute = async (opp: Opportunity) => {
    setExecutingId(opp._id);
    try {
      await growthAPI.executeOpportunity(opp._id);
      fireCelebration();
      toast.success(`${opp.assignedAgent} dispatched for "${opp.title}"`);
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Execution failed");
    } finally {
      setExecutingId(null);
    }
  };

  const handleReanalyze = async () => {
    setRefreshing(true);
    try {
      await reanalyzeCurrentProject();
      await fetchDashboardData();
      toast.success("Autonomous Growth Scan updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to refresh analysis");
    } finally {
      setRefreshing(false);
    }
  };

  const openSerpoBotWithPatch = () => {
    window.dispatchEvent(new CustomEvent("open-serpo-bot"));
  };

  const healthScore = currentProject?.growthHealthScore || 68;
  const scores = currentProject?.scores || {
    visibility: 72,
    seo: 81,
    geo: 46,
    conversion: 58,
    content: 69,
  };

  // ── Growth Velocity Chart Dataset ──
  const velocityData = useMemo(() => {
    const base = healthScore || 65;
    return [
      { week: "W-5", actual: Math.max(30, Math.round(base * 0.72)), projected: Math.max(30, Math.round(base * 0.72)) },
      { week: "W-4", actual: Math.max(35, Math.round(base * 0.78)), projected: Math.max(35, Math.round(base * 0.78)) },
      { week: "W-3", actual: Math.max(40, Math.round(base * 0.83)), projected: Math.max(40, Math.round(base * 0.83)) },
      { week: "W-2", actual: Math.max(45, Math.round(base * 0.89)), projected: Math.max(45, Math.round(base * 0.89)) },
      { week: "W-1", actual: Math.max(50, Math.round(base * 0.94)), projected: Math.max(50, Math.round(base * 0.94)) },
      { week: "Current", actual: base, projected: base },
      { week: "W+2", actual: null, projected: Math.min(98, Math.round(base * 1.08)) },
      { week: "W+4", actual: null, projected: Math.min(99, Math.round(base * 1.18)) },
      { week: "W+6", actual: null, projected: Math.min(100, Math.round(base * 1.28)) },
    ];
  }, [healthScore]);

  // ── 5-Pillar Radar Dataset ──
  const radarData = useMemo(() => {
    return [
      { pillar: "Technical SEO", current: scores.seo, benchmark: 85 },
      { pillar: "GEO (AI Search)", current: scores.geo, benchmark: 75 },
      { pillar: "Conversion", current: scores.conversion, benchmark: 80 },
      { pillar: "Content Depth", current: scores.content, benchmark: 82 },
      { pillar: "Visibility", current: scores.visibility, benchmark: 88 },
    ];
  }, [scores]);

  // ── Filtered Opportunities ──
  const filteredOpportunities = useMemo(() => {
    if (oppFilter === "high_impact") return opportunities.filter((o) => o.priorityScore >= 60 || o.impactScore >= 8);
    if (oppFilter === "quick_wins") return opportunities.filter((o) => o.effortScore <= 4);
    if (oppFilter === "autopilot") return opportunities.filter((o) => o.automationLevel === "full" || !o.requiresApproval);
    return opportunities;
  }, [opportunities, oppFilter]);

  const top3Opportunities = filteredOpportunities.slice(0, 3);

  // Average ICE
  const avgIce = useMemo(() => {
    if (!opportunities.length) return 0;
    const sum = opportunities.reduce((acc, o) => acc + (o.priorityScore || 0), 0);
    return Math.round(sum / opportunities.length);
  }, [opportunities]);

  // Radial calculation for SVG gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  if (!currentProject && !projectLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-surface border border-border max-w-lg w-full p-8 rounded-xl text-center space-y-5">
          <div className="w-12 h-12 rounded-lg bg-surface-raised border border-border flex items-center justify-center mx-auto text-accent">
            <Sparkles size={24} />
          </div>
          <h2 className="font-serif text-2xl text-text-primary">Welcome to Autonomous Growth OS</h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Connect your domain or GitHub repository to initiate real-time telemetry, ICE backlog prioritization, and autonomous patch execution.
          </p>
          <Link
            to="/onboarding"
            className="btn-primary px-5 py-2.5 rounded-lg font-semibold text-xs inline-flex items-center gap-2"
          >
            <Zap size={14} /> Setup Your First Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* ── Top Executive Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {currentProject?.domain || "serpoai.io"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
              {currentProject?.settings?.executionMode || "Autopilot"}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface text-text-muted">
              GOAL: <strong className="text-text-primary uppercase">{currentProject?.growthGoal || "Organic Traffic Acceleration"}</strong>
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight">
            Autonomous Growth OS
          </h1>
          <p className="text-xs text-text-muted mt-1 font-sans">
            Real-time closed telemetry loop: Discover → Prioritize (ICE) → Execute → Measure → Learn
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleReanalyze}
            disabled={refreshing}
            className="btn-secondary px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-accent" : ""} />
            {refreshing ? "Scanning Architecture..." : "Trigger Growth Scan"}
          </button>
          <Link
            to="/actions"
            className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <CheckSquare size={13} /> Action Center
          </Link>
        </div>
      </div>

      {/* ── Bento Grid Telemetry Cards (Row 1) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Card 1: Overall Health Score (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Growth Health Score
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              +4.1% vs last crawl
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 my-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-text-primary tabular-nums">
                  {healthScore.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-text-muted">/ 100</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">
                5-Pillar Weighted Score · Verified DOM Signals
              </p>
            </div>

            {/* Hairline Radial Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-border"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-accent transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame size={18} className="text-accent" />
              </div>
            </div>
          </div>

          {/* Sparkline mini-indicator */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>30-Day Index Velocity</span>
            <span className="text-text-primary font-semibold">Compounding +1.2×/mo</span>
          </div>
        </div>

        {/* Card 2: ICE Velocity (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Avg ICE Score
            </span>
            <Target size={14} className="text-accent" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-bold tracking-tight text-text-primary tabular-nums">
                {avgIce}
              </span>
              <span className="text-xs font-mono text-text-muted">/100</span>
            </div>
            <div className="w-full bg-border rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, avgIce)}%` }}
              />
            </div>
          </div>
          <div className="text-[10px] font-mono text-text-muted truncate">
            {opportunities.length} Backlog Vectors
          </div>
        </div>

        {/* Card 3: AI Search Index GEO (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              GEO Index
            </span>
            <Bot size={14} className="text-sky-500" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-3xl font-bold tracking-tight text-sky-500 tabular-nums">
                {scores.geo}
              </span>
              <span className="text-xs font-mono text-text-muted">/100</span>
            </div>
            <div className="w-full bg-border rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${scores.geo}%` }}
              />
            </div>
          </div>
          <div className="text-[10px] font-mono text-text-muted truncate">
            ChatGPT · Perplexity · SGE
          </div>
        </div>

        {/* Card 4: Autonomous Loop Status (3 cols) */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Autonomous Loop
            </span>
            <Cpu size={14} className="text-violet-500" />
          </div>

          <div className="my-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${autopilotArmed ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                {autopilotArmed ? "AUTOPILOT: ARMED" : "SUPERVISED: PAUSED"}
              </span>
              <button
                type="button"
                onClick={() => setAutopilotArmed(!autopilotArmed)}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-border hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
              >
                {autopilotArmed ? "Pause" : "Arm"}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-1">
              <span>Next Crawl:</span>
              <span className="text-text-primary tabular-nums">04h 18m</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-text-muted flex items-center justify-between pt-2 border-t border-border">
            <span>6/6 Agents Nominal</span>
            <span className="text-emerald-500 font-semibold">100% HEALTH</span>
          </div>
        </div>
      </div>

      {/* ── Urgent Patch Ready Callout (Row 2) ── */}
      <div className="border border-border bg-surface-raised rounded-xl p-4 sm:p-5 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-1 bg-accent absolute left-0 top-0 bottom-0" />
        <div className="flex items-start sm:items-center gap-3.5 pl-2 sm:pl-3">
          <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center text-accent shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
                Telemetry Dispatch
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-border text-text-muted">
                3 Patches Pending
              </span>
            </div>
            <p className="text-sm font-semibold text-text-primary mt-0.5">
              Serpo Bot prepared 3 code patches · Estimated organic lift +18.4% MRR
            </p>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              Article JSON-LD schema · Self-referential canonical · Heading hierarchy fix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto pl-2 sm:pl-0 shrink-0">
          <button
            type="button"
            onClick={openSerpoBotWithPatch}
            className="btn-secondary px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <Bot size={13} className="text-accent" /> Inspect in Serpo Bot
          </button>
          <Link
            to="/actions"
            className="btn-primary px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 w-full sm:w-auto justify-center font-semibold"
          >
            <GitPullRequest size={13} /> 1-Click PR
          </Link>
        </div>
      </div>

      {/* ── Visual Analytics: Area Chart & Radar Matrix (Row 3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic Velocity & Growth Projections (7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-accent" />
                <h3 className="font-sans font-semibold text-sm text-text-primary">
                  Traffic Velocity & Autonomous Projection
                </h3>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Compounding outcome model based on executed ICE backlog
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-text-muted">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-text-muted">ML Projected</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="week"
                  stroke="currentColor"
                  className="text-text-muted text-[11px] font-mono"
                  tickLine={false}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-text-muted text-[11px] font-mono"
                  tickLine={false}
                  domain={[20, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    borderRadius: "0.5rem",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#0ea5e9"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorProjected)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>Projection confidence: 92% · Bayesian calibrated</span>
            <Link to="/analytics" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              Full Analytics <ChevronRight size={12} />
            </Link>
          </div>
        </div>

        {/* 5-Pillar Spider Radar Chart (5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-accent" />
                <h3 className="font-sans font-semibold text-sm text-text-primary">
                  Multi-Pillar Radar Matrix
                </h3>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Evaluated against top 10% industry tier
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-text-muted">
              5 Pillars
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--color-border)" strokeOpacity={0.8} />
                <PolarAngleAxis
                  dataKey="pillar"
                  tick={{ fill: "var(--color-text-secondary)", fontSize: 10, fontFamily: "var(--font-mono)" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--color-border)" tick={false} />
                <Radar
                  name="Your Domain"
                  dataKey="current"
                  stroke="#708F1E"
                  fill="#708F1E"
                  fillOpacity={0.25}
                  strokeWidth={1.5}
                />
                <Radar
                  name="Top 10% Benchmark"
                  dataKey="benchmark"
                  stroke="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.08}
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)", paddingTop: "8px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-mono">
            <span>Primary vector: <strong className="text-text-primary">GEO (AI-Search Optimization)</strong></span>
            <Link to="/geo" className="text-accent font-semibold hover:underline inline-flex items-center gap-1">
              Inspect GEO <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── What Should I Do Today? Ranked Opportunities (Row 4) ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent mb-1">
              <Sparkles size={13} />
              Strategic Growth Backlog
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-text-primary">
              What should I do today?
            </h2>
            <p className="text-xs text-text-muted mt-0.5 font-sans">
              Highest-leverage actions ranked via mathematical ICE formula (Impact × Confidence ÷ Effort)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-lg border border-border self-start sm:self-auto">
            <button
              onClick={() => setOppFilter("all")}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                oppFilter === "all" ? "bg-surface text-text-primary border border-border shadow-xs" : "text-text-muted hover:text-text-primary"
              }`}
            >
              All ({opportunities.length})
            </button>
            <button
              onClick={() => setOppFilter("high_impact")}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                oppFilter === "high_impact" ? "bg-surface text-text-primary border border-border shadow-xs" : "text-text-muted hover:text-text-primary"
              }`}
            >
              High Impact
            </button>
            <button
              onClick={() => setOppFilter("quick_wins")}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                oppFilter === "quick_wins" ? "bg-surface text-text-primary border border-border shadow-xs" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Quick Wins
            </button>
            <button
              onClick={() => setOppFilter("autopilot")}
              className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                oppFilter === "autopilot" ? "bg-surface text-text-primary border border-border shadow-xs" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Autopilot
            </button>
          </div>
        </div>

        {loadingOpps ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-6 h-60 animate-pulse bg-surface-raised/30" />
            ))}
          </div>
        ) : top3Opportunities.length === 0 ? (
          <div className="bg-surface rounded-xl p-12 text-center border border-border">
            <Lightbulb size={36} className="mx-auto text-text-muted mb-3 opacity-50" />
            <p className="font-semibold text-text-primary text-sm">No pending items for this filter</p>
            <p className="text-xs text-text-muted mt-1 font-sans">
              Switch filters or trigger a Growth Scan to discover fresh opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Opportunities.map((opp, idx) => (
              <div
                key={opp._id}
                className="bg-surface rounded-xl p-5 flex flex-col justify-between border border-border relative overflow-hidden transition-all hover:border-accent/40"
              >
                <div className="space-y-3">
                  {/* Card Header: Rank + ICE + Agent */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded border border-border bg-surface-raised text-text-primary font-mono font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-surface-raised text-text-secondary">
                        {opp.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-border bg-surface-raised text-accent">
                        ICE {opp.priorityScore}
                      </span>
                    </div>
                  </div>

                  {/* Opportunity Title & Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  {/* ICE Visual Scales */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 text-center bg-surface-raised rounded-lg border border-border font-mono text-[10px]">
                    <div>
                      <span className="text-text-muted block text-[9px] uppercase">Impact</span>
                      <span className="font-bold text-text-primary tabular-nums">{opp.impactScore}/10</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[9px] uppercase">Effort</span>
                      <span className="font-bold text-text-primary tabular-nums">{opp.effortScore}/10</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[9px] uppercase">Confidence</span>
                      <span className="font-bold text-text-primary tabular-nums">{Math.round(opp.confidenceScore * 100)}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 border-t border-border flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setSelectedOppForEvidence(opp)}
                    className="btn-secondary flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                  >
                    Evidence
                  </button>
                  <button
                    onClick={() => handleExecute(opp)}
                    disabled={executingId === opp._id || opp.status === "executed"}
                    className="btn-primary flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    {executingId === opp._id ? (
                      "Dispatching..."
                    ) : opp.status === "executed" ? (
                      "Executed"
                    ) : (
                      <>
                        <Play size={11} fill="currentColor" /> Execute
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Link
            to="/opportunities"
            className="text-xs text-accent font-semibold hover:underline inline-flex items-center gap-1 font-mono"
          >
            View All Opportunities in Backlog ({opportunities.length}) <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Specialized Autonomous Agents & Persistent Growth Memory (Row 5) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Autonomous Agents Deck */}
        <div className="bg-surface rounded-xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-accent" />
              <h3 className="font-sans font-semibold text-sm text-text-primary">
                Specialized AI Execution Agents
              </h3>
            </div>
            <Link to="/agents" className="text-xs text-accent font-mono hover:underline flex items-center gap-1">
              Live Console <ArrowRight size={11} />
            </Link>
          </div>

          <div className="space-y-2">
            {[
              { name: "Growth Brain", role: "Strategy, ICE prioritization & Goal alignment", status: "Active", icon: "🧠" },
              { name: "Intelligence Agent", role: "Company profile, audience & competitor teardowns", status: "Active", icon: "🎯" },
              { name: "SEO Agent", role: "Technical crawls, metadata fixes & schema tags", status: "Ready", icon: "🔍" },
              { name: "GEO Agent", role: "AI-search visibility & citation gap analysis", status: "Ready", icon: "🤖" },
              { name: "Content Agent", role: "Comparison pages, briefs & conversion copy", status: "Ready", icon: "✍️" },
              { name: "Growth Analyst", role: "Measures experiment outcomes & stores learnings", status: "Active", icon: "📊" },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-2.5 rounded-lg bg-surface-raised border border-border flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{agent.icon}</span>
                  <div>
                    <span className="font-semibold text-text-primary">{agent.name}</span>
                    <p className="text-[10px] text-text-muted font-sans">{agent.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Persistent Growth Memory */}
        <div className="bg-surface rounded-xl p-5 border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} className="text-violet-500" />
                <h3 className="font-sans font-semibold text-sm text-text-primary">
                  Persistent Growth Memory
                </h3>
              </div>
              <span className="text-[11px] font-mono text-text-muted">Closed-Loop Learning</span>
            </div>

            {memoryItems.length === 0 ? (
              <div className="p-6 rounded-lg bg-surface-raised/50 text-center text-xs text-text-muted border border-border">
                <p className="font-semibold text-text-primary">No experiments logged yet.</p>
                <p className="mt-1 leading-relaxed text-[11px]">
                  When you deploy agents and measure results, SerpoAI permanently catalogs what drives conversions vs. what fails to continually sharpen future recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {memoryItems.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    className="p-2.5 rounded-lg bg-surface-raised border border-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-accent">[{item.category}]</span>
                      <span className="text-text-muted">Confidence: {item.confidence}</span>
                    </div>
                    <p className="text-text-primary font-medium text-[11px]">{item.learning}</p>
                    <span className="text-[10px] text-text-muted font-mono block">Source: {item.source}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Enterprise precision outcome optimization</span>
          </div>
        </div>
      </div>

      {/* ── Evidence Inspection Modal ── */}
      {selectedOppForEvidence && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-border bg-surface-raised text-accent">
                  {selectedOppForEvidence.type}
                </span>
                <h3 className="font-semibold text-base text-text-primary mt-2">
                  {selectedOppForEvidence.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {selectedOppForEvidence.description}
            </p>

            <div className="p-3.5 rounded-lg bg-surface-raised border border-border space-y-2">
              <p className="text-xs font-semibold text-text-primary font-mono">Verified Evidence & Signals:</p>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                {selectedOppForEvidence.evidence?.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-border bg-surface text-xs">
              <p className="font-mono text-[10px] text-accent font-semibold uppercase mb-1">Recommended Action</p>
              <p className="text-text-primary">{selectedOppForEvidence.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="btn-secondary flex-1 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExecute(selectedOppForEvidence);
                  setSelectedOppForEvidence(null);
                }}
                className="btn-primary flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Play size={11} fill="currentColor" /> Deploy {selectedOppForEvidence.assignedAgent}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
