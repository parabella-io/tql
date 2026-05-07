# Server

`@parabella-io/tql-server` owns the application graph. It defines entities, models, queries, includes, mutations, runtime validation, plugin hooks, HTTP adapters, and the generated `ClientSchema` consumed by `@parabella-io/tql-client`.

## Attach the server

The example backend in `apps/api` uses Fastify, Prisma/PostgreSQL, Better Auth, and `@parabella-io/tql-server` for `/query` and `/mutation`, with built-in security, rate limit, logging, effects, and request-id plugins.

The server is constructed and attached in `apps/api/src/server.ts`:

```ts
import { Server } from '@parabella-io/tql-server';
import type { ClientSchema } from '@tql/api';

const tqlServer = new Server<ClientSchema>({
  schema,
  generateSchema: {
    enabled: true,
    outputPath: './__generated__/schema.d.ts',
  },
  createContext,
  plugins: createTqlPlugins(),
});

tqlServer.attachHttp(createFastifyHttpAdapter(server));
```

The example app sometimes aliases `Server` as `TQLServer` in local imports; it is the same class.

## What the server owns

`@parabella-io/tql-server` performs these jobs:

- Registers model and mutation definitions through `Schema`.
- Builds request plans from `/query` and `/mutation` bodies.
- Validates incoming input with Zod schemas.
- Runs authorization guards before returning rows or outputs.
- Resolves nested includes in batches.
- Projects selected fields into the response.
- Runs plugins across the request and resolver lifecycle.
- Emits a generated `ClientSchema` TypeScript module.

## Main APIs

### Schema

The registry for every model and mutation; parameterized by request context and your entity map:

```ts
import { Schema, type SchemaEntity, type ClientSchema } from '@parabella-io/tql-server';

export type SchemaContext = { user: UserContext };
export type SchemaEntities = { ticket: TicketEntity; workspace: WorkspaceEntity };

export const schema = new Schema<SchemaContext, SchemaEntities>();
```

Additional subpaths cover shared types, logging, plugins, and built-ins (for example `@parabella-io/tql-server/plugins`, `@parabella-io/tql-server/plugins/built-in/security`).

### Queries and includes

Models expose `querySingle`, `queryMany`, and `include` trees; paginated lists use `queryMany` at the root for client paged queries:

```ts
ticket: schema.model('ticket', {
  queries: {
    ticketById: querySingle({
      query: z.object({ id: z.string() }),
      allow: ({ context, query }) => /* ... */,
      resolve: async ({ context, query }) => /* ... */,
    }),
  },
  includes: {
    assignee: includeSingle({
      /* ... */
    }),
  },
});
```

### Mutations

Named writes with Zod input/output, `allow`, and `resolve`:

```ts
export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    ticketListId: z.string(),
    title: z.string().min(1),
  }),
  output: z.object({ ticket: ticketOutputSchema }),
  allow: ({ context, input }) => context.user.workspaceIds.includes(input.workspaceId),
  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, input);
    return { ticket };
  },
});
```

### HTTP adapter and context

`Server` wires the schema to HTTP and builds `SchemaContext` per request:

```ts
const createContext = async ({ request }: { request: unknown }): Promise<SchemaContext> => ({
  user: /* from session */,
});
```

Use `createFastifyHttpAdapter` (or another adapter) so `attachHttp` exposes the tql routes on your app server.

## Read next

- [Schema](/server/schema)
- [Models](/server/models)
- [Queries](/server/queries)
- [Includes](/server/includes)
- [External Fields](/server/external-fields)
- [Mutations](/server/mutations)
- [Server Runtime](/server/server-runtime)
- [Codegen](/server/codegen)
