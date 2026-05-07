# Models

Models bind entity types to runtime validation, selectable scalar fields, and row-level authorization.

## Model shape

```ts
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
    description: field(),
    workspaceId: field(),
  }),

  allowEach: ({ context, entity }) => {
    return context.user.workspaceIds.includes(entity.workspaceId);
  },
});
```

This example comes from `apps/api/src/schema/models/ticket/ticket.model.ts`.

## `schema`

The model `schema` is a Zod object used to validate rows returned by root queries and includes.

If a resolver returns a malformed row, the request fails before data is serialized to the client. This keeps the generated type contract honest at runtime.

## `fields`

`fields` defines the selectable scalar fields for the model.

```ts
fields: ({ field }) => ({
  id: field(),
  title: field(),
  description: field(),
});
```

Each field may also carry authorization metadata through `field({ allow })` when a scalar needs stronger access rules than the row itself.

```ts
fields: ({ field }) => ({
  id: field(),
  name: field(),
  email: field({
    allow: ({ context, entity }) => {
      return context.user.id === entity.id;
    },
  }),
});
```

In this example, users can select their own `email` field, but not another user's email. The `allow` callback receives the request `context` and the entity row being projected.

## `allowEach`

`allowEach` runs after rows are loaded and validated. It is the row-level authorization gate:

```ts
allowEach: ({ context, entity }) => {
  return context.user.workspaceIds.includes(entity.workspaceId);
};
```

Use this for tenant and ownership checks that depend on the returned entity.
