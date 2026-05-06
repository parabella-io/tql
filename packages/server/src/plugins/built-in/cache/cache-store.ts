export type CacheEntry<T = unknown> = {
  value: T;
  expiresAt: number;
  tags: string[];
  createdAt: number;
};

export type CacheStoreSetOptions = {
  ttlMs: number;
  tags?: string[];
};

export interface CacheStore {
  get<T = unknown>(key: string): Promise<CacheEntry<T> | null>;
  set<T = unknown>(key: string, value: T, options: CacheStoreSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateTags(tags: string[]): Promise<void>;
  clear(): Promise<void>;
}
