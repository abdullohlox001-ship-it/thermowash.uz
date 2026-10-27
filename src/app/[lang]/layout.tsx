import "@fontsource-variable/onest";
import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LANGS, getDict, isLang, langMeta } from "@/lib/i18n";
import { business, isPlaceholderPhone, phoneDisplay, phoneHref, siteUrl } from "@/config/business";
import { requestServiceOptions } from "@/content/services";
import { jsonLd, localBusinessSchema } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import { RequestProvider } from "@/components/RequestModal";
import ClickTracker from "@/components/ClickTracker";
import Analytics from "@/components/Analytics";
import { hasReviews } from "@/components/sections/Reviews";
import { hasWorks } from "@/content/media";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E1726",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    metadataBase: new URL(siteUrl),
    applicationName: business.name[lang],
    icons: {
      icon: [
        { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
    formatDetection: { telephone: true },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const dev = process.env.NODE_ENV !== "production";
  const showReviews = hasReviews || dev;
  const showWorks = hasWorks || dev;

  const nav = [
    { href: `/${lang}#services`, label: t.nav.services },
    { href: `/${lang}#about`, label: t.nav.about, secondary: true },
    { href: `/${lang}#why`, label: t.nav.why },
    { href: `/${lang}#process`, label: t.nav.process },
    ...(showWorks ? [{ href: `/${lang}#works`, label: t.nav.works }] : []),
    ...(showReviews ? [{ href: `/${lang}#reviews`, label: t.nav.reviews, secondary: true }] : []),
    { href: `/${lang}#faq`, label: t.nav.faq },
    { href: `/${lang}#contacts`, label: t.nav.contacts },
  ];

  return (
    <html lang={langMeta[lang].htmlLang}>
      <body className="pb-[calc(74px+env(safe-area-inset-bottom))] lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-3 focus:font-bold">
          {lang === "uz" ? "Asosiy mazmunga o‘tish" : "Перейти к содержимому"}
        </a>
        {isPlaceholderPhone && process.env.NODE_ENV !== "production" && (
          <div className="bg-yellow-300 px-4 py-2 text-center text-sm font-semibold text-ink-950">
            DEV: telefon raqami hali placeholder — src/config/business.ts faylini to‘ldiring
          </div>
        )}
        <RequestProvider
          lang={lang}
          title={t.form.title}
          lead={t.form.lead}
          closeLabel={t.nav.close}
          t={t.form}
          options={requestServiceOptions.map((o) => ({ id: o.id, label: o.label[lang] }))}
          phoneDisplay={phoneDisplay}
          phoneHref={phoneHref}
          privacyHref={`/${lang}/privacy`}
        >
          <Header
            lang={lang}
            name={business.name[lang]}
            nav={nav}
            phoneDisplay={phoneDisplay}
            phoneHref={phoneHref}
            hours={business.workingHours.label[lang]}
            labels={{
              menu: t.nav.menu,
              close: t.nav.close,
              call: t.cta.call,
              request: t.cta.request,
              callShort: t.cta.callShort,
              langSwitch: t.langSwitch,
              home: t.nav.home,
            }}
          />
          <main id="main">{children}</main>
          <Footer lang={lang} t={t} />
          <MobileBottomBar call={t.bottomBar.call} request={t.bottomBar.request} phoneHref={phoneHref} />
        </RequestProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessSchema(lang))} />
        <ClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
