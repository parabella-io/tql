# Paged Queries

Paged queries are cursor-aware query objects for list UIs. They are created with `client.createPagedQuery(...)` and can only target server query names generated as paginated `queryMany` roots.

## Create a paged query

```ts
export const workspaceMembersPagedQuery = tql.createPagedQuery('workspaceMembers', {
  queryKey: 'workspaceMembers',
  pageSize: 20,
  query: (params: { workspaceId: string }, pagingInfo) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    select: {
      userId: true,
      name: true,
      email: true,
      isWorkspaceOwner: true,
    },
    pagingInfo,
  }),
});
```

The query builder receives both UI params and paging input.

## Paging state

Paged query state is stored as chunks:

```ts
type PagedQueryChunk<TData> = {
  data: TData;
  pagingInfo: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: unknown;
    endCursor?: unknown;
  };
};
```

The store can append, prepend, or replace chunks depending on how the query is used.

## Hooks

Use `usePagedQuery` for table-style pagination:

```ts
const members = usePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});

await members.loadNextPage();
await members.goToPage(2);
```

Use `useInfinitePagedQuery` for feed-style lists:

```ts
const members = useInfinitePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});

await members.loadNextPage();
```

The infinite hook flattens chunks into one data array for rendering.

## Local list edits

Paged hooks expose local update helpers for immediate UI updates:

```ts
members.update((draft) => {
  const member = draft.find((item) => item.userId === removedUserId);
  if (member) {
    member.name = 'Removed';
  }
});
```

Mutation optimistic store methods can also target paged query entries.

## Cache identity

Paged query cache identity is based on:

- `queryKey`
- UI params

Paging input changes which chunk is loaded but does not create a separate root cache entry for the same list.

## When to use ordinary queries

Use `createQuery` when the server returns a complete list or a small bounded list. Use `createPagedQuery` when the server query is paginated and the UI needs page navigation or infinite loading.
