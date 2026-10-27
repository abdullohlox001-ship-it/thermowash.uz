import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LANGS, getDict, isLang, type Lang } from "@/lib/i18n";
import { business, phoneDisplay, phoneHref } from "@/config/business";
import { findServiceBySlug, servicePages } from "@/content/services";
import { breadcrumbSchema, buildMetadata, faqSchema, jsonLd, localizedUrl, serviceSchema } from "@/lib/seo";
import { RequestButton } from "@/components/RequestModal";
import { ArrowIcon, CheckIcon, FormIcon, PhoneIcon, ServiceIcon, WarnDotIcon } from "@/components/Icons";
import Process from "@/components/sections/Process";
import EmergencyCTA from "@/components/sections/EmergencyCTA";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => servicePages.map((s) => ({ lang, slug: s.slug![lang] })));
}

type P = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const s = findServiceBySlug(lang, slug);
  if (!s?.page) return {};
  const city = business.city[lang];
  return buildMetadata({
    lang,
    title: `${s.page.metaTitle[lang]} | ${city}`,
    description: s.page.metaDescription[lang],
    paths: { uz: `/services/${s.slug!.uz}`, ru: `/services/${s.slug!.ru}` },
  });
}

export default async function ServicePage({ params }: P) {
  const { lang: l, slug } = await params;
  if (!isLang(l)) notFound();
  const lang: Lang = l;
  const s = findServiceBySlug(lang, slug);
  if (!s?.page) notFound();
  const t = getDict(lang);
  const pg = s.page;
  const url = localizedUrl(lang, `/services/${s.slug![lang]}`);
  const related = servicePages.filter((x) => x.id !== s.id);

  return (
    <>
      <section data-section="service_hero" className="blueprint bg-ink-900 text-white">
        <div className="wrap pb-12 pt-6 md:pb-20 md:pt-10">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href={`/${lang}`} className="hover:text-white">{t.nav.home}</a></li>
              <li aria-hidden="true">/</li>
              <li><a href={`/${lang}#services`} className="hover:text-white">{t.nav.services}</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-300">{s.title[lang]}</li>
            </ol>
          </nav>
          <div className="mt-8 flex items-center gap-3 text-flame-400">
            <ServiceIcon name={s.icon} size={30} />
          </div>
          <h1 className="mt-4 max-w-[22ch] text-[2.1rem] font-extrabold leading-[1.06] tracking-[-0.025em] md:text-[3.2rem]">{pg.h1[lang]}</h1>
          <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-relaxed text-ink-300 md:text-lg">{pg.intro[lang]}</p>
          <div className="mt-8 grid gap-3 sm:flex">
            <a href={phoneHref} className="btn-primary h-14 px-7 text-[1.05rem]">
              <PhoneIcon size={21} strokeWidth={2.2} />
              {t.cta.call}
            </a>
            <RequestButton placement={`service_${s.id}_hero`} service={s.id} className="btn-ghost-light h-14 px-7 text-[1.05rem]">
              <FormIcon size={21} />
              {t.cta.request}
            </RequestButton>
          </div>
          <a href={phoneHref} className="mt-5 inline-block text-2xl font-extrabold tracking-tight hover:text-flame-400">{phoneDisplay}</a>
        </div>
      </section>

      <section data-section="service_details" className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t.sections.whatWeDo}</h2>
            <ul className="mt-6 space-y-3.5">
              {pg.whatWeDo[lang].map((x) => (
                <li key={x} className="flex gap-3 text-[1.03rem] leading-relaxed text-ink-800">
                  <CheckIcon size={20} strokeWidth={2.4} className="mt-0.5 shrink-0 text-flame-600" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-paper p-6 md:p-8">
            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t.sections.symptoms}</h2>
            <ul className="mt-6 space-y-3.5">
              {pg.symptoms[lang].map((x) => (
                <li key={x} className="flex gap-3 text-[1.03rem] leading-relaxed text-ink-800">
                  <WarnDotIcon size={20} className="mt-0.5 shrink-0 text-flame-600" />
                  {x}
                </li>
              ))}
            </ul>
            <RequestButton placement={`service_${s.id}_symptoms`} service={s.id} className="btn-dark mt-7 h-12 px-6 text-[0.95rem]">
              {t.cta.orderMaster}
            </RequestButton>
          </div>
        </div>
      </section>

      <Process lang={lang} t={t} />
      <EmergencyCTA t={t} />
      <FAQ t={t} items={pg.faq[lang]} id="service-faq" title={t.sections.serviceFaq} />

      <section data-section="related" className="section" aria-labelledby="related-h">
        <div className="wrap">
          <h2 id="related-h" className="text-2xl font-extrabold tracking-tight md:text-3xl">{t.sections.related}</h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id} className="bg-white">
                <a href={`/${lang}/services/${r.slug![lang]}`} data-track-service={r.id} className="group flex h-full min-h-[72px] items-center justify-between gap-3 p-5 font-bold hover:bg-paper">
                  <span>{r.title[lang]}</span>
                  <ArrowIcon size={18} className="shrink-0 text-flame-600 transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact lang={lang} t={t} defaultService={s.id === "gas-repair" ? "repair" : s.id} />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema(lang, pg.h1[lang], pg.metaDescription[lang], url))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: t.nav.home, url: localizedUrl(lang) },
            { name: s.title[lang], url },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(pg.faq[lang]))} />
    </>
  );
}
