import type { Logger } from '../../../logging/index.js';

declare module '../../extensions.js' {
  interface PluginContextExtensions {
    logger?: Logger;
    startedAt?: number;
    operationKind?: 'query' | 'mutation';
  }
}

