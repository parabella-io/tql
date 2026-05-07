# Schema

`Schema` is the registry for every model and mutation exposed by a `tql` server.

## Create a schema

The schema is parameterized by request context and entity map:

```ts
export type SchemaContext = {
  user: UserContext;
  logger?: {
    error: (...args: unknown[]) => void;
  };
};

export type SchemaEntities = {
  user: UserEntity;
  workspace: WorkspaceEntity;
  ticket: TicketEntity;
  ticketList: TicketListEntity;
};

export const schema: Schema<SchemaContext, SchemaEntities> = new Schema<SchemaContext, SchemaEntities>();
```

The example app keeps this in `apps/api/src/schema/schema.ts`.

## Entities

An entity is a TypeScript type, not a runtime registration call:

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
```

`SchemaEntity<T>` adds the base entity contract used by the schema. Each key in `SchemaEntities` becomes a model name available to `schema.model(...)`.

## Context

`SchemaContext` is built once per request by the `Server`:

```ts
const createContext = async ({ request }: { request: any }): Promise<SchemaContext> => {
  return {
    user: request.user,
    logger: request.log,
  };
};
```

Resolvers receive it as `context`:

```ts
resolve: async ({ context, query }) => {
  return ticketsService.queryByWorkspaceId(context.user, query);
}
```

Use context for app services, auth identity, database clients, tenant ids, and request-scoped tools.

## Registration lifecycle

Models and mutations are registered for their side effects:

```ts
export const ticket = schema.model('ticket', {
  // model config
});

export const createTicket = schema.mutation('createTicket', {
  // mutation config
});
```

The app imports all model and mutation modules before constructing the server, so the `schema` instance contains the full graph.

## Naming

Names are part of the public API:

- Model names come from `SchemaEntities` keys, such as `ticket`, `ticketList`, and `workspaceMember`.
- Query names come from `queries`, such as `ticketById` and `tickets`.
- Mutation names come from `schema.mutation`, such as `createTicket`.
- Include names come from model `includes`, such as `comments` and `assignee`.

Changing a name changes the generated `ClientSchema` and breaks frontend query modules that reference it.
