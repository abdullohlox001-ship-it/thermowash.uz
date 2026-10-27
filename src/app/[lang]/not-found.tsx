"use client";

import { usePathname } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { phoneDisplay, phoneHref } from "@/config/business";
import { PhoneIcon } from "@/components/Icons";

export default function NotFound() {
  const lang = usePathname()?.startsWith("/ru") ? "ru" : "uz";
  const t = getDict(lang);
  return <ErrorView code="404" title={t.errors.notFoundTitle} text={t.errors.notFoundText} home={t.errors.home} lang={lang} call={t.cta.callShort} />;
}

export function ErrorView(p: { code: string; title: string; text: string; home: string; lang: string; call: string; action?: React.ReactNode }) {
  return (
    <section className="wrap flex min-h-[60vh] flex-col justify-center py-20">
      <p className="text-6xl font-extrabold tracking-tight text-flame-500 md:text-8xl">{p.code}</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{p.title}</h1>
      <p className="mt-3 max-w-[52ch] text-lg text-ink-600">{p.text}</p>
      <div className="mt-8 grid gap-3 sm:flex">
        {p.action}
        <a href={`/${p.lang}`} className="btn-dark h-14 px-7">{p.home}</a>
        <a href={phoneHref} className="btn-primary h-14 px-7">
          <PhoneIcon size={20} strokeWidth={2.2} />
          {phoneDisplay}
        </a>
      </div>
    </section>
  );
}
