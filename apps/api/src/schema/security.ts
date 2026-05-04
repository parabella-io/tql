import {
  batchPolicy,
  bodyLimitPolicy,
  breadthPolicy,
  complexityPolicy,
  defineAllowedShapes,
  depthPolicy,
  InMemoryRateLimitStore,
  rateLimitPolicy,
  requestIdPlugin,
  securityPlugin,
  takePolicy,
  timeoutPolicy,
} from '@tql/server';

import type { ClientSchema } from '../../__generated__/schema.d.ts';

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
  securityPlugin({
    getPrincipal: (_request, context) => {
      const user = (context as { user?: { id?: string } }).user;

      return user?.id ? { id: user.id } : null;
    },
    requestTimeoutMs: 10_000,
    allowedShapes,
    allowedShapesMode: 'enforce',
    policies: [
      bodyLimitPolicy({ maxBytes: 256 * 1024 }),
      batchPolicy({ maxQueriesPerRequest: 25, maxMutationsPerRequest: 10 }),
      depthPolicy({ maxDepth: 5 }),
      breadthPolicy({
        maxIncludesPerNode: 10,
        maxTotalIncludes: 50,
        maxSelectKeys: 50,
      }),
      takePolicy({ defaultMax: 100 }),
      timeoutPolicy({ perResolverTimeoutMs: 5_000 }),
      complexityPolicy({
        defaults: { single: 1, many: 5, selectKey: 0.1 },
        assumedManyTake: 25,
        budget: 1_000,
      }),
      rateLimitPolicy({
        store: new InMemoryRateLimitStore(),
        buckets: [
          { scope: 'route', capacity: 600, refillPerSec: 10 },
          { scope: 'op', capacity: 100, refillPerSec: 2 },
        ],
      }),
    ],
  }),
];
