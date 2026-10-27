"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { RequestButton } from "./RequestModal";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons";
import type { Lang } from "@/lib/i18n";

type Props = {
  lang: Lang;
  name: string;
  /** secondary: true — desktop menyuda ko‘rinmaydi (mobil menyu va footerda bor) */
  nav: { href: string; label: string; secondary?: boolean }[];
  phoneDisplay: string;
  phoneHref: string;
  hours: string;
  labels: { menu: string; close: string; call: string; request: string; callShort: string; langSwitch: string; home: string };
};

export default function Header(p: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("overflow-hidden");
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 transition-shadow ${
        scrolled || open ? "border-line shadow-[0_1px_12px_rgba(14,23,38,0.08)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-site items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:h-[76px]">
        <a href={`/${p.lang}`} aria-label={`${p.name} — ${p.labels.home}`} className="mr-auto shrink-0 rounded">
          <Logo name={p.name} />
        </a>

        <nav aria-label="Main" className="hidden min-w-0 shrink overflow-hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {p.nav.map((n) => (
              <li key={n.href} className={n.secondary ? "hidden" : undefined}>
                <a href={n.href} className="whitespace-nowrap rounded px-1.5 py-2 text-[0.875rem] 2xl:px-2.5 font-medium text-ink-700 xl:text-[0.9rem] hover:text-ink-900 hover:underline hover:decoration-flame-500 hover:decoration-2 hover:underline-offset-8">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span className="shrink-0">
          <LanguageSwitcher lang={p.lang} label={p.labels.langSwitch} />
        </span>

        <a href={p.phoneHref} className="hidden shrink-0 flex-col items-end whitespace-nowrap leading-tight lg:flex">
          <span className="text-[0.98rem] font-extrabold tracking-tight text-ink-900 2xl:text-[1.05rem]">{p.phoneDisplay}</span>
          <span className="hidden text-xs text-ink-600 lg:block xl:hidden 2xl:block">{p.hours}</span>
        </a>

        <RequestButton placement="header" className="btn-primary hidden h-11 shrink-0 whitespace-nowrap px-4 text-sm lg:inline-flex 2xl:px-5">
          {p.labels.call}
        </RequestButton>

        <a
          href={p.phoneHref}
          aria-label={`${p.labels.callShort}: ${p.phoneDisplay}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded bg-flame-500 text-ink-950 lg:hidden"
        >
          <PhoneIcon size={21} strokeWidth={2.1} />
        </a>

        <button
          ref={menuBtn}
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded border border-line text-ink-900 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? p.labels.close : p.labels.menu}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

    </header>

    {open && (
      <div
        id="mobile-menu"
        ref={panel}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 lg:top-[76px] xl:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="divide-y divide-line">
            {p.nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="flex min-h-[56px] items-center text-lg font-semibold text-ink-900">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 space-y-3">
          <a href={p.phoneHref} className="btn-primary h-14 w-full text-base">
            <PhoneIcon size={20} strokeWidth={2.1} />
            {p.phoneDisplay}
          </a>
          <RequestButton placement="mobile_menu" className="btn-dark h-14 w-full text-base">
            {p.labels.request}
          </RequestButton>
          <p className="pt-1 text-center text-sm text-ink-600">{p.hours}</p>
        </div>
      </div>
    )}
    </>
  );
}
