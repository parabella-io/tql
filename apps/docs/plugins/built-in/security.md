# Security

`securityPlugin(...)` protects `/query` and `/mutation` before application resolvers execute.

## Recommended imports

```ts
import {
  batchPolicy,
  bodyLimitPolicy,
  breadthPolicy,
  complexityPolicy,
  defineAllowedShapes,
  depthPolicy,
  securityPlugin,
  takePolicy,
  timeoutPolicy,
} from '@tql/server/plugins/built-in/security';
```

Per-identity request throttling is a separate concern: use [Rate limit](/plugins/built-in/rate-limit).

## Allowed shapes

Allowed shapes are a developer-authored ceiling for query documents:

```ts
export const allowedShapes = defineAllowedShapes<ClientSchema>({
  ticketById: {
    select: true,
    include: {
      assignee: true,
      reporter: true,
      attachments: true,
      comments: true,
      labels: true,
    },
  },
  ticketLists: {
    select: true,
    include: {
      tickets: true,
    },
  },
});
```

The policy is deny-by-default in `enforce` mode. If a query has no allowed shape entry, it is rejected.

`true` on an include is terminal: the include is allowed, but nested includes below it are rejected.

## Example plugin stack

`apps/api/src/plugins.ts` configures the example app:

```ts
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
    complexityPolicy({
      defaults: { single: 1, many: 5, selectKey: 0.1 },
      assumedManyTake: 5,
      budget: 2_500,
    }),
  ],
});
```

## Policies

| Policy | Protects against |
| --- | --- |
| `bodyLimitPolicy` | Oversized request bodies. |
| `batchPolicy` | Too many root queries or mutations in one request. |
| `depthPolicy` | Deep recursive include trees. |
| `breadthPolicy` | Too many includes or selected fields. |
| `takePolicy` | Excessive page or list sizes. |
| `timeoutPolicy` | Long resolver execution. |
| `complexityPolicy` | Expensive query plans based on resolver and selection cost. |

## Resolver overrides

Resolvers can declare their own security metadata:

```ts
tickets: queryMany({
  query: z.object({ workspaceId: z.string(), limit: z.number() }),
  security: {
    complexity: ({ query }) => 5 + query.limit * 0.2,
    timeoutMs: 3_000,
  },
  resolve: async ({ context, query, signal }) => {
    signal?.throwIfAborted();
    return ticketsService.queryByWorkspaceId(context.user, query);
  },
});
```

Resolver declarations override policy defaults but are still capped by the request timeout.

## Security errors

Security failures serialize as `TQLServerErrorType` values such as:

- `SecurityRejectedError`
- `SecurityDepthExceededError`
- `SecurityBreadthExceededError`
- `SecurityBatchExceededError`
- `SecurityTakeExceededError`
- `SecurityTimeoutError`
- `SecurityComplexityExceededError`
- `SecurityRateLimitedError`
- `SecurityShapeNotAllowedError`
- `SecurityBodySizeExceededError`

Note: `SecurityRateLimitedError` is raised when rate limiting rejects a request; configure throttling on the [Rate limit](/plugins/built-in/rate-limit) plugin.
