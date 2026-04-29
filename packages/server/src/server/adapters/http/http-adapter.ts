/**
 * Per-request hooks passed to every {@link HttpHandler}. Handlers use these
 * to schedule work the transport layer should run at specific lifecycle
 * points (most importantly: after the response has been flushed to the
 * client).
 */
export type HttpHandlerHooks = {
  /**
   * Register a callback to run after the HTTP response for this request has
   * been sent. Adapters that cannot signal "response flushed" precisely MUST
   * fall back to the next event-loop tick so the caller is guaranteed the
   * callback never blocks the reply.
   *
   * Callbacks must never throw into the transport; adapters are expected to
   * isolate them (e.g. swallow/log and move on).
   */
  afterResponse(callback: () => void | Promise<void>): void;
};

export type HttpHandler<HttpRequest, Response = unknown> = (request: HttpRequest, hooks: HttpHandlerHooks) => Promise<Response> | Response;

export interface HttpAdapter<HttpRequest> {
  post(path: string, handler: HttpHandler<HttpRequest>): void;
  getBody(request: HttpRequest): unknown;
}
