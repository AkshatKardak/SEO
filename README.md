# SerpoAI — SEO Rank Tracker & Analyzer

> AI-powered SEO analysis, rank tracking, and performance reporting platform built with the MERN stack.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://seo-rank-tracker.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Features

| Feature | Free | Pro |
|---|---|---|
| AI SEO Audit (Groq / Llama 3.3) | 3/month | Unlimited |
| PageSpeed & Core Web Vitals | ✓ | ✓ |
| Sitemap & robots.txt check | ✓ | ✓ |
| Rank Tracker (keyword positions) | ✓ | ✓ |
| Score History & trend charts | ✓ | ✓ |
| Shareable public report links | ✓ | ✓ |
| Bulk URL analysis (up to 5) | ✗ | ✓ |
| JWT authentication | ✓ | ✓ |
| Aurora gradient dark/light theme | ✓ | ✓ |

---

## Tech Stack

### Frontend (`client/`)

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 4 | Styling |
| React Router | 6 | Client-side routing |
| Lucide React | latest | Icons |
| Recharts | latest | Score history charts |

### Backend (`server/`)

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 24 | Runtime |
| Express | 5 | HTTP server |
| MongoDB + Mongoose | 9 | Database |
| JWT | 9 | Authentication |
| Groq SDK | 0.9 | AI SEO report generation |
| BrowserBase + Stagehand | latest | Headless browser scraping |
| Google PageSpeed API | v5 | Performance scores |
| node-cron | 4 | Scheduled rank checks |
| bcrypt | 6 | Password hashing |

---

## Project Structure

```
SEO/
├── client/                        # React + TypeScript frontend
│   ├── src/
│   │   ├── assets/                  # Logo, static images
│   │   ├── components/
│   │   │   └── Navbar.tsx           # Top nav with theme toggle
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # JWT auth state
│   │   │   └── ThemeContext.tsx     # Dark/light theme state
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing / hero page
│   │   │   ├── Login.tsx            # Login form
│   │   │   ├── Dashboard.tsx        # User dashboard & KPIs
│   │   │   ├── Analyze.tsx          # Single URL SEO analyzer
│   │   │   ├── BulkAnalyze.tsx      # Bulk URL analyzer (Pro)
│   │   │   ├── Report.tsx           # Full SEO report view
│   │   │   ├── RankTracker.tsx      # Keyword rank tracker
│   │   │   ├── RankDetail.tsx       # Per-keyword detail view
│   │   │   └── History.tsx          # Score history & charts
│   │   ├── services/              # Axios API service calls
│   │   ├── App.tsx               # Routes definition
│   │   ├── main.tsx              # React entry point
│   │   └── index.css             # Aurora gradient theme + Tailwind
│   ├── index.html
│   └── package.json
└── server/                        # Express + Node.js backend
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── controllers/
    │   ├── authController.js        # Register / Login / JWT
    │   ├── seoController.js         # SEO analysis + Groq AI report
    │   └── rankController.js        # Rank tracking CRUD
    ├── cron/                        # Scheduled rank refresh jobs
    ├── middleware/
    │   └── auth.js                  # JWT verification middleware
    ├── models/
    │   ├── User.js                  # User schema (name, email, plan)
    │   └── SeoAnalysis.js           # SEO analysis schema
    ├── routes/                      # Express route definitions
    ├── server.js                    # App entry point
    └── package.json
```

---

## Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- [Groq API key](https://console.groq.com) — free tier available
- [BrowserBase](https://browserbase.com) API key + Project ID
- [Google PageSpeed API key](https://developers.google.com/speed/docs/insights/v5/get-started)

### 1. Clone

```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

### 2. Server setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/serpoai
JWT_SECRET=your_super_secret_key

# Groq AI (replaces Gemini) — get free key at console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# BrowserBase headless scraping
BROWSERBASE_API_KEY=your_browserbase_key
BROWSERBASE_PROJECT_ID=your_project_id

# Google PageSpeed Insights
PAGESPEED_API_KEY=your_pagespeed_key

# Frontend URL (for share links)
CLIENT_URL=http://localhost:5173

PORT=5000
```

> **ESM note:** All local imports in server files **must include `.js` extension**
> e.g. `import connectDB from "./config/db.js"` — Node.js v18+ ESM requires this.

```bash
npm run server
```

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

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT |

### SEO Analysis — `/api/seo`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/analyze` | Yes | Analyze single URL (Groq AI report) |
| GET | `/analyses` | Yes | Get all analyses for user |
| GET | `/analysis/:id` | Yes | Get single analysis |
| POST | `/bulk` | Yes (Pro) | Analyze up to 5 URLs |
| GET | `/history` | Yes | Score history for chart |
| POST | `/share/:id` | Yes | Generate public share link |
| GET | `/share/:token` | No | View shared report |
| GET | `/sitemap-robots` | Yes | Check sitemap & robots.txt |
| GET | `/pagespeed` | Yes | Google PageSpeed scores |

### Rank Tracker — `/api/rank`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Add keyword to track |
| GET | `/` | Yes | List all tracked keywords |
| GET | `/:id` | Yes | Get keyword detail + history |
| DELETE | `/:id` | Yes | Delete tracked keyword |

---

## AI Integration (Groq)

Groq powers the AI SEO report generation via **Llama 3.3 70B Versatile** — one of the fastest and most capable open models available.

**How it works:**
1. BrowserBase scrapes the target URL (title, meta, h1, images, links)
2. SEO scores are calculated server-side
3. Groq generates a structured 400-word report covering:
   - Overall Assessment
   - Top 3 Critical Issues with specific fixes
   - Top 3 Quick Wins
   - Priority Action Plan

**Why Groq over Gemini:**
- ~10x faster inference (LPU hardware)
- Generous free tier (no credit card required)
- Better instruction-following for structured output
- No 429 rate-limit issues at typical usage volumes

**Model config:**
```js
model: "llama-3.3-70b-versatile"
max_tokens: 700
temperature: 0.4
```

---

## Deployment

### Frontend → Vercel

```bash
cd client
npx vercel --prod
```

Set env var in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render

1. Connect GitHub repo to Render
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all `.env` variables in Render dashboard

---

## Environment Variables Reference

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `GROQ_API_KEY` | Yes | Groq API key — [console.groq.com](https://console.groq.com) |
| `BROWSERBASE_API_KEY` | Yes | BrowserBase scraping key |
| `BROWSERBASE_PROJECT_ID` | Yes | BrowserBase project ID |
| `PAGESPEED_API_KEY` | Yes | Google PageSpeed Insights key |
| `CLIENT_URL` | Yes | Frontend URL for share links |
| `PORT` | No | Defaults to 5000 |

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL (e.g. `http://localhost:5000/api`) |

---

## Theme

SerpoAI uses an **Aurora Gradient** design system across all pages:

- **Dark mode:** `#0F172A → #1E3A8A → #2563EB` base with `#38BDF8` cyan highlights
- **Light mode:** Soft sky palette `#EFF6FF → #DBEAFE → #BFDBFE`
- SVG lightning shimmer overlay in dark mode
- Dot grid + scanline grid for depth
- Fully CSS-variable driven — no page files modified

---

## Common Issues

| Problem | Fix |
|---|---|
| `ERR_MODULE_NOT_FOUND: ./config/db` | Add `.js` extension: `import ... from "./config/db.js"` |
| `GROQ_API_KEY` missing | Get free key at [console.groq.com](https://console.groq.com) |
| BrowserBase timeout | Check `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are correct |
| MongoDB connection refused | Check `MONGO_URI` whitelist in Atlas Network Access |
| Vercel blank page | Ensure `VITE_API_URL` is set and backend is running |
| PageSpeed returns 400 | `PAGESPEED_API_KEY` invalid or URL is not publicly accessible |

---

## License

MIT © [Akshat Kardak](https://github.com/AkshatKardak)
