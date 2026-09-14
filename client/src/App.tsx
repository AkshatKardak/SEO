import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import GrowthCopilotDrawer from "./components/GrowthCopilotDrawer";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Opportunities = lazy(() => import("./pages/Opportunities"));
const ActionCenter = lazy(() => import("./pages/ActionCenter"));
const GEOIntelligence = lazy(() => import("./pages/GEOIntelligence"));
const AgentActivity = lazy(() => import("./pages/AgentActivity"));
const Experiments = lazy(() => import("./pages/Experiments"));
const ContentStudio = lazy(() => import("./pages/ContentStudio"));
const AnalyticsView = lazy(() => import("./pages/AnalyticsView"));
const CompetitorIntelligence = lazy(() => import("./pages/CompetitorIntelligence"));
const CompanyProfileView = lazy(() => import("./pages/CompanyProfileView"));
const StrategyHub = lazy(() => import("./pages/StrategyHub"));
const SiteAudit = lazy(() => import("./pages/SiteAudit"));
const GrowthReports = lazy(() => import("./pages/GrowthReports"));
const Analyze = lazy(() => import("./pages/Analyze"));
const Report = lazy(() => import("./pages/Report"));
const History = lazy(() => import("./pages/History"));
const RankTracker = lazy(() => import("./pages/RankTracker"));
const RankDetail = lazy(() => import("./pages/RankDetail"));

function PageLoader() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-background">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
    );
}

export default function App() {
    return (
        <>
            <Toaster position="top-right" />
            <Navbar />
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
            <GrowthCopilotDrawer />
        </>
    );
}

