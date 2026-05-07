import { describe, expect, test, vi } from 'vitest';

import { TQLServerError, TQLServerErrorType } from '../../src/errors.js';
import type { Logger } from '../../src/logging/index.js';
import { loggingPlugin } from '../../src/plugins/built-in/logging/index.js';
import { requestIdPlugin } from '../../src/plugins/built-in/request-id/index.js';
import { PluginRunner } from '../../src/plugins/runner.js';

const createLogger = (): Logger => ({
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  child: vi.fn(),
});

describe('loggingPlugin', () => {
  test('binds request id into a child logger and logs query lifecycle', async () => {
    const logger = createLogger();
    const childLogger = createLogger();
    vi.mocked(logger.child).mockReturnValue(childLogger);

    const runner = new PluginRunner({
      logger,
      plugins: [requestIdPlugin(), loggingPlugin()],
    });

    const ctx = await runner.createContext({
      request: { headers: { 'x-request-id': 'req_123' } },
      body: {},
      schemaContext: {},
      signal: new AbortController().signal,
    });

    await runner.beforeQuery({
      ctx,
      plan: { nodes: [{ queryName: 'profileById', includes: [] }] } as any,
    });
    await runner.afterQuery({ ctx, plan: { nodes: [] } as any, result: {}, costs: { staticCost: 1, actualCost: 2 } });

    expect(logger.child).toHaveBeenCalledWith({ requestId: 'req_123' });
    expect(childLogger.info).toHaveBeenCalledWith({ op: 'query', ops: ['profileById'], batch: 1 }, 'tql.request.start');
    expect(childLogger.info).toHaveBeenCalledWith(
      expect.objectContaining({ costs: { staticCost: 1, actualCost: 2 } }),
      'tql.request.complete',
    );
  });

  test('warns when request duration exceeds slowQueryMs', async () => {
    const logger = createLogger();
    const runner = new PluginRunner({
      logger,
      plugins: [loggingPlugin({ slowQueryMs: -1 })],
    });

    const ctx = await runner.createContext({
      request: {},
      body: {},
      schemaContext: {},
      signal: new AbortController().signal,
    });

    await runner.beforeMutation({ ctx, plan: { entries: [{ mutationName: 'createProfile' }] } as any });
    await runner.afterMutation({ ctx, plan: { entries: [] } as any, result: {}, inputs: {}, costs: {} });

    expect(logger.warn).toHaveBeenCalledWith(expect.objectContaining({ costs: {} }), 'tql.request.complete');
  });

  test('logs transformed TQL errors without changing them', async () => {
    const logger = createLogger();
    const runner = new PluginRunner({
      logger,
      plugins: [loggingPlugin()],
    });
    const ctx = await runner.createContext({
      request: {},
      body: {},
      schemaContext: {},
      signal: new AbortController().signal,
    });
    const error = new TQLServerError(TQLServerErrorType.QueryNotAllowedError);

    const transformed = runner.transformError(ctx, error);

    expect(transformed).toBe(error);
    expect(logger.error).toHaveBeenCalledWith({ err: error, code: TQLServerErrorType.QueryNotAllowedError }, 'tql.request.error');
  });
});
