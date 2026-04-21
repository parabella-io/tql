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

export type WebSocketFactory = (url: string) => WebSocketLike;

export type WsTransportOptions = {
  url: string;
  /**
   * Factory that constructs a `WebSocket`-like instance. Defaults to
   * `new globalThis.WebSocket(url)` when available.
   */
  webSocket?: WebSocketFactory;
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
 */
export class WsTransport implements SubscriptionTransport {
  private readonly url: string;

  private readonly webSocketFactory: WebSocketFactory;

  private socket: WebSocketLike | null = null;

  private connecting: Promise<void> | null = null;

  private pending = new Map<string, PendingRequest>();

  private listenersBySubscriptionId = new Map<string, SubscriptionListener>();

  private nextMessageId = 0;

  constructor(options: WsTransportOptions) {
    this.url = options.url;

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
    return this.socket !== null && this.socket.readyState === READY_STATE_OPEN;
  }

  public connect(): Promise<void> {
    if (this.isConnected()) return Promise.resolve();

    if (this.connecting) return this.connecting;

    const socket = this.webSocketFactory(this.url);

    this.socket = socket;

    this.connecting = new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        this.connecting = null;
        resolve();
      };

      const onError = () => {
        this.connecting = null;
        // Only reject during connect; after connect is resolved the close
        // listener handles teardown.
        if (this.socket === socket && socket.readyState !== READY_STATE_OPEN) {
          this.socket = null;

          reject(new Error('WebSocket connection failed'));
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
