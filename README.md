<div align="center">
  <img src="./client/src/assets/Logo.png" alt="SerpoAI Logo" width="160">

  # SerpoAI — AI-Powered SEO Rank Tracker
  ### Analyze, Track & Dominate Search Rankings

  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://serpoai.vercel.app/)
  [![Backend API](https://img.shields.io/badge/Backend-API-orange?style=for-the-badge)](https://serpoai-server.onrender.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)

</div>

---

## Overview

**SerpoAI** is a full-stack SEO analysis and keyword rank tracking platform. Analyze any website's SEO health with AI-powered audits powered by Google Gemini & BrowserBase, track keyword positions on Google daily via Custom Search API, and receive email alerts on rank changes — all in one clean dashboard.

---

## ✨ Features

- 🔍 **AI SEO Audit** — Deep page analysis powered by Gemini AI via BrowserBase headless browser
- 📈 **Keyword Rank Tracker** — Track Google positions via Google Custom Search API (top 30 results)
- 🏆 **Competitor Analysis** — See who's outranking you and where
- 📊 **Score Dashboard** — SEO, Performance, Accessibility & Best Practices scores
- 📂 **Analysis History** — Browse all past audits with filtering
- 📧 **Email Alerts** — Rank drop notifications via Resend
- 📄 **PDF Export** — Export any SEO report as a PDF
- 🔗 **Shareable Reports** — Generate public share links for any report
- ⚡ **PageSpeed Integration** — Real Core Web Vitals via Google PageSpeed API
- 🗺️ **Sitemap & Robots Checker** — Validate sitemap.xml and robots.txt
- 🔐 **JWT Auth** — Secure register/login with bcrypt-hashed passwords
- 🌗 **Dark / Light Mode** — System-aware theme with manual toggle
- 🚫 **Free Plan Limit** — 5 analyses/day on free tier, unlimited on Pro

---

## 🛠 Tech Stack

### Frontend (`client/`)

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool & dev server |
| React Router DOM 6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Lucide React | Icons |
| html2pdf.js | PDF export |

### Backend (`server/`)

| Technology | Purpose |
|---|---|
| Node.js 24 + Express 4 | HTTP server (ESM mode) |
| MongoDB + Mongoose 8 | Database & ODM |
| JWT + bcryptjs | Auth tokens & password hashing |
| Google Gemini AI | SEO analysis generation |
| BrowserBase + Stagehand | Headless browser scraping |
| Google Custom Search API | Keyword rank checking |
| Google PageSpeed API | Core Web Vitals scores |
| Resend | Transactional email alerts |
| node-cron | Daily rank check scheduler |

---

## 📁 Project Structure

```
SEO/
├── client/
│   ├── public/
│   │   └── favicon.png
│   └── src/
│       ├── assets/
│       │   └── Logo.png
│       ├── components/
│       │   ├── home/           # Hero, Features, HowItWorks, Pricing, Footer
│       │   ├── Navbar.tsx
│       │   ├── ScoreGauge.tsx
│       │   ├── IssueCard.tsx
│       │   └── ProtectedRoute.tsx
│       ├── context/
│       │   └── ThemeContext.tsx
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   ├── Analyze.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Report.tsx
│       │   ├── History.tsx
│       │   ├── RankTracker.tsx
│       │   └── RankDetail.tsx
│       └── services/
│           └── api.ts
│
└── server/
    ├── config/db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── seoController.js
    │   └── rankController.js
    ├── cron/rankChecker.js
    ├── middleware/auth.js
    ├── models/
    │   ├── User.js
    │   ├── SeoAnalysis.js
    │   └── RankTracker.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── seoRoutes.js
    │   └── rankRoutes.js
    └── server.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI
- Google Gemini API key
- BrowserBase account (API key + Project ID)
- Google Custom Search Engine (API key + CX ID)
- Google PageSpeed API key
- Resend API key

### 1. Clone
```bash
git clone https://github.com/AkshatKardak/SEO.git
cd SEO
```

### 2. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/serpoai
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# BrowserBase
BROWSERBASE_API_KEY=bb_live_xxxxxxxx
BROWSERBASE_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Google APIs
GEMINI_API_KEY=AIzaSy...
GOOGLE_CSE_API_KEY=AIzaSy...
GOOGLE_CSE_CX=xxxxxxxxxxxxxxxxx
PAGESPEED_API_KEY=AIzaSy...

# Email
RESEND_API_KEY=re_xxxxxxxxx
```

> ⚠️ **ESM Rule** — Every local import MUST include `.js` extension:
> ```js
> import connectDB from "./config/db.js";  // ✅
> import connectDB from "./config/db";     // ❌ crashes
> ```

```bash
npm run server
```

### 3. Frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/user` | ✅ | Get current user |
| PUT | `/schedule` | ✅ | Update email alert schedule |

### SEO — `/api/seo`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/analyze` | ✅ | Analyze a URL |
| GET | `/analyses` | ✅ | Get all analyses for user |
| GET | `/analysis/:id` | ✅ | Get single analysis |
| POST | `/:id/share` | ✅ | Generate public share token |
| GET | `/share/:token` | ❌ | View shared report publicly |
| GET | `/pagespeed` | ✅ | Google PageSpeed scores |

### Rank Tracker — `/api/rank`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Add keyword to track |
| GET | `/` | ✅ | List all tracked keywords |
| DELETE | `/:id` | ✅ | Remove keyword |
| POST | `/:id/refresh` | ✅ | Manually refresh rank |

---

## 🚀 Deployment

### Backend → Render
1. New Web Service → connect GitHub repo → set **Root Directory** to `server`
2. Build Command: `npm install`
3. Start Command: `npm run server`
4. Add all `.env` variables in Render's Environment tab

### Frontend → Vercel
1. Import repo → set **Root Directory** to `client`
2. Framework: Vite
3. Add `VITE_API_URL=https://your-render-url.onrender.com`

---


## 👤 Author

**Akshat Kardak** — [GitHub](https://github.com/AkshatKardak)

📧 kardakakshat@gmail.com

---

## 📄 License

MIT License © 2026 Akshat Kardak
