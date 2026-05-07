# Cache

```ts
import { cachePlugin, memoryCacheStore } from '@tql/server/plugins/built-in/cache';

cachePlugin({
  store: memoryCacheStore({ maxEntries: 50_000 }),
  defaultTtlMs: 30_000,
  defaultScope: ({ context }) => [`user:${(context as { user: { id: string } }).user.id}`],
  singleFlight: true,
});
```

Register the plugin on your `Server`. **`defaultScope`** is merged into cache keys so entries are isolated per user or tenant. **`defaultTtlMs`** applies when a resolver does not set `ttlMs`. **`singleFlight`** (default `true`) collapses concurrent identical cache misses into one resolver run.

Import this module anywhere you use `cache` on queries, includes, external fields, or mutations so TypeScript picks up the option types.

## Root query

Opt in on `querySingle` / `queryMany` with a **`cache`** block. **`tags`** are used for invalidation; **`ttlMs`** overrides the plugin default for that resolver.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, allowEach

  queries: ({ querySingle }) => ({
    ticketById: querySingle({
      query: z.object({ id: z.string() }),
      cache: {
        ttlMs: 60_000,
        tags: ({ query }) => [`ticket:${query.id}`],
      },
      resolve: async ({ context, query }) => {
        return ticketsService.getById(context.user, { id: query.id });
      },
    }),
  }),
});
```

## Include (per parent)

Includes are cached **per parent id**. Use **`tags`** that mention the parent so mutations can invalidate the right slice.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, allowEach, queries

  includes: ({ includeMany }) => ({
    comments: includeMany('ticketComment', {
      matchKey: 'ticketId',
      query: z.object({ order: z.enum(['asc', 'desc']) }),
      cache: {
        ttlMs: 30_000,
        tags: ({ parent }) => [`ticket:${parent.id}:comments`],
      },
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

## Mutation invalidation

After a mutation **succeeds**, **`cache.onSuccess`** runs **before** the mutation response is returned. Use the **`cache`** controller to drop or tag-invalidate entries.

```ts
export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    title: z.string().min(1),
  }),

  output: z.object({
    ticket: z.object({
      id: z.string(),
      title: z.string(),
      workspaceId: z.string(),
    }),
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  cache: {
    onSuccess: async ({ cache, input, output }) => {
      await cache.invalidateTag(`workspace:${input.workspaceId}:tickets`);
      await cache.invalidatePath('tickets');
      await cache.invalidateQuery({ path: 'ticketById', query: { id: output.ticket.id } });
    },
  },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, input);
    return { ticket };
  },
});
```

The controller also supports `invalidateTags`, `invalidatePaths`, `invalidateExternalField`, and `clear()` — see `MutationCacheController` in the server package.

## External fields

`externalField({ ... })` may set **`cache`** with the same `ttlMs` / `tags` / `scope` / `enabled` shape as root resolvers, so expensive computed fields can be cached per entity.

## Behaviour notes

- Only resolvers that declare **`cache`** participate; everything else is uncached.
- **Scope** from `defaultScope` and per-resolver `scope` factories is part of the key — keep it aligned with authorization boundaries.
- Prefer **tags** for broad invalidation (e.g. all list queries for a workspace) and **`invalidateQuery`** when you need to drop one exact key.
