import { performance } from 'node:perf_hooks';

import {
  ROOT_CONTEXT,
  SpanKind,
  SpanStatusCode,
  context as otelContext,
  propagation,
  trace,
  type Context,
  type Counter,
  type Histogram,
  type Meter,
  type MeterProvider,
  type Span,
  type Tracer,
  type TracerProvider,
} from '@opentelemetry/api';

import { definePlugin, type ServerPlugin } from '../../plugin.js';

import {
  TQL_COST_ACTUAL,
  TQL_COST_STATIC,
  TQL_ERROR_CODE,
  TQL_OP_BATCH_SIZE,
  TQL_OP_KIND,
  TQL_OP_NAMES,
  TQL_REQUEST_ID,
  TQL_RESOLVER_KIND,
  TQL_RESOLVER_PATH,
} from './attributes.js';

export type OtelPluginOptions = {
  tracerProvider?: TracerProvider;
  meterProvider?: MeterProvider;
  name?: string;
  version?: string;
};

type OtelPluginContext = {
  requestId?: string;
  otel?: {
    rootSpan: Span;
    ctx: Context;
    startedAt: number;
    operationKind?: 'query' | 'mutation';
    ended?: boolean;
    error?: boolean;
  };
};

type Instruments = {
  requestDuration?: Histogram;
  resolverDuration?: Histogram;
  requests?: Counter;
  errors?: Counter;
};

export const otelPlugin = (options: OtelPluginOptions = {}): ServerPlugin => {
  const instrumentationName = options.name ?? '@tql/server';

  let tracer: Tracer = trace.getTracer(instrumentationName, options.version);
  let meter: Meter | undefined;
  let instruments: Instruments = {};

  return definePlugin({
    name: 'otel',
    setup() {
      tracer = (options.tracerProvider ?? trace).getTracer(instrumentationName, options.version);
      meter = options.meterProvider?.getMeter(instrumentationName, options.version);
      instruments = createInstruments(meter);
    },
    createPluginContext({ request }) {
      const carrier = getHeaders(request);

      const parentContext = propagation.extract(ROOT_CONTEXT, carrier);

      const rootSpan = tracer.startSpan('tql.request', { kind: SpanKind.SERVER }, parentContext);

      return {
        otel: {
          rootSpan,
          ctx: trace.setSpan(parentContext, rootSpan),
          startedAt: performance.now(),
        },
      };
    },
    beforeQuery({ ctx, plan }) {
      configureRootSpan(ctx.plugin as OtelPluginContext, {
        kind: 'query',
        names: plan.nodes.map((node) => node.queryName),
      });
    },
    beforeMutation({ ctx, plan }) {
      configureRootSpan(ctx.plugin as OtelPluginContext, {
        kind: 'mutation',
        names: plan.entries.map((entry) => entry.mutationName),
      });
    },
    async onResolveQueryNode({ ctx, node, next }) {
      return withResolverSpan({
        pluginContext: ctx.plugin as OtelPluginContext,
        kind: 'query',
        path: node.path,
        next,
        instruments,
        tracer,
      });
    },
    async onResolveMutation({ ctx, entry, next }) {
      return withResolverSpan({
        pluginContext: ctx.plugin as OtelPluginContext,
        kind: 'mutation',
        path: entry.mutationName,
        next,
        instruments,
        tracer,
      });
    },
    afterQuery({ ctx, costs }) {
      recordCosts(ctx.plugin as OtelPluginContext, costs);
      endRootSpan(ctx.plugin as OtelPluginContext, instruments);
    },
    afterMutation({ ctx, costs }) {
      recordCosts(ctx.plugin as OtelPluginContext, costs);
    },
    afterResponse({ ctx }) {
      endRootSpan(ctx.plugin as OtelPluginContext, instruments);
    },
    onError({ ctx, error }) {
      const pluginContext = ctx.plugin as OtelPluginContext;
      const otel = pluginContext.otel;

      if (otel) {
        otel.error = true;
        otel.rootSpan.recordException(error);
        otel.rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        otel.rootSpan.setAttribute(TQL_ERROR_CODE, error.message);
        instruments.errors?.add(1, buildRequestAttributes(pluginContext));
        endRootSpan(pluginContext, instruments);
      }

      return error;
    },
  });
};

const createInstruments = (meter: Meter | undefined): Instruments => ({
  requestDuration: meter?.createHistogram('tql.request.duration_ms', {
    description: 'TQL request duration in milliseconds',
  }),
  resolverDuration: meter?.createHistogram('tql.resolver.duration_ms', {
    description: 'TQL resolver duration in milliseconds',
  }),
  requests: meter?.createCounter('tql.requests', {
    description: 'TQL requests',
  }),
  errors: meter?.createCounter('tql.errors', {
    description: 'TQL request errors',
  }),
});

const configureRootSpan = (pluginContext: OtelPluginContext, options: { kind: 'query' | 'mutation'; names: string[] }) => {
  const otel = pluginContext.otel;

  if (!otel) return;

  otel.operationKind = options.kind;
  otel.rootSpan.setAttribute(TQL_OP_KIND, options.kind);
  otel.rootSpan.setAttribute(TQL_OP_NAMES, options.names);
  otel.rootSpan.setAttribute(TQL_OP_BATCH_SIZE, options.names.length);

  if (pluginContext.requestId) {
    otel.rootSpan.setAttribute(TQL_REQUEST_ID, pluginContext.requestId);
  }
};

const withResolverSpan = async <T>(options: {
  pluginContext: OtelPluginContext;
  kind: 'query' | 'mutation';
  path: string;
  next: () => Promise<T>;
  instruments: Instruments;
  tracer: Tracer;
}): Promise<T> => {
  const otel = options.pluginContext.otel;

  if (!otel) {
    return options.next();
  }

  const startedAt = performance.now();

  const span = options.tracer.startSpan(
    'tql.resolve',
    {
      attributes: {
        [TQL_RESOLVER_KIND]: options.kind,
        [TQL_RESOLVER_PATH]: options.path,
      },
    },
    otel.ctx,
  );

  const activeContext = trace.setSpan(otel.ctx, span);

  try {
    return await otelContext.with(activeContext, options.next);
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error instanceof Error ? error.message : undefined });
    throw error;
  } finally {
    const durationMs = performance.now() - startedAt;
    options.instruments.resolverDuration?.record(durationMs, {
      [TQL_OP_KIND]: options.kind,
      [TQL_RESOLVER_PATH]: options.path,
    });
    span.end();
  }
};

const recordCosts = (pluginContext: OtelPluginContext, costs: { staticCost?: number; actualCost?: number }) => {
  const span = pluginContext.otel?.rootSpan;

  if (!span) return;

  if (costs.staticCost !== undefined) {
    span.setAttribute(TQL_COST_STATIC, costs.staticCost);
  }

  if (costs.actualCost !== undefined) {
    span.setAttribute(TQL_COST_ACTUAL, costs.actualCost);
  }
};

const endRootSpan = (pluginContext: OtelPluginContext, instruments: Instruments) => {
  const otel = pluginContext.otel;

  if (!otel || otel.ended) return;

  const durationMs = performance.now() - otel.startedAt;
  const attributes = buildRequestAttributes(pluginContext);

  if (!otel.error) {
    otel.rootSpan.setStatus({ code: SpanStatusCode.OK });
  }

  instruments.requestDuration?.record(durationMs, attributes);
  instruments.requests?.add(1, attributes);

  otel.ended = true;
  otel.rootSpan.end();
};

const buildRequestAttributes = (pluginContext: OtelPluginContext): Record<string, string | number> => {
  const attributes: Record<string, string | number> = {};

  const otel = pluginContext.otel;

  if (otel?.operationKind) {
    attributes[TQL_OP_KIND] = otel.operationKind;
  }

  if (pluginContext.requestId) {
    attributes[TQL_REQUEST_ID] = pluginContext.requestId;
  }

  return attributes;
};

const getHeaders = (request: unknown): Record<string, string | string[] | undefined> =>
  ((request as { headers?: Record<string, string | string[] | undefined> }).headers ?? {}) as Record<string, string | string[] | undefined>;
