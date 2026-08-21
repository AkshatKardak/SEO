import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Opportunities from "./pages/Opportunities";
import ActionCenter from "./pages/ActionCenter";
import GEOIntelligence from "./pages/GEOIntelligence";
import AgentActivity from "./pages/AgentActivity";
import Experiments from "./pages/Experiments";
import ContentStudio from "./pages/ContentStudio";
import AnalyticsView from "./pages/AnalyticsView";
import CompetitorIntelligence from "./pages/CompetitorIntelligence";
import CompanyProfileView from "./pages/CompanyProfileView";
import StrategyHub from "./pages/StrategyHub";
import SiteAudit from "./pages/SiteAudit";
import GrowthReports from "./pages/GrowthReports";
import GrowthCopilotDrawer from "./components/GrowthCopilotDrawer";
import Analyze from "./pages/Analyze";
import Report from "./pages/Report";
import History from "./pages/History";
import RankTracker from "./pages/RankTracker";
import RankDetail from "./pages/RankDetail";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login state="login" />} />
                <Route path="/register" element={<Login state="register" />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/opportunities" element={<Opportunities />} />
                    <Route path="/actions" element={<ActionCenter />} />
                    <Route path="/geo" element={<GEOIntelligence />} />
                    <Route path="/analytics" element={<AnalyticsView />} />
                    <Route path="/competitors" element={<CompetitorIntelligence />} />
                    <Route path="/knowledge-graph" element={<CompanyProfileView />} />
                    <Route path="/strategy" element={<StrategyHub />} />
                    <Route path="/site-audit" element={<SiteAudit />} />
                    <Route path="/reports" element={<GrowthReports />} />
                    <Route path="/agents" element={<AgentActivity />} />
                    <Route path="/experiments" element={<Experiments />} />
                    <Route path="/content" element={<ContentStudio />} />
                    {/* Preserved SEO & Rank tooling */}
                    <Route path="/analyze" element={<Analyze />} />
                    <Route path="/report/:id" element={<Report />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/rank-tracker" element={<RankTracker />} />
                    <Route path="/rank/:id" element={<RankDetail />} />
                </Route>
            </Routes>
            <GrowthCopilotDrawer />
        </>
    );
}
