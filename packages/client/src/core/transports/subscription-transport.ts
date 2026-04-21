import type { FormattedTQLServerError } from '@tql/server/shared';

/**
 * Shared wire shapes mirrored from `@tql/server`. Redeclared here so
 * the client doesn't need to import anything off the server runtime.
 * They match exactly the JSON emitted by `SubscriptionResolver.dispatch`.
 */
export type SubscriberChangeOperation = 'inserts' | 'updates' | 'upserts' | 'deletes';

export type SubscriberBatchRow = { id: string } & Record<string, unknown>;

export type SubscriberBatchRows = {
  [entity: string]: Partial<Record<SubscriberChangeOperation, Record<string, SubscriberBatchRow>>>;
};

export type SubscriberBatchMatch = {
  id: string;
  name: string;
  changes: {
    [entity: string]: Partial<Record<SubscriberChangeOperation, string[]>>;
  };
};

export type SubscriberBatchMessage = {
  type: 'subscription:batch';
  rows: SubscriberBatchRows;
  matches: SubscriberBatchMatch[];
};

export type SubscriberErrorMessage = {
  type: 'subscription:error';
  id: string;
  error: { message: string };
};

export type SubscriberMessage = SubscriberBatchMessage | SubscriberErrorMessage;

/**
 * Inbound callback surface exposed to every subscription transport. The
 * transport is responsible for demultiplexing incoming frames against
 * the `subscriptionId` returned from `subscribe(...)` and invoking
 * either `onBatch` (for the batch rows touching that subscription) or
 * `onError` (for a `subscription:error` frame targeted at it).
 */
export type SubscriptionListener = {
  onBatch: (batch: SubscriberBatchMessage) => void;
  onError?: (error: { message: string }) => void;
};

export type SubscribeHandle = {
  subscriptionId: string;
  unsubscribe: () => Promise<void>;
};

/**
 * Pluggable transport used by `Client` to carry server subscriptions.
 * Implemented by {@link WsTransport} and {@link SseTransport}. Exactly
 * one instance is active per `Client` (SSE and WS are mutually
 * exclusive when driving subscriptions).
 */
export interface SubscriptionTransport {
  /**
   * Open the underlying stream / socket. Resolves once the transport
   * is ready to accept `subscribe(...)` calls — for SSE this means the
   * server has emitted `connection:ready`; for WS the socket has
   * reached the `open` state.
   */
  connect(): Promise<void>;

  /**
   * Close the underlying stream / socket. After this resolves, all
   * outstanding `subscribe(...)` handles have been torn down and every
   * subsequent `subscribe(...)` call rejects until `connect()` is
   * invoked again.
   */
  disconnect(): Promise<void>;

  isConnected(): boolean;

  subscribe(options: { name: string; args: unknown; listener: SubscriptionListener }): Promise<SubscribeHandle>;
}

/**
 * Emitted by a transport when a request is issued against a
 * connection that is not open. The `Client` auto-connects on first
 * `Subscription.subscribe()` / `transport: 'ws'` call, so user code
 * should rarely see this — it surfaces for low-level transport
 * misuse (e.g. sending on a socket that has just closed).
 */
export class ClientNotConnectedError extends Error {
  constructor(message = 'Transport is not connected.') {
    super(message);
    this.name = 'ClientNotConnectedError';
  }
}

export const toFormattedError = (error: unknown): FormattedTQLServerError => {
  if (error && typeof error === 'object' && 'type' in error && 'details' in error) {
    return error as FormattedTQLServerError;
  }

  if (error instanceof Error) {
    return { type: 'unknown', details: { message: error.message, name: error.name } };
  }

  return { type: 'unknown', details: { message: 'Unknown error', fullError: error } };
};
