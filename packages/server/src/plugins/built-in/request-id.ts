import { randomUUID } from 'node:crypto';

import { definePlugin, type ServerPlugin } from '../plugin.js';

declare module '../extensions.js' {
  interface PluginContextExtensions {
    requestId: string;
  }

  interface SchemaContextExtensions {
    requestId: string;
  }
}

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
      (ctx.schemaContext as Record<string, unknown>).requestId = ctx.plugin.requestId;
    },
    beforeMutation(ctx) {
      (ctx.schemaContext as Record<string, unknown>).requestId = ctx.plugin.requestId;
    },
  });

