/**
 * In-process registry of active subscribers keyed by `(subscriptionName, key)`.
 *
 * The registry intentionally stores subscribers in a flat map per
 * `(name, key)` pair: dispatch is hot-path and does a single O(1) lookup
 * to find candidates before running `filter` on each one.
 */
export type RegisteredSubscriber = {
  id: string;
  connectionId: string;
  subscriptionName: string;
  key: string;
  args: unknown;
  context: unknown;
  connection: unknown;
  send: (message: SubscriberMessage) => void;
};

/**
 * Operation buckets that a subscription `changes` payload can contain.
 * Shared between the row table and per-match id lists so both sides
 * always line up.
 */
export type SubscriberChangeOperation = 'inserts' | 'updates' | 'upserts' | 'deletes';

/**
 * Row with a mandatory `id` plus arbitrary fields. Rows in a
 * {@link SubscriberMessage} batch are stored once per
 * `(entity, operation, id)` and referenced by id from each match.
 */
export type SubscriberBatchRow = { id: string } & Record<string, unknown>;

/**
 * Per-emit, per-connection deduplicated row table. Indexed by
 * `entity -> operation -> row.id -> row`.
 */
export type SubscriberBatchRows = {
  [entity: string]: Partial<Record<SubscriberChangeOperation, Record<string, SubscriberBatchRow>>>;
};

/**
 * A single matched subscriber's changes inside a batch. `changes`
 * carries only row ids; the corresponding row bodies live in the
 * batch-level `rows` table.
 */
export type SubscriberBatchMatch = {
  id: string;
  name: string;
  changes: {
    [entity: string]: Partial<Record<SubscriberChangeOperation, string[]>>;
  };
};

export type SubscriberMessage =
  | {
      type: 'subscription:batch';
      rows: SubscriberBatchRows;
      matches: SubscriberBatchMatch[];
    }
  | {
      type: 'subscription:error';
      id: string;
      error: { message: string };
    };

type CompositeKey = string;

const compositeKey = (subscriptionName: string, key: string): CompositeKey => {
  console.log(subscriptionName, key);
  return `${subscriptionName}::${key}`;
};

export class SubscriptionRegistry {
  private readonly byCompositeKey: Map<CompositeKey, Map<string, RegisteredSubscriber>> = new Map();

  private readonly byId: Map<string, RegisteredSubscriber> = new Map();

  private readonly byConnection: Map<string, Set<string>> = new Map();

  add(subscriber: RegisteredSubscriber): void {
    this.byId.set(subscriber.id, subscriber);

    const composite = compositeKey(subscriber.subscriptionName, subscriber.key);

    let bucket = this.byCompositeKey.get(composite);

    if (!bucket) {
      bucket = new Map();
      this.byCompositeKey.set(composite, bucket);
      console.log(console.log(composite, bucket));
    }

    bucket.set(subscriber.id, subscriber);

    let connectionIds = this.byConnection.get(subscriber.connectionId);

    if (!connectionIds) {
      connectionIds = new Set();
      this.byConnection.set(subscriber.connectionId, connectionIds);
    }

    connectionIds.add(subscriber.id);
  }

  removeById(id: string): RegisteredSubscriber | undefined {
    const subscriber = this.byId.get(id);

    if (!subscriber) return undefined;

    this.byId.delete(id);

    const composite = compositeKey(subscriber.subscriptionName, subscriber.key);

    const bucket = this.byCompositeKey.get(composite);

    if (bucket) {
      bucket.delete(id);

      if (bucket.size === 0) {
        this.byCompositeKey.delete(composite);
      }
    }

    const connectionIds = this.byConnection.get(subscriber.connectionId);

    if (connectionIds) {
      connectionIds.delete(id);

      if (connectionIds.size === 0) {
        this.byConnection.delete(subscriber.connectionId);
      }
    }

    return subscriber;
  }

  removeByConnection(connectionId: string): RegisteredSubscriber[] {
    const ids = this.byConnection.get(connectionId);

    if (!ids) return [];

    const removed: RegisteredSubscriber[] = [];

    for (const id of Array.from(ids)) {
      const subscriber = this.removeById(id);
      if (subscriber) removed.push(subscriber);
    }

    return removed;
  }

  lookup(subscriptionName: string, key: string): RegisteredSubscriber[] {
    const bucket = this.byCompositeKey.get(compositeKey(subscriptionName, key));
    if (!bucket) return [];
    return Array.from(bucket.values());
  }

  size(): number {
    return this.byId.size;
  }
}
