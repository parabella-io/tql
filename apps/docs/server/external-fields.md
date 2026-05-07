# External Fields

External fields are computed or virtual model fields. They are selected like normal fields, but resolved separately from the model's stored row shape.

Use them when a value is not part of the model's base Zod schema, such as:

- A derived count.
- A signed URL.
- A computed status.
- A denormalized value fetched from another service.

## Define an external field

External fields live inside `schema.model(...)`:

```ts
export const ticket = schema.model('ticket', {
  // ... model config

  externalFields: ({ externalField }) => ({
    attachmentCount: externalField({
      schema: z.number(),
      resolve: async ({ context, entities }) => {
        const counts = await ticketAttachmentsService.countByTicketIds(context.user, {
          ticketIds: entities.map((ticket) => ticket.id),
        });

        return entities.map((ticket) => counts[ticket.id] ?? 0);
      },
    }),
  }),
});
```

## Resolver contract

The resolver receives every entity that selected the external field:

```ts
resolve: async ({ context, entities }) => {
  // return one value per entity
};
```

::: warning Preserve entity order
An external field resolver must return exactly one value for each input entity, in the same order as `entities`. `tql` assigns returned values by array position, so sorting, filtering, or returning values in lookup order will attach data to the wrong entity.
:::

The field value is validated with the external field `schema` before it is returned to the client.

## Select from the client

Once generated, an external field is selected like any other field:

```ts
export const ticketQuery = tql.createQuery('ticketById', {
  queryKey: 'ticket',
  query: (params: { id: string }) => ({
    query: { id: params.id },
    select: {
      title: true,
      attachmentCount: true,
    },
  }),
});
```

## Authorization

External fields participate in the same request lifecycle as selected data. Keep resolvers authorization-aware and use model `allowEach` for row-level access before computing values.
