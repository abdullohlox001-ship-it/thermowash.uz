import { whyUs } from "@/content/home";
import { business } from "@/config/business";
import type { Dict, Lang } from "@/lib/i18n";

export default function WhyUs({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="why" data-section="why" className="section bg-paper" aria-labelledby="why-h">
      <div className="wrap">
        <h2 id="why-h" className="h2 max-w-[18ch]">{t.sections.whyTitle}</h2>
        <ol className="mt-10 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => {
            const title =
              i === 0 && business.experienceYears
                ? t.experience(business.experienceYears, business.experiencePlus)
                : i === 1
                  ? t.warranty(business.warrantyMonths)
                  : w.title[lang];
            return (
              <li key={i} className="border-t-2 border-ink-900 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-bold tabular-nums text-flame-700">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                </div>
                <p className="mt-2 pl-8 leading-relaxed text-ink-600">{w.text[lang]}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
