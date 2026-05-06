import { createRequire } from 'node:module';

import { noopLogger, type Logger } from './logger.js';

export type PinoLoggerOptions = Record<string, unknown>;

type PinoFactory = (options?: PinoLoggerOptions) => Logger;

let warnedMissingPino = false;

const require = createRequire(import.meta.url);

export const pinoLogger = (options?: PinoLoggerOptions): Logger => {
  try {
    
    const mod = require('pino') as PinoFactory | { default?: PinoFactory };
    
    const pino = typeof mod === 'function' ? mod : mod.default;

    return pino?.(options) ?? noopLogger;

  } catch (error) {

    if (!warnedMissingPino) {
      warnedMissingPino = true;
      console.warn('[tql] pino is not installed; falling back to noop logger');
    }

    return noopLogger;
  }
};

