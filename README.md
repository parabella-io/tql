# tql

> [!WARNING]
> **Experimental.** This repository is an early-stage prototype under active development. APIs, package boundaries, generated schema format and on-the-wire protocol are all subject to breaking changes without notice. Not recommended for production use.

> A typed, end-to-end query layer that exposes your API directly as an ORM — schema, queries, mutations, change-events and React bindings included.

## Why

`tql` exists to merge the **behaviour of GraphQL** — a single typed graph, selectable fields, nested relational includes resolved in one round-trip — with the **developer experience of tRPC**: no SDL, no codegen step you have to run, no client-side query language, just plain TypeScript end-to-end with full inference from server to component.

It also takes a deliberately different stance on client-side state management. Most libraries treat the cache as a global key-value store and hand you tools (invalidation, tag matching, manual refetch) to keep it correct. In `tql` **the query owns the logic for how it updates its own state**: every query declares per-entity `onInsert` / `onUpdate` / `onDelete` handlers and reacts to the typed change-events emitted by mutations. State stays consistent because the query — not the consumer — knows how to fold a change into its own shape.

## How

`tql` is built around a single idea: the network shouldn't be in the way. You declare your domain on the server (entities, models, queries, includes, mutations) and consume it on the client with the same shape you'd get from a local ORM. Mutations declare what they change, queries declare what they care about, and the client keeps itself in sync by listening to entity-level change events.

---

## Project structure

```
apps/
  api/   # example backend: schema, models, mutations, services
  app/   # example React frontend that consumes the schema
packages/
  server/   # @tql/server  — Schema, Server, codegen
  client/   # @tql/client  — Client, Query, Mutation, React hooks
  ts-config/
```

---

## The 7 pillars

The flow goes top-down: declare your domain on the server, expose it, then let the client consume it as a typed ORM and bind it to React.

### Server

1. [Define schema entities and the schema context](#1-define-schema-entities-and-the-schema-context)
2. [Define models, queries and includes; define mutations and what they changed](#2-define-models-queries-and-includes-define-mutations-and-what-they-changed)
3. [Define the server, generate the schema for the client](#3-define-the-server-generate-the-schema-for-the-client)

### Client

1. [Expose the API directly as an ORM](#4-expose-the-api-directly-as-an-orm)
2. [Create queries; state updated by listening to CRUD events](#5-create-queries-state-updated-by-listening-to-crud-events)
3. [Create mutations, with optional optimistic updates](#6-create-mutations-with-optional-optimistic-updates)
4. [Consume queries and mutations in React](#7-consume-queries-and-mutations-in-react)

---

### 1. Define schema entities and the schema context

An **entity** is the canonical shape of a record in your domain — the unit that flows through the system and that change events are emitted against.

```17:37:apps/api/src/schema/schema.ts
export type UserEntity = SchemaEntity<{
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}>;

export type WorkspaceEntity = SchemaEntity<{
  name: string;
}>;

export type WorkspaceMemberEntity = SchemaEntity<{
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  isWorkspaceOwner: boolean;
  createdAt: string;
  updatedAt: string;
}>;
```

Entities are bundled into a `SchemaEntities` map and the `Schema` is parameterised by both a `SchemaContext` (your DI container — db, services, current user) and the entity map:

```140:158:apps/api/src/schema/schema.ts
export type SchemaContext = {
  db: PrismaClient;
  userService: UserService;
  workspaceService: WorkspaceService;
  workspaceMemberService: WorkspaceMemberService;
  workspaceTicketLabelService: WorkspaceTicketLabelService;
  workspaceMemberInviteService: WorkspaceMemberInviteService;
  ticketsService: TicketsService;
  ticketListsService: TicketListsService;
  ticketAttachmentsService: TicketAttachmentsService;
  ticketAssigneeService: TicketAssigneeService;
  ticketReporterService: TicketReporterService;
  ticketCommentsService: TicketCommentsService;
  ticketLabelsService: TicketLabelsService;
  storageService: StorageService;
  user: UserContext;
};

export const schema = new Schema<SchemaContext, SchemaEntities>();
```

The context is constructed per-request and is what every resolver receives.

---

### 2. Define models, queries and includes; define mutations and what they changed

#### Models, queries, includes

A **model** binds a Zod schema, the selectable `fields`, row-level access (`allowEach`), entry-point `queries`, and relationship `includes` to an entity:

```5:122:apps/api/src/schema/models/ticket/ticket.model.ts
export const ticket = schema.model('ticket', {
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    workspaceId: z.string(),
    ticketListId: z.string(),
    assigneeId: z.string().nullable(),
    reporterId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),

  fields: ({ field }) => ({
    id: field(),
    title: field(),
    // ...
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },

  queries: ({ querySingle, queryMany }) => ({
    ticketById: querySingle({
      query: z.object({ id: z.string() }),
      resolve: async ({ context, query }) => {
        return context.ticketsService.getById(context.user, { id: query.id });
      },
    }),

    tickets: queryMany({
      query: z.object({
        workspaceId: z.string(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        return context.ticketsService.queryByWorkspaceId(context.user, {
          workspaceId: query.workspaceId,
          limit: query.limit,
          order: query.order,
        });
      },
    }),
  }),

  includes: ({ includeSingle, includeMany }) => ({
    assignee: includeSingle('ticketAssignee', {
      nullable: true,
      matchKey: 'ticketId',
      resolve: async ({ context, parents }) => {
        return context.ticketAssigneeService.queryByTicketIds(context.user, {
          ticketIds: parents.map((parent) => parent.id),
        });
      },
    }),

    // attachments, comments, labels...
  }),
});
```

Includes are resolved as **batched** lookups (parents in, children out) so deep query trees don't fan out into N+1 round trips.

#### Mutations declare what they `changed`

A **mutation** has an input schema, an `allow` guard, a `resolve` function, *and* a `changed` map declaring which entities and which kinds of changes (`inserts`, `updates`, `deletes`) it can produce:

```5:35:apps/api/src/schema/mutations/ticket/createTicket.mutation.ts
export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),

  changed: {
    ticket: {
      inserts: true,
    },
  },

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await context.ticketsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketListId: input.ticketListId,
      title: input.title,
    });

    return {
      ticket: {
        inserts: [ticket],
      },
    };
  },
});
```

The `changed` declaration is what makes reactive client caches possible (see [§5](#5-create-queries-state-updated-by-listening-to-crud-events)). The resolver's return value is type-checked against this declaration.

---

### 3. Define the server, generate the schema for the client

The `Server` takes the full schema, an HTTP adapter and a `createContext` function. With `generateSchema.enabled`, it emits a typed `ClientSchema` bundle that the frontend consumes directly:

```155:185:apps/api/src/server.ts
  const createContext = async ({ request }: { request: FastifyRequest }): Promise<SchemaContext> => {
    return {
      db: db,
      userService: userService,
      workspaceService: workspaceService,
      // ...
      user: request.user,
    };
  };

  const tqlServer: TQLServer<ClientSchema> = new TQLServer({
    schema,
    generateSchema: {
      enabled: true,
      outputPath: './generated/schema.d.ts',
    },
    createContext,
  });

  tqlServer.attachHttp(createFastifyHttpAdapter(server));
```

The generated `ClientSchema` is then re-exported by the API package so the frontend can import it as plain types:

```1:14:apps/api/src/schema/index.ts
export type {
  ClientSchema,
  UserEntity,
  WorkspaceEntity,
  WorkspaceMemberEntity,
  WorkspaceMemberInviteEntity,
  TicketEntity,
  TicketListEntity,
  TicketAssigneeEntity,
  TicketReporterEntity,
  TicketAttachmentEntity,
  TicketCommentEntity,
  TicketLabelEntity,
} from '../generated/schema.d';
```

No GraphQL SDL, no OpenAPI spec, no codegen step the developer has to think about — the schema regenerates itself when you start the server.

---

### 4. Expose the API directly as an ORM

With the schema generated, the client side opens by pointing a typed `Client` at it. The schema becomes a graph the frontend traverses exactly like an ORM — no hand-written REST endpoints per resource, no `fetch` wrappers, no DTO mapping. The client describes *what* it wants (fields + nested includes + filters) and the server resolves it.

```7:18:apps/app/src/shared/lib/tql.ts
export const tql = new Client<ClientSchema>({
  handleQuery: async (query) => {
    const response = await axios.post('/query', query)

    return response.data
  },
  handleMutation: async (mutation) => {
    const response = await axios.post('/mutation', mutation)

    return response.data
  },
})
```

From this point on, every query and mutation in the app is end-to-end typed against the server's schema.

---

### 5. Create queries; state updated by listening to CRUD events

On the client, queries are first-class objects created via `tql.createQuery`. They define *what* to fetch (root query name + params + select + nested includes) and *how* to react to entity-level change events.

```1:39:apps/app/src/api/tickets/queries/ticket.query.ts
import { tql } from '@/shared/lib/tql'

export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: {
      id: params.id,
    },
    select: true,
    include: {
      assignee:    { query: {},                select: true },
      reporter:    { query: {},                select: true },
      attachments: { query: { order: 'asc' },  select: true },
      comments:    { query: { order: 'asc' },  select: true },
      labels:      { query: { order: 'asc' },  select: true },
    },
  }),
})
```

The query then registers `updateOnChange` handlers per-entity. When a mutation's `changed` payload arrives, the client iterates over registered queries and patches their cached state via Immer-style drafts:

```41:90:apps/app/src/api/tickets/queries/ticket.query.ts
ticketQuery.updateOnChange('ticket', {
  onInsert() {},
  onUpdate({ draft, change }) {
    if (!draft || draft.id !== change.id) return
    draft.title = change.title
    draft.description = change.description
  },
  onDelete() {},
})

ticketQuery.updateOnChange('ticketAttachment', {
  onInsert({ draft, change }) {
    if (!draft || draft.id !== change.ticketId) return

    draft.attachments.push(change)
  },
  onUpdate() {},
  onDelete({ draft, change }) {
    if (!draft) return

    draft.attachments = draft.attachments.filter((att) => att.id !== change.id)
  },
})
```

Because invalidation is **entity-scoped** (not key-scoped), unrelated queries that happen to mention the same entity stay consistent without anyone wiring up `invalidateQueries`. Add a new query, add its handlers, done.

---

### 6. Create mutations, with optional optimistic updates

Mutations on the client mirror their server counterpart and may declare an `onOptimisticUpdate` callback that mutates cached query state immediately, before the server responds. If the request fails the change is rolled back; if it succeeds the authoritative `changed` payload reconciles state.

A simple mutation — no optimistic update needed:

```9:16:apps/app/src/api/tickets/mutations/create-ticket.mutation.ts
export const createTicketMutation = tql.createMutation('createTicket', {
  mutationKey: 'createTicket',
  mutation: (params: CreateTicketParams) => ({
    workspaceId: params.workspaceId,
    ticketListId: params.ticketListId,
    title: params.title,
  }),
})
```

A drag-and-drop reorder where you *do* want the UI to feel instant:

```11:44:apps/app/src/api/tickets/mutations/move-ticket.mutation.ts
export const moveTicketMutation = tql.createMutation('moveTicket', {
  mutationKey: 'moveTicket',
  mutation: (params: MoveTicketParams) => ({
    id: params.id,
    oldTicketListId: params.oldTicketListId,
    newTicketListId: params.newTicketListId,
  }),
  onOptimisticUpdate: ({ store, input }) => {
    const ticketLists = store.getAll(ticketListsQuery)

    ticketLists.update((draft) => {
      let movedTicket: any = null

      const oldList = draft!.find((list) => list.id === input.oldTicketListId)

      if (oldList) {
        const idx = oldList.tickets.findIndex((t) => t.id === input.id)

        if (idx !== -1) {
          movedTicket = oldList.tickets.splice(idx, 1)[0]
        }
      }

      if (movedTicket) {
        const newList = draft!.find((list) => list.id === input.newTicketListId)

        if (newList) {
          movedTicket.ticketListId = input.newTicketListId
          newList.tickets.push(movedTicket)
        }
      }
    })
  },
})
```

`store.getAll(query)` gives you typed access to every active instance of a query so you can patch them in one place.

---

### 7. Consume queries and mutations in React

`@tql/client` ships `useQuery` and `useMutation` hooks. They take the query/mutation object you defined above — there are no string keys, no manual cache layer, no manual subscription wiring.

```16:23:apps/app/src/features/dashboard/components/workspaces-list.tsx
    const { data, isLoading } = useQuery({
        query: myWorkspacesQuery,
        params: {},
    })
```

```19:37:apps/app/src/features/dashboard/components/dialogs/create-workspace.dialog.tsx
    const createWorkspace = useMutation({
        mutation: createWorkspaceMutation,
    })

    const form = useAppForm({
        defaultValues: {
            name: '',
        },
        validators: {
            onChange: CreateWorkspaceFormSchema,
        },
        onSubmit: async ({ value }) => {
            await createWorkspace.mutate({
                name: value.name,
            })

            onOpenChange(false)
        }
    })
```

When `createWorkspace.mutate(...)` resolves, the server's `changed` payload flows through every query subscribed to the `workspace` entity, `WorkspacesList` re-renders with the new row, and no one had to think about cache invalidation.

---

## Getting started

See [HOW_TO_START.md](./HOW_TO_START.md) for the local setup. In short:

```sh
docker compose up -d
pnpm i
pnpm db:push
pnpm dev
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) — async effects, message-bus reactors, real-time subscriptions, entity-level Redis caching.