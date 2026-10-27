"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { maskLocalPhone, phoneDigits, validateLead, LIMITS, type FieldErrors, type LeadInput } from "@/lib/validation";
import { track } from "@/lib/analytics";
import type { Lang } from "@/lib/i18n";
import { CheckIcon, PhoneIcon, WarnDotIcon } from "./Icons";

export type FormStrings = {
  name: string; namePh: string; phone: string; service: string; servicePh: string;
  problem: string; problemPh: string; location: string; locationPh: string; optional: string;
  submit: string; sending: string; consent: string; privacy: string;
  successTitle: string; successText: string; successAgain: string; urgent: string;
  errors: Record<string, string>;
};

type Props = {
  lang: Lang;
  t: FormStrings;
  options: { id: string; label: string }[];
  phoneDisplay: string;
  phoneHref: string;
  privacyHref: string;
  defaultService?: string;
  defaultProblem?: string;
  /** qaysi joydan yuborildi (analytics + Telegram uchun) */
  placement: string;
  autoFocus?: boolean;
};

type Status = "idle" | "sending" | "success" | "error";

export default function RequestForm(p: Props) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [v, setV] = useState<LeadInput>({
    name: "",
    phone: "",
    service: p.defaultService ?? "",
    problem: p.defaultProblem ?? "",
    location: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LeadInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string>("");
  const [hp, setHp] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const withPrefix = (local: string) => (phoneDigits(local) ? "+998" + phoneDigits(local) : "");
  const fullPhone = () => withPrefix(v.phone);

  function set<K extends keyof LeadInput>(k: K, val: string) {
    const next = { ...v, [k]: k === "phone" ? maskLocalPhone(val) : val };
    setV(next);
    if (touched[k]) setErrors((e) => ({ ...e, [k]: validateLead({ ...next, phone: withPrefix(next.phone) })[k] }));
  }

  function blur(k: keyof LeadInput) {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validateLead({ ...v, phone: fullPhone() })[k] }));
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    setFormError("");
    const payload = { ...v, phone: fullPhone() };
    const errs = validateLead(payload);
    setErrors(errs);
    setTouched({ name: true, phone: true, service: true, problem: true, location: true });
    const firstBad = (["name", "phone", "service", "problem", "location"] as const).find((k) => errs[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus("error");
      setFormError(p.t.errors.network);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          language: p.lang,
          source: `${window.location.pathname}#${p.placement}`,
          website: hp,
          elapsed: Date.now() - startedAt.current,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        track("request_form_submit", { service: v.service, placement: p.placement, language: p.lang });
        return;
      }
      setStatus("error");
      if (res.status === 422 && data.fields) {
        setErrors(data.fields);
        setFormError("");
        setStatus("idle");
      } else if (res.status === 429) setFormError(p.t.errors.rateLimit);
      else setFormError(p.t.errors.server);
    } catch {
      setStatus("error");
      setFormError(navigator.onLine === false ? p.t.errors.network : p.t.errors.server);
    }
  }

  if (status === "success") {
    return (
      <div className="py-4 text-center" role="status" aria-live="polite">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-ok/10 text-ok">
          <CheckIcon size={30} strokeWidth={2.4} />
        </div>
        <p className="text-xl font-bold text-ink-900">{p.t.successTitle}</p>
        <p className="mt-1 text-ink-600">{p.t.successText}</p>
        <p className="mt-6 text-sm text-ink-600">{p.t.urgent}</p>
        <a href={p.phoneHref} className="mt-1 inline-block text-lg font-bold text-ink-900 underline decoration-flame-500 decoration-2 underline-offset-4">
          {p.phoneDisplay}
        </a>
        <div>
          <button
            type="button"
            className="mt-6 text-sm font-semibold text-flame-700 underline underline-offset-4"
            onClick={() => {
              setV({ name: "", phone: "", service: "", problem: "", location: "" });
              setTouched({});
              setErrors({});
              startedAt.current = Date.now();
              setStatus("idle");
            }}
          >
            {p.t.successAgain}
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof LeadInput) => (errors[k] ? p.t.errors[errors[k]!] : "");
  const field = "block w-full rounded border bg-white px-3.5 text-base text-ink-900 placeholder:text-ink-400 transition-colors focus:border-ink-900 focus:outline-none focus:ring-2 focus:ring-flame-500/40";
  const border = (k: keyof LeadInput) => (errors[k] ? "border-red-600" : "border-line");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" aria-busy={status === "sending"}>
      {/* Honeypot — odamlar ko'rmaydi */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>

      <div>
        <label htmlFor={id("name")} className="mb-1.5 block text-sm font-semibold text-ink-800">{p.t.name}</label>
        <input
          id={id("name")} name="name" type="text" autoComplete="name" enterKeyHint="next"
          maxLength={LIMITS.name} placeholder={p.t.namePh} autoFocus={p.autoFocus}
          className={`${field} ${border("name")} h-12`}
          value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? id("name-e") : undefined}
        />
        {errors.name && <p id={id("name-e")} className="mt-1 text-sm text-red-700">{err("name")}</p>}
      </div>

      <div>
        <label htmlFor={id("phone")} className="mb-1.5 block text-sm font-semibold text-ink-800">{p.t.phone}</label>
        <div className={`flex h-12 items-stretch overflow-hidden rounded border bg-white focus-within:border-ink-900 focus-within:ring-2 focus-within:ring-flame-500/40 ${border("phone")}`}>
          <span className="flex select-none items-center border-r border-line bg-paper px-3 text-base font-semibold text-ink-700">+998</span>
          <input
            id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" enterKeyHint="next"
            placeholder="90 123 45 67" maxLength={16}
            className="w-full min-w-0 bg-transparent px-3 text-base tracking-wide text-ink-900 placeholder:text-ink-400 focus:outline-none"
            value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? id("phone-e") : undefined}
          />
        </div>
        {errors.phone && <p id={id("phone-e")} className="mt-1 text-sm text-red-700">{err("phone")}</p>}
      </div>

      <div>
        <label htmlFor={id("service")} className="mb-1.5 block text-sm font-semibold text-ink-800">{p.t.service}</label>
        <div className="relative">
          <select
            id={id("service")} name="service"
            className={`${field} ${border("service")} h-12 appearance-none pr-10 ${v.service ? "" : "text-ink-400"}`}
            value={v.service} onChange={(e) => set("service", e.target.value)} onBlur={() => blur("service")}
            aria-invalid={!!errors.service} aria-describedby={errors.service ? id("service-e") : undefined}
          >
            <option value="" disabled>{p.t.servicePh}</option>
            {p.options.map((o) => (
              <option key={o.id} value={o.id} className="text-ink-900">{o.label}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
        </div>
        {errors.service && <p id={id("service-e")} className="mt-1 text-sm text-red-700">{err("service")}</p>}
      </div>

      <div>
        <label htmlFor={id("problem")} className="mb-1.5 block text-sm font-semibold text-ink-800">
          {p.t.problem} <span className="font-normal text-ink-400">({p.t.optional})</span>
        </label>
        <textarea
          id={id("problem")} name="problem" rows={3} maxLength={LIMITS.problem} placeholder={p.t.problemPh}
          className={`${field} ${border("problem")} resize-y py-3`}
          value={v.problem} onChange={(e) => set("problem", e.target.value)} onBlur={() => blur("problem")}
        />
        {errors.problem && <p className="mt-1 text-sm text-red-700">{err("problem")}</p>}
      </div>

      <div>
        <label htmlFor={id("location")} className="mb-1.5 block text-sm font-semibold text-ink-800">
          {p.t.location} <span className="font-normal text-ink-400">({p.t.optional})</span>
        </label>
        <input
          id={id("location")} name="location" type="text" autoComplete="address-level2" enterKeyHint="send"
          maxLength={LIMITS.location} placeholder={p.t.locationPh}
          className={`${field} ${border("location")} h-12`}
          value={v.location} onChange={(e) => set("location", e.target.value)} onBlur={() => blur("location")}
        />
      </div>

      {formError && (
        <div role="alert" className="flex gap-2.5 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <WarnDotIcon size={18} className="mt-0.5 shrink-0" />
          <div>
            {formError}{" "}
            <a href={p.phoneHref} className="whitespace-nowrap font-bold underline">{p.phoneDisplay}</a>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary h-14 w-full text-base disabled:cursor-wait disabled:opacity-80"
      >
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" aria-hidden="true" />
            {p.t.sending}
          </>
        ) : (
          p.t.submit
        )}
      </button>

      <p className="text-xs leading-relaxed text-ink-600">
        {p.t.consent}{" "}
        <a href={p.privacyHref} className="underline underline-offset-2 hover:text-ink-900">{p.t.privacy}</a>
      </p>

      <p className="flex items-center justify-center gap-2 border-t border-line pt-4 text-sm text-ink-600 lg:hidden">
        <PhoneIcon size={16} />
        <a href={p.phoneHref} className="font-bold text-ink-900">{p.phoneDisplay}</a>
      </p>
    </form>
  );
}
