/**
 * Per-connection surface exposed to the `Server`. Adapters translate
 * whatever native object their library hands out (a raw `ws` socket, a
 * uWebSockets.js `WebSocket`, a fake in tests, …) into this shape.
 *
 * `request` is intentionally typed as `unknown` so adapters can surface
 * whatever upgrade-request object is natural for their library
 * (IncomingMessage, Fastify request, etc). The user-supplied
 * `createContext` / `createConnection` hooks cast it as needed.
 */
export interface WebSocketConnection {
  readonly id: string;
  readonly request: unknown;

  send(data: string): void;
  close(code?: number, reason?: string): void;

  onMessage(handler: (data: string) => void): void;
  onClose(handler: () => void): void;
}

/**
 * Minimal surface the `Server` uses to listen for new websocket
 * connections. Implementations typically wrap a WebSocket-library
 * server instance (e.g. `ws`, uWebSockets.js) and invoke the supplied
 * handler once per connection.
 */
export interface WebSocketAdapter {
  onConnection(handler: (connection: WebSocketConnection) => void): void;
}
