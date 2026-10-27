import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { escapeHtml, sendTelegram, telegramConfigured } from "./telegram";
import { requestServiceOptions } from "@/content/services";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Lang } from "./i18n";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  service: string;
  problem: string;
  location: string;
  language: Lang;
  created_at: string;
  source: string;
  ip_hash?: string;
};

/**
 * Arizani yetkazish kanallari.
 * Yangi kanal (CRM, email, Google Sheets) qo'shish uchun shu massivga funksiya qo'shing.
 * Bazasiz: asosiy kanal — Telegram, zaxira — JSONL fayl (ixtiyoriy).
 */
type Channel = { name: string; enabled: () => boolean; send: (lead: Lead) => Promise<boolean> };

const channels: Channel[] = [
  { name: "telegram", enabled: telegramConfigured, send: (l) => sendTelegram(formatTelegram(l)) },
  {
    name: "file",
    enabled: () => process.env.LEADS_LOG_FILE !== "off",
    send: async (l) => {
      // standalone server.js cwd'ni .next/standalone ga o'zgartiradi — loyiha ildiziga qaytamiz,
      // aks holda har build'da fayl o'chib ketadi.
      const root = process.cwd().replace(/[\\/]\.next[\\/]standalone$/, "");
      // Vercel kabi serverless platformalarda faqat /tmp ga yozish mumkin
      const fallback = process.env.VERCEL ? "/tmp/leads.jsonl" : path.join(root, "data", "leads.jsonl");
      const file = process.env.LEADS_LOG_FILE || fallback;
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, JSON.stringify(l) + "\n", "utf8");
      return true;
    },
  },
  {
    name: "supabase",
    enabled: () => isSupabaseConfigured,
    send: async (l) => {
      if (!supabase) return false;
      const { error } = await supabase.from("leads").insert([
        {
          id: l.id,
          name: l.name,
          phone: l.phone,
          service: l.service,
          problem: l.problem,
          location: l.location,
          language: l.language,
          created_at: l.created_at,
          source: l.source,
          ip_hash: l.ip_hash,
        },
      ]);
      if (error) {
        console.error("[lead:supabase]", error.message);
        return false;
      }
      return true;
    },
  },
];

export async function dispatchLead(lead: Lead) {
  const active = channels.filter((c) => c.enabled());
  const results = await Promise.all(
    active.map(async (c) => {
      try {
        return { name: c.name, ok: await c.send(lead) };
      } catch (e) {
        console.error(`[lead:${c.name}]`, (e as Error).message);
        return { name: c.name, ok: false };
      }
    }),
  );
  const delivered = results.some((r) => r.ok);
  if (!delivered) console.error("[lead] NOT DELIVERED", JSON.stringify(lead));
  else console.info("[lead]", lead.id, results.map((r) => `${r.name}:${r.ok ? "ok" : "fail"}`).join(" "));
  return { delivered, results };
}

function formatTelegram(l: Lead): string {
  const ru = l.language === "ru";
  const svc = requestServiceOptions.find((o) => o.id === l.service)?.label[l.language] ?? l.service;
  const time = new Intl.DateTimeFormat(ru ? "ru-RU" : "uz-UZ", {
    timeZone: "Asia/Tashkent",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(l.created_at));
  const e = escapeHtml;
  const dash = "—";
  const rows: [string, string][] = ru
    ? [
        ["Имя", e(l.name)],
        ["Телефон", `<a href="tel:${l.phone}">${l.phone}</a>`],
        ["Услуга", e(svc)],
        ["Проблема", e(l.problem) || dash],
        ["Адрес", e(l.location) || dash],
        ["Язык", "Русский"],
        ["Время", time],
        ["Страница", e(l.source)],
      ]
    : [
        ["Ism", e(l.name)],
        ["Telefon", `<a href="tel:${l.phone}">${l.phone}</a>`],
        ["Xizmat", e(svc)],
        ["Muammo", e(l.problem) || dash],
        ["Manzil", e(l.location) || dash],
        ["Til", "O‘zbekcha"],
        ["Vaqt", time],
        ["Sahifa", e(l.source)],
      ];
  const head = ru ? "🔥 <b>НОВАЯ ЗАЯВКА</b>" : "🔥 <b>YANGI ZAYAVKA</b>";
  return `${head}\n\n${rows.map(([k, v]) => `<b>${k}:</b> ${v}`).join("\n")}\n\n#${l.id}`;
}
