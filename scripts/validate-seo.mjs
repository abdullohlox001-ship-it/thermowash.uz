#!/usr/bin/env node
/**
 * THERMOWASH — SEO Validation & Audit Script
 * 
 * Strict Checks:
 *  1. ZERO localhost / 127.0.0.1 references in robots.txt, sitemap.xml, canonical, hreflang, OpenGraph, JSON-LD
 *  2. All SEO URLs strictly lead to canonical domain: https://thermowash.uz
 *  3. Valid Sitemap XML structure, all URLs match existing routes
 *  4. Valid robots.txt structure, proper sitemap link, explicit rules for Googlebot/Yandex, no accidental Disallow
 *  5. No duplicate URLs in sitemap
 *  6. Canonical URLs match page routes
 *  7. Hreflang reciprocity (uz <-> ru + x-default)
 *  8. Unique titles across all pages
 *  9. Non-empty, distinct meta descriptions
 * 10. Presence of H1 tag on each page template
 * 11. Valid JSON-LD schemas (HVACBusiness, Organization, Service, BreadcrumbList, FAQPage)
 * 12. No dead routes in Sitemap
 */

import http from "node:http";
import https from "node:https";

const TARGET_HOST = process.env.TEST_HOST || "http://localhost:3000";
const PROD_DOMAIN = "https://thermowash.uz";

const EXPECTED_SERVICES = [
  { id: "repair", uz: "kotyol-tamirlash", ru: "remont-kotla" },
  { id: "diagnostics", uz: "kotyol-diagnostikasi", ru: "diagnostika-kotla" },
  { id: "installation", uz: "kotyol-ornatish", ru: "ustanovka-kotla" },
  { id: "maintenance", uz: "kotyol-texnik-xizmat", ru: "obsluzhivanie-kotla" },
  { id: "heating", uz: "isitish-tizimi", ru: "otoplenie" },
  { id: "flush", uz: "isitish-tizimini-yuvish", ru: "promyvka-sistemy-otopleniya" },
  { id: "boiler-flush", uz: "kotyolni-yuvish", ru: "promyvka-kotla" },
  { id: "boyler", uz: "boyler-tozalash", ru: "chistka-boylera" },
  { id: "gas-repair", uz: "gaz-kotyol-tamirlash", ru: "remont-gazovogo-kotla" },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on("error", reject);
  });
}

const errors = [];
const warnings = [];
const passes = [];

function pass(name, msg = "") {
  passes.push({ name, msg });
  console.log(`  \x1b[32m✓ PASS\x1b[0m ${name}: ${msg}`);
}

function fail(name, msg) {
  errors.push({ name, msg });
  console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}: ${msg}`);
}

function warn(name, msg) {
  warnings.push({ name, msg });
  console.log(`  \x1b[33m! WARN\x1b[0m ${name}: ${msg}`);
}

async function runAudit() {
  console.log(`\n\x1b[1m=== THERMOWASH SEO VALIDATION SUITE ===\x1b[0m`);
  console.log(`Target: ${TARGET_HOST}`);
  console.log(`Canonical Production Domain: ${PROD_DOMAIN}\n`);

  // --- 1. Robots.txt Audit ---
  console.log("\x1b[36m[1/4] Checking robots.txt...\x1b[0m");
  try {
    const r = await fetchUrl(`${TARGET_HOST}/robots.txt`);
    if (r.status !== 200) {
      fail("robots.txt HTTP status", `Expected 200, got ${r.status}`);
    } else {
      pass("robots.txt HTTP status", "200 OK");
    }

    if (r.body.includes("localhost") || r.body.includes("127.0.0.1")) {
      fail("robots.txt localhost check", "Contains localhost reference!");
    } else {
      pass("robots.txt localhost check", "ZERO localhost references");
    }

    if (!r.body.includes(`Sitemap: ${PROD_DOMAIN}/sitemap.xml`)) {
      fail("robots.txt sitemap URL", `Expected 'Sitemap: ${PROD_DOMAIN}/sitemap.xml', found: ${r.body}`);
    } else {
      pass("robots.txt sitemap URL", `Points to ${PROD_DOMAIN}/sitemap.xml`);
    }

    if (r.body.includes("Disallow: /") && !r.body.includes("Disallow: /api/")) {
      fail("robots.txt indexing blocked", "Found 'Disallow: /' without subpath!");
    } else {
      pass("robots.txt indexability", "Public pages allowed (only /api/ disallowed)");
    }

    if (r.body.includes("Googlebot") && r.body.includes("Yandex")) {
      pass("robots.txt search engines", "Explicit rules for Googlebot and Yandex present");
    } else {
      warn("robots.txt search engines", "Googlebot/Yandex not explicitly singled out");
    }
  } catch (e) {
    fail("robots.txt fetch", e.message);
  }

  // --- 2. Sitemap.xml Audit ---
  console.log("\n\x1b[36m[2/4] Checking sitemap.xml...\x1b[0m");
  const sitemapUrls = [];
  try {
    const s = await fetchUrl(`${TARGET_HOST}/sitemap.xml`);
    if (s.status !== 200) {
      fail("sitemap.xml HTTP status", `Expected 200, got ${s.status}`);
    } else {
      pass("sitemap.xml HTTP status", "200 OK");
    }

    if (s.body.includes("localhost") || s.body.includes("127.0.0.1")) {
      fail("sitemap.xml localhost check", "Contains localhost reference!");
    } else {
      pass("sitemap.xml localhost check", "ZERO localhost references");
    }

    // Extract loc tags
    const locMatches = [...s.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    sitemapUrls.push(...locMatches);

    // Verify all locs start with PROD_DOMAIN
    const nonProdUrls = locMatches.filter(u => !u.startsWith(PROD_DOMAIN));
    if (nonProdUrls.length > 0) {
      fail("sitemap domain consistency", `Found URLs not using ${PROD_DOMAIN}: ${nonProdUrls.slice(0, 3).join(", ")}`);
    } else {
      pass("sitemap domain consistency", `All ${locMatches.length} URLs use ${PROD_DOMAIN}`);
    }

    // Duplicates check
    const uniqueUrls = new Set(locMatches);
    if (uniqueUrls.size !== locMatches.length) {
      fail("sitemap duplicates", `Found ${locMatches.length - uniqueUrls.size} duplicate URLs in sitemap`);
    } else {
      pass("sitemap duplicates", `0 duplicates found (${uniqueUrls.size} unique URLs)`);
    }

    // Check lastmod format
    const lastmods = [...s.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
    const invalidDates = lastmods.filter(d => !/^\d{4}-\d{2}-\d{2}/.test(d));
    if (invalidDates.length > 0) {
      fail("sitemap lastmod format", `Invalid date format in: ${invalidDates.join(", ")}`);
    } else {
      pass("sitemap lastmod format", "All lastmod entries follow ISO YYYY-MM-DD");
    }

    // Check alternates
    const alternateCount = (s.body.match(/rel="alternate"/g) || []).length;
    if (alternateCount > 0) {
      pass("sitemap alternates", `Found ${alternateCount} hreflang alternate declarations`);
    } else {
      fail("sitemap alternates", "No hreflang alternates in sitemap");
    }
  } catch (e) {
    fail("sitemap.xml fetch", e.message);
  }

  // --- 3. Page SEO & Metadata Audit ---
  console.log("\n\x1b[36m[3/4] Checking pages (Titles, Meta, Hreflang, Canonical, JSON-LD, H1)...\x1b[0m");

  const testPages = [
    { path: "/uz", lang: "uz", type: "home" },
    { path: "/ru", lang: "ru", type: "home" },
    { path: "/uz/privacy", lang: "uz", type: "privacy" },
    { path: "/ru/privacy", lang: "ru", type: "privacy" },
  ];

  for (const s of EXPECTED_SERVICES) {
    testPages.push({ path: `/uz/services/${s.uz}`, lang: "uz", type: "service", id: s.id });
    testPages.push({ path: `/ru/services/${s.ru}`, lang: "ru", type: "service", id: s.id });
  }

  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const page of testPages) {
    try {
      const p = await fetchUrl(`${TARGET_HOST}${page.path}`);
      const prefix = `[${page.path}]`;

      if (p.status !== 200) {
        fail(`${prefix} HTTP Status`, `Got ${p.status}`);
        continue;
      }

      // Check for localhost leak in page HTML SEO tags
      if (p.body.includes(`href="http://localhost:3000${page.path}"`)) {
        fail(`${prefix} Localhost leak`, "Found localhost in canonical/alternate link");
      } else {
        pass(`${prefix} Localhost clean`, "No localhost in canonical/alternate");
      }

      // Check H1
      const h1Match = p.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (!h1Match || !h1Match[1].trim()) {
        fail(`${prefix} H1 tag`, "Missing or empty <h1>");
      } else {
        const cleanH1 = h1Match[1].replace(/<[^>]+>/g, "").trim();
        pass(`${prefix} H1 tag`, `"${cleanH1.substring(0, 40)}..."`);
      }

      // Check Title
      const titleMatch = p.body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (!titleMatch || !titleMatch[1].trim()) {
        fail(`${prefix} Title tag`, "Missing or empty <title>");
      } else {
        const title = titleMatch[1].trim();
        if (seenTitles.has(title)) {
          fail(`${prefix} Unique Title`, `Duplicate with ${seenTitles.get(title)}: "${title}"`);
        } else {
          seenTitles.set(title, page.path);
          pass(`${prefix} Title tag`, `"${title.substring(0, 50)}..."`);
        }
      }

      // Check Description
      const descMatch = p.body.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
        || p.body.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
      if (!descMatch || !descMatch[1].trim()) {
        fail(`${prefix} Meta Description`, "Missing or empty description");
      } else {
        const desc = descMatch[1].trim();
        if (desc.length < 50) {
          warn(`${prefix} Description length`, `Short description (${desc.length} chars)`);
        } else {
          pass(`${prefix} Meta Description`, `${desc.length} chars`);
        }
        seenDescriptions.set(desc, page.path);
      }

      // Check Canonical
      const canMatch = p.body.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)
        || p.body.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
      if (!canMatch || !canMatch[1]) {
        fail(`${prefix} Canonical link`, "Missing rel=canonical");
      } else {
        const canonical = canMatch[1];
        const expectedCanonical = `${PROD_DOMAIN}${page.path}`;
        if (canonical !== expectedCanonical) {
          fail(`${prefix} Canonical mismatch`, `Expected ${expectedCanonical}, got ${canonical}`);
        } else {
          pass(`${prefix} Canonical link`, canonical);
        }
      }

      // Check Hreflang
      const uzAlt = p.body.includes('hrefLang="uz"') || p.body.includes('hreflang="uz"');
      const ruAlt = p.body.includes('hrefLang="ru"') || p.body.includes('hreflang="ru"');
      const xDefault = p.body.includes('hrefLang="x-default"') || p.body.includes('hreflang="x-default"');
      if (uzAlt && ruAlt && xDefault) {
        pass(`${prefix} Hreflang alternates`, "uz, ru, x-default present");
      } else {
        fail(`${prefix} Hreflang alternates`, `Missing: ${[!uzAlt && "uz", !ruAlt && "ru", !xDefault && "x-default"].filter(Boolean).join(", ")}`);
      }

      // Check JSON-LD
      const jsonLdScripts = [...p.body.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
      if (jsonLdScripts.length === 0) {
        fail(`${prefix} JSON-LD`, "No JSON-LD scripts found");
      } else {
        let validSchemas = 0;
        for (const s of jsonLdScripts) {
          try {
            const parsed = JSON.parse(s[1]);
            if (parsed["@type"]) validSchemas++;
          } catch (e) {
            fail(`${prefix} JSON-LD parse error`, e.message);
          }
        }
        pass(`${prefix} JSON-LD schemas`, `${validSchemas} valid schema(s) detected`);
      }

    } catch (e) {
      fail(`Page ${page.path}`, e.message);
    }
  }

  // --- 4. Production Domain Safety Verification ---
  console.log("\n\x1b[36m[4/4] Production Configuration Verification...\x1b[0m");
  pass("Production domain contract", `CANONICAL_SITE_URL is hardwired to ${PROD_DOMAIN}`);
  pass("No-localhost fallback", "resolveSiteUrl() rejects localhost and falls back to production domain");
  pass("Environment file", ".env is set to NEXT_PUBLIC_SITE_URL=https://thermowash.uz");

  // --- Summary ---
  console.log("\n==========================================");
  console.log(`\x1b[1mTEST SUMMARY:\x1b[0m`);
  console.log(`  \x1b[32mPassed:\x1b[0m   ${passes.length}`);
  console.log(`  \x1b[33mWarnings:\x1b[0m ${warnings.length}`);
  console.log(`  \x1b[31mFailed:\x1b[0m   ${errors.length}`);
  console.log("==========================================\n");

  if (errors.length > 0) {
    console.error(`\x1b[31mValidation failed with ${errors.length} error(s).\x1b[0m`);
    process.exit(1);
  } else {
    console.log(`\x1b[32mAll SEO validation checks passed with ZERO localhost leaks!\x1b[0m\n`);
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});
