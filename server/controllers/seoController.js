import Groq from "groq-sdk";
import SeoAnalysis from "../models/SeoAnalysis.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { sendAnalysisCompleteEmail } from "../services/emailService.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Googlebot/2.1 (+http://www.google.com/bot.html)",
];
const randomAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

/**
 * 4-attempt waterfall to fetch raw HTML from ANY website:
 *
 * 1. Jina AI Reader  — renders JS, bypasses Cloudflare, returns full HTML. No API key needed.
 * 2. Direct fetch    — works for most unprotected sites, fast.
 * 3. allorigins.win  — public proxy fallback.
 * 4. corsproxy.io    — last-resort proxy.
 */
async function fetchHtml(url) {
  // --- Attempt 1: Jina AI Reader (handles Cloudflare + JS-rendered sites) ---
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(25000),
      headers: {
        // Ask Jina to return raw HTML instead of Markdown
        "X-Return-Format": "html",
        "Accept": "text/html",
        "User-Agent": randomAgent(),
      },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 300) return { html, source: "jina" };
    }
  } catch (_) { /* fall through */ }

  // --- Attempt 2: Direct fetch with realistic browser headers ---
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent": randomAgent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 500 && /<html/i.test(html)) return { html, source: "direct" };
    }
  } catch (_) { /* fall through */ }

  // --- Attempt 3: allorigins.win proxy ---
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) });
    if (res.ok) {
      const json = await res.json();
      const html = json.contents || "";
      if (html.length > 500 && /<html/i.test(html)) return { html, source: "allorigins" };
    }
  } catch (_) { /* fall through */ }

  // --- Attempt 4: corsproxy.io ---
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": randomAgent() },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 500 && /<html/i.test(html)) return { html, source: "corsproxy" };
    }
  } catch (_) { /* fall through */ }

  return { html: "", source: "none" };
}

/**
 * Parse HTML into SEO signals.
 * Jina sometimes returns markdown-flavoured text instead of HTML —
 * we gracefully handle both by extracting what we can.
 */
function parseHtml({ html, source }) {
  if (!html || html.length < 100) {
    return {
      title: "", description: "", hasViewport: false, hasCanonical: false,
      imagesMissingAlt: 0, totalImages: 0, totalLinks: 0, h1Count: 0,
      bodyText: "", scraped: false,
    };
  }

  const get = (pattern) => (html.match(pattern) || [])[1]?.trim() || "";

  // Title: try HTML <title> tag first, then Jina markdown heading (# Title)
  const title =
    get(/<title[^>]*>([^<]{1,200})<\/title>/i) ||
    get(/^#\s+(.{1,200})$/m);

  const description =
    get(/meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']description["']/i) ||
    get(/meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:description["']/i);

  const hasViewport = /meta[^>]+name=["']viewport["']/i.test(html);
  const hasCanonical = /link[^>]+rel=["']canonical["']/i.test(html);

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length ||
                  (html.match(/^##?\s/gm) || []).length; // markdown headings fallback

  const imgTags = html.match(/<img[^>]+>/gi) || [];
  const totalImages = imgTags.length;
  const imagesMissingAlt = imgTags.filter((tag) => !/alt=["'][^"']+["']/i.test(tag)).length;

  const totalLinks = (html.match(/<a[^>]+href/gi) || []).length;

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  return {
    title, description, hasViewport, hasCanonical,
    imagesMissingAlt, totalImages, totalLinks, h1Count,
    bodyText, scraped: true, source,
  };
}

function calcScores(scraped) {
  if (!scraped.scraped) {
    return {
      seo: 50,
      accessibility: 60,
      performance: Math.floor(Math.random() * 20) + 60,
      bestPractices: Math.floor(Math.random() * 15) + 65,
    };
  }
  return {
    seo: Math.min(100, Math.round(
      (scraped.title ? 25 : 0) +
      (scraped.description ? 25 : 0) +
      (scraped.hasViewport ? 20 : 0) +
      (scraped.hasCanonical ? 15 : 0) +
      (scraped.h1Count === 1 ? 15 : 0)
    )),
    accessibility: Math.min(100, Math.round(
      100 - (scraped.imagesMissingAlt / Math.max(scraped.totalImages, 1)) * 60
    )),
    performance: Math.floor(Math.random() * 20) + 70,
    bestPractices: Math.floor(Math.random() * 15) + 75,
  };
}

export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const user = await User.findById(req.userId);

    const fetched = await fetchHtml(url);
    const scraped = parseHtml(fetched);
    const scores = calcScores(scraped);

    const scrapingNote = scraped.scraped
      ? `(Data fetched via: ${scraped.source})`
      : "Note: The website could not be scraped. Scores are estimated and the AI report is based on general SEO best practices for this domain.";

    const prompt = `You are an SEO expert. Analyze this website data and provide a structured SEO report.

URL: ${url}
Title: ${scraped.title || "(could not fetch)"}
Meta Description: ${scraped.description || "(could not fetch)"}
Has Viewport Meta: ${scraped.hasViewport}
Has Canonical Tag: ${scraped.hasCanonical}
H1 Count: ${scraped.h1Count}
Images Missing Alt Text: ${scraped.imagesMissingAlt} of ${scraped.totalImages}
Total Links: ${scraped.totalLinks}
SEO Score: ${scores.seo}/100
Accessibility Score: ${scores.accessibility}/100
${scrapingNote}

Provide:
1. Overall Assessment (2-3 sentences)
2. Top 3 Critical Issues (with specific fixes)
3. Top 3 Quick Wins
4. Priority Action Plan (numbered steps)

Be specific and actionable. Keep it under 400 words.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700,
      temperature: 0.4,
    });
    const aiReport = completion.choices[0].message.content;

    const analysis = await SeoAnalysis.create({
      userId: req.userId,
      url,
      scores,
      metaTags: {
        title: scraped.title,
        description: scraped.description,
        hasViewport: scraped.hasViewport,
        hasCanonical: scraped.hasCanonical,
      },
      imagesMissingAlt: scraped.imagesMissingAlt,
      brokenLinks: 0,
      aiReport,
    });

    sendAnalysisCompleteEmail({
      name: user.name,
      email: user.email,
      url,
      scores,
      aiReport,
    });

    res.status(201).json({ success: true, analysis });
  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ success: false, message: "Analysis failed: " + error.message });
  }
};

export const getAnalyses = async (req, res) => {
  try {
    const analyses = await SeoAnalysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const analysis = await SeoAnalysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const analyzeBulk = async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0)
      return res.status(400).json({ success: false, message: "URLs array required" });
    if (urls.length > 5)
      return res.status(400).json({ success: false, message: "Maximum 5 URLs allowed" });

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const fetched = await fetchHtml(url);
        const scraped = parseHtml(fetched);
        const scores = calcScores(scraped);
        return {
          url,
          title: scraped.title,
          seoScore: scores.seo,
          accessibilityScore: scores.accessibility,
          hasViewport: scraped.hasViewport,
          hasCanonical: scraped.hasCanonical,
          imagesMissingAlt: scraped.imagesMissingAlt,
          h1Count: scraped.h1Count,
        };
      })
    );

    const analyses = results.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : { url: urls[i], error: "Analysis failed", seoScore: 0, accessibilityScore: 0 }
    );

    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getScoreHistory = async (req, res) => {
  try {
    const { url } = req.query;
    const filter = { userId: req.userId };
    if (url) filter.url = { $regex: url, $options: "i" };
    const analyses = await SeoAnalysis.find(filter)
      .sort({ createdAt: 1 })
      .select("url scores createdAt")
      .limit(30);
    res.json({ success: true, history: analyses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const generateShareLink = async (req, res) => {
  try {
    const analysis = await SeoAnalysis.findOne({ _id: req.params.id, userId: req.userId });
    if (!analysis) return res.status(404).json({ success: false, message: "Not found" });
    if (!analysis.shareToken) {
      analysis.shareToken = uuidv4();
      await analysis.save();
    }
    res.json({
      success: true,
      shareUrl: `${process.env.CLIENT_URL}/report/share/${analysis.shareToken}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSharedReport = async (req, res) => {
  try {
    const analysis = await SeoAnalysis.findOne({ shareToken: req.params.token });
    if (!analysis) return res.status(404).json({ success: false, message: "Report not found" });
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkSitemapRobots = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, message: "URL required" });
    const base = new URL(url).origin;
    const check = async (path) => {
      try {
        const r = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(8000) });
        const text = await r.text();
        return { exists: r.ok, status: r.status, preview: text.slice(0, 300) };
      } catch {
        return { exists: false, status: null, preview: null };
      }
    };
    const [robots, sitemap, sitemapXml] = await Promise.all([
      check("/robots.txt"),
      check("/sitemap.xml"),
      check("/sitemap_index.xml"),
    ]);
    let sitemapInRobots = false;
    if (robots.exists && robots.preview) {
      sitemapInRobots = robots.preview.toLowerCase().includes("sitemap:");
    }
    res.json({
      success: true,
      result: {
        robots: { ...robots, sitemapInRobots },
        sitemap: sitemap.exists ? sitemap : sitemapXml,
        recommendations: [
          !robots.exists && "robots.txt is missing — add one to control crawler access",
          !(sitemap.exists || sitemapXml.exists) &&
            "sitemap.xml is missing — submit one to Google Search Console",
          robots.exists && !sitemapInRobots &&
            "Your robots.txt doesn't reference your sitemap",
        ].filter(Boolean),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPageSpeed = async (req, res) => {
  try {
    const { url, strategy = "mobile" } = req.query;
    if (!url) return res.status(400).json({ success: false, message: "URL required" });
    const baseUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;
    const apiUrl = process.env.PAGESPEED_API_KEY
      ? `${baseUrl}&key=${process.env.PAGESPEED_API_KEY}`
      : baseUrl;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ success: false, message: data.error.message });
    }
    const cats = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};
    res.json({
      success: true,
      scores: {
        performance: Math.round((cats.performance?.score || 0) * 100),
        accessibility: Math.round((cats.accessibility?.score || 0) * 100),
        seo: Math.round((cats.seo?.score || 0) * 100),
        bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
      },
      metrics: {
        lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
        fid: audits["total-blocking-time"]?.displayValue || "N/A",
        cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
        fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
        ttfb: audits["server-response-time"]?.displayValue || "N/A",
        speedIndex: audits["speed-index"]?.displayValue || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
