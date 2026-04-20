import type { HttpAdapter } from './http-adapter.js';

export type FastifyLikeInstance<FastifyRequest extends { body: unknown }> = {
  post(path: string, handler: (request: FastifyRequest) => Promise<unknown> | unknown): unknown;
};

export const createFastifyHttpAdapter = <FastifyRequest extends { body: unknown }>(
  server: FastifyLikeInstance<FastifyRequest>,
): HttpAdapter<FastifyRequest> => {
  return {
    post(path, handler) {
      server.post(path, async (request) => {
        return handler(request);
      });
    },
    getBody(request) {
      return request.body;
    },
  };
};
