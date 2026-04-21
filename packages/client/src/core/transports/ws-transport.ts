import {
  ClientNotConnectedError,
  SubscribeHandle,
  SubscriberBatchMessage,
  SubscriptionListener,
  SubscriptionTransport,
} from './subscription-transport';

/**
 * Minimal duck-typed view of the browser `WebSocket` constructor +
 * instance surface. Consumers typically pass the real `globalThis.WebSocket`
 * (or the `ws` package's default export) so the client doesn't drag a
 * specific library into its peer-dep graph.
 */
export type WebSocketLike = {
  readonly readyState: number;
  send(data: string): void;
  close(code?: number, reason?: string): void;
  addEventListener(event: 'open', listener: () => void): void;
  addEventListener(event: 'close', listener: (event?: { code?: number; reason?: string }) => void): void;
  addEventListener(event: 'error', listener: (event?: unknown) => void): void;
  addEventListener(event: 'message', listener: (event: { data: unknown }) => void): void;
};

export type WebSocketFactory = (url: string, options: { withCredentials: boolean }) => WebSocketLike;

export type WsTransportOptions = {
  url: string;
  /**
   * Factory that constructs a `WebSocket`-like instance. Defaults to
   * `new globalThis.WebSocket(url)` when available. Receives the
   * resolved `withCredentials` flag so Node factories (e.g. the `ws`
   * package) can forward credentials / upgrade headers; the default
   * browser factory ignores it because the `WebSocket` constructor
   * doesn't expose a credentials option.
   */
  webSocket?: WebSocketFactory;

  /**
   * Extra headers forwarded to the server in the initial
   * `connection:init` handshake frame. Lazy so auth tokens can be read
   * fresh per connection. The server merges these onto the upgrade
   * request headers before building `context` / `connection`, giving
   * parity with `HttpTransport.headers`.
   */
  headers?: () => Record<string, string> | Promise<Record<string, string>>;

  /**
   * Whether the WebSocket should be opened with credentials (cookies /
   * `Authorization`) forwarded cross-origin. Defaults to `true` to
   * match `HttpTransport` / `SseTransport`. The browser `WebSocket`
   * constructor has no corresponding option, so this is best-effort —
   * cookies flow automatically for same-origin sockets, and a
   * user-supplied `webSocket` factory can honor the flag for custom
   * behaviour.
   */
  withCredentials?: boolean;
};

type PendingRequest = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

const READY_STATE_OPEN = 1;

/**
 * WebSocket transport. Serves as both a query/mutation carrier and a
 * {@link SubscriptionTransport}. Matches the wire envelope declared
 * inside `Server.attachWebSocket` (`query` / `mutation` / `subscribe` /
 * `unsubscribe` with a correlation `id`).
 *
 * `connect()` performs a `connection:init` / `connection:ack`
 * handshake before resolving, so any `headers` returned by the options
 * callback reach the server in time to build `context` / `connection`.
 */
export class WsTransport implements SubscriptionTransport {
  private readonly url: string;

  private readonly webSocketFactory: WebSocketFactory;

  private readonly getHeaders: () => Record<string, string> | Promise<Record<string, string>>;

  private readonly withCredentials: boolean;

  private socket: WebSocketLike | null = null;

  private connecting: Promise<void> | null = null;

  /**
   * Flips to `true` once the server has sent `connection:ack`. All
   * request senders (`query` / `mutation` / `subscribe`) gate on this
   * so traffic never races ahead of the handshake.
   */
  private ready = false;

  private pending = new Map<string, PendingRequest>();

  private listenersBySubscriptionId = new Map<string, SubscriptionListener>();

  private nextMessageId = 0;

  /**
   * Set while `connect()` is awaiting `connection:ack`. Resolving
   * flips `ready` to `true`; rejecting tears the socket down.
   */
  private handshake: { resolve: () => void; reject: (error: unknown) => void } | null = null;

  constructor(options: WsTransportOptions) {
    this.url = options.url;

    this.withCredentials = options.withCredentials ?? true;

    this.getHeaders = options.headers ?? (() => ({}));

    this.webSocketFactory =
      options.webSocket ??
      ((url) => {
        const ctor = (globalThis as any).WebSocket;
        if (typeof ctor !== 'function') {
          throw new Error('WsTransport: no global `WebSocket` available. Pass `webSocket` explicitly.');
        }
        return new ctor(url) as WebSocketLike;
      });
  }

  public isConnected(): boolean {
    return this.ready && this.socket !== null && this.socket.readyState === READY_STATE_OPEN;
  }

  public connect(): Promise<void> {
    if (this.isConnected()) return Promise.resolve();

    if (this.connecting) return this.connecting;

    const socket = this.webSocketFactory(this.url, { withCredentials: this.withCredentials });

    this.socket = socket;
    this.ready = false;

    this.connecting = new Promise<void>((resolve, reject) => {
      const finishHandshake = (error?: unknown) => {
        this.handshake = null;
        this.connecting = null;

        if (error) {
          if (this.socket === socket) {
            this.socket = null;
          }

          try {
            socket.close();
          } catch {
            // Teardown is best-effort.
          }

          reject(error);
          return;
        }

        this.ready = true;
        resolve();
      };

      this.handshake = {
        resolve: () => finishHandshake(),
        reject: (error) => finishHandshake(error),
      };

      const onOpen = async () => {
        let headers: Record<string, string>;
        try {
          headers = await this.getHeaders();
        } catch (error) {
          this.handshake?.reject(error);
          return;
        }

        if (this.socket !== socket) return;

        try {
          socket.send(JSON.stringify({ type: 'connection:init', headers }));
        } catch (error) {
          this.handshake?.reject(error);
        }
      };

      const onError = () => {
        if (this.socket === socket && socket.readyState !== READY_STATE_OPEN) {
          this.handshake?.reject(new Error('WebSocket connection failed'));
        }
      };

      socket.addEventListener('open', onOpen);
      socket.addEventListener('error', onError);
      socket.addEventListener('close', () => this.handleClose());
      socket.addEventListener('message', (event) => this.handleMessage(event.data));
    });

    return this.connecting;
  }

  public async disconnect(): Promise<void> {
    const socket = this.socket;
    if (!socket) return;

    this.socket = null;
    this.connecting = null;
    this.ready = false;

    try {
      socket.close();
    } catch {
      // Transport teardown is best-effort; swallow close errors.
    }

    this.rejectAllPending(new ClientNotConnectedError('WebSocket closed before the response was received.'));
    this.listenersBySubscriptionId.clear();
  }

  public async query(payload: Record<string, any>): Promise<any> {
    return this.sendRequest({ type: 'query', payload }, { resultType: 'query:result', errorType: 'query:error' });
  }

  public async mutation(payload: Record<string, any>): Promise<any> {
    return this.sendRequest({ type: 'mutation', payload }, { resultType: 'mutation:result', errorType: 'mutation:error' });
  }

  public async subscribe(options: { name: string; args: unknown; listener: SubscriptionListener }): Promise<SubscribeHandle> {
    const { subscriptionId } = (await this.sendRequest(
      { type: 'subscribe', name: options.name, args: options.args },
      { resultType: 'subscribe:ack', errorType: 'subscribe:error' },
    )) as { subscriptionId: string };

    this.listenersBySubscriptionId.set(subscriptionId, options.listener);

    return {
      subscriptionId,
      unsubscribe: async () => {
        this.listenersBySubscriptionId.delete(subscriptionId);

        if (!this.isConnected()) return;

        try {
          await this.sendRequest(
            { type: 'unsubscribe', subscriptionId },
            { resultType: 'unsubscribe:ack', errorType: 'unsubscribe:error' },
          );
        } catch {
          // Unsubscribing over a dying socket is best-effort.
        }
      },
    };
  }

  private sendRequest(message: Record<string, unknown>, options: { resultType: string; errorType: string }): Promise<unknown> {
    if (!this.isConnected() || !this.socket) {
      return Promise.reject(new ClientNotConnectedError());
    }

    const id = `wsmsg-${++this.nextMessageId}`;

    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        resolve: (payload) => {
          const envelope = payload as Record<string, unknown>;

          if (envelope.type === options.errorType) {
            reject(envelope.error);
            return;
          }

          if (envelope.type !== options.resultType) {
            reject(new Error(`Unexpected response type: ${String(envelope.type)}`));
            return;
          }

          if (options.resultType === 'subscribe:ack') {
            resolve({ subscriptionId: envelope.subscriptionId });
          } else if (options.resultType === 'unsubscribe:ack') {
            resolve({ removed: envelope.removed });
          } else {
            resolve(envelope.payload);
          }
        },
        reject,
      });

      try {
        this.socket!.send(JSON.stringify({ id, ...message }));
      } catch (error) {
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  private handleMessage(raw: unknown): void {
    if (typeof raw !== 'string') return;

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return;
    }

    if (!parsed || typeof parsed !== 'object') return;

    const type = parsed.type;

    if (type === 'connection:ack') {
      this.handshake?.resolve();
      return;
    }

    if (type === 'connection:error') {
      const error = (parsed.error as { message?: string } | undefined) ?? { message: 'connection refused' };
      this.handshake?.reject(error);
      return;
    }

    if (type === 'subscription:batch') {
      this.dispatchBatch(parsed as unknown as SubscriberBatchMessage);
      return;
    }

    if (type === 'subscription:error') {
      const id = typeof parsed.id === 'string' ? parsed.id : undefined;
      const listener = id ? this.listenersBySubscriptionId.get(id) : undefined;
      listener?.onError?.((parsed.error as { message: string }) ?? { message: 'subscription error' });
      return;
    }

    const id = typeof parsed.id === 'string' ? parsed.id : undefined;

    if (!id) return;

    const pending = this.pending.get(id);

    if (!pending) return;

    this.pending.delete(id);

    pending.resolve(parsed);
  }

  /**
   * A `subscription:batch` frame carries every match that touched the
   * connection, so the per-subscriber listener has to re-filter to its
   * own `subscriptionId` before invoking the user's `onBatch`. We build
   * a minimal per-subscription batch view so the client runtime
   * doesn't need to know about the multi-match envelope.
   */
  private dispatchBatch(batch: SubscriberBatchMessage): void {
    for (const match of batch.matches) {
      const listener = this.listenersBySubscriptionId.get(match.id);
      if (!listener) continue;

      listener.onBatch({
        type: 'subscription:batch',
        rows: batch.rows,
        matches: [match],
      });
    }
  }

  private handleClose(): void {
    this.socket = null;
    this.connecting = null;
    this.ready = false;

    if (this.handshake) {
      const handshake = this.handshake;
      this.handshake = null;
      handshake.reject(new ClientNotConnectedError('WebSocket closed before connection:ack.'));
    }

    this.rejectAllPending(new ClientNotConnectedError('WebSocket closed.'));
    this.listenersBySubscriptionId.clear();
  }

  private rejectAllPending(error: unknown): void {
    for (const pending of this.pending.values()) {
      try {
        pending.reject(error);
      } catch {
        // reject handlers shouldn't throw; swallow if they do.
      }
    }
    this.pending.clear();
  }
}
