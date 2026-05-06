import type { CacheStore } from './cache-store.js';
import { buildExternalFieldKey, buildIncludePerParentKey, buildPathTag, buildQueryIdentityTag, buildQueryKey } from './keys.js';

export type MutationCacheControllerOptions = {
  store: CacheStore;
  keyPrefix?: string;
  context: unknown;
  defaultScope?: (options: { context: unknown }) => string[] | Promise<string[]>;
};

export type InvalidateQueryOptions = {
  path: string;
  query?: unknown;
  pagingInfo?: unknown;
  shape?: unknown;
  scope?: string[];
  parentId?: string;
};

export type InvalidateExternalFieldOptions = {
  path: string;
  entityId: string;
  scope?: string[];
};

export interface MutationCacheController {
  invalidateTag(tag: string): Promise<void>;
  invalidateTags(tags: string[]): Promise<void>;
  invalidatePath(path: string): Promise<void>;
  invalidatePaths(paths: string[]): Promise<void>;
  invalidateQuery(options: InvalidateQueryOptions): Promise<void>;
  invalidateExternalField(options: InvalidateExternalFieldOptions): Promise<void>;
  clear(): Promise<void>;
}

export class DefaultMutationCacheController implements MutationCacheController {
  constructor(private readonly options: MutationCacheControllerOptions) {}

  public async invalidateTag(tag: string): Promise<void> {
    await this.invalidateTags([tag]);
  }

  public async invalidateTags(tags: string[]): Promise<void> {
    await this.options.store.invalidateTags(tags);
  }

  public async invalidatePath(path: string): Promise<void> {
    await this.invalidatePaths([path]);
  }

  public async invalidatePaths(paths: string[]): Promise<void> {
    await this.options.store.invalidateTags(paths.map((path) => buildPathTag(path)));
  }

  public async invalidateQuery(options: InvalidateQueryOptions): Promise<void> {
    const scope = options.scope ?? (await this.options.defaultScope?.({ context: this.options.context })) ?? [];

    if (options.parentId === undefined && options.shape === undefined) {
      await this.options.store.invalidateTags([
        buildQueryIdentityTag({
          path: options.path,
          query: options.query,
          pagingInfo: options.pagingInfo,
          scope,
        }),
      ]);
      return;
    }

    const key =
      options.parentId === undefined
        ? buildQueryKey({
            keyPrefix: this.options.keyPrefix,
            path: options.path,
            query: options.query,
            pagingInfo: options.pagingInfo,
            shape: options.shape,
            scope,
          })
        : buildIncludePerParentKey({
            keyPrefix: this.options.keyPrefix,
            path: options.path,
            query: options.query,
            parentId: options.parentId,
            scope,
          });

    await this.options.store.delete(key);
  }

  public async invalidateExternalField(options: InvalidateExternalFieldOptions): Promise<void> {
    const scope = options.scope ?? (await this.options.defaultScope?.({ context: this.options.context })) ?? [];
    const key = buildExternalFieldKey({
      keyPrefix: this.options.keyPrefix,
      path: options.path,
      entityId: options.entityId,
      scope,
    });

    await this.options.store.delete(key);
  }

  public async clear(): Promise<void> {
    await this.options.store.clear();
  }
}
