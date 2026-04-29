export * from './http-transport';

/**
 * Shared shape for any transport the client knows how to drive.
 *
 * `HttpTransport` already satisfies this structurally; future transports
 * (e.g. `WsTransport`) will implement the same two methods so they can be
 * registered alongside `http` in `ClientTransports`.
 */
export interface Transport {
  query(payload: Record<string, any>): Promise<any>;
  mutation(payload: Record<string, any>): Promise<any>;
}

/**
 * Identifier used to pick a transport per `createQuery` / `createMutation`
 * call. `'ws'` will be added once `WsTransport` lands.
 */
export type TransportKey = 'http';

/**
 * Registry of transports available to a `Client`. `http` is required so the
 * default transport always resolves; optional slots will be added as new
 * transport kinds ship.
 */
export type ClientTransports = {
  http: Transport;
  // ws?: Transport;  // future
};
