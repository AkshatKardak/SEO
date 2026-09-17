import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import {
  Lightbulb,
  CheckSquare,
  Bot,
  Sparkles,
  FlaskConical,
  FileText,
  Search,
  Target,
  History,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  Globe,
  TrendingUp,
  Compass,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Logo from "../assets/Logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { projects, currentProject, selectProject } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [growthDropdownOpen, setGrowthDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
        setGrowthDropdownOpen(false);
        setToolsDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProjectDropdownOpen(false);
    setGrowthDropdownOpen(false);
    setToolsDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const isGrowthActive = [
    "/geo",
    "/competitors",
    "/content",
    "/experiments",
    "/analytics",
    "/agents",
  ].some((p) => location.pathname === p);

  const isToolsActive = [
    "/site-audit",
    "/strategy",
    "/knowledge-graph",
    "/reports",
    "/analyze",
    "/rank-tracker",
    "/history",
  ].some((p) => location.pathname === p);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 inset-x-0 w-full bg-background/85 backdrop-blur-xl z-50 border-b border-border/70 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* ── Left: Brand & Project Switcher ── */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center group py-1">
              <img src={Logo} alt="SerpoAI" className="brand-logo" />
            </Link>

            {/* Project Switcher Dropdown (Authenticated) */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setProjectDropdownOpen(!projectDropdownOpen);
                    setGrowthDropdownOpen(false);
                    setToolsDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-muted/60 hover:bg-muted border border-border text-foreground transition-all max-w-[160px] sm:max-w-[210px] cursor-pointer"
                >
                  <Globe size={13} className="text-primary shrink-0" />
                  <span className="truncate">{currentProject?.domain || "Select Website"}</span>
                  <ChevronDown size={12} className="text-muted-foreground shrink-0" />
                </button>

                {projectDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/50 mb-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Connected Websites
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                        {projects.length} Total
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 py-1">
                      {projects.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            selectProject(p._id);
                            setProjectDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                            currentProject?._id === p._id
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-foreground hover:bg-muted/70"
                          }`}
                        >
                          <span className="truncate">{p.domain}</span>
                          <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                            {p.growthGoal?.slice(0, 10)}...
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-border/60 mt-1 pt-1.5">
                      <Link
                        to="/onboarding"
                        onClick={() => setProjectDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-primary font-semibold hover:bg-primary/10 transition-colors"
                      >
                        <Plus size={14} /> Add New Website
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Center: Desktop Navigation Links ── */}
          {user ? (
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive("/dashboard")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <TrendingUp size={14} />
                Dashboard
              </Link>

              <Link
                to="/opportunities"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive("/opportunities")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Lightbulb size={14} />
                Opportunities
              </Link>

              <Link
                to="/actions"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive("/actions")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <CheckSquare size={14} />
                Actions
              </Link>

              {/* Growth Suite Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setGrowthDropdownOpen(!growthDropdownOpen);
                    setToolsDropdownOpen(false);
                    setProjectDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isGrowthActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Sparkles size={14} />
                  Growth Hub
                  <ChevronDown size={12} className={`transition-transform duration-200 ${growthDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {growthDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2.5 py-1">
                      Intelligence & Growth
                    </p>
                    <div className="space-y-0.5">
                      <Link
                        to="/geo"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/geo") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <Sparkles size={14} className={isActive("/geo") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">GEO Visibility</span>
                          <span className="text-[10px] opacity-75">AI Search engine citations</span>
                        </div>
                      </Link>
                      <Link
                        to="/competitors"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/competitors") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <Globe size={14} className={isActive("/competitors") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Competitor Intelligence</span>
                          <span className="text-[10px] opacity-75">Content gap discovery</span>
                        </div>
                      </Link>
                      <Link
                        to="/content"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/content") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <FileText size={14} className={isActive("/content") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Content Studio</span>
                          <span className="text-[10px] opacity-75">High-intent comparison briefs</span>
                        </div>
                      </Link>
                      <Link
                        to="/analytics"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/analytics") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <BarChart3 size={14} className={isActive("/analytics") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Growth Analytics</span>
                          <span className="text-[10px] opacity-75">Funnel attribution graph</span>
                        </div>
                      </Link>
                      <Link
                        to="/experiments"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/experiments") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <FlaskConical size={14} className={isActive("/experiments") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Experiments & A/B</span>
                          <span className="text-[10px] opacity-75">Hypothesis outcome tracking</span>
                        </div>
                      </Link>
                      <Link
                        to="/agents"
                        onClick={() => setGrowthDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/agents") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <Bot size={14} className={isActive("/agents") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Autonomous Agents</span>
                          <span className="text-[10px] opacity-75">Multi-agent execution logs</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setToolsDropdownOpen(!toolsDropdownOpen);
                    setGrowthDropdownOpen(false);
                    setProjectDropdownOpen(false);
                    setUserDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isToolsActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Search size={14} />
                  SEO Tools
                  <ChevronDown size={12} className={`transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2.5 py-1">
                      Technical & Audit Suite
                    </p>
                    <div className="space-y-0.5">
                      <Link
                        to="/site-audit"
                        onClick={() => setToolsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/site-audit") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <ShieldCheck size={14} className={isActive("/site-audit") ? "text-primary-foreground" : "text-emerald-400"} />
                        <div>
                          <span className="font-semibold block">Technical Site Audit</span>
                          <span className="text-[10px] opacity-75">Crawl & Core Web Vitals</span>
                        </div>
                      </Link>
                      <Link
                        to="/strategy"
                        onClick={() => setToolsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/strategy") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <Compass size={14} className={isActive("/strategy") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">30-60-90 Strategy</span>
                          <span className="text-[10px] opacity-75">Phased growth milestones</span>
                        </div>
                      </Link>
                      <Link
                        to="/rank-tracker"
                        onClick={() => setToolsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/rank-tracker") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <Target size={14} className={isActive("/rank-tracker") ? "text-primary-foreground" : "text-amber-400"} />
                        <div>
                          <span className="font-semibold block">Rank Tracker</span>
                          <span className="text-[10px] opacity-75">Daily keyword positions</span>
                        </div>
                      </Link>
                      <Link
                        to="/reports"
                        onClick={() => setToolsDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isActive("/reports") ? "bg-primary text-primary-foreground font-bold" : "text-foreground hover:bg-muted/70"
                        }`}
                      >
                        <FileText size={14} className={isActive("/reports") ? "text-primary-foreground" : "text-primary"} />
                        <div>
                          <span className="font-semibold block">Executive Reports</span>
                          <span className="text-[10px] opacity-75">Stakeholder briefs & exports</span>
                        </div>
                      </Link>
                      <div className="my-1 border-t border-border/50" />
                      <Link
                        to="/analyze"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-muted/70"
                      >
                        <Search size={13} className="text-muted-foreground" /> Single URL Scan
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-foreground hover:bg-muted/70"
                      >
                        <History size={13} className="text-muted-foreground" /> Scan History Archive
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            location.pathname !== "/login" && location.pathname !== "/register" && (
              <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
                <a href="/#growth-loop" className="hover:text-foreground transition-colors">
                  How It Works
                </a>
                <a href="/#platform-showcase" className="hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="/#proof" className="hover:text-foreground transition-colors">
                  Proof
                </a>
                <Link to="/analyze" className="hover:text-foreground transition-colors">
                  Free Scan
                </Link>
              </div>
            )
          )}

          {/* ── Right Actions ── */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              /* User Account Dropdown */
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setProjectDropdownOpen(false);
                    setGrowthDropdownOpen(false);
                    setToolsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted/60 text-xs transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black overflow-hidden shrink-0">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-bold text-foreground truncate max-w-[100px]">{user.name}</span>
                  <ChevronDown size={12} className="text-muted-foreground" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/onboarding"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/70 font-semibold"
                    >
                      <Plus size={14} className="text-primary" /> Add New Project
                    </Link>

                    <div className="my-1 border-t border-border/50" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger/10 font-bold transition-colors cursor-pointer"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Buttons */
              location.pathname === "/login" || location.pathname === "/register" ? (
                <Link
                  to="/"
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Home
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-glow px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                  >
                    Start Free
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="text-muted-foreground hover:text-foreground p-2 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open mobile menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border/80 bg-background/98 backdrop-blur-2xl px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto">
          {user ? (
            <>
              {/* User Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentProject?.domain || user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-danger hover:bg-danger/10 transition-colors"
                  title="Log out"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Core Links */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase px-1 mb-2">Core Dashboard</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { path: "/dashboard", label: "Overview", icon: <TrendingUp size={14} /> },
                    { path: "/opportunities", label: "Opportunities", icon: <Lightbulb size={14} /> },
                    { path: "/actions", label: "Actions", icon: <CheckSquare size={14} /> },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-semibold text-center ${
                        isActive(link.path) ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-foreground"
                      }`}
                    >
                      {link.icon}
                      <span className="mt-1 text-[11px]">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Growth & Intelligence Links */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase px-1 mb-2">Growth & Intelligence</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { path: "/geo", label: "GEO Visibility", icon: <Sparkles size={14} /> },
                    { path: "/competitors", label: "Competitors", icon: <Globe size={14} /> },
                    { path: "/content", label: "Content Studio", icon: <FileText size={14} /> },
                    { path: "/analytics", label: "Analytics", icon: <BarChart3 size={14} /> },
                    { path: "/experiments", label: "Experiments", icon: <FlaskConical size={14} /> },
                    { path: "/agents", label: "Agents", icon: <Bot size={14} /> },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                        isActive(link.path) ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-foreground"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* SEO Tools */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase px-1 mb-2">SEO Tools</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { path: "/site-audit", label: "Site Audit", icon: <ShieldCheck size={14} /> },
                    { path: "/strategy", label: "30-60-90 Plan", icon: <Compass size={14} /> },
                    { path: "/rank-tracker", label: "Rank Tracker", icon: <Target size={14} /> },
                    { path: "/reports", label: "Reports", icon: <FileText size={14} /> },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                        isActive(link.path) ? "bg-primary text-primary-foreground" : "bg-card border border-border/60 text-foreground"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/onboarding"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold w-full"
                >
                  <Plus size={15} /> Add Another Website
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <a
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-muted"
              >
                How It Works
              </a>
              <a
                href="#sample-response"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-muted"
              >
                Live Showcase
              </a>
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-muted"
              >
                Features
              </a>
              <Link
                to="/analyze"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 rounded-xl text-xs font-semibold text-foreground hover:bg-muted"
              >
                Instant URL Scan
              </Link>
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 text-xs font-bold text-center rounded-xl bg-card border border-border text-foreground"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block p-3 text-xs font-bold text-center rounded-xl bg-primary text-primary-foreground"
                >
                  Start Free
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
