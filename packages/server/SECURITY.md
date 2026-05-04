# @tql/server Security

`@tql/server` protects the two framework endpoints, `/query` and `/mutation`, through `securityPlugin(...)`. The plugin runs after `createContext` and before any resolver executes, so rejected requests do not reach application services.

## Recommended Stack

Keep security policy in a dedicated file and register it through `plugins`:

```ts
import {
  batchPolicy,
  bodyLimitPolicy,
  breadthPolicy,
  complexityPolicy,
  defineAllowedShapes,
  depthPolicy,
  InMemoryRateLimitStore,
  rateLimitPolicy,
  securityPlugin,
  takePolicy,
  timeoutPolicy,
} from '@tql/server';

const allowedShapes = defineAllowedShapes({
  tickets: {
    select: true,
    include: {
      assignee: true,
      reporter: true,
      comments: { select: true },
    },
  },
});

export const createSecurityPlugin = () =>
  securityPlugin({
    getPrincipal: (_request, context) => {
      const user = (context as { user?: { id?: string } }).user;
      return user?.id ? { id: user.id } : null;
    },
    requestTimeoutMs: 10_000,
    allowedShapes,
    allowedShapesMode: 'enforce',
    policies: [
      bodyLimitPolicy({ maxBytes: 256 * 1024 }),
      batchPolicy({ maxQueriesPerRequest: 25, maxMutationsPerRequest: 10 }),
      depthPolicy({ maxDepth: 5 }),
      breadthPolicy({ maxIncludesPerNode: 10, maxTotalIncludes: 50, maxSelectKeys: 50 }),
      takePolicy({ defaultMax: 100 }),
      timeoutPolicy({ perResolverTimeoutMs: 5_000 }),
      complexityPolicy({ defaults: { single: 1, many: 5, selectKey: 0.1 }, assumedManyTake: 25, budget: 1000 }),
      rateLimitPolicy({
        store: new InMemoryRateLimitStore(),
        buckets: [
          { scope: 'route', capacity: 600, refillPerSec: 10 },
          { scope: 'op', capacity: 100, refillPerSec: 2 },
        ],
      }),
    ],
  });
```

## Allowed Shapes

`allowedShapes` is a dev-authored ceiling per query name. The policy is deny-by-default: if a query has no entry, it is rejected.

`true` on an include is terminal. It allows that include but rejects any nested includes below it:

```ts
const allowedShapes = defineAllowedShapes({
  tickets: {
    select: true,
    include: {
      assignee: true,
      reporter: true,
    },
  },
});
```

For generated schema checking, pass your generated `ClientSchema` type:

```ts
import type { ClientSchema } from '../__generated__/schema.d.ts';

const allowedShapes = defineAllowedShapes<ClientSchema>({
  tickets: {
    select: true,
    include: { assignee: true, reporter: true },
  },
});
```

With this config:

- `tickets` with no includes is allowed.
- `tickets` including only `assignee` is allowed.
- `tickets` including `assignee` and `reporter` is allowed.
- `tickets` including `assignee.include.user` is rejected.
- `tickets` including an undeclared include such as `comments` is rejected.

Use `allowedShapesMode: 'warn'` during rollout to log missing shapes while still serving traffic. Switch to `enforce` once the registry matches the query shapes your clients actually send.

## Resolver Overrides

Each resolver can declare its own `security` block:

```ts
tickets: queryMany({
  query: z.object({ workspaceId: z.string(), limit: z.number() }),
  security: {
    complexity: ({ query }) => 5 + query.limit * 0.2,
    timeoutMs: 3_000,
  },
  resolve: async ({ context, query, signal }) => {
    signal?.throwIfAborted();
    return context.ticketsService.queryByWorkspaceId(context.user, query);
  },
});
```

Resolver declarations override policy-level per-model/per-op values, which override policy defaults. Resolver timeouts are still capped by `requestTimeoutMs`.

## Rate Limit Stores

`InMemoryRateLimitStore` is intended for development, tests, and single-process deployments. Production deployments with multiple API instances should implement `RateLimitStore` against a shared backend such as Redis:

```ts
interface RateLimitStore {
  consume(
    key: string,
    cost: number,
    opts: { capacity: number; refillPerSec: number },
  ): Promise<{ allowed: boolean; remaining: number; retryAfterMs: number }>;
}
```

A Redis implementation should update token count and refill timestamp atomically, ideally via a Lua script or transaction, and set a TTL so idle buckets expire.
