"use client";

import { usePathname } from "next/navigation";
import { LANGS, langMeta, type Lang } from "@/lib/i18n";
import { translateServicePath } from "@/content/services";

export function switchPath(path: string, to: Lang) {
  const svc = translateServicePath(path, to);
  if (svc) return svc;
  return path.replace(/^\/(uz|ru)(?=\/|$)/, `/${to}`) || `/${to}`;
}

export default function LanguageSwitcher({ lang, label, tone = "light" }: { lang: Lang; label: string; tone?: "light" | "dark" }) {
  const path = usePathname() || `/${lang}`;
  const base = tone === "light" ? "border-line bg-paper" : "border-ink-700 bg-ink-800";
  return (
    <nav aria-label={label} className={`inline-flex h-11 items-center rounded border p-1 ${base}`}>
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <a
            key={l}
            href={switchPath(path, l)}
            hrefLang={langMeta[l].htmlLang}
            lang={langMeta[l].htmlLang}
            aria-current={active ? "true" : undefined}
            title={langMeta[l].label}
            className={`grid h-full min-w-[2.3rem] sm:min-w-[2.6rem] place-items-center rounded-[4px] px-2 text-sm font-bold transition-colors ${
              active
                ? tone === "light" ? "bg-ink-900 text-white" : "bg-white text-ink-900"
                : tone === "light" ? "text-ink-600 hover:text-ink-900" : "text-ink-300 hover:text-white"
            }`}
          >
            {langMeta[l].short}
          </a>
        );
      })}
    </nav>
  );
}
