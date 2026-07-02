<![CDATA[<div align="center">

<img src="https://img.shields.io/badge/SerpoAI-SEO%20Rank%20Tracker-0F172A?style=for-the-badge&logo=google&logoColor=38BDF8" alt="SerpoAI" />

# SerpoAI — SEO Rank Tracker & Analyzer

**AI-powered SEO auditing, keyword rank tracking, and performance reporting platform.**  
Built with the MERN stack · Groq AI (Llama 3.3) · Google PageSpeed · BrowserBase scraping

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-brightgreen?style=flat-square)](https://seo-rank-tracker.vercel.app)
[![Backend](https://img.shields.io/badge/🖥_Backend-Render-46E3B7?style=flat-square)](https://render.com)
[![Node](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

</div>

---

## What is SerpoAI?

SerpoAI is a full-stack SEO intelligence platform that combines real browser scraping, Google PageSpeed Insights, and Groq-powered AI to give you actionable SEO reports — fast. Track keyword rankings, analyze any URL in seconds, and share public reports with clients.

---

## Features

| Feature | Free | Pro |
|---|:---:|:---:|
| AI SEO Audit (Groq / Llama 3.3 70B) | 3/month | Unlimited |
| PageSpeed & Core Web Vitals | ✅ | ✅ |
| Sitemap & robots.txt validation | ✅ | ✅ |
| Keyword Rank Tracker | ✅ | ✅ |
| Score History & trend charts | ✅ | ✅ |
| Shareable public report links | ✅ | ✅ |
| Bulk URL analysis (up to 5 URLs) | ❌ | ✅ |
| JWT Authentication | ✅ | ✅ |
| Aurora gradient dark/light theme | ✅ | ✅ |

---

## Tech Stack

### Frontend — `client/`

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router | 6 | Client-side routing |
| Recharts | latest | Score history & trend charts |
| Lucide React | latest | Icon system |

### Backend — `server/`

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24 | Runtime (ESM) |
| Express | 5 | HTTP framework |
| MongoDB + Mongoose | 9 | Database & ODM |
| JWT + bcrypt | 9 / 6 | Auth & password hashing |
| Groq SDK | 0.9 | Llama 3.3 AI report generation |
| BrowserBase + Stagehand | latest | Headless browser scraping |
| Google PageSpeed API | v5 | Performance scores |
| node-cron | 4 | Scheduled keyword rank checks |

---

## Project Structure

```
SEO/
├── client/                         # React + TypeScript frontend
│   ├── src/
│   │   ├── assets/                 # Logo, static images
│   │   ├── components/
│   │   │   └── Navbar.tsx          # Top nav with theme toggle
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # JWT auth state
│   │   │   └── ThemeContext.tsx    # Dark/light theme state
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing / hero page
│   │   │   ├── Login.tsx           # Login form
│   │   │   ├── Dashboard.tsx       # User dashboard & KPIs
│   │   │   ├── Analyze.tsx         # Single URL SEO analyzer
│   │   │   ├── BulkAnalyze.tsx     # Bulk URL analyzer (Pro)
│   │   │   ├── Report.tsx          # Full SEO report view
│   │   │   ├── RankTracker.tsx     # Keyword rank tracker
│   │   │   ├── RankDetail.tsx      # Per-keyword detail view
│   │   │   └── History.tsx         # Score history & charts
│   │   ├── services/               # Axios API service layer
│   │   ├── App.tsx                 # Route definitions
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Aurora theme + Tailwind
│   ├── index.html
│   └── package.json
│
└── server/                         # Express + Node.js backend
    ├── config/
    │   └── db.js                   # MongoDB Atlas connection
    ├── controllers/
    │   ├── authController.js       # Register / Login / JWT
    │   ├── seoController.js        # SEO analysis + Groq AI report
    │   └── rankController.js       # Rank tracking CRUD
    ├── cron/                       # Scheduled rank refresh jobs
    ├── middleware/
    │   └── auth.js                 # JWT verification middleware
    ├── models/
    │   ├── User.js                 # User schema (name, email, plan)
    │   └── SeoAnalysis.js          # SEO analysis schema
    ├── routes/                     # Express route definitions
    ├── server.js                   # App entry point
    └── package.json
```

---

## Local Setup

### Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** account (or local MongoDB)
- [Groq API key](https://console.groq.com) — free tier, no credit card
- [BrowserBase](https://browserbase.com) API key + Project ID
- [Google PageSpeed API key](https://developers.google.com/speed/docs/insights/v5/get-started)

---

### 1. Clone the repository

```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

---

### 2. Server setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/serpoai

# Auth
JWT_SECRET=your_super_secret_key

# Groq AI — free at console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# BrowserBase headless scraping
BROWSERBASE_API_KEY=your_browserbase_key
BROWSERBASE_PROJECT_ID=your_project_id

# Google PageSpeed Insights
PAGESPEED_API_KEY=your_pagespeed_key

# Frontend origin (for share links & CORS)
CLIENT_URL=http://localhost:5173

PORT=5000
```

> **ESM Note:** This project uses `"type": "module"`. All local imports **must include the `.js` extension**:
> ```js
> // ✅ Correct
> import connectDB from "./config/db.js";
> 
> // ❌ Wrong — will throw ERR_MODULE_NOT_FOUND
> import connectDB from "./config/db";
> ```

Start the server:

```bash
# Development — auto-restarts on file changes (recommended)
npm run server

# Production
npm start
```

> ⚠️ There is no `dev` script. Use `npm run server` for local development.

---

### 3. Client setup

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns JWT |

### SEO Analysis — `/api/seo`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/analyze` | ✅ | Analyze single URL (+ Groq AI report) |
| GET | `/analyses` | ✅ | Get all analyses for user |
| GET | `/analysis/:id` | ✅ | Get single analysis |
| POST | `/bulk` | ✅ Pro | Analyze up to 5 URLs |
| GET | `/history` | ✅ | Score history for chart |
| POST | `/share/:id` | ✅ | Generate public share link |
| GET | `/share/:token` | ❌ | View shared report (public) |
| GET | `/sitemap-robots` | ✅ | Check sitemap & robots.txt |
| GET | `/pagespeed` | ✅ | Google PageSpeed scores |

### Rank Tracker — `/api/rank`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/` | ✅ | Add keyword to track |
| GET | `/` | ✅ | List all tracked keywords |
| GET | `/:id` | ✅ | Keyword detail + position history |
| DELETE | `/:id` | ✅ | Remove tracked keyword |

---

## AI Integration — Groq + Llama 3.3

Groq powers all AI-generated SEO reports using **Llama 3.3 70B Versatile** via LPU hardware — giving near-instant responses even on the free tier.

**How it works:**
1. BrowserBase scrapes the target URL (title, meta tags, h1, images, internal/external links)
2. Server calculates SEO scores across multiple dimensions
3. Groq generates a structured ~400-word report covering:
   - **Overall Assessment** — a score summary with context
   - **Top 3 Critical Issues** — with specific, actionable fixes
   - **Top 3 Quick Wins** — low-effort, high-impact improvements
   - **Priority Action Plan** — ordered next steps

**Model config:**

```js
model: "llama-3.3-70b-versatile"
max_tokens: 700
temperature: 0.4
```

**Why Groq over Gemini:**
- ~10× faster inference (LPU hardware)
- Generous free tier — no credit card required
- Consistent structured output for report parsing
- Rare 429 rate-limit issues at typical usage volumes

---

## Deployment

### Frontend → Vercel

```bash
cd client
npx vercel --prod
```

Set environment variable in Vercel dashboard:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Connect `AkshatKardak/SEO` GitHub repo to Render
2. **Root directory:** `server`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add all `.env` variables under **Environment** in Render dashboard

---

## Environment Variables Reference

### `server/.env`

| Variable | Required | Description |
|---|:---:|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs |
| `GROQ_API_KEY` | ✅ | Groq key — [console.groq.com](https://console.groq.com) |
| `BROWSERBASE_API_KEY` | ✅ | BrowserBase scraping API key |
| `BROWSERBASE_PROJECT_ID` | ✅ | BrowserBase project ID |
| `PAGESPEED_API_KEY` | ✅ | Google PageSpeed Insights key |
| `CLIENT_URL` | ✅ | Frontend origin URL (CORS + share links) |
| `PORT` | ❌ | HTTP port — defaults to `5000` |

### `client/.env`

| Variable | Required | Description |
|---|:---:|---|
| `VITE_API_URL` | ✅ | Backend base URL (e.g. `http://localhost:5000/api`) |

---

## Design — Aurora Gradient Theme

SerpoAI ships with a fully CSS-variable-driven **Aurora Gradient** design system:

| Mode | Palette |
|---|---|
| **Dark** | `#0F172A → #1E3A8A → #2563EB` base · `#38BDF8` cyan highlights |
| **Light** | `#EFF6FF → #DBEAFE → #BFDBFE` soft sky palette |

Additional effects:
- SVG lightning shimmer overlay in dark mode
- Dot grid + scanline grid background for depth
- No per-page style overrides needed — all driven by CSS variables

---

## Common Issues

| Problem | Fix |
|---|---|
| `Missing script: "dev"` | Use `npm run server` instead — there's no `dev` script |
| `ERR_MODULE_NOT_FOUND: ./config/db` | Add `.js` extension to all local imports (ESM requirement) |
| `GROQ_API_KEY` missing or invalid | Get a free key at [console.groq.com](https://console.groq.com) |
| BrowserBase timeout | Verify `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are both set |
| MongoDB connection refused | Whitelist your IP in Atlas → Network Access |
| Vercel blank page | Ensure `VITE_API_URL` is set and points to a running backend |
| PageSpeed returns 400 | Key invalid, or URL is not publicly accessible |

---

## License

MIT © [Akshat Kardak](https://github.com/AkshatKardak)
]]>