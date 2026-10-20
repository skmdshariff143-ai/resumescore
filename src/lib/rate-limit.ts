/**
 * In-memory sliding-window rate limiter for ResumeScore API routes.
 *
 * NOTE: This in-memory sliding-window rate limiter is suitable for single-instance deployments.
 * In a multi-instance, clustered, or serverless deployment (e.g., Vercel, AWS Lambda, Cloudflare Workers),
 * in-memory state is not shared across instances.
 * For distributed/serverless scale, replace or back this store with a distributed store
 * such as Redis or Upstash (@upstash/ratelimit).
 */

import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit?: number;
  /** Window size in milliseconds (defaults to 60,000 ms / 1 minute) */
  windowMs?: number;
  /** Unique key prefix to segment different routes/buckets */
  keyPrefix?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms
  retryAfterSeconds: number;
}

// In-memory store: key -> array of request timestamps (ms)
// Uses globalThis to ensure a single shared store across hot-reloads and route evaluations
const globalForRateLimit = globalThis as unknown as {
  __rateLimitStore?: Map<string, number[]>;
};

const rateLimitStore =
  globalForRateLimit.__rateLimitStore ?? new Map<string, number[]>();

if (!globalForRateLimit.__rateLimitStore) {
  globalForRateLimit.__rateLimitStore = rateLimitStore;
}

/**
 * Extracts client IP from standard proxy headers (X-Forwarded-For, X-Real-IP)
 * with fallback to local identifier.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Checks sliding window rate limit for the given request.
 */
export function checkRateLimit(req: NextRequest, options: RateLimitOptions = {}): RateLimitResult {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 60_000;
  const prefix = options.keyPrefix ?? 'global';
  const ip = getClientIp(req);
  const key = `${prefix}:${ip}`;

  const now = Date.now();
  const windowStart = now - windowMs;

  // Periodically prune stale keys to prevent unbounded memory growth
  if (rateLimitStore.size > 1000) {
    for (const [k, tsList] of rateLimitStore.entries()) {
      if (tsList.length === 0 || tsList[tsList.length - 1] <= windowStart) {
        rateLimitStore.delete(k);
      }
    }
  }

  const timestamps = rateLimitStore.get(key) || [];
  if (!rateLimitStore.has(key) && rateLimitStore.size >= 10_000) {
    return { success: false, limit, remaining: 0, reset: now + windowMs, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }
  // Evict timestamps outside the active sliding window
  const activeTimestamps = timestamps.filter((t) => t > windowStart);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    // Update store with pruned list
    rateLimitStore.set(key, activeTimestamps);

    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
      retryAfterSeconds,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(key, activeTimestamps);

  return {
    success: true,
    limit,
    remaining: limit - activeTimestamps.length,
    reset: now + windowMs,
    retryAfterSeconds: 0,
  };
}

/**
 * Generates an HTTP 429 Too Many Requests response with standard rate limit headers.
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait before making additional requests.',
      retryAfter: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
      },
    }
  );
}

/**
 * Reset all or specific keys in the rate limit store (useful for automated testing).
 */
export function resetRateLimitStore(keyPrefix?: string): void {
  if (!keyPrefix) {
    rateLimitStore.clear();
    return;
  }
  for (const key of rateLimitStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      rateLimitStore.delete(key);
    }
  }
}
