import Hero from "../components/home/Hero";
import ProblemSection from "../components/home/ProblemSection";
import GrowthLoopSection from "../components/home/GrowthLoopSection";
import GrowthPlatformShowcase from "../components/home/GrowthPlatformShowcase";
import ProofSection from "../components/home/ProofSection";
import FinalCTASection from "../components/home/FinalCTASection";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 01. Hero & Product Preview */}
      <Hero />

      {/* 02. Problem Section in Simple English */}
      <ProblemSection />

      {/* 03. Growth Loop: Scan -> Prioritize -> Approve -> Grow */}
      <div id="growth-loop">
        <GrowthLoopSection />
      </div>

      {/* 04. Unified Growth Platform Showcase (Consolidates all feature containers) */}
      <div id="platform-showcase">
        <GrowthPlatformShowcase />
      </div>

      {/* 05. Proof & Developer Trust */}
      <div id="proof">
        <ProofSection />
      </div>

      {/* 06. Simplified FAQ, Plain-English Glossary & Launchpad */}
      <FinalCTASection />

      {/* 07. Footer */}
      <Footer />
    </div>
  );
}

