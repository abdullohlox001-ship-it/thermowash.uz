import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/i18n";
import { servicePages } from "@/content/services";
import { localizedUrl } from "@/lib/seo";

/**
 * lastModified — sahifalar qachon o'zgarganini bildiradi.
 * Har build da yangilanmasligi uchun QATTIQ sanalar ishlatiladi.
 * Sahifa kontenti o'zgarganda shu sanani yangilang.
 */
const CONTENT_DATES = {
  home: "2026-10-30",
  services: "2026-10-30",
  privacy: "2026-06-01",
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const alt = (paths: Record<string, string>) => ({
    languages: {
      ...Object.fromEntries(LANGS.map((l) => [l, localizedUrl(l, paths[l])])),
      "x-default": localizedUrl("uz", paths.uz),
    },
  });

  const entries: MetadataRoute.Sitemap = [];

  // === Bosh sahifa (home) — har bir til uchun ===
  const homePaths = { uz: "", ru: "" };
  for (const l of LANGS) {
    entries.push({
      url: localizedUrl(l),
      lastModified: CONTENT_DATES.home,
      changeFrequency: "weekly",
      priority: 1,
      alternates: alt(homePaths),
    });
  }

  // === Xizmat sahifalari ===
  for (const s of servicePages) {
    const paths = {
      uz: `/services/${s.slug!.uz}`,
      ru: `/services/${s.slug!.ru}`,
    };
    for (const l of LANGS) {
      entries.push({
        url: localizedUrl(l, paths[l]),
        lastModified: CONTENT_DATES.services,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: alt(paths),
      });
    }
  }

  // === Maxfiylik siyosati ===
  const privacyPaths = { uz: "/privacy", ru: "/privacy" };
  for (const l of LANGS) {
    entries.push({
      url: localizedUrl(l, "/privacy"),
      lastModified: CONTENT_DATES.privacy,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: alt(privacyPaths),
    });
  }

  return entries;
}
