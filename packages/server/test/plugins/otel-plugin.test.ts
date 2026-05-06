import { describe, expect, test } from 'vitest';
import { BasicTracerProvider, InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

import {
  TQL_COST_ACTUAL,
  TQL_COST_STATIC,
  TQL_OP_BATCH_SIZE,
  TQL_OP_KIND,
  TQL_OP_NAMES,
  TQL_REQUEST_ID,
  TQL_RESOLVER_KIND,
  TQL_RESOLVER_PATH,
  otelPlugin,
} from '../../src/plugins/built-in/otel/index.js';
import { requestIdPlugin } from '../../src/plugins/built-in/request-id/index.js';
import { PluginRunner } from '../../src/plugins/runner.js';

const createProvider = () => {
  const exporter = new InMemorySpanExporter();
  const provider = new BasicTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)],
  });

  return { exporter, provider };
};

describe('otelPlugin', () => {
  test('creates a root query span and child resolver span with TQL attributes', async () => {
    const { exporter, provider } = createProvider();
    const runner = new PluginRunner({
      plugins: [requestIdPlugin(), otelPlugin({ tracerProvider: provider })],
    });

    const ctx = await runner.createContext({
      request: { headers: { 'x-request-id': 'req_otel' } },
      body: {},
      schemaContext: {},
      signal: new AbortController().signal,
    });

    await runner.beforeQuery({
      ctx,
      plan: { nodes: [{ queryName: 'profileById', path: 'profileById', includes: [] }] } as any,
    });

    const result = await runner.wrapQueryNode(ctx, { path: 'profileById', includes: [] } as any, async () => 'ok');

    await runner.afterQuery({ ctx, plan: { nodes: [] } as any, result: { profileById: result }, costs: { staticCost: 1, actualCost: 2 } });
    await provider.forceFlush();

    const spans = exporter.getFinishedSpans();
    const root = spans.find((span) => span.name === 'tql.request');
    const resolver = spans.find((span) => span.name === 'tql.resolve');

    expect(root?.attributes).toMatchObject({
      [TQL_OP_KIND]: 'query',
      [TQL_OP_BATCH_SIZE]: 1,
      [TQL_REQUEST_ID]: 'req_otel',
      [TQL_COST_STATIC]: 1,
      [TQL_COST_ACTUAL]: 2,
    });
    expect(root?.attributes[TQL_OP_NAMES]).toEqual(['profileById']);
    expect(resolver?.attributes).toMatchObject({
      [TQL_RESOLVER_KIND]: 'query',
      [TQL_RESOLVER_PATH]: 'profileById',
    });
    expect(resolver?.spanContext().traceId).toBe(root?.spanContext().traceId);
  });

  test('ends mutation root span after afterResponse', async () => {
    const { exporter, provider } = createProvider();
    const runner = new PluginRunner({
      plugins: [otelPlugin({ tracerProvider: provider })],
    });

    const ctx = await runner.createContext({
      request: {},
      body: {},
      schemaContext: {},
      signal: new AbortController().signal,
    });

    await runner.beforeMutation({ ctx, plan: { entries: [{ mutationName: 'createProfile' }] } as any });
    await runner.afterMutation({ ctx, plan: { entries: [] } as any, result: {}, inputs: {}, costs: {} });

    expect(exporter.getFinishedSpans()).toHaveLength(0);

    await runner.afterResponse({ ctx });
    await provider.forceFlush();

    expect(exporter.getFinishedSpans().some((span) => span.name === 'tql.request')).toBe(true);
  });
});

