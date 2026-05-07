# Mutations

Mutations are server write operations. They validate input, authorize the write, execute application code, validate output, and return a typed payload to the client.

## Mutation shape

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
    const ticket = await ticketsService.create(context.user, {
      workspaceId: input.workspaceId,
      ticketListId: input.ticketListId,
      title: input.title,
    });

    return { ticket };
  },
});
```

This example is from `apps/api/src/schema/mutations/ticket/createTicket.mutation.ts`.

## Options

| Option    | Description                                               |
| --------- | --------------------------------------------------------- |
| `input`   | Required Zod object for mutation input.                   |
| `output`  | Required Zod schema for the response payload.             |
| `allow`   | Required guard. Receives `{ context, input }`.            |
| `resolve` | Required resolver. Receives `{ context, input, signal }`. |

Plugin option keys such as `security`, `rateLimit`, and `cache` are added by declaration merging when their plugins are imported.

## Output schemas

The example app centralizes reusable output schemas in `apps/api/src/schema/mutations/outputSchemas.ts`. This keeps mutation outputs consistent:

```ts
output: z.object({
  ticket: ticketOutputSchema,
});
```

The generated `ClientSchema` uses this output shape for:

- `client.mutation('createTicket', input)`
- `createTicketMutation.execute(params)`
- `onSuccess({ output })` on the client

## Mutation response envelope

Mutation responses are keyed by mutation name:

```json
{
  "createTicket": {
    "data": {
      "ticket": {
        "id": "ticket_123",
        "title": "Fix docs"
      }
    },
    "error": null
  }
}
```

If a mutation fails, `data` is absent or `null` and `error` contains a formatted `TQLServerError`.
