// Rate Limiting Layer: Upstash Redis REST when configured, in-memory sliding window fallback

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store: Map<key, RateLimitRecord>
const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
}

export async function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If Upstash Redis REST credentials exist, use Upstash
  if (upstashUrl && upstashToken) {
    try {
      const now = Date.now();
      const clearBefore = now - windowMs;
      const redisKey = `ratelimit:${key}`;

      // Pipeline using Upstash REST: ZREMRANGEBYSCORE, ZADD, ZCARD, EXPIRE
      const pipelineRes = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['ZREMRANGEBYSCORE', redisKey, 0, clearBefore],
          ['ZADD', redisKey, now, `${now}-${Math.random()}`],
          ['ZCARD', redisKey],
          ['EXPIRE', redisKey, Math.ceil(windowMs / 1000)],
        ]),
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        // Index 2 is result of ZCARD
        const currentCount = typeof results[2]?.result === 'number' ? results[2].result : 1;
        const resetSeconds = Math.ceil((now + windowMs) / 1000);
        const remaining = Math.max(0, limit - currentCount);

        return {
          success: currentCount <= limit,
          limit,
          remaining,
          reset: resetSeconds,
        };
      }
    } catch (err) {
      console.warn('[RateLimit] Upstash Redis request failed, falling back to memory store:', err);
    }
  }

  // 2. Fallback: In-memory sliding window
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0] || now;
    const resetSeconds = Math.ceil((oldest + windowMs) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = limit - record.timestamps.length;
  const resetSeconds = Math.ceil((now + windowMs) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset: resetSeconds,
  };
}

/**
 * Utility to clear the in-memory rate limiter (used in test suites)
 */
export function resetRateLimits(): void {
  memoryStore.clear();
}
