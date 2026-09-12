<p align="center">
  <img src="client/src/assets/Logo.png" alt="SerpoAI Logo" width="220"/>
</p>

<h1 align="center">SerpoAI</h1>
<p align="center">
  <strong>An Autonomous Search Growth Operating System</strong><br/>
  <em>"Turn Search Data Into Growth."</em>
</p>

<p align="center">
  <a href="https://github.com/AkshatKardak/SEO">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-059669?style=for-the-badge&logo=rocket" />
  </a>
  <a href="https://github.com/AkshatKardak/SEO/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/ML%20Engine-FastAPI%20%2B%20scikit--learn-blue?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-product-positioning">Positioning</a> •
  <a href="#-core-operating-loop">Growth Loop</a> •
  <a href="#-ml-intelligence-engine">ML Engine</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-specialized-ai-agents">AI Agents</a>
</p>

---

## 🧭 Product Positioning

**SerpoAI is NOT simply an SEO audit tool.**

> **"SerpoAI doesn't just tell you what is wrong. It determines what matters, predicts what will have impact, helps execute it, measures the result, and learns from the outcome."**

SerpoAI discovers your highest-impact SEO and AI-search opportunities, predicts their potential impact using mathematical ICE scoring and machine learning, helps execute approved fixes with specialized AI agents, and measures what actually moves traffic, conversions, and revenue.

---

## 🔄 Core Operating Loop

$$\Large \textbf{DISCOVER} \longrightarrow \textbf{PRIORITIZE} \longrightarrow \textbf{EXECUTE} \longrightarrow \textbf{MEASURE} \longrightarrow \textbf{LEARN} \longrightarrow \textbf{REPEAT}$$

1. **DISCOVER**: SSRF-safe multi-page crawler extracts 60+ DOM hygiene signals and synthesizes a structured company knowledge graph.
2. **PRIORITIZE**: Mathematical ICE formula $\left(\frac{\text{Impact} \times \text{Confidence}}{\text{Effort}} \times 10\right)$ weighted by ML outcome probability and North Star business goals.
3. **EXECUTE**: 5 specialized AI agents generate verified code diffs, JSON-LD structured data, and bottom-funnel comparison briefs with human-in-the-loop approval.
4. **MEASURE**: Multi-touch Growth Graph tracks the complete outcome chain: $\text{Impressions} \to \text{Traffic} \to \text{Engagement} \to \text{Signups} \to \text{Revenue}$.
5. **LEARN**: Permanent **Growth Memory** stores verified experiment outcomes and feeds learned priors back into future recommendations.
6. **REPEAT**: Continuous autonomous optimization compounding organic search velocity.

---

## 🧠 Machine Learning Engine (`ml-service/`)

SerpoAI integrates a dedicated Python FastAPI service powered by `scikit-learn`, `numpy`, `pandas`, and `statsmodels` for real product decisions:

### 1. Smart Opportunity Ranking
- **Inputs**: Page type, current ranking, search volume, competitor gap, content depth, technical severity, historical experiment count.
- **Outputs**: ML predicted impact score, success probability (0–100%), expected traffic lift range (`+8–15%`), expected conversion lift range (`+3–7%`), and top contributing signal attribution (positive & negative factors).
- **Cold-Start Handling**: Hybrid Bayesian priors with automatic `"learning_mode": true` indicator when historical domain data is building.

### 2. SEO Anomaly Radar
- **Inputs**: 14-day & 30-day time-series telemetry across traffic, impressions, CTR, keyword rankings, and Core Web Vitals.
- **Outputs**: Automated detection of statistical deviations (Z-score + IsolationForest), severity classification (`critical`, `warning`, `info`), and explainable likely contributing factors.

### 3. 30-Day Growth Forecasting
- **Inputs**: Historical search traffic and visibility time-series.
- **Outputs**: Autoregressive Holt-Winters exponential projection with 95% confidence bands distinguishing **ACTUAL** historical baseline from **FORECAST** bounds.

---

## 🤖 Specialized Autonomous Agents

| Agent | Subsystem | Primary Inputs | Generated Artifacts |
| :--- | :--- | :--- | :--- |
| **Intelligence Agent** | Knowledge Graph | DOM text, Meta signals, Competitor URLs | Company Knowledge Graph, Personas, Bottlenecks |
| **SEO Agent** | Technical & Schema | DOM tree, Lighthouse, Canonical headers | 1-Click JSON-LD schemas, Core Web Vitals patches |
| **GEO Agent** | AI Search & Citations | High-intent queries, Perplexity & ChatGPT citations | AI search presence graph, Citation gap teardown |
| **Content Agent** | High-Intent Briefs | Topic gaps, Keyword search volumes | /vs/competitor matrices, Conversion outlines |
| **Growth Analyst** | Attribution & Memory | Search Console metrics, Signups, Revenue | Growth Graph attribution, Verified Growth Memory |

---

## 🏗️ System Architecture

```
                                  SERPOAI PLATFORM
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
           ML Engine (FastAPI)                          LLM Orchestrator
       (scikit-learn / statsmodels)                 (Groq / DeepSeek / Claude)
                 │                                               │
       • Opportunity Ranking (Lift %)                   • Knowledge Graph Synthesis
       • Anomaly Radar (Deviation)                      • Code Patch Generation
       • 30-Day Growth Forecasting                      • High-Intent Content Briefs
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                   Growth Brain
                                         │
                             5 Specialized AI Agents
                                         │
                           Action Center (Human Approval)
                                         │
                                   Deploy & Crawl
                                         │
                           Growth Graph Attribution
                                         │
                               Persistent Growth Memory
```

---

## 📁 Repository Structure

```
seo-rank-tracker-main/
│
├── client/                                 # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/                       # Editorial Landing Page Components (17 Sections)
│   │   │   │   ├── Hero.tsx                # Hero + Realistic Product Dashboard Preview
│   │   │   │   ├── ProblemSection.tsx      # Checklists vs Growth Loop
│   │   │   │   ├── GrowthLoopSection.tsx   # DISCOVER → PRIORITIZE → EXECUTE → MEASURE → LEARN
│   │   │   │   ├── ICEOpportunitySection.tsx# Mathematical ICE Prioritization & Sorting
│   │   │   │   ├── GEOPresenceSection.tsx  # AI Search Presence & Citation Gaps
│   │   │   │   ├── AIAgentsSection.tsx     # 5 Autonomous Specialized Agents
│   │   │   │   ├── CompetitorSection.tsx   # Competitor Benchmarks & Gaps
│   │   │   │   ├── MLPredictionsSection.tsx# Smart Ranking, Anomaly Radar, Forecasting
│   │   │   │   ├── GrowthGraphSection.tsx  # 6-Tier Funnel Attribution
│   │   │   │   ├── ActionCenterSection.tsx # Human-in-the-Loop Code Diff Approvals
│   │   │   │   ├── GrowthMemorySection.tsx # Permanent Organizational Memory
│   │   │   │   ├── StrategySection.tsx     # 30-60-90 Day Strategic Roadmap
│   │   │   │   ├── ProofSection.tsx        # Traditional SEO vs SerpoAI Table
│   │   │   │   ├── FinalCTASection.tsx     # Final Call to Action
│   │   │   │   └── Footer.tsx              # Editorial Footer
│   │   │   └── Navbar.tsx                  # Minimal Navigation & Project Switcher
│   │   ├── pages/                          # Core Dashboard & Product Views
│   │   └── services/api.ts                 # Axios API Client with ML API
│   └── package.json
│
├── server/                                 # Express + Node.js Backend API
│   ├── ai/providers/                       # Multi-Provider Fallback Cascade
│   ├── controllers/                        # Opportunity, Project, Action, & ML Controllers
│   ├── models/                             # Mongoose Schemas (Opportunity, Memory, Project)
│   ├── routes/                             # Express Routers (/api/v1/*)
│   ├── services/
│   │   ├── mlClientService.js              # Python ML API Client + Statistical Fallback
│   │   ├── growthBrainService.js           # Growth Brain Knowledge Synthesis
│   │   └── crawlerService.js               # SSRF-Safe Cloud Crawler
│   └── server.js
│
└── ml-service/                             # Python FastAPI Machine Learning Service
    ├── app/
    │   ├── main.py                         # FastAPI App Entrypoint & Healthcheck
    │   ├── models/
    │   │   ├── opportunity_ranker.py       # ML Outcome Probability & Lift Estimator
    │   │   ├── anomaly_detector.py         # IsolationForest & Rolling Z-Score Radar
    │   │   └── traffic_forecaster.py       # Autoregressive Time-Series Projection
    │   ├── routes/                         # /api/ml/predictions, /anomalies, /forecasts
    │   └── schemas/                        # Pydantic Request & Response Models
    └── requirements.txt
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

### 2. Configure Environment Variables
Create `.env` in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serpoai
JWT_SECRET=your_secure_jwt_secret

# AI Providers (At least one required)
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIzaSy...

# ML Service URL
ML_SERVICE_URL=http://localhost:8000
```

### 3. Start the Python ML Service
```bash
cd ml-service
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Start the Backend API
```bash
cd ../server
npm install
npm run dev
```

### 5. Start the Frontend Client
```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173` to access SerpoAI.

---

## 🛡️ Security & Privacy
- **SSRF Defense**: Strict CIDR IP blocklists at the DNS resolution layer protect internal cloud metadata endpoints.
- **Human-in-the-Loop**: High-risk code patches and structural redirects require explicit operator approval.
- **Secure Token Encryption**: AES-256 encrypted OAuth credential storage for third-party integrations.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
