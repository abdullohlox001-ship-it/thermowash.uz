/**
 * Oddiy xotiradagi (in-memory) rate limiter — bazasiz.
 * Bitta Node jarayoni uchun yetarli (PM2 fork / Docker 1 konteyner).
 * Bir nechta instansiya bo'lsa — Nginx limit_req ham yoqilgan (deploy/nginx.conf).
 */
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count++;
  if (b.count > limit) return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}
