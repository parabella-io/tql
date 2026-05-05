import { randomUUID } from 'node:crypto';

import { definePlugin, type ServerPlugin } from '../../plugin.js';

export type RequestIdPluginOptions = {
  header?: string;
};

export const requestIdPlugin = (options: RequestIdPluginOptions = {}): ServerPlugin =>
  definePlugin({
    name: 'request-id',
    createPluginContext({ request }) {
      const headerName = (options.header ?? 'x-request-id').toLowerCase();
      const headers = (request as { headers?: Record<string, string | string[] | undefined> }).headers;
      const fromHeader = headers?.[headerName];

      return {
        requestId: Array.isArray(fromHeader) ? (fromHeader[0] ?? randomUUID()) : (fromHeader ?? randomUUID()),
      };
    },
    beforeQuery(ctx) {
      (ctx.schemaContext as Record<string, unknown>).requestId = (ctx.plugin as RequestIdPluginContext).requestId;
    },
    beforeMutation(ctx) {
      (ctx.schemaContext as Record<string, unknown>).requestId = (ctx.plugin as RequestIdPluginContext).requestId;
    },
  });

type RequestIdPluginContext = {
  requestId: string;
};
