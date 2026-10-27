import { processSteps } from "@/content/home";
import type { Dict, Lang } from "@/lib/i18n";

export default function Process({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="process" data-section="process" className="section" aria-labelledby="process-h">
      <div className="wrap">
        <h2 id="process-h" className="h2">{t.sections.processTitle}</h2>
        <p className="lead">{t.sections.processLead}</p>
        {/* Quvur chizig'i qadamlarni bog'laydi */}
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-[3px] rounded bg-gradient-to-b from-flame-500 to-flame-100 md:bottom-auto md:left-6 md:right-6 md:top-[21px] md:h-[3px] md:w-auto md:bg-gradient-to-r" />
          {processSteps.map((s, i) => (
            <li key={i} className="relative flex gap-5 md:block">
              <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px] border-flame-500 bg-white text-base font-extrabold text-ink-900">
                {i + 1}
              </span>
              <div className="md:mt-5">
                <h3 className="text-lg font-bold leading-snug">{s.title[lang]}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-600">{s.text[lang]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
