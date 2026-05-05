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
  rateLimitPlugin,
  securityPlugin,
  takePolicy,
  timeoutPolicy,
} from '@tql/server';

import { RateLimiterMemory } from 'rate-limiter-flexible';

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

export const createTqlPlugins = () => [
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
    ],
  }),
  rateLimitPlugin({
    getIdentity: (_request, context) => {
      const user = (context as { user?: { id?: string } }).user;
      return user?.id ?? 'anon';
    },
    limiter: new RateLimiterMemory({ points: 600, duration: 30 }),
  }),
];
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

## Rate Limits

`rateLimitPlugin` is independent from `securityPlugin`. It uses its own `getIdentity` callback, charges costs declared on query, include, and mutation definitions, and consumes those points from one identity budget. Missing resolver metadata is charged `defaultCost`, which defaults to `1`.

```ts
import { RateLimiterRedis } from 'rate-limiter-flexible';

rateLimitPlugin({
  getIdentity: (_request, context) => {
    const user = (context as { user?: { id?: string } }).user;
    return user?.id ?? 'anon';
  },
  keyPrefix: 'tql',
  limiter: new RateLimiterRedis({
    storeClient: redis,
    points: 600,
    duration: 30,
  }),
  defaultCost: 1,
});

tickets: queryMany({
  query: z.object({ workspaceId: z.string(), limit: z.number() }),
  rateLimit: { cost: 5 },
  resolve: async ({ context, query }) => context.ticketsService.queryByWorkspaceId(context.user, query),
});

comments: includeMany('ticketComment', {
  query: z.object({ order: z.enum(['asc', 'desc']) }),
  rateLimit: { cost: 2 },
  resolve: async ({ context, parents }) => context.ticketCommentsService.queryByTicketIds(context.user, parents),
});

const createTicket = schema.mutation('createTicket', {
  input: createTicketInput,
  rateLimit: { cost: 10 },
  resolve: async ({ context, input }) => context.ticketsService.create(context.user, input),
});
```

Query requests charge the selected root query plus selected includes recursively. Mutation requests charge each mutation entry. Rate limit costs do not inspect args and are not linked to `complexityPolicy`.
