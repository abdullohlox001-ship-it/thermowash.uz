import { NextResponse, type NextRequest } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { clean, LIMITS, normalizePhone, validateLead, type LeadInput } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { dispatchLead, type Lead } from "@/lib/leads";
import { isLang } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 8 * 1024;
const MIN_FILL_MS = 2500;

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // ba'zi brauzerlar yubormaydi — boshqa himoyalar bor
  try {
    const o = new URL(origin).host;
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const allowed = [host, process.env.NEXT_PUBLIC_SITE_URL && new URL(process.env.NEXT_PUBLIC_SITE_URL).host];
    return allowed.includes(o);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json(403, { ok: false, error: "forbidden" });
  if (!(req.headers.get("content-type") || "").includes("application/json"))
    return json(415, { ok: false, error: "bad_request" });

  const ip = clientIp(req);
  const short = rateLimit(`s:${ip}`, 5, 10 * 60_000);
  const daily = rateLimit(`d:${ip}`, 20, 24 * 60 * 60_000);
  if (!short.ok || !daily.ok) {
    return json(429, { ok: false, error: "rate_limit" }, { "Retry-After": String(Math.max(short.retryAfter, daily.retryAfter)) });
  }

  let raw: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json(413, { ok: false, error: "bad_request" });
    raw = JSON.parse(text);
    if (!raw || typeof raw !== "object") throw new Error();
  } catch {
    return json(400, { ok: false, error: "bad_request" });
  }

  // Spam: honeypot maydoni to'ldirilgan yoki forma juda tez yuborilgan.
  // Botga "muvaffaqiyat" qaytaramiz — u qayta urinmasligi uchun.
  const elapsed = Number(raw.elapsed);
  if (clean(raw.website, 200) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.warn("[lead] spam blocked", ip);
    return json(200, { ok: true });
  }

  const input: LeadInput = {
    name: clean(raw.name, LIMITS.name),
    phone: clean(raw.phone, 30),
    service: clean(raw.service, 40),
    problem: clean(raw.problem, LIMITS.problem),
    location: clean(raw.location, LIMITS.location),
  };
  const errors = validateLead(input);
  if (Object.keys(errors).length) return json(422, { ok: false, error: "validation", fields: errors });

  const language = isLang(raw.language) ? raw.language : "uz";
  const source = clean(raw.source, 200).replace(/[^\w\-/.?=&%#]/g, "") || "/";

  const lead: Lead = {
    id: randomUUID().slice(0, 8),
    ...input,
    phone: normalizePhone(input.phone),
    language,
    created_at: new Date().toISOString(),
    source,
    ip_hash: createHash("sha256").update(ip + (process.env.IP_HASH_SALT || "")).digest("hex").slice(0, 16),
  };

  const { delivered } = await dispatchLead(lead);
  if (!delivered) return json(502, { ok: false, error: "server" });
  return json(200, { ok: true, id: lead.id });
}

export function GET() {
  return json(405, { ok: false, error: "method_not_allowed" }, { Allow: "POST" });
}
