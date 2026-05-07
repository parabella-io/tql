# Queries

Client queries are typed objects created by `client.createQuery(...)`. They know how to build a server query payload, execute it through a transport, cache the result, and notify subscribers.

## Create a query

```ts
export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: {
      id: params.id,
    },
    select: {
      title: true,
      description: true,
      workspaceId: true,
    },
    include: {
      comments: {
        query: { order: 'asc' },
        select: { content: true, createdAt: true },
      },
    },
  }),
});
```

The first argument must be a query name generated from the server schema. The `query()` function returns the full server query input for that name.

## Options

| Option | Description |
| --- | --- |
| `queryKey` | Stable logical cache key. |
| `query` | Function mapping UI params to server query input. |
| `staleTimeInMs` | Optional freshness window for cached data. |
| `isEnabled` | Optional default enable flag. |
| `transport` | Optional transport override. |

## `select`

`select` controls scalar fields returned for the model:

```ts
select: {
  title: true,
  description: true,
}
```

The response type is projected from the exact fields selected by this object.

## `include`

`include` selects nested model relationships:

```ts
include: {
  assignee: {
    query: {},
    select: {
      name: true,
    },
  },
  attachments: {
    query: { order: 'asc' },
    select: {
      key: true,
      name: true,
      size: true,
    },
  },
}
```

Each include has its own `query`, `select`, and optional nested `include`.

## Cache identity

Normal queries are cached by a hash of:

- `queryKey`
- the result of `query(params)`

This means two calls with the same logical key and same generated query payload share the same store entry.

## Query instance methods

Useful methods on a `Query` object include:

| Method | Purpose |
| --- | --- |
| `register(params)` | Ensures a query is in the store and executes it when stale. |
| `execute(params)` | Runs the query immediately, deduping concurrent calls for the same hash. |
| `getState(params)` | Reads state for a registered query. |
| `getStateOrNull(params)` | Reads state or returns `null`. |
| `getData(params)` | Reads current data. |
| `getError(params)` | Reads current error. |
| `getPagingInfo(params)` | Reads paging metadata for ordinary query-many responses. |
| `subscribe(params, callback)` | Subscribes to state changes. |
| `getHashKey(params)` | Returns the cache hash. |
| `getAllHashKeys()` | Returns all hashes registered for this query object. |
| `getHashKeysWhere(partialParams)` | Finds hashes whose params partially match. |

React hooks use `register` and `subscribe` for you.

## Staleness and dedupe

`register(params)` executes when the entry is new or stale. `execute(params)` coalesces in-flight requests with the same hash, so repeated calls do not trigger duplicate network requests while the first is pending.

## Query state

Query state contains:

```ts
{
  data,
  error,
  isLoading,
  pagingInfo,
  staleAtTimestamp
}
```

Use `useQuery` for components and the optimistic store API inside mutations.
