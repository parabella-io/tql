import {
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
  /**
   * URL of the SSE `GET /events` endpoint. Each `subscribe(...)` call
   * opens its own `EventSource` against this URL with `?name=...` and
   * `?args=<JSON>` query params, so a single stream carries exactly
   * one subscription.
   */
  eventsUrl: string;

  /**
   * Factory that opens the SSE stream. Defaults to
   * `new EventSource(url, { withCredentials })`. When overriding, the
   * factory is responsible for honoring `withCredentials` itself (and
   * for any custom request headers, which the native `EventSource`
   * does not support).
   */
  eventSource?: EventSourceFactory;

  /**
   * Whether the SSE stream should be opened with
   * `withCredentials: true` so cookies / `Authorization` are forwarded
   * cross-origin. Defaults to `true`.
   */
  withCredentials?: boolean;
};

/**
 * SSE subscription transport. Each call to `subscribe(...)` opens a
 * dedicated `EventSource` to `eventsUrl?name=...&args=...`. The server
 * resolves the subscription on-connect and writes a
 * `subscription:ready` frame (which resolves the returned handle),
 * followed by `subscription:batch` frames for that subscription only.
 * Closing the `EventSource` (via `handle.unsubscribe()`) is what tears
 * the subscription down on the server — there are no `/subscribe` or
 * `/unsubscribe` POSTs.
 *
 * `connect()` / `disconnect()` are intentional no-ops: there is no
 * shared long-lived stream to manage.
 */
export class SseTransport implements SubscriptionTransport {
  private readonly options: SseTransportOptions;

  private readonly withCredentials: boolean;

  constructor(options: SseTransportOptions) {
    this.options = options;
    this.withCredentials = options.withCredentials ?? true;
  }

  public isConnected(): boolean {
    return true;
  }

  public connect(): Promise<void> {
    return Promise.resolve();
  }

  public async disconnect(): Promise<void> {
    // No shared connection state to tear down.
  }

  public subscribe(options: { name: string; args: unknown; listener: SubscriptionListener }): Promise<SubscribeHandle> {
    const url = this.buildUrl(options.name, options.args);

    const factory = this.resolveFactory();

    const source = factory(url);

    return new Promise<SubscribeHandle>((resolve, reject) => {
      let settled = false;
      let subscriptionId: string | null = null;

      const settleResolve = (id: string) => {
        if (settled) return;
        settled = true;
        subscriptionId = id;
        resolve({
          subscriptionId: id,
          unsubscribe: async () => {
            try {
              source.close();
            } catch {
              // Teardown is best-effort.
            }
          },
        });
      };

      const settleReject = (error: unknown) => {
        if (settled) return;
        settled = true;
        try {
          source.close();
        } catch {
          // Teardown is best-effort.
        }
        reject(error);
      };

      source.addEventListener('error', (event) => {
        if (!settled) {
          settleReject(new Error('SSE connection failed'));
          return;
        }
        // After a successful subscribe the browser `EventSource`
        // emits `error` on transient network blips. We leave
        // reconnection to the native implementation and surface
        // unrecoverable errors via the listener's `subscription:error`
        // path instead.
        void event;
      });

      source.addEventListener('message', (event) => {
        let parsed: Record<string, unknown>;

        try {
          parsed = JSON.parse(event.data) as Record<string, unknown>;
        } catch {
          return;
        }

        if (!parsed || typeof parsed !== 'object') return;

        if (parsed.type === 'subscription:ready') {
          const id = typeof parsed.subscriptionId === 'string' ? parsed.subscriptionId : null;
          if (!id) {
            settleReject(new Error('Invalid subscription:ready frame: missing subscriptionId'));
            return;
          }
          settleResolve(id);
          return;
        }

        if (parsed.type === 'subscription:batch') {
          if (!settled) return;
          options.listener.onBatch(parsed as unknown as SubscriberBatchMessage);
          return;
        }

        if (parsed.type === 'subscription:error') {
          const error = (parsed.error as { message: string } | undefined) ?? { message: 'subscription error' };
          if (!settled) {
            settleReject(error);
            return;
          }
          options.listener.onError?.(error);
          // A terminal error is usually followed by the server closing
          // the stream; `unsubscribe()` is safe to call again if the
          // consumer hasn't torn the handle down yet.
          void subscriptionId;
          return;
        }
      });
    });
  }

  private buildUrl(name: string, args: unknown): string {
    // `eventsUrl` may be absolute (`https://api.example.com/events`)
    // or relative (`/events`). `new URL` rejects relative URLs without
    // a base, so we fall back to manual query-string assembly in that
    // case. `EventSource` itself accepts both.
    const query = `name=${encodeURIComponent(name)}&args=${encodeURIComponent(JSON.stringify(args ?? {}))}`;

    try {
      const url = new URL(this.options.eventsUrl);
      url.searchParams.set('name', name);
      url.searchParams.set('args', JSON.stringify(args ?? {}));
      return url.toString();
    } catch {
      const base = this.options.eventsUrl;
      const separator = base.includes('?') ? '&' : '?';
      return `${base}${separator}${query}`;
    }
  }

  private resolveFactory(): EventSourceFactory {
    if (this.options.eventSource) return this.options.eventSource;

    const withCredentials = this.withCredentials;

    return (url: string) => {
      const ctor = (globalThis as any).EventSource;

      if (typeof ctor !== 'function') {
        throw new Error('SseTransport: no global `EventSource` available. Pass `eventSource` explicitly.');
      }

      return new ctor(url, { withCredentials }) as EventSourceLike;
    };
  }
}
