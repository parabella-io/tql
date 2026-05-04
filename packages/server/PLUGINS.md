# @tql/server Plugins

Plugins are the extension point for cross-cutting server behaviour: security, caching, observability, request IDs, idempotency, and error redaction.

## Registering Plugins

```ts
import { Server, requestIdPlugin, securityPlugin } from '@tql/server';

const server = new Server({
  schema,
  createContext,
  plugins: [
    requestIdPlugin(),
    securityPlugin({
      allowedShapes, // usually defineAllowedShapes<ClientSchema>({...})
      allowedShapesMode: 'enforce',
      policies: [
        /* shape, complexity, rate-limit policies */
      ],
    }),
  ],
});
```

Plugins run in array order. Resolver wrappers compose outside-in, so the first plugin in the array wraps all later plugins and the final resolver.

## Authoring A Plugin

```ts
import { definePlugin } from '@tql/server';

export const timingPlugin = () =>
  definePlugin({
    name: 'timing',
    async onResolveQueryNode({ node, next }) {
      const start = performance.now();

      try {
        return await next();
      } finally {
        console.log(`[tql] ${node.path} resolved in ${performance.now() - start}ms`);
      }
    },
  });
```

Available lifecycle hooks:

- `setup(server)` runs once when the `Server` is created.
- `createPluginContext(...)` runs once per request and merges into `ctx.plugin`.
- `beforeQuery` / `beforeMutation` run after plan construction and before resolvers.
- `onResolveQueryNode` / `onResolveMutation` wrap each resolver call and may short-circuit by returning without calling `next`.
- `afterQuery` / `afterMutation` run after resolution.
- `onError` can transform or redact `TQLServerError` before it is serialized.

## Type Extensions

Plugins can add typed resolver options and context fields through declaration merging.

```ts
declare module '@tql/server' {
  interface QuerySingleOptionsExtensions<QueryArgs> {
    cache?: { ttlMs: number; key?: (query: QueryArgs) => string };
  }

  interface PluginContextExtensions {
    cacheHits: number;
  }
}
```

After that import is present, resolver options accept the added field:

```ts
ticketById: querySingle({
  query: z.object({ id: z.string() }),
  cache: { ttlMs: 30_000, key: (query) => query.id },
  resolve: async ({ context, query }) => context.ticketsService.getById(context.user, query),
});
```

The extension interfaces are project-global. Prefer namespaced option keys (`cache`, `security`, `observability`) to avoid plugin conflicts.

## Request IDs

`requestIdPlugin()` is a small built-in example. It reads `x-request-id` when present, generates one otherwise, stores it on `ctx.plugin.requestId`, and copies it to `schemaContext.requestId` before resolvers run.

```ts
plugins: [requestIdPlugin({ header: 'x-request-id' })];
```

## Cache Plugin Sketch

A future cache plugin can use resolver wrappers to short-circuit:

```ts
export const cachePlugin = (store: CacheStore) =>
  definePlugin({
    name: 'cache',
    async onResolveQueryNode({ node, next }) {
      const cache = node.extensions?.cache;
      if (!cache) return next();

      const key = cache.key ?? `${node.path}:${JSON.stringify(node.query)}`;
      const hit = await store.get(key);
      if (hit) return hit;

      const value = await next();
      await store.set(key, value, cache.ttlMs);
      return value;
    },
  });
```
