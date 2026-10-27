import { RequestButton } from "../RequestModal";
import { ArrowIcon, CheckIcon, PhoneIcon, ServiceIcon } from "../Icons";
import { services, allWorks } from "@/content/services";
import { phoneHref } from "@/config/business";
import type { Dict, Lang } from "@/lib/i18n";

export default function Services({ lang, t }: { lang: Lang; t: Dict }) {
  const cards = services.filter((s) => s.featured);
  return (
    <section id="services" data-section="services" className="section bg-paper" aria-labelledby="services-h">
      <div className="wrap">
        <h2 id="services-h" className="h2">{t.sections.servicesTitle}</h2>
        <p className="lead">{t.sections.servicesLead}</p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((s) => {
            const urgent = s.id === "emergency";
            const href = s.slug ? `/${lang}/services/${s.slug[lang]}` : null;
            return (
              <li key={s.id} className={`flex flex-col p-6 md:p-7 ${urgent ? "bg-ink-900 text-white" : "bg-white"}`}>
                <span className={`grid h-12 w-12 place-items-center rounded ${urgent ? "bg-flame-500 text-ink-950" : "bg-flame-50 text-flame-700"}`}>
                  <ServiceIcon name={s.icon} size={26} />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {href ? (
                    <a href={href} data-track-service={s.id} className="hover:underline hover:decoration-flame-500 hover:decoration-2 hover:underline-offset-4">
                      {s.title[lang]}
                    </a>
                  ) : (
                    s.title[lang]
                  )}
                </h3>
                <p className={`mt-2 flex-1 leading-relaxed ${urgent ? "text-ink-300" : "text-ink-600"}`}>{s.short[lang]}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {urgent ? (
                    <a href={phoneHref} data-track-service={s.id} className="btn-primary h-12 px-5 text-[0.95rem]">
                      <PhoneIcon size={18} strokeWidth={2.2} />
                      {t.cta.callNow}
                    </a>
                  ) : (
                    <RequestButton service={s.id} placement={`service_card_${s.id}`} className="btn-outline h-12 px-5 text-[0.95rem]">
                      {t.cta.call}
                    </RequestButton>
                  )}
                  {href && (
                    <a href={href} data-track-service={s.id} className="inline-flex min-h-[44px] items-center gap-1.5 text-[0.95rem] font-semibold text-ink-700 hover:text-flame-700" aria-label={`${t.sections.more}: ${s.title[lang]}`}>
                      {t.sections.more}
                      <ArrowIcon size={17} />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 md:mt-16">
          <h3 className="text-lg font-bold">{t.sections.allServices}</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {allWorks[lang].map((w) => (
              <li key={w} className="flex items-start gap-2 text-[0.97rem] text-ink-700">
                <CheckIcon size={17} strokeWidth={2.4} className="mt-0.5 shrink-0 text-flame-600" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
