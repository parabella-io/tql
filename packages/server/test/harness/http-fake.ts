import type { HttpAdapter, HttpHandler, HttpHandlerHooks } from '../../src/server/adapters/http/http-adapter.js';

export type TestRequest = {
  body: any;
};

type StoredHandler = HttpHandler<TestRequest>;

export type FakeTransport = {
  adapter: HttpAdapter<TestRequest>;
  invoke(
    path: string,
    request: TestRequest,
  ): Promise<{
    response: unknown;
    flushResponse(): Promise<void>;
  }>;
};

export function createFakeTransport(): FakeTransport {
  const routes = new Map<string, StoredHandler>();

  const adapter: HttpAdapter<TestRequest> = {
    post(path, handler) {
      routes.set(path, handler);
    },
    getBody(request) {
      return request.body;
    },
  };

  return {
    adapter,
    async invoke(path, request) {
      const handler = routes.get(path);

      if (!handler) throw new Error(`no handler for ${path}`);

      const afterResponseCallbacks: Array<() => void | Promise<void>> = [];

      const hooks: HttpHandlerHooks = {
        afterResponse(cb) {
          afterResponseCallbacks.push(cb);
        },
      };

      const response = await handler(request, hooks);

      return {
        response,
        async flushResponse() {
          for (const cb of afterResponseCallbacks) {
            try {
              await cb();
            } catch {
              // Post-response errors must never bubble into the transport.
            }
          }
        },
      };
    },
  };
}
