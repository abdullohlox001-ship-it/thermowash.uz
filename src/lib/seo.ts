import type { Metadata } from "next";
import { business, siteUrl } from "@/config/business";
import { LANGS, langMeta, type Lang } from "./i18n";

/** Qidiruvdagi yozilish variantlari (Yandex uchun keywords; Google e'tiborsiz qoldiradi) */
export const keywords: Record<Lang, string[]> = {
  uz: [
    "kotyol ustasi", "usta kotyol", "kotyol ta'mirlash", "kotyol tamirlash", "kotyol o'rnatish", "kotyol remont",
    "kotel ustasi", "kotel remont", "katyol usta", "katyol remont", "isitish qozoni ustasi", "qozon ustasi",
    "isitish tizimi", "kotyol xizmatlari", "gaz kotyol ta'mirlash", "kotyol diagnostika",
    "isitish tizimini yuvish", "kotyol yuvish", "promivka", "isitish promivka", "boyler tozalash", "quyqa tozalash", "thermowash", "котёл устаси", "котел уста",
  ],
  ru: [
    "мастер по котлам", "котёл мастер", "ремонт котла", "ремонт котлов", "ремонт газового котла", "ремонт газовых котлов",
    "установка котла", "обслуживание котла", "обслуживание котлов", "ремонт отопления", "мастер по отоплению",
    "котёл не работает", "котел не включается", "котельщик", "ремонт котла на дому",
    "промывка системы отопления", "промывка котла", "промывка теплообменника", "промывка радиаторов",
    "чистка котла от накипи", "чистка бойлера", "удаление накипи", "промывка отопления Ташкент", "thermowash",
  ],
};

export function localizedUrl(lang: Lang, path = "") {
  return `${siteUrl}/${lang}${path}`;
}

export function buildMetadata(opts: {
  lang: Lang;
  title: string;
  description: string;
  /** til prefiksisiz yo'l, masalan "/services/x". Har bir til uchun alohida. */
  paths?: Partial<Record<Lang, string>>;
  noindex?: boolean;
}): Metadata {
  const { lang, title, description } = opts;
  const paths: Record<Lang, string> = { uz: "", ru: "", ...opts.paths };
  const url = localizedUrl(lang, paths[lang]);
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[langMeta[l].htmlLang] = localizedUrl(l, paths[l]);
  languages["x-default"] = localizedUrl("uz", paths.uz);

  return {
    title,
    description,
    keywords: keywords[lang],
    alternates: { canonical: url, languages },
    robots: opts.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: business.name[lang],
      locale: langMeta[lang].ogLocale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => langMeta[l].ogLocale),
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og.png`] },
  };
}

/* ------------------- JSON-LD ------------------- */

export function localBusinessSchema(lang: Lang) {
  const b = business;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": `${siteUrl}/#business`,
    name: b.name[lang],
    url: localizedUrl(lang),
    telephone: b.phone,
    ...(b.phone2 ? { contactPoint: [b.phone, b.phone2].map((tel) => ({ "@type": "ContactPoint", telephone: tel, contactType: "customer service", areaServed: "UZ", availableLanguage: ["uz", "ru"], hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => `https://schema.org/${d}`), opens: "00:00", closes: "23:59" } })) } : {}),
    image: `${siteUrl}/og.png`,
    logo: `${siteUrl}/icon.png`,
    inLanguage: langMeta[lang].htmlLang,
    areaServed: b.serviceArea
      ? b.serviceArea[lang]
      : { "@type": "City", name: b.city[lang] },
    openingHoursSpecification: b.workingHours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${dayName(d)}`),
      opens: h.opens,
      closes: h.closes,
    })),
    knowsLanguage: ["uz", "ru"],
  };
  if (b.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: b.address.street[lang],
      addressLocality: b.city[lang],
      addressCountry: "UZ",
      ...(b.address.postalCode ? { postalCode: b.address.postalCode } : {}),
    };
    if (b.address.lat && b.address.lng)
      schema.geo = { "@type": "GeoCoordinates", latitude: b.address.lat, longitude: b.address.lng };
  } else {
    schema.address = { "@type": "PostalAddress", addressLocality: b.city[lang], addressCountry: "UZ" };
  }
  if (b.mapsUrl) schema.hasMap = b.mapsUrl;
  const sameAs = [...b.socials, ...b.telegrams.map((u) => `https://t.me/${u}`)];
  if (sameAs.length) schema.sameAs = sameAs;
  return schema;
}

function dayName(d: string) {
  return (
    { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" } as Record<string, string>
  )[d];
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function serviceSchema(lang: Lang, name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    serviceType: name,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: business.serviceArea ? business.serviceArea[lang] : business.city[lang],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

/** JSON-LD ni xavfsiz serializatsiya (</script> injeksiyasidan himoya) */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
