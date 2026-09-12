import Hero from "../components/home/Hero";
import ProblemSection from "../components/home/ProblemSection";
import GrowthLoopSection from "../components/home/GrowthLoopSection";
import ICEOpportunitySection from "../components/home/ICEOpportunitySection";
import GEOPresenceSection from "../components/home/GEOPresenceSection";
import AIAgentsSection from "../components/home/AIAgentsSection";
import CompetitorSection from "../components/home/CompetitorSection";
import MLPredictionsSection from "../components/home/MLPredictionsSection";
import GrowthGraphSection from "../components/home/GrowthGraphSection";
import ActionCenterSection from "../components/home/ActionCenterSection";
import GrowthMemorySection from "../components/home/GrowthMemorySection";
import StrategySection from "../components/home/StrategySection";
import ProofSection from "../components/home/ProofSection";
import FinalCTASection from "../components/home/FinalCTASection";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 02. Hero & 03. Product Preview */}
      <Hero />

      {/* 04. Problem Section */}
      <ProblemSection />

      {/* 05. Growth Loop Section */}
      <div id="growth-loop">
        <GrowthLoopSection />
      </div>

      {/* 06. ICE Opportunity Engine */}
      <div id="ice-engine">
        <ICEOpportunitySection />
      </div>

      {/* 07. SEO + GEO Intelligence */}
      <div id="geo-presence">
        <GEOPresenceSection />
      </div>

      {/* 08. Autonomous AI Agents */}
      <div id="agents">
        <AIAgentsSection />
      </div>

      {/* 09. Competitor Intelligence */}
      <div id="competitors">
        <CompetitorSection />
      </div>

      {/* 10. ML Predictions & Anomaly Radar */}
      <div id="ml-predictions">
        <MLPredictionsSection />
      </div>

      {/* 11. Growth Graph */}
      <div id="growth-graph">
        <GrowthGraphSection />
      </div>

      {/* 12. Action Center */}
      <div id="action-center">
        <ActionCenterSection />
      </div>

      {/* 13. Growth Memory */}
      <div id="growth-memory">
        <GrowthMemorySection />
      </div>

      {/* 14. 30/60/90 Day Strategy */}
      <div id="strategy">
        <StrategySection />
      </div>

      {/* 15. Proof & Differentiators */}
      <div id="proof">
        <ProofSection />
      </div>

      {/* 16. Final CTA */}
      <FinalCTASection />

      {/* 17. Footer */}
      <Footer />
    </div>
  );
}
