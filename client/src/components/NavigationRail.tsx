import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Lightbulb,
  CheckSquare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  FileText,
  Sun,
  Moon,
  Bot,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronsUpDown,
  Plus,
  Menu,
  X,
  Layers,
  BarChart3,
  Users,
  Compass,
  FlaskConical,
  Activity,
  Search,
  Target,
  History as HistoryIcon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import Logo from "../assets/Logo.png";

interface NavigationRailProps {
  onOpenSerpoBot?: () => void;
}

export default function NavigationRail({ onOpenSerpoBot }: NavigationRailProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { projects, currentProject, selectProject } = useProject();
  const location = useLocation();
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem("serpo_nav_rail_expanded") === "true";
    } catch {
      return false;
    }
  });

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [growthMenuOpen, setGrowthMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("serpo_nav_rail_expanded", String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (railRef.current && !railRef.current.contains(e.target as Node)) {
        setProjectMenuOpen(false);
        setGrowthMenuOpen(false);
        setToolsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close submenus on route change
  useEffect(() => {
    setProjectMenuOpen(false);
    setGrowthMenuOpen(false);
    setToolsMenuOpen(false);
    setUserMenuOpen(false);
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const isGrowthActive = [
    "/analytics",
    "/competitors",
    "/strategy",
    "/knowledge-graph",
    "/experiments",
    "/agents",
    "/content",
  ].some((p) => location.pathname === p);

  const isToolsActive = [
    "/site-audit",
    "/rank-tracker",
    "/analyze",
    "/history",
  ].some((p) => location.pathname.startsWith(p));

  const cleanDomain = (url?: string) => {
    if (!url) return "Select Website";
    try {
      return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  return (
    <>
      {/* ── DESKTOP LEFT NAVIGATION RAIL (Hidden on mobile) ── */}
      <aside
        ref={railRef}
        aria-label="Application Navigation Rail"
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-surface border-r border-border transition-all duration-200 ease-out select-none ${
          isExpanded ? "w-60" : "w-16"
        }`}
      >
        {/* ── Top Header: Brand Mark + Collapse Toggle ── */}
        <div className="h-14 border-b border-border flex items-center justify-between px-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group focus:outline-none"
            title="SerpoAI — Dashboard"
          >
            <img
              src={Logo}
              alt="SerpoAI"
              className="w-7 h-7 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            />
            {isExpanded && (
              <span className="font-serif text-lg tracking-tight font-medium text-text-primary truncate">
                Serpo<span className="text-accent italic">AI</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleExpanded}
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
            className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* ── Domain Switcher Strip ── */}
        <div className="relative p-2 border-b border-border">
          <button
            type="button"
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
            className={`w-full flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors hover:bg-surface-muted ${
              projectMenuOpen ? "bg-surface-muted text-text-primary" : "text-text-secondary"
            }`}
            title={cleanDomain(currentProject?.url)}
          >
            <div className="w-5 h-5 rounded bg-surface-muted border border-border flex items-center justify-center text-[10px] font-mono font-bold text-accent flex-shrink-0 uppercase">
              {currentProject?.url ? cleanDomain(currentProject.url).charAt(0) : "S"}
            </div>

            {isExpanded && (
              <div className="flex-1 min-w-0 text-left">
                <p className="font-mono text-xs text-text-primary truncate leading-tight">
                  {cleanDomain(currentProject?.url)}
                </p>
                <p className="text-[10px] text-text-muted leading-tight">
                  {currentProject?.growthGoal ? currentProject.growthGoal : "Autonomous Mode"}
                </p>
              </div>
            )}

            {isExpanded && <ChevronsUpDown size={13} className="text-text-muted flex-shrink-0" />}
          </button>

          {/* Project Switcher Popover */}
          {projectMenuOpen && (
            <div className="absolute left-2 top-full mt-1 w-64 rounded-md border border-border bg-surface shadow-xl z-50 p-1.5 space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <span>Websites ({projects.length})</span>
                <Link
                  to="/onboarding"
                  onClick={() => setProjectMenuOpen(false)}
                  className="flex items-center gap-1 text-accent hover:underline font-sans normal-case text-xs"
                >
                  <Plus size={12} /> Add
                </Link>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5">
                {projects.map((proj) => {
                  const selected = currentProject?._id === proj._id;
                  return (
                    <button
                      key={proj._id}
                      type="button"
                      onClick={() => {
                        selectProject(proj._id);
                        setProjectMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                        selected
                          ? "bg-accent-soft/30 text-text-primary font-medium"
                          : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                      }`}
                    >
                      <div className="truncate min-w-0">
                        <div className="font-mono text-xs truncate">{cleanDomain(proj.url)}</div>
                        <div className="text-[10px] text-text-muted truncate">{proj.growthGoal || "Growth"}</div>
                      </div>
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 border-t border-border mt-1">
                <Link
                  to="/onboarding"
                  onClick={() => setProjectMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-text-primary rounded border border-border bg-surface-muted hover:bg-surface transition-colors"
                >
                  <Plus size={13} /> Add Website / Private Repo
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Primary Navigation Links ── */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`relative flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
              isActive("/dashboard")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            title="Dashboard"
          >
            {isActive("/dashboard") && <div className="active-nav-tick" />}
            <LayoutDashboard
              size={18}
              className={isActive("/dashboard") ? "text-accent" : "text-text-secondary"}
            />
            {isExpanded && <span>Dashboard</span>}
          </Link>

          {/* Opportunities */}
          <Link
            to="/opportunities"
            className={`relative flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
              isActive("/opportunities")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            title="Opportunities (ICE Backlog)"
          >
            {isActive("/opportunities") && <div className="active-nav-tick" />}
            <Lightbulb
              size={18}
              className={isActive("/opportunities") ? "text-accent" : "text-text-secondary"}
            />
            {isExpanded && <span>Opportunities</span>}
          </Link>

          {/* Action Center */}
          <Link
            to="/actions"
            className={`relative flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
              isActive("/actions")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            title="Action Center (Patches)"
          >
            {isActive("/actions") && <div className="active-nav-tick" />}
            <CheckSquare
              size={18}
              className={isActive("/actions") ? "text-accent" : "text-text-secondary"}
            />
            {isExpanded && <span>Action Center</span>}
          </Link>

          {/* GEO Intelligence */}
          <Link
            to="/geo"
            className={`relative flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
              isActive("/geo")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            title="GEO Intelligence (AI Citations)"
          >
            {isActive("/geo") && <div className="active-nav-tick" />}
            <Sparkles
              size={18}
              className={isActive("/geo") ? "text-accent" : "text-text-secondary"}
            />
            {isExpanded && <span>GEO Intelligence</span>}
          </Link>

          {/* ── Submenu: Growth Hub ── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setGrowthMenuOpen(!growthMenuOpen)}
              className={`w-full relative flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                isGrowthActive || growthMenuOpen
                  ? "text-text-primary bg-surface-muted"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
              }`}
              title="Growth Hub (Analytics, Competitors, Strategy)"
            >
              <div className="flex items-center gap-3">
                {isGrowthActive && <div className="active-nav-tick" />}
                <TrendingUp
                  size={18}
                  className={isGrowthActive ? "text-accent" : "text-text-secondary"}
                />
                {isExpanded && <span>Growth Hub</span>}
              </div>
              {isExpanded && (
                <ChevronRight
                  size={14}
                  className={`text-text-muted transition-transform ${
                    growthMenuOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {/* Growth Hub Popover / Drawer */}
            {growthMenuOpen && (
              <div
                className={`${
                  isExpanded ? "pl-7 pr-1 pt-1 space-y-0.5" : "absolute left-full top-0 ml-2 w-52 rounded-md border border-border bg-surface shadow-xl z-50 p-1.5 space-y-1"
                }`}
              >
                {!isExpanded && (
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-text-muted border-b border-border mb-1">
                    Growth Hub
                  </div>
                )}
                <Link
                  to="/analytics"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/analytics")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <BarChart3 size={14} /> Analytics Funnel
                </Link>
                <Link
                  to="/competitors"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/competitors")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Users size={14} /> Competitor Gaps
                </Link>
                <Link
                  to="/strategy"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/strategy")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Compass size={14} /> Strategy Roadmap
                </Link>
                <Link
                  to="/knowledge-graph"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/knowledge-graph")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Layers size={14} /> Knowledge Graph
                </Link>
                <Link
                  to="/experiments"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/experiments")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <FlaskConical size={14} /> Growth Experiments
                </Link>
                <Link
                  to="/agents"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/agents")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Activity size={14} /> Agent Activity
                </Link>
              </div>
            )}
          </div>

          {/* ── Submenu: SEO & Audit Tooling ── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className={`w-full relative flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                isToolsActive || toolsMenuOpen
                  ? "text-text-primary bg-surface-muted"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
              }`}
              title="Technical SEO Tools (Audit, Rank Tracker, Analyze)"
            >
              <div className="flex items-center gap-3">
                {isToolsActive && <div className="active-nav-tick" />}
                <ShieldCheck
                  size={18}
                  className={isToolsActive ? "text-accent" : "text-text-secondary"}
                />
                {isExpanded && <span>SEO Tools</span>}
              </div>
              {isExpanded && (
                <ChevronRight
                  size={14}
                  className={`text-text-muted transition-transform ${
                    toolsMenuOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {/* Tools Popover / Drawer */}
            {toolsMenuOpen && (
              <div
                className={`${
                  isExpanded ? "pl-7 pr-1 pt-1 space-y-0.5" : "absolute left-full top-0 ml-2 w-52 rounded-md border border-border bg-surface shadow-xl z-50 p-1.5 space-y-1"
                }`}
              >
                {!isExpanded && (
                  <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-text-muted border-b border-border mb-1">
                    Technical Tools
                  </div>
                )}
                <Link
                  to="/site-audit"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/site-audit")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <ShieldCheck size={14} /> Technical Audit
                </Link>
                <Link
                  to="/rank-tracker"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/rank-tracker")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Target size={14} /> Rank Tracker
                </Link>
                <Link
                  to="/analyze"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/analyze")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <Search size={14} /> URL Deep Scan
                </Link>
                <Link
                  to="/history"
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive("/history")
                      ? "text-accent font-medium bg-surface-muted"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <HistoryIcon size={14} /> Scan History
                </Link>
              </div>
            )}
          </div>

          {/* Executive Reports */}
          <Link
            to="/reports"
            className={`relative flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium transition-colors ${
              isActive("/reports")
                ? "text-text-primary font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
            title="Executive Reports"
          >
            {isActive("/reports") && <div className="active-nav-tick" />}
            <FileText
              size={18}
              className={isActive("/reports") ? "text-accent" : "text-text-secondary"}
            />
            {isExpanded && <span>Reports</span>}
          </Link>
        </nav>

        {/* ── Bottom Controls: Theme, Serpo Bot, User ── */}
        <div className="p-2 border-t border-border space-y-1">
          {/* Serpo Bot Launcher Button */}
          <button
            type="button"
            onClick={onOpenSerpoBot}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium text-accent hover:bg-accent-soft/20 transition-colors"
            title="Open Serpo Bot"
          >
            <div className="w-5 h-5 flex items-center justify-center relative">
              <Bot size={17} className="text-accent" />
            </div>
            {isExpanded && (
              <div className="flex-1 flex items-center justify-between">
                <span>Serpo Bot</span>
                <span className="badge-instrument text-[10px] py-0 px-1 text-accent">Active</span>
              </div>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-2.5 py-2 rounded text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
            title={`Switch to ${theme === "dark" ? "Light (Paper)" : "Dark (Observatory)"}`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </div>
            {isExpanded && (
              <span>{theme === "dark" ? "Observatory (Dark)" : "Paper (Light)"}</span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative pt-1 border-t border-border">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors"
              title={user?.email || "Account"}
            >
              <div className="w-6 h-6 rounded bg-accent-fill text-[#111508] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0 text-left truncate">
                  <div className="text-xs font-medium text-text-primary truncate">
                    {user?.name || "Operator"}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono truncate">
                    {user?.email || "admin@serpo.ai"}
                  </div>
                </div>
              )}
            </button>

            {/* User Menu Popover */}
            {userMenuOpen && (
              <div className="absolute left-2 bottom-full mb-2 w-56 rounded-md border border-border bg-surface shadow-xl z-50 p-1.5 space-y-1">
                <div className="px-2 py-1.5 border-b border-border">
                  <p className="text-xs font-medium text-text-primary truncate">{user?.name || "Operator"}</p>
                  <p className="text-[10px] font-mono text-text-muted truncate">{user?.email}</p>
                  <span className="badge-instrument text-[9px] mt-1 text-accent">
                    {user?.plan || "Pro Growth"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-negative hover:bg-negative/10 rounded flex items-center gap-2 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM TAB BAR (< md screens) ── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-surface border-t border-border z-40 flex items-center justify-around px-2"
      >
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] ${
            isActive("/dashboard") ? "text-accent font-semibold" : "text-text-muted"
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/opportunities"
          className={`flex flex-col items-center gap-1 text-[10px] ${
            isActive("/opportunities") ? "text-accent font-semibold" : "text-text-muted"
          }`}
        >
          <Lightbulb size={18} />
          <span>Opportunities</span>
        </Link>
        <Link
          to="/actions"
          className={`flex flex-col items-center gap-1 text-[10px] ${
            isActive("/actions") ? "text-accent font-semibold" : "text-text-muted"
          }`}
        >
          <CheckSquare size={18} />
          <span>Actions</span>
        </Link>
        <Link
          to="/geo"
          className={`flex flex-col items-center gap-1 text-[10px] ${
            isActive("/geo") ? "text-accent font-semibold" : "text-text-muted"
          }`}
        >
          <Sparkles size={18} />
          <span>GEO</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 text-[10px] text-text-muted"
        >
          <Menu size={18} />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm h-full bg-surface border-l border-border p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-serif text-lg font-medium text-text-primary">SerpoAI Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded flex items-center justify-center text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-3 space-y-1">
                <Link
                  to="/analytics"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <BarChart3 size={16} /> Analytics Funnel
                </Link>
                <Link
                  to="/competitors"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <Users size={16} /> Competitor Intelligence
                </Link>
                <Link
                  to="/strategy"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <Compass size={16} /> Strategy Roadmap
                </Link>
                <Link
                  to="/site-audit"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <ShieldCheck size={16} /> Technical Site Audit
                </Link>
                <Link
                  to="/rank-tracker"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <Target size={16} /> Rank Tracker
                </Link>
                <Link
                  to="/reports"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-text-secondary hover:text-text-primary"
                >
                  <FileText size={16} /> Executive Reports
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 text-xs text-text-secondary"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-1 text-xs text-negative"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
