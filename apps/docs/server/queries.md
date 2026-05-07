# Queries

Queries are root read operations exposed by a model. They parse input, authorize access, resolve data, validate rows, and project selected fields into the response.

## `querySingle`

Use `querySingle` when the operation returns one entity or `null`.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, and allowEach

  queries: ({ querySingle }) => ({
    ticketById: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        return ticketsService.getById(context.user, {
          id: query.id,
        });
      },
    }),
  }),
});
```

`nullable: true` marks a query as allowed to return `null`. Without it, a missing entity is treated as an error.

## `queryMany`

Use `queryMany` when the operation returns a list of entities.

```ts
export const ticket = schema.model('ticket', {
  // ... schema, fields, and allowEach

  queries: ({ queryMany }) => ({
    tickets: queryMany({
      query: z.object({
        workspaceId: z.string(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return ticketsService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
          limit: query.limit,
          order: query.order,
        });
      },
    }),
  }),
});
```

The result must be an array of rows matching the model schema.

## Options

Common query options:

| Option | Description |
| --- | --- |
| `query` | Optional Zod schema for root query args. If omitted, the query input is `{}`. |
| `allow` | Optional guard that runs before `resolve`. Receives `{ context, query }`. |
| `resolve` | Required resolver. Receives `{ context, query, signal }`. |
| `nullable` | `querySingle` only. Allows `null` data. |
| `withPaging` | `queryMany` only. Enables cursor pagination. |

Plugin options such as `security`, `rateLimit`, and `cache` are added through TypeScript declaration merging when their plugins are imported.

## Authorization order

For a root query, authorization happens in two layers:

1. `allow` checks whether the caller may execute the operation with those args.
2. Model `allowEach` checks whether each returned row may be seen.

Use `allow` for input-level checks and `allowEach` for row-level checks.

## Resolver abort signal

Resolvers receive `signal` when request timeout policies are active:

```ts
resolve: async ({ context, query, signal }) => {
  signal?.throwIfAborted();
  return context.ticketsService.queryByWorkspaceId(context.user, query);
}
```

Long-running services should periodically check the signal.

## Paged root queries

`queryMany` can opt into cursor paging with `withPaging`. A paged query resolver receives `pagingInfo` and returns both rows and resolved paging metadata:

```ts
export const workspaceMember = schema.model('workspaceMember', {
  // ... schema, fields, and allowEach

  queries: ({ queryMany }) => ({
    workspaceMembers: queryMany({
      query: z.object({ workspaceId: z.string() }),
      withPaging: {
        cursor: z.object({ id: z.string() }),
      },
      resolve: async ({ context, query, pagingInfo }) => {
        return workspaceMemberService.query(context.user, {
          workspaceId: query.workspaceId,
          pagingInfo,
        });
      },
    }),
  }),
});
```

Paged query names are the only names accepted by `client.createPagedQuery(...)`.
