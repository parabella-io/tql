import { randomUUID } from 'node:crypto';

import type { WebSocketAdapter, WebSocketConnection } from './websocket-adapter.js';

/**
 * Minimal duck-typed view of the `ws` library's `WebSocketServer` so
 * this module doesn't need a value-level import of the `ws` package.
 * Consumers pass an actual `WebSocketServer` instance — the shape used
 * here lines up one-for-one.
 */
export type WsLikeServer = {
  on(event: 'connection', listener: (socket: WsLikeSocket, request: unknown) => void): void;
};

export type WsLikeSocket = {
  send(data: string): void;
  close(code?: number, reason?: string): void;
  on(event: 'message', listener: (data: unknown) => void): void;
  on(event: 'close', listener: () => void): void;
  on(event: 'error', listener: (error: unknown) => void): void;
};

/**
 * Wraps a `ws` (`WebSocketServer`) instance into the
 * {@link WebSocketAdapter} surface consumed by `Server.attachWebSocket`.
 *
 * Binary frames are decoded to UTF-8 strings so the Server layer can
 * work with a single string protocol. If you need raw binary, write a
 * different adapter.
 */
export const createWsWebSocketAdapter = (server: WsLikeServer): WebSocketAdapter => {
  return {
    onConnection(handler) {
      server.on('connection', (socket, request) => {
        const id = randomUUID();

        const messageHandlers: Array<(data: string) => void> = [];

        const closeHandlers: Array<() => void> = [];

        const connection: WebSocketConnection = {
          id,
          request,
          send(data) {
            try {
              socket.send(data);
            } catch {
              // Swallow send errors — the adapter doesn't own retry policy.
            }
          },
          close(code, reason) {
            try {
              socket.close(code, reason);
            } catch {
              // Ignore double-close errors.
            }
          },
          onMessage(listener) {
            messageHandlers.push(listener);
          },
          onClose(listener) {
            closeHandlers.push(listener);
          },
        };

        socket.on('message', (raw: unknown) => {
          const data = coerceToString(raw);

          if (data === null) return;

          for (const listener of messageHandlers) {
            try {
              listener(data);
            } catch {
              // Per-message handler errors must never crash the socket.
            }
          }
        });

        socket.on('close', () => {
          for (const listener of closeHandlers) {
            try {
              listener();
            } catch {
              // Close handlers run best-effort.
            }
          }
        });

        socket.on('error', () => {
          // `ws` emits 'close' after 'error'. Nothing to do here today.
        });

        handler(connection);
      });
    },
  };
};

const coerceToString = (raw: unknown): string | null => {
  if (typeof raw === 'string') return raw;

  if (raw instanceof Uint8Array) return new TextDecoder('utf-8').decode(raw);

  if (Array.isArray(raw)) {
    // `ws` passes `Buffer[]` for fragmented frames when binary=true.
    const parts = raw.filter((part): part is Uint8Array => part instanceof Uint8Array);

    if (parts.length === 0) return null;

    return parts.map((part) => new TextDecoder('utf-8').decode(part)).join('');
  }

  if (raw && typeof (raw as { toString?: () => string }).toString === 'function') {
    return String(raw);
  }

  return null;
};
