import { Stagehand } from "@browserbasehq/stagehand";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SeoAnalysis from "../models/SeoAnalysis.js";
import User from "../models/User.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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

    const stagehand = new Stagehand({
      env: "BROWSERBASE",
      apiKey: process.env.BROWSERBASE_API_KEY,
      projectId: process.env.BROWSERBASE_PROJECT_ID,
    });
    await stagehand.init();
    const page = stagehand.page;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const scraped = await page.evaluate(() => {
      const getMeta = (name) =>
        document.querySelector(`meta[name="${name}"]`)?.content ||
        document.querySelector(`meta[property="og:${name}"]`)?.content || "";

      const images = Array.from(document.querySelectorAll("img"));
      const links = Array.from(document.querySelectorAll("a[href]"));

      return {
        title: document.title || "",
        description: getMeta("description"),
        hasViewport: !!document.querySelector('meta[name="viewport"]'),
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        imagesMissingAlt: images.filter((img) => !img.alt).length,
        totalImages: images.length,
        totalLinks: links.length,
        h1Count: document.querySelectorAll("h1").length,
        bodyText: document.body?.innerText?.slice(0, 3000) || "",
      };
    });

    await stagehand.close();

    // Calculate scores (0-100)
    const scores = {
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
      performance: Math.floor(Math.random() * 20) + 70, // placeholder
      bestPractices: Math.floor(Math.random() * 15) + 75, // placeholder
    };

    // Generate AI report with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    const result = await model.generateContent(prompt);
    const aiReport = result.response.text();

    // Save to DB
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

    res.status(201).json({ success: true, analysis });

  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ success: false, message: "Analysis failed: " + error.message });
  }
};

// Get all analyses for current user
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

// Get single analysis
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