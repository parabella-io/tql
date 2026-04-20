import type { HttpAdapter, HttpHandlerHooks } from './http-adapter.js';

export type FastifyLikeRawResponse = {
  on(event: 'finish', listener: () => void): void;
  on(event: 'close', listener: () => void): void;
};

export type FastifyLikeReply = {
  raw: FastifyLikeRawResponse;
};

export type FastifyLikeInstance<FastifyRequest extends { body: unknown }> = {
  post(path: string, handler: (request: FastifyRequest, reply: FastifyLikeReply) => Promise<unknown> | unknown): unknown;
};

export const createFastifyHttpAdapter = <FastifyRequest extends { body: unknown }>(
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
    getBody(request) {
      return request.body;
    },
  };
};
