import { brands } from "@/content/home";
import { phoneHref } from "@/config/business";
import type { Dict } from "@/lib/i18n";

export default function Brands({ t, lang }: { t: Dict; lang: "uz" | "ru" }) {
  const other = lang === "uz" ? "Boshqa brendlar" : "Другие марки";
  const official = lang === "uz" ? "Rasmiy servis" : "Официальный сервис";
  return (
    <section id="brands" data-section="brands" className="section border-t border-line bg-white" aria-labelledby="brands-h">
      <div className="wrap">
        <h2 id="brands-h" className="h2">{t.sections.brandsTitle}</h2>
        <p className="lead">{t.sections.brandsLead}</p>
        <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <li key={b.name} className="flex min-h-[84px] flex-col items-center justify-center bg-white px-3 py-4 text-center">
              <span className="text-lg font-extrabold tracking-tight text-ink-800">{b.name}</span>
              {b.official && <span className="mt-1 text-xs font-semibold text-ok">{official}</span>}
            </li>
          ))}
          <li className="flex min-h-[84px] items-center justify-center bg-paper px-3 py-4 text-center">
            <span className="text-[0.95rem] font-semibold text-ink-600">{other}</span>
          </li>
        </ul>
        <p className="mt-6 max-w-[62ch] text-ink-600">
          {t.sections.brandsNote}{" "}
          <a href={phoneHref} className="font-semibold text-flame-700 underline underline-offset-4">{t.cta.callShort}</a>
        </p>
      </div>
    </section>
  );
}
