# React

`@tql/client` ships React hooks for queries, mutations, paged queries, and infinite paged queries. They subscribe directly to the stores owned by the query or mutation object, so no provider is required.

## `useQuery`

```ts
const { data, pagingInfo, error, isLoading, isError } = useQuery({
  query: ticketQuery,
  params: { id: ticketId },
  isEnabled: true,
});
```

Behavior:

- Registers the query on mount.
- Executes it if enabled and stale.
- Subscribes with `useSyncExternalStore`.
- Returns projected `data` based on the query object's `select` and `include`.

Use `isEnabled: false` when required params are not ready.

## `useMutation`

```ts
const createTicket = useMutation({
  mutation: createTicketMutation,
});

await createTicket.mutate({
  workspaceId,
  ticketListId,
  title,
});
```

The hook returns mutation state and a `mutate` function. `mutate` resolves to the typed server mutation output or throws when the server returns an error.

## `usePagedQuery`

```ts
const members = usePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});
```

Use this for page-based UI. It exposes page navigation helpers, current page data, loading state, error state, and local update helpers.

## `useInfinitePagedQuery`

```ts
const members = useInfinitePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});
```

Use this for infinite scroll or feed UIs. It combines loaded chunks into a single data array and exposes `loadNextPage`.

## No provider

The client stores live in the `Client` instance:

```ts
export const tql = new Client<ClientSchema>({
  transports: {
    http: new HttpTransport({ url: 'http://localhost:3001' }),
  },
});
```

Every query and mutation created from `tql` shares those stores. If you create multiple `Client` instances, they do not share cache state.

## Example consumers

The example app uses these hooks throughout `apps/app/src/features`:

- Workspace lists use `useQuery(myWorkspacesQuery)`.
- Board columns use `useQuery(ticketListsQuery)`.
- Member tables use `usePagedQuery(workspaceMembersPagedQuery)`.
- Ticket details use `useQuery(ticketQuery)` plus mutations for labels, assignees, and attachments.
- Drag-and-drop uses `useMutation(moveTicketMutation)` with optimistic cache updates.
