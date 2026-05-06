import { TQLServerError } from './errors.js';

/**
 * Runs `runTask` with optional per-resolver timeout and/or parent abort-signal
 * propagation. The two callers (query resolver, mutation resolver) differ only
 * in how they build their error payloads and their wrapper call, so those are
 * injected as callbacks.
 */
export const runWithTimeout = async <T>(options: {
  signal: AbortSignal | undefined;
  timeoutMs: number | undefined;
  runTask: (signal: AbortSignal | undefined) => Promise<T>;
  makeTimeoutError: (timeoutMs: number) => TQLServerError;
  makeAbortError: () => TQLServerError;
}): Promise<T> => {
  if (options.timeoutMs === undefined && !options.signal) {
    return options.runTask(undefined);
  }

  const controller = new AbortController();

  const parentSignal = options.signal;

  let timeout: ReturnType<typeof setTimeout> | undefined;

  const abortFromParent = () => {
    controller.abort(parentSignal?.reason);
  };

  if (parentSignal?.aborted) {
    controller.abort(parentSignal.reason);
  } else {
    parentSignal?.addEventListener('abort', abortFromParent, { once: true });
  }

  const task = Promise.resolve().then(() => options.runTask(controller.signal));

  const abortPromise = new Promise<never>((_resolve, reject) => {
    controller.signal.addEventListener('abort', () => reject(options.makeAbortError()), { once: true });
  });

  const timeoutPromise =
    options.timeoutMs === undefined
      ? new Promise<never>(() => {})
      : new Promise<never>((_resolve, reject) => {
          timeout = setTimeout(() => {
            controller.abort();
            reject(options.makeTimeoutError(options.timeoutMs!));
          }, options.timeoutMs);
        });

  try {
    return await Promise.race([task, timeoutPromise, abortPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
    parentSignal?.removeEventListener('abort', abortFromParent);
  }
};
