# Plugins

Plugins are the server extension point for cross-cutting behavior: security, caching, observability, request IDs, rate limits, effects, idempotency, and error redaction.

## Register plugins

```ts
const server = new Server({
  schema,
  createContext,
  plugins: [
    requestIdPlugin(),
    loggingPlugin({ slowQueryMs: 500 }),
    securityPlugin({
      allowedShapes,
      allowedShapesMode: 'enforce',
      policies: [
        bodyLimitPolicy({ maxBytes: 256 * 1024 }),
        batchPolicy({ maxQueriesPerRequest: 25, maxMutationsPerRequest: 10 }),
      ],
    }),
    rateLimitPlugin({
      getIdentity: (_request, context) => context.user?.id ?? 'anon',
      limiter,
    }),
  ],
});
```

Plugins run in array order. Resolver wrappers compose outside-in, so the first plugin wraps later plugins and the final resolver.

## Lifecycle hooks

`ServerPlugin` supports these hooks:

| Hook | When it runs |
| --- | --- |
| `setup` | Once when the `Server` is created. |
| `createPluginContext` | Once per request, merged into `ctx.plugin`. |
| `beforeQuery` / `beforeMutation` | After plan construction and before resolvers. |
| `onResolveQueryNode` | Around each query or include resolver. |
| `onResolveExternalField` | Around each external field resolver. |
| `onResolveMutation` | Around each mutation resolver. |
| `afterQuery` / `afterMutation` | After resolution. |
| `afterResponse` | After the HTTP response is sent. |
| `onError` | Allows a plugin to transform or redact server errors. |

## Author a plugin

```ts
import { definePlugin } from '@tql/server/plugins';

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

Use [Authoring](/plugins/authoring) for a deeper custom plugin guide. Built-in plugins are documented under [Built-in](/plugins/built-in/).

## Type extensions

Plugins can add typed resolver options and typed context fields through declaration merging:

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

Built-in plugin indexes import their own augmentation files, so consumers do not need extra type-only imports.

## Built-in plugins

`@tql/server` ships built-ins under `@tql/server/plugins/built-in/*`. Each one has a dedicated page:

- [Built-in overview](/plugins/built-in/)
- [Request ID](/plugins/built-in/request-id)
- [Logging](/plugins/built-in/logging)
- [OpenTelemetry](/plugins/built-in/otel)
- [Security](/plugins/built-in/security)
- [Rate limit](/plugins/built-in/rate-limit)
- [Cache](/plugins/built-in/cache)
- [Effects](/plugins/built-in/effects)
