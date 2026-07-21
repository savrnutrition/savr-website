import type { NextRequest } from "next/server";

/**
 * In-memory sliding-window-ish (fixed window) rate limiter keyed by IP.
 *
 * Caveat: this app has no login/session system and runs on Vercel's
 * serverless functions, so state is per-instance, not shared across every
 * edge/region or cold start — it will not perfectly enforce a global limit
 * under high distributed load. It does meaningfully stop the common case
 * (a single attacker/script hammering one endpoint) without requiring an
 * external store (e.g. Upstash Redis). Swap this for a Redis-backed limiter
 * if/when traffic justifies it.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  // Cheap bound on memory growth — sweep stale entries once the map gets large.
  if (buckets.size > 5000) cleanup(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
