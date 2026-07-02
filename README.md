<p align="center">
  <img src="https://img.shields.io/badge/SerpoAI-SEO%20Intelligence-0F172A?style=for-the-badge&logo=google&logoColor=38BDF8" alt="SerpoAI Logo" width="300"/>
</p>

<p align="center">
  <a href="https://seo-rank-tracker.vercel.app">
    <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel" />
  </a>
  <a href="https://render.com">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render" />
  </a>
</p>

# SerpoAI

### The AI-Powered SEO Rank Tracker & Analyzer

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-F55036?style=flat-square)](https://console.groq.com)
[![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=flat-square)](LICENSE)

---

### The Problem

SEO practitioners and website owners rely on a fragmented set of tools: rank trackers, site auditors, PageSpeed testers, sitemap validators, and AI writing tools — all disconnected, expensive, and requiring separate logins.

Traditional SEO tools are either:
* **Too shallow:** Basic rank trackers that only show position changes with no context.
* **Too expensive:** Enterprise platforms like Ahrefs or SEMrush priced for large agencies, not indie developers or small businesses.

This leaves developers and founders guessing on SEO priorities, missing critical site issues, and wasting time stitching together insights from five different dashboards.

---

### The Solution: A Unified SEO Intelligence Platform

**SerpoAI** is not just a rank tracker. It is a full-stack SEO intelligence platform that combines real browser scraping, Google PageSpeed Insights, and Groq-powered AI into one streamlined workspace.

With SerpoAI, you can:
* **Audit & Analyze:** Run a deep SEO audit on any URL — meta tags, headings, images, links — in seconds.
* **Track Rankings:** Monitor keyword positions over time with automated scheduled checks.
* **Measure Performance:** Pull real Google PageSpeed & Core Web Vitals scores.
* **Validate Structure:** Check sitemap.xml and robots.txt health automatically.
* **Share Reports:** Generate public shareable report links to send to clients.
* **Get AI Advice:** Receive a structured Groq AI report — issues, quick wins, and an action plan.

---

### Why SerpoAI is Different

Generic SEO tools answer:
> *"What is my keyword position today?"*

SerpoAI goes further and answers:
* **Why is my ranking dropping?** AI-identified critical issues with specific, actionable fixes.
* **What should I fix first?** A prioritized action plan ordered by impact.
* **How fast is my site?** Real PageSpeed scores pulled live from Google's API.
* **Is my site properly indexed?** Sitemap and robots.txt validation in one click.
* **What changed over time?** Score history charts showing SEO trends across past analyses.

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI SEO Audit** | Groq Llama 3.3 generates a structured 400-word report: assessment, critical issues, quick wins, and an action plan. |
| 📈 **Keyword Rank Tracker** | Add keywords and track their Google positions over time with automated cron-based refresh jobs. |
| ⚡ **PageSpeed & Core Web Vitals** | Live Google PageSpeed API scores — LCP, CLS, FID — for any URL. |
| 🗺️ **Sitemap & robots.txt Check** | Validates sitemap.xml existence and robots.txt crawl rules automatically. |
| 📊 **Score History Charts** | Recharts-powered trend visualizations showing SEO score progression across analyses. |
| 🔗 **Shareable Public Reports** | Generate a public token-based report URL to share with clients — no login required. |
| 📦 **Bulk URL Analysis** | Analyze up to 5 URLs in one request (Pro plan). |
| 🔐 **JWT Authentication** | Secure register/login flow with bcrypt-hashed passwords and signed JWT tokens. |
| 🌗 **Aurora Gradient Theme** | Premium dark/light theme with CSS-variable-driven Aurora gradient design system. |

---

## Tech Stack

### Frontend
- **React 18 + TypeScript** (Type-safe UI components)
- **Vite 5** (Fast builds and HMR dev server)
- **Tailwind CSS 4** (Utility-first styling)
- **React Router 6** (Client-side routing)
- **Recharts** (Score history and trend charts)
- **Lucide React** (Modern icon system)

### Backend
- **Node.js 24 + Express 5** (ESM RESTful API)
- **MongoDB Atlas + Mongoose 9** (NoSQL database and ODM)
- **JWT + bcrypt** (Authentication and password hashing)
- **Groq SDK 0.9** (Llama 3.3 70B AI report generation)
- **BrowserBase + Stagehand** (Headless browser scraping)
- **Google PageSpeed API v5** (Performance scores)
- **node-cron 4** (Scheduled keyword rank refresh jobs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas connection string
- [Groq API Key](https://console.groq.com) — free tier, no credit card required
- [BrowserBase](https://browserbase.com) API Key + Project ID
- [Google PageSpeed API Key](https://developers.google.com/speed/docs/insights/v5/get-started)

### 1. Clone the Repository
```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

### 2. Configure & Start Backend Server
```bash
cd server
npm install
```

Create a `server/.env` file:
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

# Frontend origin (for CORS + share links)
CLIENT_URL=http://localhost:5173

PORT=5000
```

> **ESM Note:** This project uses `"type": "module"`. All local imports **must include the `.js` extension**:
> ```js
> // ✅ Correct
> import connectDB from "./config/db.js";
> // ❌ Wrong — throws ERR_MODULE_NOT_FOUND
> import connectDB from "./config/db";
> ```

Run the server locally:
```bash
npm run server
```
*The API server will listen on `http://localhost:5000`.*

> ⚠️ There is no `dev` script in `server/package.json`. Use `npm run server` for local development with nodemon.

### 3. Configure & Start Frontend Client
```bash
cd ../client
npm install
```

Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the client app:
```bash
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📂 Project Structure

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

## 🤖 AI Integration — Groq + Llama 3.3

Groq powers all AI-generated SEO reports using **Llama 3.3 70B Versatile** on LPU hardware — near-instant responses even on the free tier.

**How it works:**
1. BrowserBase scrapes the target URL (title, meta tags, h1, images, internal/external links)
2. Server calculates SEO scores across multiple dimensions
3. Groq generates a structured ~400-word report covering:
   - **Overall Assessment** — score summary with context
   - **Top 3 Critical Issues** — specific, actionable fixes
   - **Top 3 Quick Wins** — low-effort, high-impact improvements
   - **Priority Action Plan** — ordered next steps

**Model config:**
```js
model: "llama-3.3-70b-versatile"
max_tokens: 700
temperature: 0.4
```

**Why Groq over Gemini:**
* ~10× faster inference (LPU hardware)
* Generous free tier — no credit card required
* Consistent structured output for report parsing
* Virtually no 429 rate-limit issues at typical usage volumes

---

## Deployment

### Frontend → Vercel
```bash
cd client
npx vercel --prod
```
Set in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
1. Connect `AkshatKardak/SEO` to Render
2. **Root directory:** `server`
3. **Build command:** `npm install`
4. **Start command:** `npm start`
5. Add all `.env` variables under **Environment** in the Render dashboard

---

## Common Issues

| Problem | Fix |
|---|---|
| `Missing script: "dev"` | Use `npm run server` — there is no `dev` script in `server/package.json` |
| `Cannot find package '@browserbasehq/stagehand'` | Run `npm install` inside the `server/` directory |
| `ERR_MODULE_NOT_FOUND: ./config/db` | Add `.js` extension to all local ESM imports |
| `GROQ_API_KEY` missing | Get a free key at [console.groq.com](https://console.groq.com) |
| BrowserBase timeout | Verify both `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are set |
| MongoDB connection refused | Whitelist your IP in Atlas → Network Access |
| Vercel blank page | Ensure `VITE_API_URL` points to a running backend |
| PageSpeed returns 400 | Key is invalid or the target URL is not publicly accessible |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
Built with ❤️ for developers who want fast, AI-driven SEO insights without the enterprise price tag.
</div>
