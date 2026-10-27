/**
 * Umumiy validatsiya — klientda ham, serverda ham ishlatiladi.
 * Общая валидация — используется и на клиенте, и на сервере.
 */
import { serviceOptionIds } from "@/content/services";

export type LeadInput = {
  name: string;
  phone: string;
  service: string;
  problem: string;
  location: string;
};

export type FieldErrorCode =
  | "nameRequired"
  | "nameShort"
  | "phoneRequired"
  | "phoneInvalid"
  | "serviceRequired"
  | "tooLong";

export type FieldErrors = Partial<Record<keyof LeadInput, FieldErrorCode>>;

export const LIMITS = { name: 60, problem: 600, location: 150 } as const;

/** Faqat 9 ta raqam (998 siz) qaytaradi */
export function phoneDigits(v: string): string {
  let d = (v || "").replace(/\D/g, "");
  if (d.length > 9 && d.startsWith("998")) d = d.slice(3);
  return d.slice(0, 9);
}

/** Kiritish maskasi (+998 prefiksi alohida ko'rsatiladi): "XX XXX XX XX" */
export function maskLocalPhone(v: string): string {
  const d = phoneDigits(v);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

/** O'zbekiston raqami: 9 ta raqam, birinchisi 0 yoki 1 emas */
export function isValidUzPhone(v: string): boolean {
  return /^[2-9]\d{8}$/.test(phoneDigits(v));
}

export function normalizePhone(v: string): string {
  return "+998" + phoneDigits(v);
}

/** Boshqaruv belgilarini olib tashlash, bo'sh joylarni qisqartirish */
export function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, max + 1);
}

export function validateLead(input: LeadInput): FieldErrors {
  const e: FieldErrors = {};
  const name = input.name.trim();
  if (!name) e.name = "nameRequired";
  else if (name.length < 2) e.name = "nameShort";
  else if (name.length > LIMITS.name) e.name = "tooLong";

  const digits = phoneDigits(input.phone);
  if (!digits) e.phone = "phoneRequired";
  else if (!isValidUzPhone(input.phone)) e.phone = "phoneInvalid";

  if (!input.service || !serviceOptionIds.includes(input.service)) e.service = "serviceRequired";
  if (input.problem.length > LIMITS.problem) e.problem = "tooLong";
  if (input.location.length > LIMITS.location) e.location = "tooLong";
  return e;
}
