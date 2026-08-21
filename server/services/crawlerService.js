import * as cheerio from "cheerio";
import dns from "dns/promises";
import { URL } from "url";

/**
 * SSRF Safety Checker
 * Blocks local, private, loopback, link-local, and cloud metadata addresses
 */
export async function isSafeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);

    // Only allow HTTP/HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { safe: false, reason: "Invalid protocol. Only HTTP and HTTPS are permitted." };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block common localhost and cloud metadata aliases
    const forbiddenHostnames = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
      "instance-data",
      "169.254.169.254",
      "metadata.google.internal",
    ];

    if (forbiddenHostnames.includes(hostname) || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
      return { safe: false, reason: "Access to private or metadata hosts is blocked." };
    }

    // Resolve DNS and inspect resolved IP
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      for (const { address, family } of addresses) {
        if (family === 4) {
          const parts = address.split(".").map(Number);
          // 127.0.0.0/8
          if (parts[0] === 127) return { safe: false, reason: "Loopback IP addresses are blocked." };
          // 10.0.0.0/8
          if (parts[0] === 10) return { safe: false, reason: "Private 10.x IP range is blocked." };
          // 172.16.0.0/12
          if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return { safe: false, reason: "Private 172.x IP range is blocked." };
          // 192.168.0.0/16
          if (parts[0] === 192 && parts[1] === 168) return { safe: false, reason: "Private 192.168.x IP range is blocked." };
          // 169.254.0.0/16 Link-local
          if (parts[0] === 169 && parts[1] === 254) return { safe: false, reason: "Link-local IP range is blocked." };
          // 0.0.0.0/8
          if (parts[0] === 0) return { safe: false, reason: "Broadcast/0.0.0.0 range is blocked." };
        } else if (family === 6) {
          if (address === "::1" || address.startsWith("fe80:") || address.startsWith("fc00:") || address.startsWith("fd00:")) {
            return { safe: false, reason: "Private or loopback IPv6 range is blocked." };
          }
        }
      }
    } catch (dnsErr) {
      // If DNS resolution fails entirely
      return { safe: false, reason: `Could not resolve domain: ${dnsErr.message}` };
    }

    return { safe: true, url: parsed.href };
  } catch (err) {
    return { safe: false, reason: "Malformed URL" };
  }
}

/**
 * Fetch HTML with realistic user agent and timeout
 */
async function fetchPage(url, timeoutMs = 12000) {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; AIGrowthOS/2.0)",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 (compatible; AIGrowthOS/2.0)",
  ];
  const randomAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  // Try direct fetch first
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": randomAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Upgrade-Insecure-Requests": "1",
      },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 200) return { html, status: res.status, source: "direct" };
    }
  } catch (_) {}

  // Fallback to Jina AI Reader
  try {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(15000),
      headers: {
        "X-Return-Format": "html",
        "Accept": "text/html",
        "User-Agent": randomAgent,
      },
    });
    if (res.ok) {
      const html = await res.text();
      if (html.length > 200) return { html, status: res.status, source: "jina" };
    }
  } catch (_) {}

  return { html: "", status: 500, source: "failed" };
}

/**
 * Cheerio-based Page Parser
 */
export function extractPageData(html, pageUrl) {
  if (!html || html.length < 50) {
    return {
      url: pageUrl,
      title: "",
      description: "",
      canonical: "",
      robots: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "",
      viewport: "",
      h1: [],
      h2: [],
      h3: [],
      links: { internal: [], external: [], total: 0 },
      images: { total: 0, missingAlt: 0, withAlt: 0 },
      schemaTypes: [],
      wordCount: 0,
      bodyTextSnippet: "",
      scraped: false,
    };
  }

  const $ = cheerio.load(html);

  // Extract JSON-LD schema before stripping scripts
  const schemaTypes = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      if (json["@type"]) schemaTypes.push(String(json["@type"]));
      if (Array.isArray(json["@graph"])) {
        json["@graph"].forEach(g => g["@type"] && schemaTypes.push(String(g["@type"])));
      }
    } catch (_) {}
  });

  // Remove noise
  $("script, style, noscript, iframe, svg").remove();

  const title = $("title").first().text().trim() || $('meta[property="og:title"]').attr("content") || "";
  const description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || "";
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const robots = $('meta[name="robots"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogDescription = $('meta[property="og:description"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const twitterCard = $('meta[name="twitter:card"]').attr("content") || "";
  const viewport = $('meta[name="viewport"]').attr("content") || "";

  const h1 = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const h2 = $("h2").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 15);
  const h3 = $("h3").map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 15);

  const parsedUrl = new URL(pageUrl);
  const baseDomain = parsedUrl.hostname.replace(/^www\./, "");

  const internalLinks = new Set();
  const externalLinks = new Set();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    try {
      const resolved = new URL(href, pageUrl);
      if (resolved.protocol === "http:" || resolved.protocol === "https:") {
        const linkDomain = resolved.hostname.replace(/^www\./, "");
        if (linkDomain === baseDomain) {
          internalLinks.add(resolved.href.split("#")[0]);
        } else {
          externalLinks.add(resolved.href);
        }
      }
    } catch (_) {}
  });

  const images = $("img");
  const totalImages = images.length;
  let missingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") missingAlt++;
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  return {
    url: pageUrl,
    title,
    description,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    viewport,
    h1,
    h2,
    h3,
    links: {
      internal: Array.from(internalLinks),
      external: Array.from(externalLinks),
      total: internalLinks.size + externalLinks.size,
    },
    images: {
      total: totalImages,
      missingAlt,
      withAlt: totalImages - missingAlt,
    },
    schemaTypes: [...new Set(schemaTypes)],
    wordCount,
    bodyTextSnippet: bodyText.slice(0, 4000),
    scraped: true,
  };
}

/**
 * Multi-Page Crawl Engine
 * Crawls homepage and discovers key internal subpages (pricing, features, about, blog)
 */
export async function crawlWebsite(rootUrl, maxPages = 4) {
  const safety = await isSafeUrl(rootUrl);
  if (!safety.safe) {
    throw new Error(`SSRF Blocked: ${safety.reason}`);
  }

  const normalizedRoot = safety.url;
  const visited = new Set();
  const pages = [];

  // Step 1: Fetch and parse root
  const rootResult = await fetchPage(normalizedRoot);
  const rootData = extractPageData(rootResult.html, normalizedRoot);
  pages.push(rootData);
  visited.add(normalizedRoot.replace(/\/$/, ""));

  // Step 2: Identify high-value internal links
  const targetKeywords = ["pricing", "features", "product", "about", "blog", "docs", "solutions"];
  const queue = [];

  for (const link of rootData.links.internal) {
    const cleanLink = link.replace(/\/$/, "");
    if (!visited.has(cleanLink)) {
      const lower = cleanLink.toLowerCase();
      const isPriority = targetKeywords.some(kw => lower.includes(kw));
      if (isPriority) {
        queue.unshift(link); // priority to front
      } else {
        queue.push(link);
      }
    }
  }

  // Step 3: Fetch up to maxPages in queue
  while (queue.length > 0 && pages.length < maxPages) {
    const nextUrl = queue.shift();
    const cleanNext = nextUrl.replace(/\/$/, "");
    if (visited.has(cleanNext)) continue;

    const subSafety = await isSafeUrl(nextUrl);
    if (!subSafety.safe) continue;

    visited.add(cleanNext);
    const subResult = await fetchPage(subSafety.url, 8000);
    if (subResult.html) {
      const subData = extractPageData(subResult.html, subSafety.url);
      pages.push(subData);
    }
  }

  return {
    rootUrl: normalizedRoot,
    pagesScanned: pages.length,
    pages,
  };
}
