"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Barcha tel:, t.me va data-track havolalarini bitta joyda kuzatadi */
export default function ClickTracker() {
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const placement = a.closest("[data-section]")?.getAttribute("data-section") || undefined;
      if (href.startsWith("tel:")) track("phone_click", { placement });
      else if (/^https:\/\/t\.me\//.test(href)) track("telegram_click", { placement });
      const svc = a.getAttribute("data-track-service");
      if (svc) track("service_click", { service: svc, placement });
    };
    document.addEventListener("click", on, { capture: true });
    return () => document.removeEventListener("click", on, { capture: true });
  }, []);
  return null;
}
