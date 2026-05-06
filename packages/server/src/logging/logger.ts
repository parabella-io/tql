export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogMethod = {
  (message: string): void;
  (obj: Record<string, unknown>, message?: string): void;
  (...args: unknown[]): void;
};

export type Logger = {
  trace: LogMethod;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
  child(bindings: Record<string, unknown>): Logger;
};

const noop: LogMethod = () => {};

export const noopLogger: Logger = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop,
  child: () => noopLogger,
};

