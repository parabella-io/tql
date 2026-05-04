export type RateLimitConsumeResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export interface RateLimitStore {
  consume(
    key: string,
    cost: number,
    opts: { capacity: number; refillPerSec: number },
  ): Promise<RateLimitConsumeResult> | RateLimitConsumeResult;
}

