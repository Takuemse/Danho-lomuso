// src/lib/rate-limit.ts

// In-memory store as fallback when Redis is not configured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean } {
  const now = Date.now();
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= maxRequests) {
    return { success: false };
  }

  record.count += 1;
  return { success: true };
}

// Check if Upstash is configured
const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN &&
  process.env.UPSTASH_REDIS_REST_URL !== "https://your-url.upstash.io";

let upstashLimits: {
  apiRateLimit: { limit: (key: string) => Promise<{ success: boolean }> };
  chatRateLimit: { limit: (key: string) => Promise<{ success: boolean }> };
  feedbackRateLimit: { limit: (key: string) => Promise<{ success: boolean }> };
  authRateLimit: { limit: (key: string) => Promise<{ success: boolean }> };
} | null = null;

async function getUpstashLimits() {
  if (!hasRedis) return null;
  if (upstashLimits) return upstashLimits;

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    upstashLimits = {
      apiRateLimit: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        prefix: "danho:api",
      }),
      chatRateLimit: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 m"),
        prefix: "danho:chat",
      }),
      feedbackRateLimit: new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(1, "6 h"),
        prefix: "danho:feedback",
      }),
      authRateLimit: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        prefix: "danho:auth",
      }),
    };

    return upstashLimits;
  } catch {
    return null;
  }
}

// Exported rate limiters — work with or without Redis
export const apiRateLimit = {
  limit: async (key: string) => {
    const limits = await getUpstashLimits();
    if (limits) return limits.apiRateLimit.limit(key);
    return memoryRateLimit(`api:${key}`, 20, 60_000);
  },
};

export const chatRateLimit = {
  limit: async (key: string) => {
    const limits = await getUpstashLimits();
    if (limits) return limits.chatRateLimit.limit(key);
    return memoryRateLimit(`chat:${key}`, 10, 60_000);
  },
};

export const feedbackRateLimit = {
  limit: async (key: string) => {
    const limits = await getUpstashLimits();
    if (limits) return limits.feedbackRateLimit.limit(key);
    return memoryRateLimit(`feedback:${key}`, 1, 6 * 60 * 60_000);
  },
};

export const authRateLimit = {
  limit: async (key: string) => {
    const limits = await getUpstashLimits();
    if (limits) return limits.authRateLimit.limit(key);
    return memoryRateLimit(`auth:${key}`, 5, 15 * 60_000);
  },
};