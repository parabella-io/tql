# @tql/server Plugins

Plugins are the extension point for cross-cutting server behaviour: security, caching, observability, request IDs, idempotency, and error redaction.

## Registering Plugins

```ts
import { Server } from '@tql/server';
import { loggingPlugin } from '@tql/server/plugins/built-in/logging';
import { rateLimitPlugin } from '@tql/server/plugins/built-in/rate-limit';
import { requestIdPlugin } from '@tql/server/plugins/built-in/request-id';
import { securityPlugin } from '@tql/server/plugins/built-in/security';

const server = new Server({
  schema,
  createContext,
  plugins: [
    requestIdPlugin(),
    loggingPlugin({ slowQueryMs: 500 }),
    securityPlugin({
      allowedShapes, // usually defineAllowedShapes<ClientSchema>({...})
      allowedShapesMode: 'enforce',
      policies: [
        /* shape and complexity policies */
      ],
    }),
    rateLimitPlugin({
      getIdentity: (_request, context) => context.user?.id ?? 'anon',
      limiter: { points: 600, duration: 30 },
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

- `setup({ server })` runs once when the `Server` is created.
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

The extension interfaces are project-global. Prefer namespaced option keys (`cache`, `security`, `observability`) to avoid plugin conflicts. Request plans preserve resolver options as `extensions`; each plugin is responsible for interpreting only the extension fields it owns.

## Request IDs

`requestIdPlugin()` is a small built-in example. It reads `x-request-id` when present, generates one otherwise, stores it on `ctx.plugin.requestId`, and copies it to `schemaContext.requestId` before resolvers run.

```ts
plugins: [requestIdPlugin({ header: 'x-request-id' })];
```

## Logging and OpenTelemetry

`loggingPlugin()` emits structured request lifecycle logs through the server logger. Put it after `requestIdPlugin()` so log entries include the request id.

```ts
plugins: [requestIdPlugin(), loggingPlugin({ slowQueryMs: 500 })];
```

`otelPlugin()` is opt-in and isolated to its own subpath. Pass providers from your app's OpenTelemetry setup; TQL creates root request spans and child resolver spans, but does not configure exporters.

```ts
import { otelPlugin } from '@tql/server/plugins/built-in/otel';

plugins: [requestIdPlugin(), loggingPlugin(), otelPlugin({ tracerProvider, meterProvider })];
```

## Rate Limits

`rateLimitPlugin()` is a built-in plugin for identity-based operation budgets. It runs before resolvers, uses its own `getIdentity(request, context)` callback, and consumes costs declared on selected query, include, and mutation definitions.

```ts
rateLimitPlugin({
  getIdentity: (_request, context) => context.user?.id ?? 'anon',
  limiter: { points: 600, duration: 30 },
  defaultCost: 1,
});

ticketById: querySingle({
  query: z.object({ id: z.string() }),
  rateLimit: { cost: 1 },
  resolve: async ({ context, query }) => context.ticketsService.getById(context.user, query),
});

comments: includeMany('ticketComment', {
  query: z.object({ order: z.enum(['asc', 'desc']) }),
  rateLimit: { cost: 2 },
  resolve: async ({ context, parents }) => context.ticketCommentsService.queryByTicketIds(context.user, parents),
});
```

Omitted resolver metadata is charged `defaultCost`, which defaults to `1`. Query requests charge the selected root query plus selected includes recursively; mutation requests charge each mutation entry. Rate-limit costs are independent from security complexity costs.

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
