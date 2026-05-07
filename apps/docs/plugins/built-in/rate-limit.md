# Rate limit

The rate limit plugin runs **`beforeQuery`** and **`beforeMutation`**. It sums a **cost** for every selected root resolver and nested include (queries) or each mutation entry (mutations), then calls `limiter.consume(identityKey, totalCost)` for that request.

Failures surface as `TQLServerErrorType.SecurityRateLimitedError` with `remaining` and `retryAfterMs` in the error details. This is **separate** from [Security](/plugins/built-in/security) complexity limits.

Import `@parabella-io/tql-server/plugins/built-in/rate-limit` wherever you use `rateLimit` on resolvers so TypeScript picks up the option types.

## Plugin setup

```ts
import { rateLimitPlugin } from '@parabella-io/tql-server/plugins/built-in/rate-limit';
import { RateLimiterMemory } from 'rate-limiter-flexible';

rateLimitPlugin({
  getIdentity: (_request, context) => {
    const user = (context as { user?: { id?: string } }).user;
    return user?.id ?? 'anon';
  },
  keyPrefix: 'tql',
  limiter: new RateLimiterMemory({
    points: 600,
    duration: 30,
  }),
  defaultCost: 1,
});
```

- **`getIdentity`** — Stable string per caller (user id, api key id, or `'anon'`). Combined with **`keyPrefix`** for the limiter key.
- **`limiter`** — Either `rate-limiter-flexible` options (wrapped in `RateLimiterMemory`) or any object with `consume(key, points)`.
- **`defaultCost`** — Used when a resolver does not set `rateLimit.cost` (defaults to `1`).

## Root query

Attach **`rateLimit: { cost: n }`** on `querySingle` / `queryMany`. The client pays that cost when this root is selected.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, allowEach

  queries: ({ querySingle, queryMany }) => ({
    ticketById: querySingle({
      query: z.object({ id: z.string() }),
      rateLimit: { cost: 1 },
      resolve: async ({ context, query }) => {
        return ticketsService.getById(context.user, { id: query.id });
      },
    }),

    tickets: queryMany({
      query: z.object({
        workspaceId: z.string(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      rateLimit: { cost: 5 },
      resolve: async ({ context, query }) => {
        return ticketsService.queryByWorkspaceId(context.user, query);
      },
    }),
  }),
});
```

## Includes

Each **selected** include adds its own cost, recursively. A query that loads `ticketById` plus `comments` and `attachments` pays the root cost plus each included branch’s cost.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, allowEach, queries

  includes: ({ includeMany }) => ({
    comments: includeMany('ticketComment', {
      matchKey: 'ticketId',
      query: z.object({ order: z.enum(['asc', 'desc']) }),
      rateLimit: { cost: 2 },
      resolve: async ({ context, query, parents }) => {
        return ticketCommentsService.queryByTicketIds(context.user, {
          ticketIds: parents.map((p) => p.id),
          order: query.order,
        });
      },
    }),
  }),
});
```

## Mutation

Each mutation in the request body is charged separately.

```ts
export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    title: z.string().min(1),
  }),

  output: z.object({
    ticket: z.object({ id: z.string(), title: z.string(), workspaceId: z.string() }),
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  rateLimit: { cost: 10 },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, input);
    return { ticket };
  },
});
```

## Cost rules

- Costs are **integers**; missing `rateLimit` uses **`defaultCost`**.
- Query cost = **sum of costs** along the selected tree (root + every selected include subtree).
- Mutation cost = **sum** of each mutation entry’s cost in the batch.
- **`cost: 0`** is allowed and adds nothing (use sparingly).

For Redis-backed limits, pass a `RateLimiterRedis` (or compatible `RateLimiterLike`) as `limiter` instead of `RateLimiterMemory`.
