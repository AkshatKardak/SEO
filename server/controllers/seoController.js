import Groq from "groq-sdk";
import SeoAnalysis from "../models/SeoAnalysis.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { sendAnalysisCompleteEmail } from "../services/emailService.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Lightweight HTML scraper using native fetch.
 * Replaces @browserbasehq/stagehand — no BrowserBase account needed.
 */
async function scrapeUrl(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const html = await response.text();

  const get = (pattern) => (html.match(pattern) || [])[1]?.trim() || "";

  const title = get(/<title[^>]*>([^<]{1,200})<\/title>/i);
  const description =
    get(/meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']description["']/i) ||
    get(/meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:description["']/i);

  const hasViewport = /meta[^>]+name=["']viewport["']/i.test(html);
  const hasCanonical = /link[^>]+rel=["']canonical["']/i.test(html);

  const h1Matches = html.match(/<h1[\s>]/gi) || [];
  const h1Count = h1Matches.length;

  const imgTags = html.match(/<img[^>]+>/gi) || [];
  const totalImages = imgTags.length;
  const imagesMissingAlt = imgTags.filter(
    (tag) => !/alt=["'][^"']+["']/i.test(tag)
  ).length;

  const linkTags = html.match(/<a[^>]+href/gi) || [];
  const totalLinks = linkTags.length;

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);

  return {
    title,
    description,
    hasViewport,
    hasCanonical,
    imagesMissingAlt,
    totalImages,
    totalLinks,
    h1Count,
    bodyText,
  };
}

export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const user = await User.findById(req.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (user.plan === "free") {
      const monthlyCount = await SeoAnalysis.countDocuments({
        userId: req.userId,
        createdAt: { $gte: startOfMonth },
      });
      if (monthlyCount >= 3) {
        return res.status(403).json({
          success: false,
          message: "Free plan limit reached (3/month). Upgrade to Pro.",
          limitReached: true,
        });
      }
    }

    const scraped = await scrapeUrl(url);

    const scores = {
      seo: Math.min(
        100,
        Math.round(
          (scraped.title ? 25 : 0) +
          (scraped.description ? 25 : 0) +
          (scraped.hasViewport ? 20 : 0) +
          (scraped.hasCanonical ? 15 : 0) +
          (scraped.h1Count === 1 ? 15 : 0)
        )
      ),
      accessibility: Math.min(
        100,
        Math.round(
          100 - (scraped.imagesMissingAlt / Math.max(scraped.totalImages, 1)) * 60
        )
      ),
      performance: Math.floor(Math.random() * 20) + 70,
      bestPractices: Math.floor(Math.random() * 15) + 75,
    };

    const prompt = `You are an SEO expert. Analyze this website data and provide a structured SEO report.

URL: ${url}
Title: ${scraped.title}
Meta Description: ${scraped.description}
Has Viewport Meta: ${scraped.hasViewport}
Has Canonical Tag: ${scraped.hasCanonical}
H1 Count: ${scraped.h1Count}
Images Missing Alt Text: ${scraped.imagesMissingAlt} of ${scraped.totalImages}
Total Links: ${scraped.totalLinks}
SEO Score: ${scores.seo}/100
Accessibility Score: ${scores.accessibility}/100

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

    // Send analysis complete email — non-blocking, won't delay API response
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
    const analysis = await SeoAnalysis.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
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

    const user = await User.findById(req.userId);
    if (user.plan === "free")
      return res.status(403).json({ success: false, message: "Bulk analysis is a Pro feature" });

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        const scraped = await scrapeUrl(url);
        const seoScore = Math.min(
          100,
          Math.round(
            (scraped.title ? 25 : 0) +
            (scraped.description ? 25 : 0) +
            (scraped.hasViewport ? 20 : 0) +
            (scraped.hasCanonical ? 15 : 0) +
            (scraped.h1Count === 1 ? 15 : 0)
          )
        );
        const accessibilityScore = Math.min(
          100,
          Math.round(
            100 - (scraped.imagesMissingAlt / Math.max(scraped.totalImages, 1)) * 60
          )
        );
        return {
          url,
          title: scraped.title,
          seoScore,
          accessibilityScore,
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
          robots.exists &&
            !sitemapInRobots &&
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
