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

## Cache

`cachePlugin()` provides opt-in TTL caching for root queries and includes. It ships with an in-memory store and a pluggable `CacheStore` interface for custom backends.

```ts
import { cachePlugin, memoryCacheStore } from '@tql/server/plugins/built-in/cache';

plugins: [
  cachePlugin({
    store: memoryCacheStore({ maxEntries: 50_000 }),
    defaultTtlMs: 30_000,
    defaultScope: ({ context }) => [`user:${context.user.id}`],
  }),
];
```

Resolvers opt in with `cache`. Scope values are part of the cache key and should identify the current user or tenant. The plugin-level `defaultScope` is applied to every cached entry and can be extended per resolver.

```ts
ticketById: querySingle({
  query: z.object({ id: z.string() }),
  cache: {
    ttlMs: 60_000,
    tags: ({ query }) => [`ticket:${query.id}`],
  },
  resolve: async ({ context, query }) => context.ticketsService.getById(context.user, query),
});
```

Includes are cached per parent. TQL resolves includes in batches, but the cache plugin stores one entry per parent id so later requests can reuse partial hits and only resolve missing parents.

```ts
comments: includeMany('ticketComment', {
  matchKey: 'ticketId',
  query: z.object({ order: z.enum(['asc', 'desc']) }),
  cache: {
    ttlMs: 30_000,
    tags: ({ parent }) => [`ticket:${parent.id}:comments`],
  },
  resolve: async ({ context, parents, query }) =>
    context.ticketCommentsService.queryByTicketIds(context.user, {
      ticketIds: parents.map((parent) => parent.id),
      order: query.order,
    }),
});
```

Mutations own invalidation through an imperative `cache.onSuccess` hook. It runs synchronously after the mutation resolver succeeds and before the mutation response is returned.

```ts
createTicket: schema.mutation('createTicket', {
  input: z.object({ workspaceId: z.string(), ticketListId: z.string(), title: z.string() }),
  output: z.object({ ticket: z.any() }),
  allow: ({ context, input }) => context.user.workspaceIds.includes(input.workspaceId),
  cache: {
    onSuccess: async ({ cache, input, output }) => {
      await cache.invalidateTag(`workspace:${input.workspaceId}:tickets`);
      await cache.invalidatePath('tickets');
      await cache.invalidateQuery({ path: 'ticketById', query: { id: output.ticket.id } });
    },
  },
  resolve: async ({ context, input }) => ({
    ticket: await context.ticketsService.create(context.user, input),
  }),
});
```
