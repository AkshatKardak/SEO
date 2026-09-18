import Hero from "../components/home/Hero";
import ProblemSection from "../components/home/ProblemSection";
import GrowthLoopSection from "../components/home/GrowthLoopSection";
import GrowthPlatformShowcase from "../components/home/GrowthPlatformShowcase";
import ProofSection from "../components/home/ProofSection";
import FinalCTASection from "../components/home/FinalCTASection";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent-soft selection:text-accent">
      {/* 01. Hero & Product Preview */}
      <Hero />

      {/* 02. Problem Section in Precision Terms */}
      <ProblemSection />

      {/* 03. Growth Loop: Discover -> Prioritize -> Synthesize -> Execute -> Measure -> Repeat */}
      <GrowthLoopSection />

      {/* 04. Unified Growth Platform Showcase */}
      <GrowthPlatformShowcase />

      {/* 05. Proof & Architecture Comparison */}
      <ProofSection />

      {/* 06. Simplified FAQ, Lexicon & Launchpad */}
      <FinalCTASection />

      {/* 07. Footer */}
      <Footer />
    </div>
  );
}


