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

/**
 * Per-stream surface exposed to an {@link SseHandler}. Adapter
 * implementations are responsible for setting the `text/event-stream`
 * response headers and for translating socket-level lifecycle (client
 * disconnect, keep-alive, flush semantics) into these three hooks.
 */
export interface SseStream {
  /**
   * Write a raw SSE frame. Callers pass complete frames including the
   * trailing `\n\n` terminator so comment keep-alive frames (e.g.
   * `":ka\n\n"`) can be sent alongside `data:` frames.
   */
  write(data: string): void;
  /** Close the SSE stream. Idempotent. */
  close(): void;
  /** Register a callback invoked once when the stream closes (from any side). */
  onClose(listener: () => void): void;
}

/**
 * Handler signature for SSE routes. Adapters guarantee that headers are
 * flushed before the handler runs, so the handler can write frames
 * synchronously on the first tick.
 */
export type SseHandler<HttpRequest> = (request: HttpRequest, stream: SseStream) => Promise<void> | void;

export interface HttpAdapter<HttpRequest> {
  post(path: string, handler: HttpHandler<HttpRequest>): void;
  /**
   * Register an SSE route at `path`. The adapter MUST:
   *   - reply with `Content-Type: text/event-stream`, `Cache-Control:
   *     no-cache, no-transform`, `Connection: keep-alive`, and
   *     `X-Accel-Buffering: no`;
   *   - flush headers before invoking `handler`;
   *   - invoke every `onClose` listener exactly once when the client or
   *     server closes the connection.
   */
  sse(path: string, handler: SseHandler<HttpRequest>): void;
  getBody(request: HttpRequest): unknown;
}
