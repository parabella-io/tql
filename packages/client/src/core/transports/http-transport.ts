/**
 * HTTP transport for queries and mutations. Targets the endpoints
 * wired by `Server.attachHttp` — `POST /query` and `POST /mutation` —
 * but is deliberately decoupled from any specific HTTP client so app
 * code can plug in `fetch`, `axios`, or a test fake.
 */
export type HttpFetch = (options: {
  url: string;
  method: 'POST';
  headers: Record<string, string>;
  body: string;
  credentials?: 'include' | 'same-origin' | 'omit';
}) => Promise<HttpFetchResponse>;

export type HttpFetchResponse = {
  status: number;
  json: () => Promise<unknown>;
};

export type HttpTransportOptions = {
  /**
   * Base URL (or path prefix) that `/query` and `/mutation` are
   * appended to. Trailing slashes are trimmed so `'/api'` and
   * `'/api/'` both target `'/api/query'`.
   */
  url: string;

  /**
   * Optional explicit endpoint override. When supplied this wins over
   * the derived `${url}/query` / `${url}/mutation`.
   */
  queryUrl?: string;

  mutationUrl?: string;

  /**
   * Extra headers merged onto every request. Lazy so auth tokens can
   * be read fresh per call.
   */
  headers?: () => Record<string, string> | Promise<Record<string, string>>;

  /**
   * Whether requests should be sent with `credentials: 'include'` so
   * cookies / `Authorization` flow cross-origin. Defaults to `true`
   * to match `SseTransport`. When `false`, requests use
   * `credentials: 'omit'`.
   */
  withCredentials?: boolean;

  /**
   * Override the underlying transport. Defaults to `globalThis.fetch`.
   */
  fetch?: HttpFetch;
};

const defaultFetch: HttpFetch = async ({ url, method, headers, body, credentials }) => {
  if (typeof globalThis.fetch !== 'function') {
    throw new Error('HttpTransport: no global `fetch` available. Pass `fetch` explicitly.');
  }

  const response = await globalThis.fetch(url, { method, headers, body, credentials: credentials ?? 'include' });

  return {
    status: response.status,
    json: () => response.json(),
  };
};

export class HttpTransport {
  private readonly queryUrl: string;

  private readonly mutationUrl: string;

  private readonly getHeaders: () => Record<string, string> | Promise<Record<string, string>>;

  private readonly fetchImpl: HttpFetch;

  private readonly credentials: 'include' | 'omit';

  constructor(options: HttpTransportOptions) {
    const base = options.url.replace(/\/+$/, '');

    this.queryUrl = options.queryUrl ?? `${base}/query`;
    this.mutationUrl = options.mutationUrl ?? `${base}/mutation`;
    this.getHeaders = options.headers ?? (() => ({}));
    this.fetchImpl = options.fetch ?? defaultFetch;
    this.credentials = (options.withCredentials ?? true) ? 'include' : 'omit';
  }

  public async query(payload: Record<string, any>): Promise<any> {
    return this.post(this.queryUrl, payload);
  }

  public async mutation(payload: Record<string, any>): Promise<any> {
    return this.post(this.mutationUrl, payload);
  }

  private async post(url: string, payload: Record<string, any>): Promise<any> {
    const extraHeaders = await this.getHeaders();

    const response = await this.fetchImpl({
      url,
      method: 'POST',
      headers: { 'content-type': 'application/json', ...extraHeaders },
      body: JSON.stringify(payload),
      credentials: this.credentials,
    });

    if (response.status < 200 || response.status >= 300) {
      // Surface server errors as structured payloads when possible;
      // fall through to a generic thrown error otherwise.
      try {
        const body = await response.json();
        throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status, body });
      } catch (error) {
        throw error;
      }
    }

    return response.json();
  }
}
