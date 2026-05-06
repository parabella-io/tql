import type { Context, Span } from '@opentelemetry/api';

declare module '../../extensions.js' {
  interface PluginContextExtensions {
    otel?: {
      rootSpan: Span;
      ctx: Context;
      startedAt: number;
      operationKind?: 'query' | 'mutation';
      ended?: boolean;
      error?: boolean;
    };
  }
}

