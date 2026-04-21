/**
 * Pub/sub seam used to fan out mutation-emitted changes to every
 * subscription resolver instance (typically one per process, but the
 * interface is the extension point for cross-process transports like
 * Redis).
 *
 * The in-memory implementation ships with `@tql/server`. A Redis-backed
 * implementation will satisfy the same contract so the
 * {@link SubscriptionResolver} code path never needs to change.
 */

/**
 * Entity-level change shape accepted by `emit(...)`. The same shape is
 * then routed to every subscription whose `subscribeTo` declaration
 * overlaps with at least one of the provided entity keys.
 */
export type EmittedChange = {
  inserts?: Array<{ id: string } & Record<string, unknown>>;
  updates?: Array<{ id: string } & Record<string, unknown>>;
  upserts?: Array<{ id: string } & Record<string, unknown>>;
  deletes?: Array<{ id: string } & Record<string, unknown>>;
};

export type EmittedChanges = Record<string, EmittedChange>;

export type BackboneMessage = {
  /** Name of the mutation that produced these changes. Informational. */
  mutationName: string;
  /** Entity-keyed changes payload passed through to subscription dispatch. */
  changes: EmittedChanges;
};

export type BackboneListener = (message: BackboneMessage) => Promise<void> | void;

export interface Backbone {
  publish(message: BackboneMessage): Promise<void> | void;
  subscribe(listener: BackboneListener): () => void;
}
