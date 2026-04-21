import type { HttpAdapter, HttpHandlerHooks, SseStream } from './http-adapter.js';

export type FastifyLikeRawResponse = {
  writeHead(statusCode: number, headers?: Record<string, string | number | string[] | undefined>): void;
  write(chunk: string): boolean;
  end(): void;
  flushHeaders?: () => void;
  on(event: 'finish', listener: () => void): void;
  on(event: 'close', listener: () => void): void;
};

export type FastifyLikeRawRequest = {
  on(event: 'close', listener: () => void): void;
};

export type FastifyLikeReply = {
  raw: FastifyLikeRawResponse;
  hijack?: () => void;
  /**
   * Returns headers accumulated on the reply by upstream plugins
   * (e.g. `@fastify/cors`). The SSE handler forwards these into the
   * raw `writeHead` call since `hijack()` bypasses Fastify's own
   * header flush.
   */
  getHeaders?: () => Record<string, string | number | string[] | undefined>;
};

export type FastifyLikeRequest = {
  raw: FastifyLikeRawRequest;
};

export type FastifyLikeInstance<FastifyRequest extends { body: unknown }> = {
  post(path: string, handler: (request: FastifyRequest, reply: FastifyLikeReply) => Promise<unknown> | unknown): unknown;
  get(path: string, handler: (request: FastifyRequest, reply: FastifyLikeReply) => Promise<unknown> | unknown): unknown;
};

export const createFastifyHttpAdapter = <FastifyRequest extends { body: unknown } & FastifyLikeRequest>(
  server: FastifyLikeInstance<FastifyRequest>,
): HttpAdapter<FastifyRequest> => {
  return {
    post(path, handler) {
      server.post(path, async (request, reply) => {
        const afterResponseCallbacks: Array<() => void | Promise<void>> = [];

        const hooks: HttpHandlerHooks = {
          afterResponse(callback) {
            afterResponseCallbacks.push(callback);
          },
        };

        const result = await handler(request, hooks);

        if (afterResponseCallbacks.length > 0) {
          const flush = () => {
            for (const callback of afterResponseCallbacks) {
              Promise.resolve()
                .then(callback)
                .catch(() => {
                  // Adapters must not let post-response callbacks bubble into
                  // the transport. Each callback is expected to self-report.
                });
            }
          };

          let flushed = false;

          const runOnce = () => {
            if (flushed) return;
            flushed = true;
            flush();
          };

          reply.raw.on('finish', runOnce);

          reply.raw.on('close', runOnce);
        }

        return result;
      });
    },

    sse(path, handler) {
      server.get(path, async (request, reply) => {
        // `hijack()` bypasses Fastify's header flush, which would
        // normally carry headers set by plugins like `@fastify/cors`
        // (`Access-Control-Allow-Origin`, `…-Credentials`, `Vary`, …).
        // Snapshot them first so the raw `writeHead` below forwards
        // them onto the SSE response; otherwise cross-origin
        // `EventSource` is rejected by the browser.
        const inheritedHeaders = Object.fromEntries(Object.entries(reply.getHeaders?.() ?? {}).filter(([, value]) => value !== undefined));

        // Tell Fastify we're taking over the raw response so it won't
        // try to serialize a payload or set its own headers.
        reply.hijack?.();

        reply.raw.writeHead(200, {
          ...inheritedHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        });

        reply.raw.flushHeaders?.();

        const closeListeners: Array<() => void> = [];
        let closed = false;

        const runCloseListeners = () => {
          if (closed) return;
          closed = true;
          for (const listener of closeListeners) {
            try {
              listener();
            } catch {
              // Close listeners run best-effort — never bubble into the transport.
            }
          }
        };

        request.raw.on('close', runCloseListeners);
        reply.raw.on('close', runCloseListeners);
        reply.raw.on('finish', runCloseListeners);

        const stream: SseStream = {
          write(data) {
            if (closed) return;
            try {
              reply.raw.write(data);
            } catch {
              // A write error usually means the socket is gone; treat it
              // as a close and let listeners clean up.
              runCloseListeners();
            }
          },
          close() {
            if (closed) return;
            try {
              reply.raw.end();
            } catch {
              // Ignore double-close from adapters that race finish/close.
            }
            runCloseListeners();
          },
          onClose(listener) {
            closeListeners.push(listener);
          },
        };

        try {
          await handler(request, stream);
        } catch {
          // Handler errors must not leave the connection hanging.
          stream.close();
        }
      });
    },

    getBody(request) {
      return request.body;
    },
  };
};
