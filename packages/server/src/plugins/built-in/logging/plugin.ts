import { performance } from 'node:perf_hooks';

import { noopLogger, type Logger, type LogLevel } from '../../../logging/index.js';

import { definePlugin, type ServerPlugin } from '../../plugin.js';

export type LoggingPluginOptions = {
  slowQueryMs?: number;
  level?: Exclude<LogLevel, 'fatal'>;
  includeOpNames?: boolean;
};

type LoggingPluginContext = {
  logger?: Logger;
  startedAt?: number;
  operationKind?: 'query' | 'mutation';
  requestId?: string;
};

export const loggingPlugin = (options: LoggingPluginOptions = {}): ServerPlugin => {
  let rootLogger: Logger = noopLogger;

  const level = options.level ?? 'info';

  const includeOpNames = options.includeOpNames ?? true;

  return definePlugin({
    name: 'logging',
    setup({ server }) {
      rootLogger = server.log;
    },
    createPluginContext({ pluginContext }) {
      const requestId = (pluginContext as LoggingPluginContext).requestId;

      const logger = requestId ? rootLogger.child({ requestId }) : rootLogger;

      return {
        logger,
        startedAt: performance.now(),
      };
    },
    beforeQuery({ ctx, plan }) {
      const pluginContext = ctx.plugin as LoggingPluginContext;

      ctx.logger = pluginContext.logger ?? ctx.logger;

      pluginContext.operationKind = 'query';

      ctx.logger[level](
        {
          op: 'query',
          ...(includeOpNames ? { ops: plan.nodes.map((node) => node.queryName) } : {}),
          batch: plan.nodes.length,
        },
        'tql.request.start',
      );
    },
    beforeMutation({ ctx, plan }) {
      const pluginContext = ctx.plugin as LoggingPluginContext;

      ctx.logger = pluginContext.logger ?? ctx.logger;

      pluginContext.operationKind = 'mutation';

      ctx.logger[level](
        {
          op: 'mutation',
          ...(includeOpNames ? { ops: plan.entries.map((entry) => entry.mutationName) } : {}),
          batch: plan.entries.length,
        },
        'tql.request.start',
      );
    },
    afterQuery({ ctx, costs }) {
      logComplete({ ctx, costs, slowQueryMs: options.slowQueryMs, level });
    },
    afterMutation({ ctx, costs }) {
      logComplete({ ctx, costs, slowQueryMs: options.slowQueryMs, level });
    },
    afterResponse({ ctx }) {
      ctx.logger.debug({ totalMs: elapsedMs(ctx.plugin) }, 'tql.response.flushed');
    },
    onError({ ctx, error }) {
      ctx.logger.error({ err: error, code: error.message }, 'tql.request.error');
      return error;
    },
  });
};

const logComplete = (options: {
  ctx: { plugin: unknown; logger: Logger };
  costs: Record<string, unknown>;
  slowQueryMs: number | undefined;
  level: Exclude<LogLevel, 'fatal'>;
}) => {
  const durationMs = elapsedMs(options.ctx.plugin);

  const logLevel = options.slowQueryMs !== undefined && durationMs > options.slowQueryMs ? 'warn' : options.level;

  options.ctx.logger[logLevel]({ durationMs, costs: options.costs }, 'tql.request.complete');
};

const elapsedMs = (pluginContext: unknown): number => {
  const startedAt = (pluginContext as LoggingPluginContext).startedAt;

  return startedAt === undefined ? 0 : performance.now() - startedAt;
};
