import { about } from "@/content/home";
import { business } from "@/config/business";
import type { Dict, Lang } from "@/lib/i18n";

export default function About({ lang, t }: { lang: Lang; t: Dict }) {
  const facts = [
    business.experienceYears ? t.experience(business.experienceYears, business.experiencePlus) : null,
    business.warrantyMonths ? t.warranty(business.warrantyMonths) : null,
  ].filter(Boolean) as string[];

  return (
    <section id="about" data-section="about" className="section border-t border-line" aria-labelledby="about-h">
      <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="about-h" className="h2 max-w-[16ch]">{t.sections.aboutTitle}</h2>
          {facts.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {facts.map((f) => (
                <li key={f} className="rounded border border-ink-900 px-3 py-1.5 text-sm font-bold">{f}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="max-w-[68ch] space-y-4 text-[1.05rem] leading-[1.7] text-ink-700">
          {about[lang].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
