# Client

`@tql/client` consumes the generated `ClientSchema` and gives the frontend typed query objects, mutation objects, local stores, transports, and React hooks.

## Create a client

The example app creates one shared client in `apps/app/src/shared/lib/tql.ts`:

```ts
import { Client, HttpTransport } from '@tql/client';
import type { ClientSchema } from '@tql/api';

export const tql = new Client<ClientSchema>({
  transports: {
    http: new HttpTransport({
      url: 'http://localhost:3001',
      withCredentials: true,
    }),
  },
});
```

The `ClientSchema` type comes from the backend package and makes query names, mutation names, input payloads, selected fields, includes, paging, and mutation outputs type-safe.

## What the client owns

Each `Client` owns:

- A normal query store.
- A paged query store.
- A mutation store.
- Registered transports.
- Factory methods for queries, paged queries, and mutations.

No React provider is required. Queries and mutations created from the same client share the same stores.

## Main APIs

### Query

`createQuery` builds a typed root query object (single-record reads and non-paginated lists):

```ts
const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: { id: params.id },
    select: { title: true, description: true },
  }),
});
```

### Paged query

`createPagedQuery` builds cursor-aware list queries that pair with paginated `queryMany` roots on the server:

```ts
const workspaceMembersPagedQuery = tql.createPagedQuery('workspaceMembers', {
  queryKey: 'workspaceMembers',
  pageSize: 20,
  query: (params: { workspaceId: string }, pagingInfo) => ({
    query: { workspaceId: params.workspaceId },
    select: { userId: true, name: true, email: true },
    pagingInfo,
  }),
});
```

### Mutation

`createMutation` builds a typed write object:

```ts
const createTicketMutation = tql.createMutation('createTicket', {
  mutationKey: 'createTicket',
  mutation: (params) => ({
    workspaceId: params.workspaceId,
    ticketListId: params.ticketListId,
    title: params.title,
  }),
});
```

### React hooks

React integrations subscribe to those objects (see [Integrations](/client/integrations/)):

```ts
const ticket = useQuery({
  query: ticketQuery,
  params: { id: ticketId },
});

const members = usePagedQuery({
  query: workspaceMembersPagedQuery,
  params: { workspaceId },
});

const createTicket = useMutation({
  mutation: createTicketMutation,
});
```

## Read next

- [Client Setup](/client/client)
- [Queries](/client/queries)
- [Paged Queries](/client/paged-queries)
- [Mutations](/client/mutations)
- [Integrations](/client/integrations/) (e.g. [React](/client/integrations/react))
