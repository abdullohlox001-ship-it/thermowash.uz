/**
 * ============================================================
 *  RASMLAR / ФОТОГРАФИИ
 * ============================================================
 *  Faqat O'ZINGIZNING rasmlaringizni qo'ying: ustaning ishlayotgan payti,
 *  o'rnatilgan kotyol, tozalangan gorelka, isitish tizimi va h.k.
 *
 *  ⚠️ Boshqa saytlardan rasm olish mumkin emas — mualliflik huquqi buziladi
 *     va Google uchun ham foyda bermaydi. Telefon kamerasida olingan real
 *     rasm har qanday "stock" rasmdan yaxshiroq ishlaydi.
 *
 *  QANDAY QO'SHILADI
 *   1. Rasmlarni  public/images/  papkasiga tashlang
 *      (masalan: public/images/hero.jpg, public/images/works/1.jpg)
 *   2. Quyidagi ro'yxatlarga yo'lini va izohini yozing
 *   3. Yangilash:  cd /opt/thermix && bash deploy/update.sh
 *
 *  TAVSIYA
 *   - format: .jpg (yoki .webp), sayt o'zi WebP/AVIF ga o'giradi
 *   - hero rasmi: kamida 1600×1200, gorizontal
 *   - ishlar rasmi: kamida 1000×750
 *   - hajmi 2 MB dan oshmasin
 *   - odamlarning yuzi ko'rinsa, ruxsatini so'rang
 *   - alt: rasmda nima borligini yozing (Google shuni o'qiydi)
 */
import type { Lang } from "@/lib/i18n";

type L = Record<Lang, string>;

export interface Photo {
  /** public papkasidan boshlab yo'l: "/images/works/1.jpg" */
  src: string;
  /** rasm tavsifi — SEO va ko'zi ojizlar uchun majburiy */
  alt: L;
  /** rasm ostidagi qisqa izoh (ixtiyoriy) */
  caption?: L;
  width?: number;
  height?: number;
}

/**
 * Hero (birinchi ekran) rasmi. null = texnik chizma (manometr) ko'rsatiladi.
 * Misol:
 *   export const heroPhoto: Photo | null = {
 *     src: "/images/hero.jpg",
 *     alt: { uz: "Usta gaz kotyolini ta’mirlamoqda", ru: "Мастер ремонтирует газовый котёл" },
 *   };
 */
export const heroPhoto: Photo | null = null;

/**
 * "Bizning ishlarimiz" galereyasi. Bo'sh = bo'lim ko'rsatilmaydi
 * (dev rejimida tahrir uchun joy ko'rinadi).
 *
 * Misol:
 *   { src: "/images/works/1.jpg",
 *     alt: { uz: "Yangi gaz kotyoli o‘rnatildi", ru: "Установлен новый газовый котёл" },
 *     caption: { uz: "Kotyol o‘rnatish", ru: "Установка котла" } },
 */
export const works: Photo[] = [];

export const hasWorks = works.length > 0;
