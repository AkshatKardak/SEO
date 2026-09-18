<p align="center">
  <img src="client/src/assets/Logo.png" alt="SerpoAI Logo" width="220"/>
</p>

<h1 align="center">SerpoAI</h1>
<p align="center">
  <strong>The Autonomous Search Growth Operating System</strong><br/>
  <em>"Turn Search Data Into Compounding Organic Growth."</em>
</p>

<p align="center">
  <a href="https://github.com/AkshatKardak/SEO">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-1E6B45?style=for-the-badge&logo=rocket" />
  </a>
  <a href="https://github.com/AkshatKardak/SEO/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-D4F843?style=for-the-badge&logoColor=111508&color=1E6B45" />
  </a>
  <img src="https://img.shields.io/badge/ML%20Engine-FastAPI%20%2B%20scikit--learn-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/UI-Precision%20Instrument-10151B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-product-positioning">Positioning</a> •
  <a href="#-core-operating-loop">Growth Loop</a> •
  <a href="#-design-system-precision-instrument">Design System</a> •
  <a href="#-core-features">Core Features</a> •
  <a href="#-the-three-ml-engines">The 3 ML Engines</a> •
  <a href="#-serpo-bot-github-pr-dispatcher">Serpo Bot</a> •
  <a href="#-local-development--setup">Local Setup</a> •
  <a href="#-deployment-guide">Deployment</a> •
  <a href="#-author">Author</a>
</p>

---

## 🧭 Product Positioning

**SerpoAI is NOT simply an SEO audit checklist.**

> **"SerpoAI doesn't just tell you what is broken. It determines what matters with mathematical ICE ranking, predicts expected traffic lift with local ML models, synthesizes verified code patches, dispatches GitHub Pull Requests in 1 click, and learns from verified revenue outcomes."**

Traditional SEO platforms are retrospective reporting dashboards: they tell you what dropped last week and dump a 200-item checklist into your Jira backlog. **SerpoAI is an autonomous execution engine** connecting continuous technical crawling to verified pull requests and closed-loop search attribution.

---

## 🔄 Core Operating Loop

$$\Large \textbf{DISCOVER} \longrightarrow \textbf{PRIORITIZE} \longrightarrow \textbf{SYNTHESIZE} \longrightarrow \textbf{EXECUTE} \longrightarrow \textbf{MEASURE} \longrightarrow \textbf{REPEAT}$$

1. **DISCOVER**: Full-spectrum crawler audits 60+ technical DOM hygiene vectors, Schema.org entities, and brand citation footprints across AI answer engines.
2. **PRIORITIZE**: Mathematical ICE formula $\left(\frac{\text{Impact} \times \text{Confidence}}{\text{Effort}} \times 10\right)$ powered by trained scikit-learn regressors orders backlog by expected conversion yield.
3. **SYNTHESIZE**: AST diff engine produces syntactically verified code patches (JSON-LD schemas, canonical tags, 301 redirect trees) with zero hallucinated code.
4. **EXECUTE**: **Serpo Bot** branches, commits verified patches, and opens reviewable GitHub Pull Requests with automated CI pre-merge checks.
5. **MEASURE**: Closed-loop Growth Graph connects Impressions $\to$ Clicks $\to$ Signups $\to$ Attributed MRR using official Google Search Console OAuth telemetry.
6. **REPEAT**: Persistent Growth Memory stores domain-specific causal experiment outcomes and recalibrates ML priors for compounding rank velocity.

---

## 🎛️ Design System: "Precision Instrument"

SerpoAI features a custom design system inspired by **Linear × Bloomberg Terminal × Oscilloscope**:

- **Dual Color Modes**:
  - **Light ("Paper")**: Clean `#F7F6F2` canvas with `#FFFFFF` surfaces, `#1E6B45` deep moss green accents, `#E4E1DA` hairline borders, and `#1A1D21` ink typography.
  - **Dark ("Observatory")**: Deep `#0A0E12` ink navy (never pure black), `#10151B` surfaces, `#D4F843` electric chartreuse accents, and `rgba(255, 255, 255, 0.08)` hairline borders.
- **Precision Typography**:
  - `Instrument Serif`: Editorial elegance for headlines, section titles, and value propositions.
  - `Geist Sans`: High-legibility geometric sans-serif for UI copy, dialogs, and controls.
  - `IBM Plex Mono`: Fixed-width numerals with `font-variant-numeric: tabular-nums` for latency meters, coordinates, and diff blocks.
- **Persistent App Shell**:
  - **Collapsible Navigation Rail**: 64px icon rail $\leftrightarrow$ 240px expanded navigation with active left indicator ticks.
  - **Top Status Strip**: Breadcrumb hierarchy, live UTC clock (`HH:MM:SS UTC`), and `● Engine online` pulse monitor.
  - **Serpo Bot Widget**: Docked bottom-right popover (`bottom-[76px]`) with real-time oscilloscope bars and code patch generator.
  - **Subtle Background Texture**: Fixed radial grid dot-matrix overlay (`radial-gradient(var(--grid-texture) 1px, transparent 1px)`).

---

## 🚀 Core Features

- **Deep Technical Site Audit**: Crawls pages to detect missing meta tags, broken canonicals, heading hierarchy issues, and Core Web Vitals bottlenecks.
- **ICE-Ranked Opportunity Engine**: Prioritizes growth fixes using mathematical Impact, Confidence, and Effort scoring to maximize search ROI.
- **Generative Engine Optimization (GEO) Radar**: Audits brand citation presence across ChatGPT, Perplexity, Gemini, and Google AI Overviews.
- **1-Click Code Patch Generator**: Creates production-ready JSON-LD schemas (Organization, Article, FAQ, Product), robots.txt rules, and OpenGraph tags.
- **Multi-Page Sitemap XML Crawler**: Discovers and prioritizes key subpages (pricing, product, blog) protected by SSRF cloud sandbox filters.
- **Daily Keyword Rank Tracker**: Monitors Google keyword positions on daily or weekly schedules with rank history graphs.
- **Executive PDF & Markdown Reports**: Generates professional stakeholder audit briefs with 1-click PDF download.
- **Secure Clerk Authentication**: Enterprise-grade single sign-on with multi-tenant workspace protection and immediate post-login `/dashboard` routing.
- **Private Repo & Pre-Release Onboarding**: Supports live production domains as well as private GitHub repositories and staging environments with personal access token (PAT) presets.

---

## 🧠 The Three ML Engines

SerpoAI couples its Node.js API with a dedicated Python 3.11 FastAPI microservice (`ml-service/`) utilizing `scikit-learn` and `joblib`:

### 1. Deterministic ICE Opportunity Ranker (`opportunity_ranker.py`)
- **Model**: Trained Scikit-Learn Random Forest Regressor + Ridge Regressor with Bayesian shrinkage priors.
- **Functionality**: Eliminates arbitrary vanity checklists. Takes technical severity, search volume, domain authority, and implementation complexity to predict net traffic impact and conversion lift.

### 2. Automated Keyword Cannibalization Graph (`cannibalization_engine.py`)
- **Model**: Force-Directed Semantic Clustering + Cosine Similarity over query intent embeddings.
- **Functionality**: Identifies when multiple URLs on the same domain compete for identical search intents, outputting deterministic resolution patches (canonicalization, 301 redirects, or content differentiation).

### 3. Google Search Console (GSC) CTR Curve Engine (`gsc_ctr_engine.py`)
- **Model**: Log-Logistic Click-Through Curve Fitting & Striking Distance Regressor.
- **Functionality**: Ingests actual GSC search performance curves. Identifies high-impression queries sitting in "striking distance" (positions 4–15) and generates title/snippet patches to capture immediate top-3 click gains.

---

## 🤖 Serpo Bot & GitHub PR Dispatcher

Instead of sending static audit PDFs to engineering teams that sit unresolved in Jira:

1. **1-Click GitHub Repository Connection**: Operators connect public or private repositories via scoped OAuth or Personal Access Tokens.
2. **AST Verification**: Code diffs are run through Abstract Syntax Tree (AST) linters to ensure 100% syntax safety and Schema.org compliance.
3. **Automated Branch & PR Dispatch**: Serpo Bot creates a dedicated feature branch (`serpo/seo-patch-*`), commits the verified patch, and opens a GitHub Pull Request with automated CI test summaries.
4. **Strict Human-in-the-Loop Safeguard**: Zero code touches production branches without explicit operator and engineering review.

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: 3.11+
- **MongoDB**: Local instance or MongoDB Atlas URI

### 1. Backend Server (`server/`)
```bash
cd server
npm install
npm run dev
# Running on http://localhost:5000
```
**Environment Variables (`server/.env`)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serpoai
JWT_SECRET=your_jwt_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
ML_SERVICE_URL=http://localhost:8000
```

### 2. Python ML Microservice (`ml-service/`)
```bash
cd ml-service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
# Running on http://127.0.0.1:8000 (Docs at http://127.0.0.1:8000/docs)
```

### 3. Frontend Client (`client/`)
```bash
cd client
npm install
npm run dev
# Running on http://localhost:5173
```
**Environment Variables (`client/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Production Build Verification
```bash
cd client
npm run build
# tsc -b && vite build -> dist/
```

---

## 🌐 Deployment Guide

### Deploying Backend & ML Service on Render
1. **Backend API (`server/`)**:
   - New Web Service $\to$ Root: `server` $\to$ Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
2. **Python ML Service (`ml-service/`)**:
   - New Web Service $\to$ Root: `ml-service` $\to$ Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Deploying Frontend on Netlify / Vercel
1. Connect repository $\to$ Root Directory: `client`
2. Build Command: `npm run build`
3. Publish Directory: `client/dist`
4. Set `VITE_API_URL` to your production backend API URL.
5. Client SPA routing is handled by the included `client/public/_redirects` file.

---

## 📁 Repository Structure

```
seo-rank-tracker-main/
│
├── client/                                 # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/                             # Static Assets, Screenshots & Netlify _redirects
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/                       # Precision Landing (Hero, Problem, GrowthLoop, Showcase, Proof, FinalCTA)
│   │   │   ├── features/                   # SerpoBotPRModal, ForceGraph, Radar & Gauges
│   │   │   ├── NavigationRail.tsx          # Collapsible 64px/240px Navigation Rail
│   │   │   ├── StatusStrip.tsx             # 48px Header Strip with Live UTC Clock
│   │   │   ├── SerpoBotWidget.tsx          # Docked Floating Oscilloscope Copilot
│   │   │   └── AppLayout.tsx               # Persistent Application Shell
│   │   ├── pages/                          # Dashboard, GEO, Opportunities, Action Center (18 views)
│   │   └── services/api.ts                 # Clean API Client (/api/*)
│   └── package.json
│
├── server/                                 # Express + Node.js Backend API
│   ├── ai/providers/                       # Multi-Provider LLM Cascade (Groq, Gemini, OpenRouter)
│   ├── controllers/                        # Project, Opportunity, GEO, & Audit Controllers
│   ├── models/                             # Mongoose Schemas (Opportunity, Memory, Project)
│   ├── routes/                             # Clean Express Routers (/api/* and /api/v1/*)
│   ├── services/
│   │   ├── mlClientService.js              # ML Scoring + Bayesian Statistical Gateway
│   │   ├── growthBrainService.js           # Growth Brain Knowledge Synthesis
│   │   ├── geoService.js                   # Generative Engine Optimization Engine
│   │   └── crawlerService.js               # SSRF-Safe Cloud Crawler
│   └── server.js
│
└── ml-service/                             # Python 3.11 FastAPI Machine Learning Microservice
    ├── app/
    │   ├── main.py                         # FastAPI App Entrypoint & Healthcheck
    │   ├── models/
    │   │   ├── opportunity_ranker.py       # Scikit-Learn Trained Random Forest Regressor
    │   │   ├── cannibalization_engine.py   # Intent Cluster & Cannibalization Graph
    │   │   ├── gsc_ctr_engine.py           # Log-Logistic CTR Curve Fitting & Striking Distance
    │   │   ├── anomaly_detector.py         # IsolationForest & Rolling Z-Score Radar
    │   │   └── traffic_forecaster.py       # Autoregressive Time-Series Projection
    │   └── routes/                         # /api/ml/predictions, /anomalies, /cannibalization, /forecasts
    └── requirements.txt
```

---

## 🛡️ Security & Governance

- **SSRF Defense**: Strict CIDR IP blocklists at the DNS resolution layer protect internal cloud metadata endpoints.
- **Human-in-the-Loop Protocol**: High-risk code patches, structural redirects, and Git PR merges require explicit operator authorization.
- **Scoped Token Handling**: AES-256 encrypted credential storage for third-party GitHub and Search Console integrations.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author
**Akshat Kardak**  
- GitHub: [@AkshatKardak](https://github.com/AkshatKardak)  
- Repository: [SerpoAI — Autonomous Search Growth OS](https://github.com/AkshatKardak/SEO)

