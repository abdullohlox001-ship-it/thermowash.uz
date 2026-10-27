/**
 * ============================================================
 *  BIZNES MA'LUMOTLARI — YAGONA JOY / ДАННЫЕ БИЗНЕСА — ОДНО МЕСТО
 * ============================================================
 *  Telefon, manzil, ish vaqti va boshqa hamma narsa faqat shu faylda.
 *  Телефон, адрес, график и т.д. меняются только в этом файле.
 *
 *  null qiymat = saytda ko'rsatilmaydi (soxta ma'lumot chiqmaydi).
 *  null = не показывается на сайте (никаких выдуманных цифр).
 *
 *  ⚠️  "TODO" bilan belgilangan joylarni real ma'lumot bilan almashtiring.
 */

import type { Lang } from "@/lib/i18n";

type L10n = Record<Lang, string>;

export const business = {
  /** Kompaniya nomi / Название компании */
  name: { uz: "THERMOWASH", ru: "THERMOWASH" } as L10n,

  /** Qisqa nom (logo yonida) */
  shortName: "THERMOWASH",

  /**
   * ASOSIY TELEFON. Faqat raqamlar, +998 bilan.
   * Hamma joyda (header, hero, pastki panel, footer, schema) avtomatik ishlatiladi.
   */
  phone: "+998914580202",

  /** Qo'shimcha telefon (ixtiyoriy) */
  phone2: "+998993853402" as string | null,

  /** Telegram username'lar (@ belgisisiz). Birinchisi — asosiy "Telegramda yozish" tugmasi. [] = ko'rsatilmaydi */
  telegrams: ["autocheck_uz", "idrisov_jasurbek"] as string[],

  /** Shahar — SEO sarlavhalarida ishlatiladi */
  city: { uz: "Toshkent", ru: "Ташкент" } as L10n,

  /** Xizmat hududi. null = ko'rsatilmaydi */
  serviceArea: { uz: "Toshkent shahrining barcha tumanlari", ru: "Все районы Ташкента" } as L10n | null,
  // Misol: { uz: "Toshkent shahri va Toshkent viloyati", ru: "Ташкент и Ташкентская область" }

  /** TODO: Manzil (ofis/ustaxona bo'lsa). null = ko'rsatilmaydi */
  address: null as
    | { street: L10n; postalCode?: string; lat?: number; lng?: number }
    | null,

  /** Ish vaqti */
  workingHours: {
    label: { uz: "Kechayu kunduz, 24/7", ru: "Круглосуточно, 24/7" } as L10n,
    /** schema.org uchun (24/7 = 00:00–23:59 har kuni) */
    schema: [{ days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], opens: "00:00", closes: "23:59" }],
  },

  /** Tajriba yillari. null = hech qayerda raqam chiqmaydi. experiencePlus: true => "8+" */
  experienceYears: 8 as number | null,
  experiencePlus: true,

  /** Kafolat muddati (oy). null = faqat "Kafolat" so'zi chiqadi, muddatsiz. Muddatini bilsangiz — raqam yozing */
  warrantyMonths: null as number | null,

  /**
   * Aksiya/taklif qatori (hero'da ko'rinadi). null = ko'rsatilmaydi.
   * ⚠️ Faqat HAQIQATDAN beradigan taklifingizni yozing.
   * Misol: { uz: "Diagnostika — bepul", ru: "Диагностика — бесплатно" }
   */
  promo: null as L10n | null,

  /** Google Business Profile havolasi (sharh qoldirish uchun). null = ko'rsatilmaydi */
  googleReviewsUrl: null as string | null,

  /** Google Maps havolasi. null = ko'rsatilmaydi */
  mapsUrl: null as string | null,

  /** Ijtimoiy tarmoqlar (schema sameAs uchun) */
  socials: [] as string[],
} as const;

/* ---------- yordamchi funksiyalar / helpers ---------- */

/** +998900000000 -> +998 90 000 00 00 */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  const m = d.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : raw;
}

export const phoneHref = `tel:${business.phone}`;
export const phoneDisplay = formatPhone(business.phone);
export const telegramLinks = business.telegrams.map((u) => ({ username: u, href: `https://t.me/${u}` }));
export const telegramHref = telegramLinks[0]?.href ?? null;
export const phone2Display = business.phone2 ? formatPhone(business.phone2) : null;
export const phone2Href = business.phone2 ? `tel:${business.phone2}` : null;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Placeholder telefon hali almashtirilmaganmi? (dev ogohlantirish uchun) */
export const isPlaceholderPhone = (business.phone as string) === "+998900000000";
