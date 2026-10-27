/** Konversiya hodisalari. GA4 (gtag) va GTM (dataLayer) bilan ishlaydi. ID'lar .env da. */
export type ConversionEvent =
  | "phone_click"
  | "request_form_open"
  | "request_form_submit"
  | "telegram_click"
  | "service_click";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: ConversionEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) window.gtag("event", event, params);
    else if (window.dataLayer) window.dataLayer.push({ event, ...params });
  } catch {
    /* analytics hech qachon saytni buzmasligi kerak */
  }
}
