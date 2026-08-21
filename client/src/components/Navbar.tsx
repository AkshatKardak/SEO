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
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const coreNavLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <TrendingUp size={15} /> },
    { path: "/opportunities", label: "Opportunities", icon: <Lightbulb size={15} /> },
    { path: "/actions", label: "Actions", icon: <CheckSquare size={15} /> },
    { path: "/geo", label: "GEO", icon: <Sparkles size={15} /> },
    { path: "/competitors", label: "Competitors", icon: <Globe size={15} /> },
    { path: "/analytics", label: "Analytics", icon: <TrendingUp size={15} /> },
    { path: "/experiments", label: "Experiments", icon: <FlaskConical size={15} /> },
    { path: "/content", label: "Content", icon: <FileText size={15} /> },
    { path: "/agents", label: "Agents", icon: <Bot size={15} /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/85 backdrop-blur-xl z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={Logo} alt="SerpoAI" className="h-8 w-auto object-contain" />
              <span className="hidden sm:inline-block font-bold text-sm tracking-tight text-foreground">
                Serpo<span className="text-primary font-black">AI</span>
              </span>
            </Link>

            {/* Project Switcher Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 border border-primary/20 text-foreground hover:bg-primary/15 transition-all max-w-[160px] sm:max-w-[200px]"
                >
                  <Globe size={13} className="text-primary shrink-0" />
                  <span className="truncate">{currentProject?.domain || "Select Project"}</span>
                  <ChevronDown size={12} className="text-muted-foreground shrink-0" />
                </button>

                {projectDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl p-2 z-50">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase px-2 py-1">
                      Your Projects
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1 py-1">
                      {projects.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => {
                            selectProject(p._id);
                            setProjectDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                            currentProject?._id === p._id
                              ? "bg-primary/15 text-primary font-bold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="truncate">{p.domain}</span>
                          <span className="text-[10px] opacity-70 ml-2">{p.growthGoal?.slice(0, 12)}...</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-border mt-1 pt-1">
                      <Link
                        to="/onboarding"
                        onClick={() => setProjectDropdownOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-primary font-semibold hover:bg-primary/10 transition-colors"
                      >
                        <Plus size={14} /> Add New Website
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          {user && (
            <div className="hidden lg:flex items-center gap-0.5">
              {coreNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Legacy SEO Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 font-medium"
                >
                  <Search size={14} /> SEO Tools <ChevronDown size={11} />
                </button>
                {toolsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl p-1.5 z-50">
                    <Link
                      to="/strategy"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted font-medium"
                    >
                      <Compass size={14} className="text-primary" /> 30-60-90 Strategy Plan
                    </Link>
                    <Link
                      to="/site-audit"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted font-medium"
                    >
                      <ShieldCheck size={14} className="text-success" /> Technical Site Audit
                    </Link>
                    <Link
                      to="/knowledge-graph"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted font-medium"
                    >
                      <Sparkles size={14} className="text-accent" /> Knowledge Graph
                    </Link>
                    <Link
                      to="/reports"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted font-medium"
                    >
                      <FileText size={14} className="text-primary" /> Executive Growth Briefs
                    </Link>
                    <div className="my-1 border-t border-border" />
                    <Link
                      to="/analyze"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted"
                    >
                      <Search size={14} /> Single URL Audit
                    </Link>
                    <Link
                      to="/rank-tracker"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted"
                    >
                      <Target size={14} /> Rank Tracker
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-foreground hover:bg-muted"
                    >
                      <History size={14} /> Scan History
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border bg-card text-xs">
                  <div
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-foreground font-semibold truncate max-w-[100px]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-glow px-4 py-1.5 rounded-full text-xs font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="text-muted-foreground hover:text-foreground p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-3 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-muted/60 rounded-xl mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground">{currentProject?.domain || user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 py-1">
                {coreNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                      isActive(link.path) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/analyze"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs text-foreground hover:bg-muted"
                >
                  <Search size={16} /> SEO Audit
                </Link>
                <Link
                  to="/rank-tracker"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs text-foreground hover:bg-muted"
                >
                  <Target size={16} /> Rank Tracker
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold text-danger bg-danger/10 w-full mt-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 text-xs font-bold text-center rounded-lg hover:bg-muted text-foreground"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block p-2.5 text-xs font-bold text-center rounded-lg bg-primary text-primary-foreground"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
