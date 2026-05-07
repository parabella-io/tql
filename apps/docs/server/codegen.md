# Codegen

`generateSchema` emits the type-only contract that `@parabella-io/tql-client` consumes.

## Enable generation

The example backend enables schema generation in `apps/api/src/server.ts`:

```ts
const tqlServer: TQLServer<ClientSchema> = new TQLServer({
  schema,
  generateSchema: {
    enabled: true,
    outputPath: './__generated__/schema.d.ts',
  },
  createContext,
  plugins: createTqlPlugins(),
});
```

The generated file is re-exported by `apps/api/src/index.ts`, so the frontend imports:

```ts
import type { ClientSchema } from '@tql/api';
```

## What is generated

The generated module contains:

- Entity interfaces.
- `SchemaEntities`.
- Per-model select maps.
- Per-model include maps.
- Query input types.
- `QueryInputMap`.
- `QueryRegistry`.
- Mutation input and output maps.
- `ClientSchema`.
- Projection helper aliases.

## Why type-only

`@parabella-io/tql-client` does not need a generated runtime client. The runtime client is generic:

```ts
export const tql = new Client<ClientSchema>({
  transports: {
    http: new HttpTransport({
      url: 'http://localhost:3001',
      withCredentials: true,
    }),
  },
});
```

The generated `ClientSchema` constrains the names and payloads passed to this generic client.

## Query typing

Generated query maps make this type-check:

```ts
tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: { id: params.id },
    select: { title: true },
  }),
});
```

If you use a query name, query arg, selected field, or include that is not present in the server schema, TypeScript reports it.

## Mutation typing

Generated mutation maps make mutation input and output typed:

```ts
tql.createMutation('createTicket', {
  mutationKey: 'createTicket',
  mutation: (params) => ({
    workspaceId: params.workspaceId,
    ticketListId: params.ticketListId,
    title: params.title,
  }),
  onSuccess: ({ output }) => {
    output.ticket.id;
  },
});
```

`output.ticket` is inferred from the server mutation's Zod `output` schema.

## Hash header

Generated files include a schema hash comment. It lets tooling detect whether the file represents the current server schema. Treat the file as generated output and do not hand-edit it.

## When generation runs

Generation runs when the `Server` is constructed with `generateSchema` enabled. You can also call `generateSchema(...)` directly from scripts if you want a build-time codegen step.
