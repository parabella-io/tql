# Authoring Plugins

Use plugins when behavior cuts across many resolvers or belongs to the framework request lifecycle rather than one service method.

## Start with `definePlugin`

```ts
import { definePlugin } from '@tql/server/plugins';

export const timingPlugin = () =>
  definePlugin({
    name: 'timing',
    async onResolveQueryNode({ node, next }) {
      const start = performance.now();

      try {
        return await next();
      } finally {
        console.log(`[tql] ${node.path} resolved in ${performance.now() - start}ms`);
      }
    },
  });
```

Always give plugins a stable `name`; logs and diagnostics use it.

## All `ServerPlugin` hooks and options

A plugin object may define the following. Only **`name`** is required; everything else is optional.

| Member | Kind | When it runs |
| --- | --- | --- |
| **`name`** | string (required) | Identifies the plugin in logs and diagnostics. |
| **`requestTimeoutMs`** | number | Request-level timeout in milliseconds. The runner uses the **minimum** of this value across all registered plugins. |
| **`setup`** | hook | Once at server startup (`{ server }` with the root logger). |
| **`createPluginContext`** | hook | Start of each request; return values are **merged** into `ctx.plugin` (and receive `request`, `body`, `schemaContext`, `signal`, and the partial `pluginContext` built so far). |
| **`beforeQuery`** | hook | After planning, before any query batch resolves (`ctx`, `plan`). |
| **`beforeMutation`** | hook | After planning, before any mutation batch runs (`ctx`, `plan`). |
| **`onResolveQueryNode`** | hook | Wraps each query or include node; must `return next(overrides?)` (or a substituted result). Args: `ctx`, `node`, optional `parents`, `next`. |
| **`onResolveExternalField`** | hook | Wraps each external-field batch; must `return next(overrides?)`. Args: `ctx`, `node` (`path`, `fieldName`, `modelName`, `extensions`), `entities`, `next`. |
| **`onResolveMutation`** | hook | Wraps each mutation entry in the batch; must `return next()` (or a substituted result). Args: `ctx`, `entry` (plan entry for that mutation), `next`. |
| **`afterQuery`** | hook | After the query batch finishes (`ctx`, `plan`, `result`, `costs`). |
| **`afterMutation`** | hook | After the mutation batch finishes (`ctx`, `plan`, `result`, `inputs`, `costs`). |
| **`afterResponse`** | hook | After the HTTP response is sent (`ctx`). Use for background work (effects, flush queues). |
| **`onError`** | hook | When the framework turns a failure into a `TQLServerError` before serialization; return another error to replace it, or `void` / `undefined` to keep the original. |

Resolver hooks (`onResolve*`) are async and form a chain: each plugin’s hook wraps `next`, which invokes the rest of the stack and the real resolver.

## Wrap resolvers

Resolver hooks receive `next`. Call it to continue the chain or return your own result to short-circuit:

```ts
async onResolveMutation({ entry, next }) {
  if (shouldSkip(entry)) {
    return cachedMutationResult;
  }

  return next();
}
```

Use short-circuiting carefully. Plugins that bypass resolvers must still return the same shape the runtime expects.

## Add request context

```ts
definePlugin({
  name: 'tenant',
  createPluginContext({ schemaContext }) {
    return {
      tenantId: schemaContext.user.workspaceIds[0],
    };
  },
});
```

Returned fields merge into `ctx.plugin`. Plugins can also copy values into schema context if resolvers should see them.

## Extend resolver options

Plugins can add typed metadata to queries, includes, mutations, and external fields:

```ts
declare module '@tql/server' {
  interface QuerySingleOptionsExtensions<QueryArgs> {
    audit?: {
      action: string;
      resource?: (query: QueryArgs) => string;
    };
  }
}
```

Then resolvers can opt in:

```ts
ticketById: querySingle({
  query: z.object({ id: z.string() }),
  audit: {
    action: 'read_ticket',
    resource: (query) => query.id,
  },
  resolve: async ({ context, query }) => ticketsService.getById(context.user, query),
});
```

Prefer namespaced option keys to avoid collisions between plugins.

## Error handling

`onError` can transform or redact framework errors before serialization (see the table above). Return a different `TQLServerError` instance to replace the one sent to the client; return nothing to leave it unchanged. Built-in plugins import that class from the same module graph as `@tql/server`; follow their imports if you need to construct replacement errors.

```ts
definePlugin({
  name: 'redact-errors',
  onError({ error }) {
    // Replace with a new `TQLServerError` when hiding details (see `@tql/server` built-ins for imports).
    return shouldHideDetails(error) ? redact(error) : error;
  },
});
```

Do not hide operational signals from logs. Redact the client response, not your observability pipeline.

## Use `afterResponse`

Use `afterResponse` for work that should happen after the HTTP response is sent:

```ts
definePlugin({
  name: 'effects',
  async afterResponse({ ctx }) {
    await flushQueuedEffects(ctx);
  },
});
```

This is useful for background effects, async audit logs, or side-channel notifications.

## Testing guidance

Test custom plugins at two levels:

- Unit-test hook behavior by passing fake hook args and `next`.
- Integration-test with a small schema to verify ordering, context merging, errors, and response shape.

The server package includes plugin-system tests under `packages/server/test/plugins`.
