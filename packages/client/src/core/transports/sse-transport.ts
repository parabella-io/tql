import { HttpFetch, HttpFetchResponse } from './http-transport';
import {
  ClientNotConnectedError,
  SubscribeHandle,
  SubscriberBatchMessage,
  SubscriptionListener,
  SubscriptionTransport,
} from './subscription-transport';

/**
 * Minimal duck-typed view of the browser `EventSource` surface the
 * client needs. Consumers can plug in the global `EventSource`, a
 * polyfill, or a test fake.
 */
export type EventSourceLike = {
  readonly readyState: number;
  close(): void;
  addEventListener(event: 'open', listener: () => void): void;
  addEventListener(event: 'error', listener: (event?: unknown) => void): void;
  addEventListener(event: 'message', listener: (event: { data: string }) => void): void;
};

export type EventSourceFactory = (url: string) => EventSourceLike;

export type SseTransportOptions = {
  /** URL of the long-lived `GET /events` SSE stream. */
  eventsUrl: string;
  /** URL of the `POST /subscribe` RPC endpoint. */
  subscribeUrl: string;
  /** URL of the `POST /unsubscribe` RPC endpoint. */
  unsubscribeUrl: string;

  /**
   * Factory that opens the SSE stream. Defaults to
   * `new EventSource(url, { withCredentials })`. When overriding, the
   * factory is responsible for honoring `withCredentials` itself.
   */
  eventSource?: EventSourceFactory;

  /**
   * Whether the SSE stream should be opened with
   * `withCredentials: true` so cookies / `Authorization` are forwarded
   * cross-origin, matching the `/subscribe` + `/unsubscribe` POSTs
   * which already use `credentials: 'include'`. Defaults to `true`.
   */
  withCredentials?: boolean;

  /** HTTP transport used for the POST RPCs. */
  fetch?: HttpFetch;

  /** Extra headers merged onto every `/subscribe` + `/unsubscribe` call. */
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
};

const defaultFetch: HttpFetch = async ({ url, method, headers, body, credentials }) => {
  if (typeof globalThis.fetch !== 'function') {
    throw new Error('SseTransport: no global `fetch` available. Pass `fetch` explicitly.');
  }

  const response = await globalThis.fetch(url, { method, headers, body, credentials: credentials ?? 'include' });

  return {
    status: response.status,
    json: () => response.json(),
  };
};

/**
 * SSE subscription transport. Opens a single long-lived `EventSource`
 * on `eventsUrl`, captures `connectionId` from the
 * `connection:ready` frame, then delegates subscribe/unsubscribe to
 * plain POST RPCs.
 */
export class SseTransport implements SubscriptionTransport {
  private readonly options: SseTransportOptions;

  private readonly fetchImpl: HttpFetch;

  private readonly getHeaders: () => Record<string, string> | Promise<Record<string, string>>;

  private readonly credentials: 'include' | 'omit';

  private eventSource: EventSourceLike | null = null;

  private connectionId: string | null = null;

  private connecting: Promise<void> | null = null;

  private listenersBySubscriptionId = new Map<string, SubscriptionListener>();

  constructor(options: SseTransportOptions) {
    this.options = options;
    this.fetchImpl = options.fetch ?? defaultFetch;
    this.getHeaders = options.headers ?? (() => ({}));
    this.credentials = (options.withCredentials ?? true) ? 'include' : 'omit';
  }

  public isConnected(): boolean {
    return this.eventSource !== null && this.connectionId !== null;
  }

  public connect(): Promise<void> {
    if (this.isConnected()) return Promise.resolve();

    if (this.connecting) return this.connecting;

    const withCredentials = this.credentials === 'include';

    const factory =
      this.options.eventSource ??
      ((url: string) => {
        const ctor = (globalThis as any).EventSource;

        if (typeof ctor !== 'function') {
          throw new Error('SseTransport: no global `EventSource` available. Pass `eventSource` explicitly.');
        }

        return new ctor(url, { withCredentials }) as EventSourceLike;
      });

    const source = factory(this.options.eventsUrl);

    this.eventSource = source;

    this.connecting = new Promise<void>((resolve, reject) => {
      let settled = false;

      const settleResolve = () => {
        if (settled) return;
        settled = true;
        this.connecting = null;
        resolve();
      };

      const settleReject = (error: unknown) => {
        if (settled) return;
        settled = true;
        this.connecting = null;
        this.eventSource = null;
        reject(error);
      };

      source.addEventListener('error', (event) => {
        if (!settled) {
          settleReject(new Error('SSE connection failed'));
          return;
        }
        this.handleStreamError(event);
      });

      source.addEventListener('message', (event) => {
        let parsed: Record<string, unknown>;

        try {
          parsed = JSON.parse(event.data) as Record<string, unknown>;
        } catch {
          return;
        }

        if (!parsed || typeof parsed !== 'object') return;

        if (parsed.type === 'connection:ready' && typeof parsed.connectionId === 'string') {
          this.connectionId = parsed.connectionId;
          settleResolve();
          return;
        }

        if (parsed.type === 'connection:error') {
          settleReject(parsed.error ?? new Error('connection:error'));
          return;
        }

        if (parsed.type === 'subscription:batch') {
          this.dispatchBatch(parsed as unknown as SubscriberBatchMessage);
          return;
        }

        if (parsed.type === 'subscription:error') {
          const id = typeof parsed.id === 'string' ? parsed.id : undefined;
          const listener = id ? this.listenersBySubscriptionId.get(id) : undefined;
          listener?.onError?.((parsed.error as { message: string }) ?? { message: 'subscription error' });
          return;
        }
      });
    });

    return this.connecting;
  }

  public async disconnect(): Promise<void> {
    const source = this.eventSource;

    if (!source) return;

    this.eventSource = null;
    this.connectionId = null;
    this.connecting = null;

    try {
      source.close();
    } catch {
      // Teardown is best-effort.
    }

    this.listenersBySubscriptionId.clear();
  }

  public async subscribe(options: { name: string; args: unknown; listener: SubscriptionListener }): Promise<SubscribeHandle> {
    if (!this.isConnected() || !this.connectionId) {
      throw new ClientNotConnectedError();
    }

    const connectionId = this.connectionId;

    const body = {
      connectionId,
      name: options.name,
      args: options.args,
    };

    const response = await this.post(this.options.subscribeUrl, body);

    if (response && typeof response === 'object' && 'error' in response) {
      throw (response as { error: unknown }).error;
    }

    const subscriptionId = (response as { subscriptionId?: string }).subscriptionId;

    if (!subscriptionId) {
      throw new Error('Invalid /subscribe response: missing subscriptionId');
    }

    this.listenersBySubscriptionId.set(subscriptionId, options.listener);

    return {
      subscriptionId,
      unsubscribe: async () => {
        this.listenersBySubscriptionId.delete(subscriptionId);

        if (!this.isConnected() || !this.connectionId) return;

        try {
          await this.post(this.options.unsubscribeUrl, {
            connectionId: this.connectionId,
            subscriptionId,
          });
        } catch {
          // Best-effort.
        }
      },
    };
  }

  private async post(url: string, body: Record<string, unknown>): Promise<unknown> {
    const extraHeaders = await this.getHeaders();

    const response: HttpFetchResponse = await this.fetchImpl({
      url,
      method: 'POST',
      headers: { 'content-type': 'application/json', ...extraHeaders },
      body: JSON.stringify(body),
      credentials: this.credentials,
    });

    if (response.status < 200 || response.status >= 300) {
      throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
    }

    return response.json();
  }

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

  private handleStreamError(_event: unknown): void {
    // After a successful connect, the browser `EventSource` emits
    // `error` on transient network blips. We leave reconnection to the
    // native implementation and only report unrecoverable errors via
    // subscriber listeners; there's nothing transport-wide to surface
    // here today.
  }
}
