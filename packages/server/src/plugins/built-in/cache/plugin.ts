import type { IncludeNode, QueryNode } from '../../../request-plan/plan.js';
import {
  definePlugin,
  type ExternalFieldNode,
  type ExternalFieldResolveOverrides,
  type QueryResolveOverrides,
  type ServerPlugin,
} from '../../plugin.js';
import { DefaultMutationCacheController, type MutationCacheController } from './cache-controller.js';
import type { CacheStore } from './cache-store.js';
import {
  buildExternalFieldKey,
  buildQueryIdentityTag,
  buildQueryShape,
  buildIncludePerParentKey,
  buildQueryKey,
  withPathTags,
} from './keys.js';
import { memoryCacheStore } from './memory-cache-store.js';
import { SingleFlight } from './single-flight.js';

export type CacheValueFactoryOptions<QueryArgs = unknown> = {
  context: unknown;
  query: QueryArgs;
  path: string;
  parent?: Record<string, unknown>;
  entity?: Record<string, unknown>;
};

export type CacheValueFactory<QueryArgs = unknown> = (options: CacheValueFactoryOptions<QueryArgs>) => string[] | Promise<string[]>;

export type ResolverCacheOptions<QueryArgs = unknown> = {
  ttlMs?: number;
  tags?: string[] | CacheValueFactory<QueryArgs>;
  scope?: string[] | CacheValueFactory<QueryArgs>;
  enabled?: boolean | ((options: CacheValueFactoryOptions<QueryArgs>) => boolean | Promise<boolean>);
};

export type MutationCacheOptions<Input = unknown, Output = unknown, SchemaContext = unknown> = {
  onSuccess?: (options: { cache: MutationCacheController; input: Input; output: Output; context: SchemaContext }) => Promise<void> | void;
};

export type CachePluginOptions = {
  store?: CacheStore;
  defaultTtlMs?: number;
  defaultScope?: (options: { context: unknown }) => string[] | Promise<string[]>;
  singleFlight?: boolean;
  enabled?: boolean | ((options: { context: unknown }) => boolean | Promise<boolean>);
  keyPrefix?: string;
};

type CacheableIncludeNode = IncludeNode & { matchKey: string };

export const cachePlugin = (options: CachePluginOptions = {}): ServerPlugin => {
  const store = options.store ?? memoryCacheStore();
  const flights = new SingleFlight();
  const useSingleFlight = options.singleFlight ?? true;

  return definePlugin({
    name: 'cache',
    async onResolveQueryNode({ ctx, node, parents, next }) {
      if (!(await isPluginEnabled(options, ctx.schemaContext))) {
        return next();
      }

      const cache = getResolverCache(node.extensions);

      if (!cache) {
        return next();
      }

      if (isIncludeNode(node) && parents && parents.length > 0) {
        return resolveIncludeNode({
          store,
          flights,
          useSingleFlight,
          options,
          cache,
          context: ctx.schemaContext,
          node,
          parents,
          next,
        });
      }

      return resolveRootNode({
        store,
        flights,
        useSingleFlight,
        options,
        cache,
        context: ctx.schemaContext,
        node,
        next,
      });
    },
    async onResolveExternalField({ ctx, node, entities, next }) {
      if (!(await isPluginEnabled(options, ctx.schemaContext))) {
        return next();
      }

      const cache = getResolverCache(node.extensions);

      if (!cache) {
        return next();
      }

      return resolveExternalField({
        store,
        flights,
        useSingleFlight,
        options,
        cache,
        context: ctx.schemaContext,
        node,
        entities,
        next,
      });
    },
    async onResolveMutation({ ctx, entry, next }) {
      const output = await next();

      const cache = getMutationCache(entry.extensions);

      if (cache?.onSuccess) {
        const controller = new DefaultMutationCacheController({
          store,
          keyPrefix: options.keyPrefix,
          context: ctx.schemaContext,
          defaultScope: options.defaultScope,
        });

        await cache.onSuccess({
          cache: controller,
          input: entry.input,
          output,
          context: ctx.schemaContext,
        });
      }

      return output;
    },
  });
};

const resolveExternalField = async <T>(input: {
  store: CacheStore;
  flights: SingleFlight;
  useSingleFlight: boolean;
  options: CachePluginOptions;
  cache: ResolverCacheOptions;
  context: unknown;
  node: ExternalFieldNode;
  entities: ReadonlyArray<unknown>;
  next: (overrides?: ExternalFieldResolveOverrides) => Promise<T>;
}): Promise<T> => {
  const ttlMs = getTtlMs(input.cache, input.options);

  if (ttlMs <= 0) {
    return input.next();
  }

  const cacheEntities = input.entities.filter(isObjectWithStringId);

  if (cacheEntities.length !== input.entities.length) {
    return input.next();
  }

  const values = new Array<unknown>(input.entities.length);
  const missEntities: Array<Record<string, unknown> & { id: string }> = [];
  const missPositions: number[] = [];
  const missKeys = new Map<number, string>();
  const pendingHits: Array<Promise<void>> = [];

  for (const [index, entity] of cacheEntities.entries()) {
    const enabled = await isResolverEnabled(input.cache, {
      context: input.context,
      query: {},
      path: input.node.path,
      entity,
    });

    if (!enabled) {
      return input.next();
    }

    const scope = await getScope(input.options, input.cache, {
      context: input.context,
      query: {},
      path: input.node.path,
      entity,
    });
    const key = buildExternalFieldKey({
      keyPrefix: input.options.keyPrefix,
      path: input.node.path,
      entityId: entity.id,
      scope,
    });

    const hit = await input.store.get<unknown>(key);

    if (hit) {
      values[index] = hit.value;
      continue;
    }

    const pending = input.useSingleFlight ? input.flights.get<unknown>(key) : undefined;

    if (pending) {
      pendingHits.push(
        pending.then((value) => {
          values[index] = value;
        }),
      );
      continue;
    }

    missEntities.push(entity);
    missPositions.push(index);
    missKeys.set(index, key);
  }

  await Promise.all(pendingHits);

  if (missEntities.length === 0) {
    return values as T;
  }

  const freshPromise = Promise.resolve(input.next({ entities: missEntities })).then((value) => (Array.isArray(value) ? value : []));

  if (input.useSingleFlight) {
    for (const [missIndex, position] of missPositions.entries()) {
      const key = missKeys.get(position);

      if (!key) {
        continue;
      }

      input.flights.set(
        key,
        freshPromise.then((freshValues) => freshValues[missIndex]),
      );
    }
  }

  const freshValues = await freshPromise;

  for (const [missIndex, position] of missPositions.entries()) {
    const entity = missEntities[missIndex];

    if (!entity) {
      continue;
    }

    const value = freshValues[missIndex];
    const key = missKeys.get(position);

    values[position] = value;

    if (!key) {
      continue;
    }

    const tags = await getTags(input.cache, {
      context: input.context,
      query: {},
      path: input.node.path,
      entity,
    });

    await input.store.set(key, value, {
      ttlMs,
      tags: withPathTags({ path: input.node.path, entityId: entity.id, tags }),
    });
  }

  return values as T;
};

const resolveRootNode = async <T>(input: {
  store: CacheStore;
  flights: SingleFlight;
  useSingleFlight: boolean;
  options: CachePluginOptions;
  cache: ResolverCacheOptions;
  context: unknown;
  node: QueryNode | IncludeNode;
  next: (overrides?: QueryResolveOverrides) => Promise<T>;
}): Promise<T> => {
  const ttlMs = getTtlMs(input.cache, input.options);

  if (ttlMs <= 0 || !(await isResolverEnabled(input.cache, { context: input.context, query: input.node.query, path: input.node.path }))) {
    return input.next();
  }

  const scope = await getScope(input.options, input.cache, {
    context: input.context,
    query: input.node.query,
    path: input.node.path,
  });
  const key = buildQueryKey({
    keyPrefix: input.options.keyPrefix,
    path: input.node.path,
    query: input.node.query,
    pagingInfo: 'pagingInfo' in input.node ? input.node.pagingInfo : undefined,
    shape: buildQueryShape(input.node),
    scope,
  });

  const hit = await input.store.get<T>(key);

  if (hit) {
    return hit.value;
  }

  const fill = async () => {
    const recheck = await input.store.get<T>(key);

    if (recheck) {
      return recheck.value;
    }

    const value = await input.next();

    const tags = await getTags(input.cache, {
      context: input.context,
      query: input.node.query,
      path: input.node.path,
    });

    await input.store.set(key, value, {
      ttlMs,
      tags: withPathTags({
        path: input.node.path,
        tags: [
          ...tags,
          buildQueryIdentityTag({
            path: input.node.path,
            query: input.node.query,
            pagingInfo: 'pagingInfo' in input.node ? input.node.pagingInfo : undefined,
            scope,
          }),
        ],
      }),
    });

    return value;
  };

  return input.useSingleFlight ? input.flights.run(key, fill) : fill();
};

const resolveIncludeNode = async <T>(input: {
  store: CacheStore;
  flights: SingleFlight;
  useSingleFlight: boolean;
  options: CachePluginOptions;
  cache: ResolverCacheOptions;
  context: unknown;
  node: CacheableIncludeNode;
  parents: ReadonlyArray<unknown>;
  next: (overrides?: QueryResolveOverrides) => Promise<T>;
}): Promise<T> => {
  const ttlMs = getTtlMs(input.cache, input.options);

  if (ttlMs <= 0) {
    return input.next();
  }

  const cacheParents = input.parents.filter(isObjectWithStringId);

  if (cacheParents.length !== input.parents.length) {
    return input.next();
  }

  const hitRows: unknown[] = [];
  const missParents: Array<Record<string, unknown> & { id: string }> = [];
  const missKeys = new Map<string, string>();
  const pendingHits: Array<Promise<unknown[]>> = [];

  for (const parent of cacheParents) {
    const enabled = await isResolverEnabled(input.cache, {
      context: input.context,
      query: input.node.query,
      path: input.node.path,
      parent,
    });

    if (!enabled) {
      return input.next();
    }

    const scope = await getScope(input.options, input.cache, {
      context: input.context,
      query: input.node.query,
      path: input.node.path,
      parent,
    });

    const key = buildIncludePerParentKey({
      keyPrefix: input.options.keyPrefix,
      path: input.node.path,
      query: input.node.query,
      parentId: parent.id,
      scope,
    });

    const hit = await input.store.get<unknown[]>(key);

    if (hit) {
      hitRows.push(...hit.value);
      continue;
    }

    const pending = input.useSingleFlight ? input.flights.get<unknown[]>(key) : undefined;

    if (pending) {
      pendingHits.push(pending);
      continue;
    }

    missParents.push(parent);
    missKeys.set(parent.id, key);
  }

  const pendingRows = (await Promise.all(pendingHits)).flat();

  if (missParents.length === 0) {
    return [...hitRows, ...pendingRows] as T;
  }

  const missIds = new Set(missParents.map((parent) => parent.id));

  const freshPromise = Promise.resolve(input.next({ parents: missParents })).then((value) => {
    const rows = Array.isArray(value) ? value : [];
    return rows.filter(
      (row) => isObject(row) && typeof row[input.node.matchKey] === 'string' && missIds.has(row[input.node.matchKey] as string),
    );
  });

  if (input.useSingleFlight) {
    for (const parent of missParents) {
      const key = missKeys.get(parent.id);

      if (!key) {
        continue;
      }

      input.flights.set(
        key,
        freshPromise.then((rows) => rows.filter((row) => isObject(row) && row[input.node.matchKey] === parent.id)),
      );
    }
  }

  const freshRows = await freshPromise;

  for (const parent of missParents) {
    const key = missKeys.get(parent.id);

    if (!key) {
      continue;
    }

    const rowsForParent = freshRows.filter((row) => isObject(row) && row[input.node.matchKey] === parent.id);

    const tags = await getTags(input.cache, {
      context: input.context,
      query: input.node.query,
      path: input.node.path,
      parent,
    });

    await input.store.set(key, rowsForParent, {
      ttlMs,
      tags: withPathTags({ path: input.node.path, parentId: parent.id, tags }),
    });
  }

  return [...hitRows, ...pendingRows, ...freshRows] as T;
};

const getTtlMs = (cache: ResolverCacheOptions, options: CachePluginOptions): number => cache.ttlMs ?? options.defaultTtlMs ?? 0;

const isPluginEnabled = async (options: CachePluginOptions, context: unknown): Promise<boolean> => {
  if (options.enabled === undefined) {
    return true;
  }

  return typeof options.enabled === 'function' ? options.enabled({ context }) : options.enabled;
};

const isResolverEnabled = async (cache: ResolverCacheOptions, options: CacheValueFactoryOptions): Promise<boolean> => {
  if (cache.enabled === undefined) {
    return true;
  }

  return typeof cache.enabled === 'function' ? cache.enabled(options) : cache.enabled;
};

const getScope = async (
  pluginOptions: CachePluginOptions,
  cache: ResolverCacheOptions,
  options: CacheValueFactoryOptions,
): Promise<string[]> => {
  const defaultScope = (await pluginOptions.defaultScope?.({ context: options.context })) ?? [];
  const resolverScope = await getCacheValues(cache.scope, options);

  return [...defaultScope, ...resolverScope];
};

const getTags = async (cache: ResolverCacheOptions, options: CacheValueFactoryOptions): Promise<string[]> => {
  return getCacheValues(cache.tags, options);
};

const getCacheValues = async (value: string[] | CacheValueFactory | undefined, options: CacheValueFactoryOptions): Promise<string[]> => {
  if (value === undefined) {
    return [];
  }

  return typeof value === 'function' ? value(options) : value;
};

const getResolverCache = (extensions: unknown): ResolverCacheOptions | undefined => (extensions as { cache?: ResolverCacheOptions }).cache;

const getMutationCache = (extensions: unknown): MutationCacheOptions | undefined => (extensions as { cache?: MutationCacheOptions }).cache;

const isIncludeNode = (node: QueryNode | IncludeNode): node is CacheableIncludeNode => {
  return 'includeName' in node && typeof (node as { matchKey?: unknown }).matchKey === 'string';
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isObjectWithStringId = (value: unknown): value is Record<string, unknown> & { id: string } =>
  isObject(value) && typeof value.id === 'string';
