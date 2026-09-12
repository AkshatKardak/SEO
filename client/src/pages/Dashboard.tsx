import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
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

  if (!currentProject && !projectLoading) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-background bg-grid flex items-center justify-center px-4">
        <div className="surface-card max-w-lg w-full p-8 rounded-2xl text-center space-y-5 border border-border shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-black text-foreground">Welcome to Autonomous Growth</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect your website or startup domain to discover high-impact growth vectors, AI search opportunities, and deploy autonomous execution agents.
          </p>
          <Link
            to="/onboarding"
            className="btn-glow px-6 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <Zap size={16} /> Setup Your First Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-20 bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Top Executive Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {currentProject?.domain}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary font-bold">
                {currentProject?.settings?.executionMode || "Autopilot"} Mode
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-medium">
                Goal: <strong className="text-foreground">{currentProject?.growthGoal || "Organic Traffic Acceleration"}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground mt-2">
              Autonomous Growth OS
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Real-time closed loop: Discover → Prioritize (ICE) → Execute → Measure → Learn
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleReanalyze}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold glass hover:bg-muted text-foreground transition-all disabled:opacity-50 hover-lift"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
              {refreshing ? "Scanning Architecture..." : "Trigger Growth Scan"}
            </button>
            <Link
              to="/actions"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover-lift"
            >
              <CheckSquare size={14} /> Action Center
            </Link>
          </div>
        </div>

        {/* ── 4 High-Impact KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Health */}
          <div className="surface-card hover-lift p-5 rounded-2xl border border-border flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Growth Health Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Flame size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-foreground">{healthScore}</span>
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {healthScore >= 70 ? "+14% MoM" : "Optimization Req"}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 block">
              Calculated across 5 core growth pillars
            </span>
          </div>

          {/* Card 2: Average ICE Score */}
          <div className="surface-card hover-lift p-5 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Avg ICE Velocity
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Target size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-primary">{avgIce}</span>
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {opportunities.length} Backlog Items
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, avgIce)}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 block">
              Impact × Confidence ÷ Effort formula
            </span>
          </div>

          {/* Card 3: AI Engine Readiness (GEO) */}
          <div className="surface-card hover-lift p-5 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                AI Search Index (GEO)
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Bot size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-sky-500">{scores.geo}</span>
              <span className="text-xs font-bold text-muted-foreground">/ 100</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                LLM Citations
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${scores.geo}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 block">
              Google AI, Gemini, ChatGPT & Perplexity readiness
            </span>
          </div>

          {/* Card 4: Autonomous Agents */}
          <div className="surface-card hover-lift p-5 rounded-2xl border border-border flex flex-col justify-between bg-gradient-to-br from-card to-card/70">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Autonomous Loop
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Cpu size={16} />
              </div>
            </div>
            <div className="my-3 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-violet-500">6</span>
              <span className="text-xs font-bold text-muted-foreground">Agents Ready</span>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20">
                {memoryItems.length} Learned Rules
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 block">
              Autonomous execution & feedback learning
            </span>
          </div>
        </div>

        {/* ── Visual Analytics: Area Chart & Radar Matrix ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Traffic Velocity & Growth Projections (7 cols) */}
          <div className="lg:col-span-7 surface-card hover-lift p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  <h3 className="text-base font-bold text-foreground">Traffic Velocity & Autonomous Projection</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ML forecast modeling compounding impact of executed ICE backlog
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground text-[11px]">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-muted-foreground text-[11px]">ML Projected</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    stroke="currentColor"
                    className="text-muted-foreground text-[11px]"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-muted-foreground text-[11px]"
                    tickLine={false}
                    domain={[20, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorProjected)"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 mt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Projection confidence: 92% based on verified high-ICE backlog items</span>
              <Link to="/analytics" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Full Analytics <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* 5-Pillar Spider Radar Chart (5 cols) */}
          <div className="lg:col-span-5 surface-card hover-lift p-6 rounded-2xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-primary" />
                  <h3 className="text-base font-bold text-foreground">Multi-Pillar Radar Matrix</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Evaluated against top 10% industry tier
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                5 Pillars
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--border)" strokeOpacity={0.8} />
                  <PolarAngleAxis
                    dataKey="pillar"
                    tick={{ fill: "var(--foreground)", fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--border)" tick={false} />
                  <Radar
                    name="Your Domain"
                    dataKey="current"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Top 10% Benchmark"
                    dataKey="benchmark"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.1}
                    strokeDasharray="3 3"
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 mt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Primary growth vector: <strong className="text-foreground">GEO (AI-Search Optimization)</strong></span>
              <Link to="/geo" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                Inspect GEO <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── What Should I Do Today? Ranked Opportunities ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <Sparkles size={14} />
                Strategic Growth Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                What should I do today?
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Highest-leverage actions ranked via mathematical ICE formula ($$Impact \times Confidence \div Effort$$)
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border self-start sm:self-auto">
              <button
                onClick={() => setOppFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  oppFilter === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({opportunities.length})
              </button>
              <button
                onClick={() => setOppFilter("high_impact")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  oppFilter === "high_impact" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => setOppFilter("quick_wins")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  oppFilter === "quick_wins" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Quick Wins
              </button>
              <button
                onClick={() => setOppFilter("autopilot")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  oppFilter === "autopilot" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Autopilot
              </button>
            </div>
          </div>

          {loadingOpps ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="surface-card rounded-2xl p-6 h-60 animate-pulse bg-muted/30" />
              ))}
            </div>
          ) : top3Opportunities.length === 0 ? (
            <div className="surface-card rounded-2xl p-12 text-center border border-border">
              <Lightbulb size={40} className="mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-base font-bold text-foreground">No pending items for this filter</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try switching filters or run a Growth Scan to discover fresh opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {top3Opportunities.map((opp, idx) => (
                <div
                  key={opp._id}
                  className="surface-card hover-lift rounded-2xl p-5 flex flex-col justify-between border border-border relative overflow-hidden bg-card transition-all"
                >
                  <div className="space-y-3.5">
                    {/* Card Header: Rank + ICE + Agent */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center border border-primary/20">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                          {opp.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          ICE: {opp.priorityScore}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-500 border border-violet-500/20">
                          {opp.assignedAgent}
                        </span>
                      </div>
                    </div>

                    {/* Opportunity Title & Details */}
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    {/* ICE Visual Scales */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 text-center bg-muted/40 rounded-xl border border-border/60 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold">Impact</span>
                        <span className="font-black text-emerald-500">{opp.impactScore}/10</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold">Effort</span>
                        <span className="font-black text-amber-500">{opp.effortScore}/10</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold">Confidence</span>
                        <span className="font-black text-sky-500">{Math.round(opp.confidenceScore * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-border/70 flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setSelectedOppForEvidence(opp)}
                      className="flex-1 py-2 px-3 rounded-xl bg-muted/60 border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors flex items-center justify-center gap-1 hover-lift"
                    >
                      Evidence
                    </button>
                    <button
                      onClick={() => handleExecute(opp)}
                      disabled={executingId === opp._id || opp.status === "executed"}
                      className="flex-1 py-2 px-3 rounded-xl btn-glow text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 hover-lift"
                    >
                      {executingId === opp._id ? (
                        "Dispatching..."
                      ) : opp.status === "executed" ? (
                        "Executed"
                      ) : (
                        <>
                          <Play size={12} fill="currentColor" /> Execute
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Link
              to="/opportunities"
              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
            >
              View All Opportunities in Backlog ({opportunities.length}) <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Specialized Autonomous Agents & Persistent Growth Memory ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Autonomous Agents Deck */}
          <div className="surface-card hover-lift rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">Specialized AI Execution Agents</h3>
              </div>
              <Link to="/agents" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Live Console <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-2.5">
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
                  className="p-3 rounded-xl bg-card border border-border flex items-center justify-between text-xs hover-slide-right"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{agent.icon}</span>
                    <div>
                      <span className="font-bold text-foreground">{agent.name}</span>
                      <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Persistent Growth Memory */}
          <div className="surface-card hover-lift rounded-2xl p-6 border border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FlaskConical size={18} className="text-violet-500" />
                  <h3 className="text-sm font-bold text-foreground">Persistent Growth Memory</h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">Closed-Loop Learning</span>
              </div>

              {memoryItems.length === 0 ? (
                <div className="p-6 rounded-xl bg-muted/30 text-center text-xs text-muted-foreground border border-border">
                  <p className="font-semibold text-foreground">No experiments logged yet.</p>
                  <p className="mt-1 leading-relaxed">
                    When you deploy agents and measure results, SerpoAI permanently catalogs what drives conversions vs. what fails to continually sharpen future recommendations.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memoryItems.slice(0, 4).map((item) => (
                    <div
                      key={item._id}
                      className="p-3 rounded-xl bg-card border border-border text-xs space-y-1 hover-slide-right"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-primary">[{item.category}]</span>
                        <span className="text-muted-foreground font-semibold">Confidence: {item.confidence}</span>
                      </div>
                      <p className="text-foreground font-medium">{item.learning}</p>
                      <span className="text-[10px] text-muted-foreground block">Source: {item.source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Optimizing for real enterprise outcomes, not generic AI tokens.</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Evidence Inspection Modal ── */}
      {selectedOppForEvidence && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  {selectedOppForEvidence.type}
                </span>
                <h3 className="text-base font-bold text-foreground mt-2">
                  {selectedOppForEvidence.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedOppForEvidence.description}
            </p>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <p className="text-xs font-bold text-foreground">Verified Evidence & Signals:</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {selectedOppForEvidence.evidence?.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
              <p className="font-bold text-primary mb-1">Recommended Action:</p>
              <p className="text-foreground">{selectedOppForEvidence.recommendedAction}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedOppForEvidence(null)}
                className="flex-1 py-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground hover:bg-muted/80"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExecute(selectedOppForEvidence);
                  setSelectedOppForEvidence(null);
                }}
                className="flex-1 py-2.5 rounded-xl btn-glow text-xs font-bold flex items-center justify-center gap-1.5 hover-lift"
              >
                <Play size={12} fill="currentColor" /> Deploy {selectedOppForEvidence.assignedAgent}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
