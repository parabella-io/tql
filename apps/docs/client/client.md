# Client Setup

`Client<S extends ClientSchema>` is the frontend entry point.

## Constructor

```ts
export const tql = new Client<ClientSchema>({
  transports: {
    http: new HttpTransport({
      url: 'http://localhost:3001',
      withCredentials: true,
    }),
  },
  defaultTransport: 'http',
});
```

`defaultTransport` is optional and defaults to `'http'`.

## Options

| Option | Description |
| --- | --- |
| `transports` | Registered transports keyed by name. The current `TransportKey` is `'http'`. |
| `defaultTransport` | Transport used by queries and mutations that do not specify `transport`. |

## HTTP transport

`HttpTransport` posts to the server's `/query` and `/mutation` endpoints:

```ts
new HttpTransport({
  url: 'http://localhost:3001',
  withCredentials: true,
});
```

Use `withCredentials: true` when the API uses cookie-backed sessions, as the example app does with Better Auth.

## Custom transport

A transport implements:

```ts
type Transport = {
  query: (payload: Record<string, unknown>) => Promise<unknown>;
  mutation: (payload: Record<string, unknown>) => Promise<unknown>;
};
```

This lets the client runtime stay independent from HTTP details. Future transports can use the same query and mutation objects.

## Factory methods

```ts
tql.createQuery(name, options);
tql.createPagedQuery(name, options);
tql.createMutation(name, options);
```

Each object captures the selected transport at creation time. You can override transport per query or mutation:

```ts
tql.createQuery('ticketById', {
  queryKey: 'ticket',
  transport: 'http',
  query: (params) => ({
    query: { id: params.id },
    select: { title: true },
  }),
});
```

## Imperative APIs

For one-off calls, use:

```ts
const response = await tql.query('ticketById', {
  query: { id: ticketId },
  select: { title: true },
});

const output = await tql.mutation('createTicket', {
  workspaceId,
  ticketListId,
  title,
});
```

The object APIs are preferred for UI because they integrate with the stores and React hooks.

## Reset

```ts
tql.reset();
```

`reset()` clears query, paged query, and mutation stores. The example app calls it on sign-out so data from one authenticated session does not leak into the next.
