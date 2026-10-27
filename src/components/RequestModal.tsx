"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import RequestForm, { type FormStrings } from "./RequestForm";
import { CloseIcon } from "./Icons";
import { track } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";

type OpenOpts = { service?: string; problem?: string; placement?: string };
const Ctx = createContext<(o?: OpenOpts) => void>(() => {});

type ProviderProps = {
  children: ReactNode;
  lang: Lang;
  title: string;
  lead: string;
  closeLabel: string;
  t: FormStrings;
  options: { id: string; label: string }[];
  phoneDisplay: string;
  phoneHref: string;
  privacyHref: string;
};

export function RequestProvider({ children, ...p }: ProviderProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [opts, setOpts] = useState<OpenOpts | null>(null);
  const [n, setN] = useState(0);

  const open = useCallback((o: OpenOpts = {}) => {
    setOpts(o);
    setN((x) => x + 1);
    track("request_form_open", { placement: o.placement, service: o.service });
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d || !opts) return;
    if (!d.open) {
      if (typeof d.showModal === "function") d.showModal();
      else d.setAttribute("open", "");
      document.documentElement.classList.add("overflow-hidden");
    }
  }, [opts, n]);

  function close() {
    ref.current?.close();
  }

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        aria-labelledby="req-title"
        className="req-dialog"
        onClose={() => {
          document.documentElement.classList.remove("overflow-hidden");
          setOpts(null);
        }}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
      >
        {opts && (
          <div className="relative max-h-[inherit] overflow-y-auto overscroll-contain p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="req-title" className="text-2xl font-bold tracking-tight text-ink-900">{p.title}</h2>
                <p className="mt-1 text-sm text-ink-600">{p.lead}</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded text-ink-600 hover:bg-paper hover:text-ink-900"
                aria-label={p.closeLabel}
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <RequestForm
              key={n}
              lang={p.lang}
              t={p.t}
              options={p.options}
              phoneDisplay={p.phoneDisplay}
              phoneHref={p.phoneHref}
              privacyHref={p.privacyHref}
              defaultService={opts.service}
              defaultProblem={opts.problem}
              placement={opts.placement ?? "modal"}
            />
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}

export function useRequest() {
  return useContext(Ctx);
}

/**
 * Arizani ochuvchi tugma. JS yo'q bo'lsa — sahifadagi #request formaga o'tadi.
 */
export function RequestButton({
  children,
  className,
  service,
  problem,
  placement,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  service?: string;
  problem?: string;
  placement: string;
  ariaLabel?: string;
}) {
  const open = useRequest();
  return (
    <a
      href="#request"
      role="button"
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        open({ service, problem, placement });
      }}
    >
      {children}
    </a>
  );
}
