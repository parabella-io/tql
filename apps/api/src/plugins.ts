import {
  batchPolicy,
  bodyLimitPolicy,
  breadthPolicy,
  complexityPolicy,
  defineAllowedShapes,
  depthPolicy,
  takePolicy,
  timeoutPolicy,
  securityPlugin,
} from '@tql/server/plugins/built-in/security';
import { rateLimitPlugin } from '@tql/server/plugins/built-in/rate-limit';
import { requestIdPlugin } from '@tql/server/plugins/built-in/request-id';
import { effectsPlugin, InMemoryEffectQueue } from '@tql/server/plugins/built-in/effects';
import { loggingPlugin } from '@tql/server/plugins/built-in/logging';
// import { otelPlugin } from '@tql/server/plugins/built-in/otel';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { ClientSchema } from '../__generated__/schema.d.ts';

export const allowedShapes = defineAllowedShapes<ClientSchema>({
  myWorkspaces: {
    select: true,
  },
  myWorkspaceInvites: {
    select: true,
    include: {
      workspace: {
        select: true,
        include: {
          owner: true,
        },
      },
    },
  },
  workspaceTicketLabels: {
    select: true,
  },
  ticketById: {
    select: true,
    include: {
      assignee: true,
      reporter: true,
      attachments: true,
      comments: true,
      labels: true,
    },
  },
  ticketLists: {
    select: true,
    include: {
      tickets: true,
    },
  },
});

export const createTqlPlugins = () => [
  requestIdPlugin(),
  loggingPlugin({ slowQueryMs: 500 }),
  // otelPlugin({ tracerProvider, meterProvider }),
  securityPlugin({
    getPrincipal: (_request, context) => {
      const user = (context as { user?: { id?: string } }).user;
      return user?.id ? { id: user.id } : null;
    },
    requestTimeoutMs: 10_000,
    allowedShapes,
    allowedShapesMode: 'enforce',
    policies: [
      bodyLimitPolicy({
        maxBytes: 256 * 1024,
      }),
      batchPolicy({
        maxQueriesPerRequest: 25,
        maxMutationsPerRequest: 10,
      }),
      depthPolicy({
        maxDepth: 5,
      }),
      breadthPolicy({
        maxIncludesPerNode: 10,
        maxTotalIncludes: 50,
        maxSelectKeys: 50,
      }),
      takePolicy({
        defaultMax: 100,
      }),
      timeoutPolicy({
        perResolverTimeoutMs: 5_000,
      }),
      complexityPolicy({
        defaults: {
          single: 1,
          many: 5,
          selectKey: 0.1,
        },
        assumedManyTake: 25,
        budget: 1_000,
      }),
    ],
  }),
  rateLimitPlugin({
    getIdentity: (_request, context) => {
      const user = (context as { user?: { id?: string } }).user;
      return user?.id ?? 'anon';
    },
    limiter: new RateLimiterMemory({ points: 600, duration: 30 }),
  }),
  effectsPlugin({
    queue: new InMemoryEffectQueue(),
  }),
];
