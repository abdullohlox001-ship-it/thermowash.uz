import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { business, phone2Display, phone2Href, phoneDisplay, phoneHref, telegramLinks } from "@/config/business";
import { servicePages } from "@/content/services";
import type { Dict, Lang } from "@/lib/i18n";

export default function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const year = new Date().getFullYear();
  return (
    <footer data-section="footer" className="bg-ink-950 text-ink-300">
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <a href={`/${lang}`} className="inline-block rounded"><Logo name={business.name[lang]} tone="light" /></a>
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed">{t.footer.about}</p>
          <div className="mt-6">
            <div className="mb-2 text-sm text-ink-400">{t.footer.language}</div>
            <LanguageSwitcher lang={lang} label={t.langSwitch} tone="dark" />
          </div>
        </div>

        <nav aria-label={t.footer.services}>
          <h2 className="text-sm font-bold text-white">{t.footer.services}</h2>
          <ul className="mt-4 space-y-1">
            {servicePages.map((s) => (
              <li key={s.id}>
                <a href={`/${lang}/services/${s.slug![lang]}`} className="inline-flex min-h-[36px] items-center text-sm hover:text-white">
                  {s.title[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-white">{t.footer.contacts}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href={phoneHref} className="text-lg font-extrabold text-white hover:text-flame-400">{phoneDisplay}</a></li>
            {phone2Href && <li><a href={phone2Href} className="text-base font-bold text-white hover:text-flame-400">{phone2Display}</a></li>}
            {telegramLinks.map((tg) => (
              <li key={tg.username}><a href={tg.href} target="_blank" rel="noopener" className="hover:text-white">Telegram: @{tg.username}</a></li>
            ))}
            <li>{business.workingHours.label[lang]}</li>
            {business.serviceArea && <li>{business.serviceArea[lang]}</li>}
            {business.address && <li>{business.address.street[lang]}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {business.name[lang]}. {t.footer.rights}</p>
          <a href={`/${lang}/privacy`} className="hover:text-white">{t.form.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
