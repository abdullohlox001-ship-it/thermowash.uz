import type { Metadata } from "next";
import { getDict, isLang, type Lang } from "@/lib/i18n";
import { business, phoneDisplay } from "@/config/business";
import { faq } from "@/content/home";
import { buildMetadata, faqSchema, jsonLd } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Problems from "@/components/sections/Problems";
import Brands from "@/components/sections/Brands";
import WhyUs from "@/components/sections/WhyUs";
import Process from "@/components/sections/Process";
import EmergencyCTA from "@/components/sections/EmergencyCTA";
import Works from "@/components/sections/Works";
import Reviews from "@/components/sections/Reviews";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

const meta: Record<Lang, (city: string, name: string) => { title: string; description: string }> = {
  uz: (city, name) => ({
    title: `Kotyol ustasi ${city}da — ta’mirlash, o‘rnatish, yuvish | ${name}`,
    description: `Kotyol (kotel) ta’mirlash, o‘rnatish va diagnostika, isitish tizimini yuvish (promivka), boyler tozalash. Gaz va elektr kotyollar. 24/7, Toshkentning barcha tumanlari. Kafolat. Tel: ${phoneDisplay}`,
  }),
  ru: (city, name) => ({
    title: `Мастер по котлам — ремонт, установка и промывка, ${city} | ${name}`,
    description: `Ремонт котлов на дому, установка и диагностика, промывка систем отопления и теплообменников, чистка бойлеров. Круглосуточно 24/7, все районы Ташкента. Гарантия. Тел: ${phoneDisplay}`,
  }),
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const m = meta[lang](business.city[lang], business.name[lang]);
  return buildMetadata({ lang, ...m });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = l as Lang;
  const t = getDict(lang);
  return (
    <>
      <Hero lang={lang} t={t} />
      <Services lang={lang} t={t} />
      <Problems lang={lang} t={t} />
      <Brands lang={lang} t={t} />
      <WhyUs lang={lang} t={t} />
      <Process lang={lang} t={t} />
      <EmergencyCTA t={t} />
      <Works lang={lang} t={t} />
      <Reviews lang={lang} t={t} />
      <About lang={lang} t={t} />
      <FAQ t={t} items={faq[lang]} />
      <Contact lang={lang} t={t} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faq[lang]))} />
    </>
  );
}
