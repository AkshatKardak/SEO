import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavigationRail from "./NavigationRail";
import StatusStrip from "./StatusStrip";
import SerpoBotWidget from "./SerpoBotWidget";

export default function AppLayout() {
  const [serpoBotOpen, setSerpoBotOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSerpoBotOpen(true);
    window.addEventListener("open-serpo-bot", handler);
    return () => window.removeEventListener("open-serpo-bot", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col md:flex-row antialiased selection:bg-accent-soft selection:text-text-primary">
      {/* ── Left Rail ── */}
      <NavigationRail onOpenSerpoBot={() => setSerpoBotOpen(true)} />

      {/* ── Main Content Area ── */}
      <div className="flex-1 min-w-0 md:pl-16 flex flex-col min-h-screen pb-16 md:pb-0 transition-all duration-200">
        <StatusStrip onOpenSerpoBot={() => setSerpoBotOpen(true)} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>

      {/* ── Docked Serpo Bot ── */}
      <SerpoBotWidget
        isOpenExternal={serpoBotOpen}
        onToggleExternal={() => setSerpoBotOpen((prev) => !prev)}
      />
    </div>
  );
}
