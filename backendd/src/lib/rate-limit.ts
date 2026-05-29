// src/lib/rate-limit.ts
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, maxReq: number, windowMs: number) {
  const now = Date.now();
  const r = memoryStore.get(key);
  if (!r || now > r.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }
  if (r.count >= maxReq) return { success: false };
  r.count += 1;
  return { success: true };
}

// Only attempt Redis if both vars are present and look real
const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN &&
  process.env.UPSTASH_REDIS_REST_TOKEN !== "your_token_here" &&
  process.env.UPSTASH_REDIS_REST_TOKEN !== "********" &&
  process.env.UPSTASH_REDIS_REST_URL.startsWith("https://");

let _upstash: Record<string, { limit: (k: string) => Promise<{ success: boolean }> }> | null = null;
let _upstashFailed = false; // once it fails, stop retrying

async function getUpstash() {
  if (!hasRedis || _upstashFailed) return null;
  if (_upstash) return _upstash;
  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    // Quick health check before trusting it
    await redis.ping();
    _upstash = {
      api:      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 m"),  prefix: "danho:api" }),
      chat:     new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"),  prefix: "danho:chat" }),
      feedback: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(1,  "6 h"),    prefix: "danho:feedback" }),
      auth:     new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,  "15 m"), prefix: "danho:auth" }),
    };
    console.log("✅ Upstash Redis connected");
    return _upstash;
  } catch (err) {
    _upstashFailed = true;
    console.warn("⚠ Upstash unavailable — using in-memory rate limiting:", (err as Error).message);
    return null;
  }
}

async function limit(prefix: string, key: string, maxReq: number, windowMs: number) {
  try {
    const u = await getUpstash();
    if (u?.[prefix]) return u[prefix].limit(key);
  } catch {
    // fallthrough to memory
  }
  return memoryRateLimit(`${prefix}:${key}`, maxReq, windowMs);
}

export const apiRateLimit      = { limit: (k: string) => limit("api",      k, 20, 60_000) };
export const chatRateLimit     = { limit: (k: string) => limit("chat",     k, 10, 60_000) };
export const feedbackRateLimit = { limit: (k: string) => limit("feedback", k,  1, 6*60*60_000) };
export const authRateLimit     = { limit: (k: string) => limit("auth",     k,  5, 15*60_000) };