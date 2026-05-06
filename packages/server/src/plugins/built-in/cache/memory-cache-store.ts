import type { CacheEntry, CacheStore, CacheStoreSetOptions } from './cache-store.js';

export type MemoryCacheStoreOptions = {
  maxEntries?: number;
};

export const memoryCacheStore = (options: MemoryCacheStoreOptions = {}): CacheStore => {
  return new MemoryCacheStore(options);
};

class MemoryCacheStore implements CacheStore {
  private readonly entries = new Map<string, CacheEntry>();

  private readonly keysByTag = new Map<string, Set<string>>();

  constructor(private readonly options: MemoryCacheStoreOptions) {}

  public async get<T = unknown>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.deleteSync(key);
      return null;
    }

    // Refresh insertion order for naive LRU eviction.
    this.entries.delete(key);
    
    this.entries.set(key, entry);

    return entry as CacheEntry<T>;
  }

  public async set<T = unknown>(key: string, value: T, options: CacheStoreSetOptions): Promise<void> {
    this.deleteSync(key);

    const entry: CacheEntry<T> = {
      value,
      tags: unique(options.tags ?? []),
      createdAt: Date.now(),
      expiresAt: Date.now() + options.ttlMs,
    };

    this.entries.set(key, entry);

    for (const tag of entry.tags) {
      let keys = this.keysByTag.get(tag);

      if (!keys) {
        keys = new Set();
        this.keysByTag.set(tag, keys);
      }

      keys.add(key);
    }

    this.enforceMaxEntries();
  }

  public async delete(key: string): Promise<void> {
    this.deleteSync(key);
  }

  public async invalidateTags(tags: string[]): Promise<void> {
    for (const tag of unique(tags)) {
      const keys = this.keysByTag.get(tag);

      if (!keys) {
        continue;
      }

      for (const key of Array.from(keys)) {
        this.deleteSync(key);
      }
    }
  }

  public async clear(): Promise<void> {
    this.entries.clear();
    this.keysByTag.clear();
  }

  private deleteSync(key: string): void {
    const entry = this.entries.get(key);

    if (!entry) {
      return;
    }

    this.entries.delete(key);

    for (const tag of entry.tags) {
      const keys = this.keysByTag.get(tag);

      if (!keys) {
        continue;
      }

      keys.delete(key);

      if (keys.size === 0) {
        this.keysByTag.delete(tag);
      }
    }
  }

  private enforceMaxEntries(): void {
    const maxEntries = this.options.maxEntries;

    if (maxEntries === undefined || maxEntries <= 0) {
      return;
    }

    while (this.entries.size > maxEntries) {
      const oldestKey = this.entries.keys().next().value as string | undefined;

      if (oldestKey === undefined) {
        return;
      }

      this.deleteSync(oldestKey);
    }
  }
}

const unique = (values: string[]): string[] => Array.from(new Set(values));
