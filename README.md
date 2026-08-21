<p align="center">
  <img src="https://raw.githubusercontent.com/AkshatKardak/SEO/main/client/src/assets/Logo.png" alt="SerpoAI Logo" width="180"/>
</p>

<p align="center">
  <a href="https://github.com/AkshatKardak/SEO">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge&logo=rocket" />
  </a>
  <a href="https://github.com/AkshatKardak/SEO/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge" />
  </a>
</p>

# SerpoAI

### Autonomous Growth Engineering, GEO AI Visibility & Closed-Loop Intelligence Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-F55036?style=flat-square)](https://console.groq.com)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-V3%20%2F%20R1-0066FF?style=flat-square)](https://platform.deepseek.com)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude%203.5%20%2F%203.7%20Sonnet-D97706?style=flat-square&logo=anthropic)](https://anthropic.com)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Unified%20API-6366F1?style=flat-square)](https://openrouter.ai)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)](https://platform.openai.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini%202.0%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

---

## 🎯 The Problem

Modern growth, marketing, and SEO teams are bogged down by a fractured toolset:
1. **Shallow SEO Scanners**: Traditional audit tools dump 80-page lists of low-priority warnings without business context or expected ROI.
2. **Disconnected Point Solutions**: Separate subscriptions for rank trackers, site crawlers, keyword tools, AI copywriters, and Google Analytics lead to disjointed execution and zero attribution.
3. **No Closed-Loop Learning**: Marketing teams execute arbitrary changes without measuring baseline vs. post-execution metrics or recording what worked for future campaigns.
4. **Blindness to AI Answer Engines (GEO)**: As organic search shifts toward modern AI search engines (*ChatGPT Search, Perplexity, Gemini, Google AI Overviews*), traditional tools fail to analyze entity citation authority or AI visibility gaps.

---

## 💡 The Solution: SerpoAI

**SerpoAI** is an intelligent growth and SEO operating system that analyzes a company's website, synthesizes its knowledge graph, prioritizes high-leverage growth opportunities using the ICE formula, executes approved actions via specialized AI agents, measures true business impact along the Growth Graph, and continuously learns what works.

The core product philosophy is:

$$\Large \textbf{Discover} \longrightarrow \textbf{Prioritize} \longrightarrow \textbf{Execute} \longrightarrow \textbf{Measure} \longrightarrow \textbf{Learn} \longrightarrow \textbf{Repeat}$$

---

## 🌟 Core Features

- 🧠 **Growth Brain & Prioritization Engine**: Scores all growth opportunities using the rigorous ICE formula:
  $$\text{Priority Score} = \frac{\text{Impact (1-10)} \times \text{Confidence (0.1-1.0)}}{\text{Effort (1-10)}} \times 10$$
- 🛡️ **SSRF-Safe Multi-Page Crawler**: Fast server-side Cheerio scraping with strict DNS-level CIDR filtering that blocks private, loopback, and cloud metadata IPs (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254`).
- 🤖 **5 Specialized AI Agents**:
  - **Intelligence Agent**: Knowledge graph synthesis, buyer personas, and bottleneck analysis.
  - **SEO Agent**: Technical fixes, structured JSON-LD schemas, and indexing optimization.
  - **GEO Agent**: Generative Engine Optimization citation blueprints for Perplexity and ChatGPT.
  - **Content Agent**: High-intent comparison matrices (`Brand vs Competitor`) and conversion briefs.
  - **Growth Analyst Agent**: Closed-loop metric evaluation and organizational learning extraction.
- ⚡ **Action Center & Human-In-The-Loop**: Review proposed code diffs, SEO patches, and metadata with risk classifications (`LOW`, `MEDIUM`, `HIGH`) and one-click authorization.
- 📊 **Outcome Analytics & Funnel Tracking**: 6-step Growth Graph chain:
  $$\text{Visibility (Impressions)} \to \text{Traffic (Sessions)} \to \text{Engagement} \to \text{Signup (CVR)} \to \text{Activation} \to \text{Revenue (MRR)}$$
- ⚔️ **Competitor Intelligence & Content Gaps**: Computes high-ROI opportunities using:
  $$\text{Competitor Topic Coverage} + \text{Customer Search Demand} - \text{Your Coverage} = \text{Content Opportunities}$$
- 🧭 **30-60-90 Day Strategic Roadmap**: Milestones organized across 3 growth phases (Conversion Quick Wins $\to$ GEO Authority $\to$ Programmatic Scale) tied to your North Star metric.
- 🩺 **Technical Site Audit & Core Web Vitals**: Deep crawl inspection of schemas, canonical tags, viewport, image alt coverage, and live Core Web Vitals (LCP, INP, CLS) with 1-click auto-fix dispatching.
- 📑 **Executive Growth Briefs**: Performance reports summarizing traffic/conversion lift, verified learnings, and next-cycle priorities with 1-click Markdown export.
- 💬 **Global AI Co-Pilot Drawer**: Slide-over AI Growth Assistant available globally across all views for real-time strategic questions.
- 🔍 **Preserved Legacy SEO Tooling**: Single URL audit, Google PageSpeed analysis, sitemap validator, and keyword rank tracker with cron jobs.

---

## 💎 Unique Differentiators

| Capability | Generic SEO Tools | SerpoAI |
| :--- | :--- | :--- |
| **Execution Philosophy** | Dumps long lists of unranked warnings | Ranks by ICE formula: (Impact × Confidence) ÷ Effort |
| **Generative Engine Optimization (GEO)** | None (keywords only) | Simulates visibility across ChatGPT, Perplexity, Gemini, Google AI |
| **Safety & Human Control** | Black-box or manual only | 3 modes: Copilot, Autopilot (Diff approval), Autonomous |
| **Closed-Loop Intelligence** | No outcome tracking | Closed-loop attribution: *"Blog traffic increased 24%, but signups lagged $\to$ pivot to pricing page proof"* |
| **Organizational Memory** | None (resets every audit) | Stores verified experiment learnings permanently in Growth Memory |
| **LLM Provider Agnostic** | Single vendor lock-in | Multi-provider fallback cascade (**Groq Llama 3.3** $\to$ **DeepSeek V3/R1** $\to$ **Anthropic Claude 3.5/3.7** $\to$ **OpenRouter** $\to$ **OpenAI GPT-4o** $\to$ **Google Gemini 2.0 Flash**) |

---

## 🛠️ Tech Stack

### Frontend Client
- **Framework**: React 18 + TypeScript + Vite 8
- **Styling**: Tailwind CSS 4 + Aurora Gradient Glassmorphism design system
- **State Management**: React Context API (`ProjectContext`, `AuthContext`, `ThemeContext`)
- **Routing**: React Router 6
- **Icons & UI**: Lucide React, React Hot Toast, Recharts
- **Exporting**: `html2pdf.js`, Markdown BLOB generator

### Backend Server
- **Runtime**: Node.js 24 + Express 5 (Native ES Modules)
- **Database**: MongoDB Atlas + Mongoose 9
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Multi-Model LLM Layer**:
  - **Groq SDK**: `llama-3.3-70b-versatile`
  - **DeepSeek API**: `deepseek-chat` / `deepseek-reasoner`
  - **Anthropic Claude API**: `claude-3-5-sonnet-20241022` / `claude-3-7-sonnet`
  - **OpenRouter API**: Access to 200+ global open & proprietary models
  - **OpenAI REST API**: `gpt-4o` / `gpt-4o-mini` / `o3-mini`
  - **Google Generative AI REST API**: `gemini-2.0-flash`
- **DOM & Schema Extraction**: Cheerio (fast server-side scraping) + JSON-LD Microdata parser
- **Validation**: Zod strict schema enforcement for all LLM structured JSON payloads
- **Network Security**: Safe DNS resolution and private CIDR block filter against SSRF
- **Performance & Jobs**: Google PageSpeed Insights API v5, node-cron 4

---

## 📂 Project Structure

```
SEO/
├── client/                                 # React 18 + TypeScript Frontend
│   ├── src/
│   │   ├── assets/                         # Static assets & branding
│   │   ├── components/
│   │   │   ├── GrowthCopilotDrawer.tsx     # Global floating AI Growth Assistant
│   │   │   ├── Navbar.tsx                  # Project switcher, tools dropdown, navigation
│   │   │   └── ProtectedRoute.tsx          # Authentication route guard
│   │   ├── context/
│   │   │   ├── AuthContext.tsx             # JWT session state
│   │   │   ├── ProjectContext.tsx          # Multi-project switcher & active domain state
│   │   │   └── ThemeContext.tsx            # Light/Dark mode state
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx               # Growth OS command center (Scores, ICE Actions, Memory)
│   │   │   ├── Onboarding.tsx              # 4-step crawl, persona synthesis & goal wizard
│   │   │   ├── Opportunities.tsx           # ICE opportunity backlog & agent dispatcher
│   │   │   ├── ActionCenter.tsx            # Human-in-the-loop approval & code diff viewer
│   │   │   ├── GEOIntelligence.tsx         # AI Search visibility (ChatGPT, Perplexity, Gemini)
│   │   │   ├── AnalyticsView.tsx           # Growth Graph funnel & closed-loop verdicts
│   │   │   ├── CompetitorIntelligence.tsx  # Content Gap Analysis & competitor teardowns
│   │   │   ├── CompanyProfileView.tsx      # Knowledge Graph, personas & bottlenecks
│   │   │   ├── StrategyHub.tsx             # 30-60-90 Day Roadmap & North Star metrics
│   │   │   ├── SiteAudit.tsx               # Technical health, Core Web Vitals & 1-click auto-fix
│   │   │   ├── GrowthReports.tsx           # Executive growth briefs with Markdown export
│   │   │   ├── AgentActivity.tsx           # Agent token accounting, latency & financial costs
│   │   │   ├── Experiments.tsx             # A/B growth experiment hypothesis tracker
│   │   │   ├── ContentStudio.tsx           # Comparison pages & GEO citation briefs
│   │   │   ├── Analyze.tsx                 # (Preserved) Single URL SEO analyzer
│   │   │   ├── RankTracker.tsx             # (Preserved) Keyword rank tracker
│   │   │   ├── RankDetail.tsx              # (Preserved) Per-keyword position history
│   │   │   ├── History.tsx                 # (Preserved) SEO audit score history
│   │   │   ├── Report.tsx                  # (Preserved) Shareable audit report
│   │   │   ├── Home.tsx                    # Landing hero page
│   │   │   └── Login.tsx                   # Auth login & registration
│   │   ├── services/
│   │   │   └── api.ts                      # Axios API client (Growth OS v1 + legacy APIs)
│   │   ├── App.tsx                         # Router configuration
│   │   └── main.tsx                        # Root mounting with ProjectProvider
│   └── package.json
│
└── server/                                 # Express + Node.js Backend
    ├── ai/
    │   ├── providers/
    │   │   ├── LLMProvider.js              # Master provider coordinator with fallback cascade
    │   │   ├── GroqProvider.js             # Groq SDK structured JSON provider (Llama 3.3 70B)
    │   │   ├── DeepSeekProvider.js         # DeepSeek API provider (deepseek-chat / reasoner)
    │   │   ├── AnthropicProvider.js        # Anthropic Claude API provider (Claude 3.5 / 3.7)
    │   │   ├── OpenRouterProvider.js       # OpenRouter unified multi-model provider
    │   │   ├── OpenAIProvider.js           # OpenAI REST structured provider (GPT-4o)
    │   │   └── GeminiProvider.js           # Google Gemini REST provider (Gemini 2.0 Flash)
    │   └── schemas/
    │       └── growthSchemas.js            # Zod validation schemas for AI outputs
    ├── controllers/
    │   ├── projectController.js            # Project CRUD & onboarding coordinator
    │   ├── opportunityController.js        # Opportunity backlog & agent dispatching
    │   ├── actionController.js             # Action approvals & rejection audit log
    │   ├── geoController.js                # AI answer visibility simulator
    │   ├── analyticsController.js          # Growth Funnel & integration connectors
    │   ├── competitorController.js         # Content Gap discovery engine
    │   ├── strategyController.js           # 30-60-90 day strategic plan generator
    │   ├── siteAuditController.js          # Technical SEO & auto-fix action generator
    │   ├── reportController.js             # Executive growth briefs compiler
    │   ├── agentController.js              # Observability logs & Co-Pilot chat
    │   ├── experimentController.js         # A/B tests & learning extractor
    │   ├── memoryController.js             # Persistent organizational memory
    │   ├── authController.js               # JWT auth & password hashing
    │   └── seoController.js                # (Preserved) SSRF-safe SEO analysis
    ├── models/
    │   ├── Project.js                      # Project & 5-pillar scores model
    │   ├── CompanyProfile.js               # Knowledge Graph & personas model
    │   ├── GrowthOpportunity.js            # ICE-ranked opportunities model
    │   ├── GrowthAction.js                 # Action approval & code diff model
    │   ├── GEOQuery.js                     # AI search visibility query model
    │   ├── AnalyticsSnapshot.js            # Funnel metric snapshot model
    │   ├── Integration.js                  # Encrypted OAuth tokens model
    │   ├── CompetitorAnalysis.js           # Content gap analysis model
    │   ├── GrowthStrategy.js               # 30-60-90 roadmap model
    │   ├── SiteAuditReport.js              # Technical crawl audit & CWV model
    │   ├── GrowthReport.js                 # Executive report model
    │   ├── GrowthExperiment.js             # A/B test model
    │   ├── GrowthMemory.js                 # Persistent organizational memory model
    │   ├── AgentRun.js                     # Token & financial cost accounting model
    │   ├── User.js                         # User account model
    │   ├── SeoAnalysis.js                  # (Preserved) Audit records model
    │   └── RankTracker.js                  # (Preserved) Keyword tracker model
    ├── routes/
    │   ├── apiV1Router.js                  # Master API v1 mount (/api/v1/*)
    │   ├── projectRoutes.js
    │   ├── opportunityRoutes.js
    │   ├── actionRoutes.js
    │   ├── geoRoutes.js
    │   ├── analyticsRoutes.js
    │   ├── competitorRoutes.js
    │   ├── strategyRoutes.js
    │   ├── siteAuditRoutes.js
    │   ├── reportRoutes.js
    │   ├── agentRoutes.js
    │   ├── experimentRoutes.js
    │   └── memoryRoutes.js
    ├── services/
    │   ├── crawlerService.js               # SSRF DNS protection & Cheerio DOM parser
    │   ├── growthBrainService.js           # Knowledge graph synthesis & ICE ranking
    │   ├── geoService.js                   # Generative engine optimization queries
    │   ├── agentService.js                 # Specialized agent execution engine
    │   ├── analyticsService.js             # Closed-loop attribution & funnel snapshots
    │   ├── competitorService.js            # Content gap calculation service
    │   ├── strategyService.js              # 30-60-90 strategic roadmap service
    │   ├── siteAuditService.js             # Technical diagnostics & auto-fix service
    │   ├── reportService.js                # Executive brief synthesis service
    │   └── experimentService.js            # A/B testing & learning extraction
    ├── test-growth-os.js                   # Automated test verification suite
    ├── server.js                           # Express entry point
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version ≥ 18.0.0
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Groq API Key**: Free tier at [console.groq.com](https://console.groq.com)
- *(Optional)* **OpenAI API Key** or **Google Gemini API Key** for multi-provider fallback

---

### 1. Clone the Repository
```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

---

### 2. Configure & Start the Backend Server
```bash
cd server
npm install
```

Create a `server/.env` file:
```env
# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/growth_os?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_2026

# Primary LLM Provider (Groq Llama 3.3 70B - Free at console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Multi-Model AI Providers (Configure any/all for auto-fallback)
DEEPSEEK_API_KEY=sk-your_deepseek_key_here
ANTHROPIC_API_KEY=sk-ant-api-your_anthropic_key_here
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key_here
OPENAI_API_KEY=sk-proj-your_openai_key_here
GEMINI_API_KEY=AIzaSy_your_gemini_key_here

# Model Overrides (Optional - defaults to latest modern versions)
# OPENAI_MODEL=gpt-4o
# GEMINI_MODEL=gemini-2.0-flash
# DEEPSEEK_MODEL=deepseek-chat
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
# OPENROUTER_MODEL=deepseek/deepseek-chat

# Server Port & CORS Client URL
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run the backend server:
```bash
npm run server
```
*Backend API will run on `http://localhost:5000` with routes mounted at `/api/v1/*`.*

---

### 3. Run the Automated Verification Suite
To verify SSRF filtering, Cheerio DOM parsing, ICE prioritization math, and LLM coordinator connectivity:
```bash
node test-growth-os.js
```

---

### 4. Configure & Start the Frontend Client
```bash
cd ../client
npm install
```

Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📄 License
This project is open-source software licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## 👤 Author & Contributor
**Akshat Kardak**
- **GitHub**: [@AkshatKardak](https://github.com/AkshatKardak)
- **Repository**: [https://github.com/AkshatKardak/SEO](https://github.com/AkshatKardak/SEO)

---

<div align="center">
  <sub>Built with ❤️ for founders and growth engineers who prioritize business outcomes, conversion rate lift, and generative search visibility.</sub>
</div>
