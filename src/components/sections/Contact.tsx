import type { ReactElement, ReactNode } from "react";
import RequestForm from "../RequestForm";
import { ClockIcon, PhoneIcon, PinIcon, TelegramIcon } from "../Icons";
import { business, phoneDisplay, phoneHref, telegramHref, telegramLinks, formatPhone } from "@/config/business";
import { requestServiceOptions } from "@/content/services";
import type { Dict, Lang } from "@/lib/i18n";

export default function Contact({ lang, t, defaultService }: { lang: Lang; t: Dict; defaultService?: string }) {
  const rows: { icon: ReactElement; label: string; value: ReactNode }[] = [];
  if (business.phone2)
    rows.push({ icon: <PhoneIcon size={20} />, label: t.contact.phone, value: <a href={`tel:${business.phone2}`} className="hover:text-flame-400">{formatPhone(business.phone2)}</a> });
  if (telegramLinks.length)
    rows.push({
      icon: <TelegramIcon size={20} />,
      label: t.contact.telegram,
      value: (
        <span className="flex flex-col gap-1">
          {telegramLinks.map((tg) => (
            <a key={tg.username} href={tg.href} target="_blank" rel="noopener" className="w-fit hover:text-flame-400">@{tg.username}</a>
          ))}
        </span>
      ),
    });
  rows.push({ icon: <ClockIcon size={20} />, label: t.contact.hours, value: business.workingHours.label[lang] });
  if (business.serviceArea) rows.push({ icon: <PinIcon size={20} />, label: t.contact.area, value: business.serviceArea[lang] });
  if (business.address)
    rows.push({
      icon: <PinIcon size={20} />,
      label: t.contact.address,
      value: (
        <>
          {business.address.street[lang]}
          {business.mapsUrl && (
            <a href={business.mapsUrl} target="_blank" rel="noopener" className="mt-1 block text-sm text-flame-400 underline underline-offset-4">{t.contact.map}</a>
          )}
        </>
      ),
    });

  return (
    <section id="contacts" data-section="contacts" className="blueprint bg-ink-900 text-white" aria-labelledby="contacts-h">
      <div className="wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-16">
        <div>
          <h2 id="contacts-h" className="h2">{t.sections.contactTitle}</h2>
          <p className="mt-3 max-w-[48ch] text-[1.05rem] leading-relaxed text-ink-300">{t.sections.contactLead}</p>

          <div className="mt-8">
            <div className="text-sm text-ink-400">{t.contact.phone}</div>
            <a href={phoneHref} className="mt-1 inline-block text-[2rem] font-extrabold tracking-tight hover:text-flame-400 md:text-[2.6rem]">
              {phoneDisplay}
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:flex">
            <a href={phoneHref} className="btn-primary h-14 px-7 text-[1.05rem]">
              <PhoneIcon size={21} strokeWidth={2.2} />
              {t.cta.callMaster}
            </a>
            {telegramHref && (
              <a href={telegramHref} target="_blank" rel="noopener" className="btn-ghost-light h-14 px-7 text-[1.05rem]">
                <TelegramIcon size={20} />
                {t.cta.telegram}
              </a>
            )}
          </div>

          <dl className="mt-10 grid gap-6 border-t border-ink-700 pt-8 sm:grid-cols-2">
            {rows.map((r, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-0.5 text-flame-400">{r.icon}</span>
                <div>
                  <dt className="text-sm text-ink-400">{r.label}</dt>
                  <dd className="mt-0.5 font-semibold">{r.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div id="request" className="scroll-mt-24 rounded-lg bg-white p-5 text-ink-900 shadow-2xl sm:p-7">
          <h3 className="text-2xl font-bold tracking-tight">{t.form.title}</h3>
          <p className="mb-5 mt-1 text-sm text-ink-600">{t.form.lead}</p>
          <RequestForm
            lang={lang}
            t={t.form}
            options={requestServiceOptions.map((o) => ({ id: o.id, label: o.label[lang] }))}
            phoneDisplay={phoneDisplay}
            phoneHref={phoneHref}
            privacyHref={`/${lang}/privacy`}
            defaultService={defaultService}
            placement="contact_form"
          />
        </div>
      </div>
    </section>
  );
}
