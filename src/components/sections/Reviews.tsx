import { reviews } from "@/content/home";
import { business } from "@/config/business";
import type { Dict, Lang } from "@/lib/i18n";

/**
 * Faqat real sharhlar. Ro'yxat bo'sh bo'lsa:
 *  - production: bo'lim ko'rsatilmaydi
 *  - development: tahrir uchun aniq belgilangan joy ko'rsatiladi
 * Keyinchalik Google Places API orqali ulash uchun `reviews` manbasini almashtirish kifoya.
 */
export const hasReviews = reviews.length > 0;

export default function Reviews({ lang, t }: { lang: Lang; t: Dict }) {
  const dev = process.env.NODE_ENV !== "production";
  if (!hasReviews && !dev) return null;

  return (
    <section id="reviews" data-section="reviews" className="section bg-paper" aria-labelledby="reviews-h">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="reviews-h" className="h2">{t.sections.reviewsTitle}</h2>
          {business.googleReviewsUrl && (
            <a href={business.googleReviewsUrl} target="_blank" rel="noopener" className="btn-outline h-11 px-5 text-sm">
              {t.sections.reviewsLeave}
            </a>
          )}
        </div>

        {hasReviews ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <li key={i} className="flex flex-col rounded-lg border border-line bg-white p-6">
                {r.rating && (
                  <div className="text-flame-500" aria-label={`${r.rating}/5`}>
                    {"★".repeat(r.rating)}
                    <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                  </div>
                )}
                <blockquote className="mt-3 flex-1 leading-relaxed text-ink-800">{r.text[lang]}</blockquote>
                <footer className="mt-5 text-sm">
                  <span className="font-bold text-ink-900">{r.author}</span>
                  {r.district && <span className="text-ink-600">, {r.district[lang]}</span>}
                  <time dateTime={r.date} className="block text-ink-400">
                    {new Date(r.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ")}
                  </time>
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-lg border-2 border-dashed border-flame-500 bg-white p-6 text-sm text-ink-700">
            <strong className="text-flame-700">[EDITABLE — faqat dev rejimida ko‘rinadi]</strong>
            <br />
            Real mijoz sharhlarini <code className="rounded bg-paper px-1">src/content/home.ts → reviews</code> ga qo‘shing.
            Ro‘yxat bo‘sh bo‘lsa, productionda bu bo‘lim va menyudagi “Sharhlar” havolasi avtomatik yashiriladi.
          </div>
        )}
      </div>
    </section>
  );
}
