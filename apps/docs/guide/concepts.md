# Concepts

`tql` has seven core building blocks. The server defines the graph and the client consumes it as typed query and mutation objects.

## 1. Entities

An entity is the canonical shape of a record in your domain. In `apps/api/src/schema/schema.ts`, each entity is wrapped in `SchemaEntity<T>` and collected into a `SchemaEntities` map:

```ts
export type TicketEntity = SchemaEntity<{
  title: string;
  description: string;
  workspaceId: string;
  ticketListId: string;
  assigneeId: string | null;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}>;

export type SchemaEntities = {
  ticket: TicketEntity;
  ticketList: TicketListEntity;
};
```

There is no `schema.entity()` call. Entity names come from the `SchemaEntities` generic passed to `new Schema<Context, Entities>()`.

## 2. Schema context

`SchemaContext` is the request-scoped dependency container passed to every resolver. In the example app it contains the authenticated user and logger:

```ts
export type SchemaContext = {
  user: UserContext;
  logger?: {
    error: (...args: unknown[]) => void;
  };
};
```

Your app can put services, database clients, tenant data, feature flags, or request metadata here.

## 3. Models

A model binds an entity to runtime validation, field selection, authorization, root queries, and includes.

```ts
export const ticket = schema.model('ticket', {
  schema: z.object({
    id: z.string(),
    title: z.string(),
    workspaceId: z.string(),
    ticketListId: z.string(),
  }),
  fields: ({ field }) => ({
    id: field(),
    title: field(),
    workspaceId: field(),
    ticketListId: field(),
  }),
  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },
});
```

`schema` validates resolver output. `fields` controls selectable scalar fields. `allowEach` enforces row-level access after rows are loaded.

## 4. Queries

Queries are server entry points. A model can expose `querySingle` and `queryMany` roots:

```ts
tickets: queryMany({
  query: z.object({
    workspaceId: z.string(),
    limit: z.number(),
    order: z.enum(['asc', 'desc']),
  }),
  resolve: async ({ context, query }) => {
    return ticketsService.queryByWorkspaceId(context.user, query);
  },
});
```

The input is parsed by Zod before `resolve` runs. The result is parsed against the target model schema before it is serialized.

## 5. Includes

Includes define relationships. They are batched: the resolver receives all parent rows and returns all children in one call.

```ts
comments: includeMany('ticketComment', {
  matchKey: 'ticketId',
  query: z.object({
    order: z.enum(['asc', 'desc']),
  }),
  resolve: async ({ context, query, parents }) => {
    return ticketCommentsService.queryByTicketIds(context.user, {
      ticketIds: parents.map((parent) => parent.id),
      order: query.order,
    });
  },
});
```

The `matchKey` tells `tql` which child field points back to the parent id.

## 6. Mutations

Mutations define writes. They have input validation, output validation, an authorization guard, and a resolver.

```ts
export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),
  output: z.object({
    ticket: ticketOutputSchema,
  }),
  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },
  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, input);
    return { ticket };
  },
});
```

The output schema becomes the typed payload available to client `onSuccess` hooks.

## 7. Client queries, mutations, and React hooks

The frontend creates typed query, paged query, and mutation objects from the shared `Client`.

### Normal query

Use `createQuery` for a single record or a bounded non-paged list:

```ts
export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: { id: params.id },
    select: { title: true },
  }),
});
```

Subscribe to it with `useQuery`:

```ts
const { data, isLoading, error } = useQuery({
  query: ticketQuery,
  params: { id: ticketId },
});
```

### Paged query

Use `createPagedQuery` when the server query is cursor-paginated:

```ts
export const workspaceMembersPagedQuery = tql.createPagedQuery('workspaceMembers', {
  queryKey: 'workspaceMembers',
  pageSize: 20,
  query: (params: { workspaceId: string }, pagingInfo) => ({
    query: {
      workspaceId: params.workspaceId,
    },
    select: {
      name: true,
      email: true,
    },
    pagingInfo,
  }),
});
```

Subscribe to it with `usePagedQuery`:

```ts
const members = usePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});
```

### Mutation with cache update

Use `createMutation` for writes. Mutations can also update cached query state after a successful server response:

```ts
export const createTicketMutation = tql.createMutation('createTicket', {
  mutationKey: 'createTicket',
  mutation: (params: { workspaceId: string; title: string }) => ({
    workspaceId: params.workspaceId,
    title: params.title,
  }),
  onSuccess: ({ store, output }) => {
    store.getAll(ticketsQuery).update((draft) => {
      draft?.push(output.ticket);
    });
  },
});
```

No provider is required. The `Client` owns the stores used by every query, paged query, and mutation created from it.
