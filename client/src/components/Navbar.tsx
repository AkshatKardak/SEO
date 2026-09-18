import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, ArrowRight, Menu, X } from "lucide-react";
import Logo from "../assets/Logo.png";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 w-full h-14 bg-surface/90 backdrop-blur-md z-40 border-b border-border select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* ── Brand Mark & System Status ── */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group focus:outline-none">
            <img src={Logo} alt="SerpoAI" className="w-7 h-7 object-contain" />
            <span className="font-serif text-lg font-medium text-text-primary tracking-tight">
              Serpo<span className="italic text-accent">AI</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-border bg-surface-muted text-[10px] font-mono text-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
            <span>ENGINE ONLINE</span>
          </div>
        </div>

        {/* ── Center Anchor Navigation Links ── */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-sans text-text-secondary">
          <a href="#platform-showcase" className="hover:text-text-primary transition-colors">
            Platform
          </a>
          <a href="#growth-loop" className="hover:text-text-primary transition-colors">
            Engine Loop
          </a>
          <a href="#proof" className="hover:text-text-primary transition-colors">
            Architecture
          </a>
          <Link to="/analyze" className="hover:text-text-primary transition-colors">
            URL Deep Scan
          </Link>
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded border border-border bg-surface-muted hover:bg-surface text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Paper (Light)" : "Observatory (Dark)"}`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="btn-primary h-8 px-3 text-xs font-semibold gap-1.5"
            >
              <span>Open Console</span>
              <ArrowRight size={13} />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn-secondary h-8 px-3 text-xs font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="btn-primary h-8 px-3 text-xs font-semibold gap-1"
              >
                <span>Launch App</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 rounded border border-border bg-surface text-text-secondary flex items-center justify-center cursor-pointer"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border p-4 space-y-3 font-sans text-xs">
          <a
            href="#platform-showcase"
            onClick={() => setMobileOpen(false)}
            className="block text-text-secondary hover:text-text-primary py-1"
          >
            Platform
          </a>
          <a
            href="#growth-loop"
            onClick={() => setMobileOpen(false)}
            className="block text-text-secondary hover:text-text-primary py-1"
          >
            Engine Loop
          </a>
          <a
            href="#proof"
            onClick={() => setMobileOpen(false)}
            className="block text-text-secondary hover:text-text-primary py-1"
          >
            Architecture
          </a>
          <Link
            to="/analyze"
            onClick={() => setMobileOpen(false)}
            className="block text-text-secondary hover:text-text-primary py-1"
          >
            URL Deep Scan
          </Link>
        </div>
      )}
    </header>
  );
}
