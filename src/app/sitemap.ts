import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/i18n";
import { servicePages } from "@/content/services";
import { localizedUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const alt = (paths: Record<string, string>) => ({
    languages: Object.fromEntries(LANGS.map((l) => [l, localizedUrl(l, paths[l])])),
  });
  const entries: MetadataRoute.Sitemap = [];

  for (const l of LANGS) {
    entries.push({ url: localizedUrl(l), lastModified: now, changeFrequency: "weekly", priority: 1, alternates: alt({ uz: "", ru: "" }) });
  }
  for (const s of servicePages) {
    const paths = { uz: `/services/${s.slug!.uz}`, ru: `/services/${s.slug!.ru}` };
    for (const l of LANGS) {
      entries.push({ url: localizedUrl(l, paths[l]), lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: alt(paths) });
    }
  }
  for (const l of LANGS) {
    entries.push({ url: localizedUrl(l, "/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 });
  }
  return entries;
}
