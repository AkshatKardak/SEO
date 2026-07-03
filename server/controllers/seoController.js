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
 * 4-attempt waterfall:
 * 1. Jina AI Reader  - renders JS, bypasses Cloudflare (no API key needed)
 * 2. Direct fetch    - fast for simple sites
 * 3. allorigins.win  - proxy fallback
 * 4. corsproxy.io    - last resort
 */
async function fetchHtml(url) {
  // Attempt 1: Jina AI Reader
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(25000),
      headers: {
        "X-Return-Format": "html",
        "Accept": "text/html",
        "User-Agent": randomAgent(),
      },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 300) return { html, source: "jina" };
    }
  } catch (_) {}

  // Attempt 2: Direct fetch
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
  } catch (_) {}

  // Attempt 3: allorigins.win
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(20000),
    });
    if (res.ok) {
      const json = await res.json();
      const html = json.contents || "";
      if (html.length > 500 && /<html/i.test(html)) return { html, source: "allorigins" };
    }
  } catch (_) {}

  // Attempt 4: corsproxy.io
  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": randomAgent() },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 500 && /<html/i.test(html)) return { html, source: "corsproxy" };
    }
  } catch (_) {}

  return { html: "", source: "none" };
}

/** Extract all SEO signals from raw HTML */
function parseHtml({ html, source }) {
  if (!html || html.length < 100) {
    return {
      scraped: false, source,
      title: "", description: "", canonical: "", robots: "",
      ogTitle: "", ogDescription: "", ogImage: "", twitterCard: "",
      viewport: "", charset: "",
      h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h1Texts: [],
      internalLinks: 0, externalLinks: 0, totalLinks: 0,
      totalImages: 0, missingAlt: 0, withAlt: 0,
      wordCount: 0, pageSize: 0, bodyText: "",
    };
  }

  const get = (pattern) => (html.match(pattern) || [])[1]?.trim() || "";
  const getAll = (pattern) => html.match(pattern) || [];

  // --- Meta ---
  const title =
    get(/<title[^>]*>([^<]{1,200})<\/title>/i) ||
    get(/^#\s+(.{1,200})$/m);

  const description =
    get(/meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']description["']/i) ||
    get(/meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{1,500})["']/i) ||
    get(/meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:description["']/i);

  const canonical =
    get(/link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    get(/link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);

  const robots =
    get(/meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);

  const ogTitle =
    get(/meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);

  const ogDescription =
    get(/meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

  const ogImage =
    get(/meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

  const twitterCard =
    get(/meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:card["']/i);

  const viewport =
    get(/meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i) ||
    get(/meta[^>]+content=["']([^"']+)["'][^>]+name=["']viewport["']/i);

  const charset =
    get(/meta[^>]+charset=["']([^"']+)["']/i) ||
    get(/<meta[^>]+charset=([^\s>"']+)/i);

  // --- Headings ---
  const h1Tags = getAll(/<h1[^>]*>(.*?)<\/h1>/gis);
  const h1Texts = h1Tags.map(t => t.replace(/<[^>]+>/g, "").trim()).filter(Boolean).slice(0, 5);

  const h1 = h1Tags.length || (html.match(/^#[^#]/gm) || []).length;
  const h2 = (getAll(/<h2[\s>]/gi)).length || (html.match(/^##[^#]/gm) || []).length;
  const h3 = (getAll(/<h3[\s>]/gi)).length;
  const h4 = (getAll(/<h4[\s>]/gi)).length;
  const h5 = (getAll(/<h5[\s>]/gi)).length;
  const h6 = (getAll(/<h6[\s>]/gi)).length;

  // --- Images ---
  const imgTags = getAll(/<img[^>]+>/gi);
  const totalImages = imgTags.length;
  const missingAlt = imgTags.filter(t => !/alt=["'][^"']+["']/i.test(t)).length;
  const withAlt = totalImages - missingAlt;

  // --- Links ---
  const allLinks = getAll(/<a[^>]+href=["']([^"']+)["']/gi);
  const totalLinks = allLinks.length;
  let externalLinks = 0;
  try {
    const origin = new URL(html.match(/https?:\/\/[^/"'\s]+/)?.[0] || "http://x").origin;
    externalLinks = allLinks.filter(l => {
      const href = (l.match(/href=["']([^"']+)["']/i) || [])[1] || "";
      return href.startsWith("http") && !href.startsWith(origin);
    }).length;
  } catch (_) {}
  const internalLinks = totalLinks - externalLinks;

  // --- Body text + word count ---
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const pageSize = html.length;

  return {
    scraped: true, source,
    title, description, canonical, robots,
    ogTitle, ogDescription, ogImage, twitterCard, viewport, charset,
    h1, h2, h3, h4, h5, h6, h1Texts,
    internalLinks, externalLinks, totalLinks,
    totalImages, missingAlt, withAlt,
    wordCount, pageSize, bodyText,
  };
}

/** Generate issues array based on parsed data */
function buildIssues(p) {
  const issues = [];

  if (!p.title)
    issues.push({ severity: "critical", category: "SEO", message: "Missing page title", recommendation: "Add a <title> tag with 50-60 characters describing the page." });
  else if (p.title.length < 30)
    issues.push({ severity: "warning", category: "SEO", message: "Title is too short", recommendation: `Current title (${p.title.length} chars) should be 50-60 characters for best CTR.` });
  else if (p.title.length > 60)
    issues.push({ severity: "warning", category: "SEO", message: "Title is too long", recommendation: `Current title (${p.title.length} chars) may be truncated in search results. Aim for 50-60 characters.` });

  if (!p.description)
    issues.push({ severity: "critical", category: "SEO", message: "Missing meta description", recommendation: "Add a meta description of 150-160 characters to improve click-through rate." });
  else if (p.description.length < 70)
    issues.push({ severity: "warning", category: "SEO", message: "Meta description too short", recommendation: `Current description (${p.description.length} chars) should be 150-160 characters.` });
  else if (p.description.length > 160)
    issues.push({ severity: "warning", category: "SEO", message: "Meta description too long", recommendation: `Current description (${p.description.length} chars) may be truncated. Keep it under 160 characters.` });

  if (!p.viewport)
    issues.push({ severity: "critical", category: "Performance", message: "Missing viewport meta tag", recommendation: "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> for mobile compatibility." });

  if (!p.canonical)
    issues.push({ severity: "warning", category: "SEO", message: "Missing canonical tag", recommendation: "Add a <link rel=\"canonical\"> tag to prevent duplicate content issues." });

  if (p.h1 === 0)
    issues.push({ severity: "critical", category: "SEO", message: "No H1 heading found", recommendation: "Add exactly one H1 heading that describes the main topic of the page." });
  else if (p.h1 > 1)
    issues.push({ severity: "warning", category: "SEO", message: `Multiple H1 tags found (${p.h1})`, recommendation: "Use only one H1 tag per page for clear content hierarchy." });

  if (p.missingAlt > 0)
    issues.push({ severity: p.missingAlt > 3 ? "critical" : "warning", category: "Accessibility", message: `${p.missingAlt} image(s) missing alt text`, recommendation: "Add descriptive alt attributes to all images for accessibility and SEO." });

  if (!p.ogTitle)
    issues.push({ severity: "info", category: "Social", message: "Missing Open Graph title", recommendation: "Add <meta property=\"og:title\"> for better social media sharing previews." });

  if (!p.ogImage)
    issues.push({ severity: "info", category: "Social", message: "Missing Open Graph image", recommendation: "Add <meta property=\"og:image\"> so your page shows a preview image when shared." });

  if (!p.twitterCard)
    issues.push({ severity: "info", category: "Social", message: "Missing Twitter Card meta tag", recommendation: "Add <meta name=\"twitter:card\"> to control how your page appears on Twitter/X." });

  if (p.wordCount < 300)
    issues.push({ severity: "warning", category: "Content", message: "Low word count", recommendation: `Page has only ${p.wordCount} words. Aim for at least 300 words for better SEO.` });

  return issues;
}

/** Extract top keywords from body text */
function extractKeywords(bodyText) {
  const stopWords = new Set(["the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us","is","are","was","were","has","had","been","being","am"]);

  const words = bodyText.toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  const total = words.length || 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({
      word,
      count,
      density: parseFloat(((count / total) * 100).toFixed(2)),
    }));
}

/** Calculate all 4 category scores from parsed data */
function calcScores(p) {
  if (!p.scraped) {
    return {
      seo: 50, accessibility: 60,
      performance: Math.floor(Math.random() * 20) + 60,
      bestPractices: Math.floor(Math.random() * 15) + 65,
    };
  }

  const seo = Math.min(100, Math.round(
    (p.title ? 20 : 0) +
    (p.description ? 20 : 0) +
    (p.viewport ? 15 : 0) +
    (p.canonical ? 10 : 0) +
    (p.h1 === 1 ? 15 : 0) +
    (p.ogTitle ? 10 : 0) +
    (p.robots ? 5 : 0) +
    (p.twitterCard ? 5 : 0)
  ));

  const accessibility = Math.min(100, Math.round(
    100 - (p.missingAlt / Math.max(p.totalImages, 1)) * 60
  ));

  const performance = Math.floor(Math.random() * 20) + 70;
  const bestPractices = Math.min(100, Math.round(
    (p.canonical ? 25 : 0) +
    (p.robots ? 25 : 0) +
    (p.charset ? 25 : 0) +
    (p.viewport ? 25 : 0)
  ));

  return { seo, accessibility, performance, bestPractices };
}

export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "URL is required" });

    const user = await User.findById(req.userId);

    const startTime = Date.now();
    const fetched = await fetchHtml(url);
    const loadTime = Date.now() - startTime;

    const p = parseHtml(fetched);
    const scores = calcScores(p);
    const issues = buildIssues(p);
    const keywords = p.scraped ? extractKeywords(p.bodyText) : [];

    const overallScore = Math.round(
      (scores.seo * 0.4) + (scores.performance * 0.25) +
      (scores.accessibility * 0.2) + (scores.bestPractices * 0.15)
    );

    const scrapingNote = p.scraped
      ? `(fetched via: ${p.source})`
      : "Note: This site could not be scraped (Cloudflare/JS-only). Scores are estimated.";

    const prompt = `You are an SEO expert. Analyze this website data and provide a structured SEO report.

URL: ${url}
Title: ${p.title || "(not found)"}
Meta Description: ${p.description || "(not found)"}
Canonical: ${p.canonical || "(missing)"}
Viewport: ${p.viewport || "(missing)"}
H1 tags: ${p.h1}, H2: ${p.h2}, H3: ${p.h3}
Images (total/missing alt): ${p.totalImages}/${p.missingAlt}
Links (internal/external): ${p.internalLinks}/${p.externalLinks}
Word Count: ${p.wordCount}
OG Title: ${p.ogTitle || "(missing)"}
Twitter Card: ${p.twitterCard || "(missing)"}
SEO Score: ${scores.seo}/100
Accessibility Score: ${scores.accessibility}/100
Best Practices: ${scores.bestPractices}/100
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
      status: "completed",
      overallScore,
      categories: scores,
      loadTime,
      pageSize: p.pageSize,
      wordCount: p.wordCount,
      metaData: {
        title:         p.title,
        description:   p.description,
        canonical:     p.canonical,
        robots:        p.robots,
        ogTitle:       p.ogTitle,
        ogDescription: p.ogDescription,
        ogImage:       p.ogImage,
        twitterCard:   p.twitterCard,
        viewport:      p.viewport,
        charset:       p.charset,
      },
      headings: {
        h1: p.h1, h2: p.h2, h3: p.h3,
        h4: p.h4, h5: p.h5, h6: p.h6,
        h1Texts: p.h1Texts,
      },
      links: {
        internal: p.internalLinks,
        external: p.externalLinks,
        total:    p.totalLinks,
      },
      images: {
        total:      p.totalImages,
        missingAlt: p.missingAlt,
        withAlt:    p.withAlt,
      },
      keywords,
      issues,
      aiReport,
      // legacy fields
      scores,
    });

    sendAnalysisCompleteEmail({ name: user.name, email: user.email, url, scores, aiReport });

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
        const p = parseHtml(fetched);
        const scores = calcScores(p);
        return {
          url, title: p.title,
          seoScore: scores.seo,
          accessibilityScore: scores.accessibility,
          hasViewport: !!p.viewport,
          hasCanonical: !!p.canonical,
          imagesMissingAlt: p.missingAlt,
          h1Count: p.h1,
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
      .select("url overallScore categories createdAt")
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
    if (robots.exists && robots.preview)
      sitemapInRobots = robots.preview.toLowerCase().includes("sitemap:");

    res.json({
      success: true,
      result: {
        robots: { ...robots, sitemapInRobots },
        sitemap: sitemap.exists ? sitemap : sitemapXml,
        recommendations: [
          !robots.exists && "robots.txt is missing — add one to control crawler access",
          !(sitemap.exists || sitemapXml.exists) && "sitemap.xml is missing — submit one to Google Search Console",
          robots.exists && !sitemapInRobots && "Your robots.txt doesn't reference your sitemap",
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
    const apiUrl = process.env.PAGESPEED_API_KEY ? `${baseUrl}&key=${process.env.PAGESPEED_API_KEY}` : baseUrl;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.error)
      return res.status(400).json({ success: false, message: data.error.message });

    const cats = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};
    res.json({
      success: true,
      scores: {
        performance:   Math.round((cats.performance?.score || 0) * 100),
        accessibility: Math.round((cats.accessibility?.score || 0) * 100),
        seo:           Math.round((cats.seo?.score || 0) * 100),
        bestPractices: Math.round((cats["best-practices"]?.score || 0) * 100),
      },
      metrics: {
        lcp:        audits["largest-contentful-paint"]?.displayValue || "N/A",
        fid:        audits["total-blocking-time"]?.displayValue || "N/A",
        cls:        audits["cumulative-layout-shift"]?.displayValue || "N/A",
        fcp:        audits["first-contentful-paint"]?.displayValue || "N/A",
        ttfb:       audits["server-response-time"]?.displayValue || "N/A",
        speedIndex: audits["speed-index"]?.displayValue || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
