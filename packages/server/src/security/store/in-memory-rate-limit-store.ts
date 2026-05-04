import type { RateLimitStore } from './rate-limit-store.js';

export type InMemoryRateLimitStoreOptions = {
  now?: () => number;
  sweepIntervalMs?: number;
  maxIdleMs?: number;
};

type Bucket = {
  tokens: number;
  lastRefill: number;
  lastSeen: number;
};

export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, Bucket>();

  private readonly now: () => number;

  private readonly maxIdleMs: number;

  private lastSweep: number;

  private readonly sweepIntervalMs: number;

  constructor(options: InMemoryRateLimitStoreOptions = {}) {
    this.now = options.now ?? (() => performance.now());
    this.sweepIntervalMs = options.sweepIntervalMs ?? 60_000;
    this.maxIdleMs = options.maxIdleMs ?? 5 * 60_000;
    this.lastSweep = this.now();
  }

  consume(key: string, cost: number, opts: { capacity: number; refillPerSec: number }) {
    const now = this.now();

    this.sweep(now);

    const existing = this.buckets.get(key);
    const bucket = existing ?? { tokens: opts.capacity, lastRefill: now, lastSeen: now };
    const elapsedSec = Math.max(0, (now - bucket.lastRefill) / 1000);
    const refilled = Math.min(opts.capacity, bucket.tokens + elapsedSec * opts.refillPerSec);

    bucket.tokens = refilled;
    bucket.lastRefill = now;
    bucket.lastSeen = now;

    if (bucket.tokens < cost) {
      this.buckets.set(key, bucket);

      const missing = cost - bucket.tokens;

      const retryAfterMs = opts.refillPerSec > 0 ? Math.ceil((missing / opts.refillPerSec) * 1000) : Number.POSITIVE_INFINITY;

      return {
        allowed: false,
        remaining: Math.floor(bucket.tokens),
        retryAfterMs,
      };
    }

    bucket.tokens -= cost;

    this.buckets.set(key, bucket);

    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      retryAfterMs: 0,
    };
  }

  private sweep(now: number): void {
    if (now - this.lastSweep < this.sweepIntervalMs) {
      return;
    }

    this.lastSweep = now;

    for (const [key, bucket] of this.buckets) {
      if (now - bucket.lastSeen > this.maxIdleMs) {
        this.buckets.delete(key);
      }
    }
  }
}
