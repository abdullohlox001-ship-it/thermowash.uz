import { RequestButton } from "../RequestModal";
import { ArrowIcon } from "../Icons";
import { problems } from "@/content/home";
import { phoneDisplay, phoneHref } from "@/config/business";
import type { Dict, Lang } from "@/lib/i18n";

export default function Problems({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <section id="problems" data-section="problems" className="section" aria-labelledby="problems-h">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="problems-h" className="h2">{t.sections.problemsTitle}</h2>
          <p className="lead">{t.sections.problemsLead}</p>
          <a href={phoneHref} className="mt-6 hidden text-2xl font-extrabold tracking-tight text-ink-900 underline decoration-flame-500 decoration-[3px] underline-offset-[6px] hover:text-flame-700 lg:inline-block">
            {phoneDisplay}
          </a>
        </div>

        <ul className="border-t border-line">
          {problems.map((pr) => (
            <li key={pr.id} className="border-b border-line">
              <RequestButton
                service={pr.service}
                problem={pr.text[lang]}
                placement={`problem_${pr.id}`}
                className="group flex min-h-[72px] w-full items-center gap-4 py-4 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-flame-500 text-lg font-extrabold leading-none text-flame-600" aria-hidden="true">!</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.08rem] font-bold leading-snug text-ink-900">{pr.text[lang]}</span>
                  <span className="mt-0.5 block text-sm text-ink-600">{pr.hint[lang]}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-flame-700 group-hover:underline sm:inline-flex">
                  {t.cta.orderMaster}
                  <ArrowIcon size={16} />
                </span>
                <ArrowIcon size={20} className="shrink-0 text-flame-600 sm:hidden" />
              </RequestButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
