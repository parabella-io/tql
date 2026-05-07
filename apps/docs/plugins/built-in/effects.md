# Effects

```ts
import { effectsPlugin, InMemoryEffectQueue } from '@tql/server/plugins/built-in/effects';

const effects = effectsPlugin({
  queue: new InMemoryEffectQueue(),
});
```

Register `effects` on your `Server` like any other plugin. The plugin exposes `effects.drain()` so you can wait for queued work to finish (for example in tests or graceful shutdown).

## How it works with mutations

1. A mutation **resolver** runs and returns `{ data, error }` as usual. The HTTP response can be sent to the client with that payload.
2. On **`afterMutation`**, the plugin looks at each mutation in the plan. For entries that **succeeded** (no error, valid data) and define **`resolveEffects`**, it records a pending task.
3. On **`afterResponse`** (after the response has been sent), those tasks are **enqueued** on your `EffectQueue`. They run asynchronously with whatever concurrency your queue implements.

So `resolveEffects` is **not** part of the critical path of the mutation response. If it throws, the client has already received success; handle failures with `onError` on the queue or inside your effect.

## Mutation example

Opt in per mutation with **`resolveEffects`**. It receives the same **`input`** and typed **`output`** as your resolver, plus **`context`**:

```ts
import { z } from 'zod';

import { schema } from './schema';

export const createTicket = schema.mutation('createTicket', {
  input: z.object({
    workspaceId: z.string(),
    title: z.string().min(1),
  }),

  output: z.object({
    ticket: z.object({
      id: z.string(),
      title: z.string(),
      workspaceId: z.string(),
    }),
  }),

  allow: ({ context, input }) => {
    return context.user.workspaceIds.includes(input.workspaceId);
  },

  resolve: async ({ context, input }) => {
    const ticket = await ticketsService.create(context.user, input);
    return { ticket };
  },

  resolveEffects: async ({ context, input, output }) => {
    await notificationsService.notifyWorkspaceMembers(context.user, {
      workspaceId: input.workspaceId,
      message: `New ticket: ${output.ticket.title}`,
    });
  },
});
```

Types for `input` and `output` come from your mutation’s Zod `input` / `output` schemas once the effects plugin’s module augmentation is loaded (import from `@tql/server/plugins/built-in/effects` in the file that defines the mutation, or ensure that import is part of your server bundle).

## Behaviour notes

- **Success only** — If the mutation fails validation, `allow`, or `resolve`, or returns an error envelope, `resolveEffects` is **not** run for that entry.
- **Batched mutations** — If the client sends several mutations in one request, each successful entry with `resolveEffects` can enqueue its own task.
- **Queue** — `InMemoryEffectQueue` is fine for development and single-process apps. For production, implement `EffectQueue` to push work to a worker, message bus, or durable outbox.
