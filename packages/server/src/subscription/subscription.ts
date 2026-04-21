import { z } from 'zod';

type WithId<T> = { id: string } & Omit<T, 'id'>;

/**
 * Entity-only `subscribeTo` declaration. A subscription declares which
 * schema entities it cares about; dispatch will short-circuit when an
 * emitted change doesn't touch any of the declared entities.
 */
export type SubscribeToMap<SchemaEntities extends Record<string, any>> = Partial<Record<keyof SchemaEntities & string, true>>;

type ExactSubscribeToKeys<SchemaEntities extends Record<string, any>, SubscribeTo extends Record<string, any>> =
  Exclude<keyof SubscribeTo, keyof SchemaEntities & string> extends never ? SubscribeTo : never;

/**
 * Single-row change variant surfaced to `keyFromChange` and `filter`,
 * discriminated by `entity` and `operation` so subscribers can
 * `if`-check the variant and TypeScript narrows `row` to the matching
 * entity shape.
 */
export type SubscribedChange<SchemaEntities extends Record<string, any>, SubscribeTo extends SubscribeToMap<SchemaEntities>> = {
  [K in Extract<keyof SubscribeTo, keyof SchemaEntities & string>]:
    | { entity: K; operation: 'insert'; row: WithId<SchemaEntities[K]> }
    | { entity: K; operation: 'update'; row: WithId<SchemaEntities[K]> }
    | { entity: K; operation: 'upsert'; row: WithId<SchemaEntities[K]> }
    | { entity: K; operation: 'delete'; row: WithId<SchemaEntities[K]> };
}[Extract<keyof SubscribeTo, keyof SchemaEntities & string>];

/** Operations a {@link SubscribedChange} can carry. Exported so callers
 * can build helpers like `change.operation === 'insert'` exhaustively. */
export type SubscribedChangeOperation = 'insert' | 'update' | 'upsert' | 'delete';

export type SubscriptionOptions<
  SchemaContext,
  SchemaEntities extends Record<string, any>,
  SchemaConnection,
  Args extends z.ZodObject<z.ZodRawShape>,
  SubscribeTo extends SubscribeToMap<SchemaEntities>,
> = {
  args: Args;

  /**
   * Entities this subscription cares about. Dispatch skips subscriptions
   * whose declared entities have no overlap with the emitted changes.
   */
  subscribeTo: SubscribeTo & ExactSubscribeToKeys<SchemaEntities, SubscribeTo>;

  /**
   * Optional async authorization hook run at subscribe time. Returning
   * `false` (or `undefined`) will reject the subscription before it is
   * registered with the resolver.
   */
  allow?: (options: {
    context: SchemaContext;
    connection: SchemaConnection;
    args: z.infer<Args>;
  }) => boolean | void | Promise<boolean | void>;

  /**
   * Computes the routing key for a new subscriber at subscribe time.
   * Receives the parsed `args` plus the per-connection `context` and
   * `connection` so implementations can derive the key from
   * authenticated identity (e.g. the session user id) in addition to
   * caller-supplied args. Must be stable for the lifetime of the
   * subscription.
   */
  keyFromSubscribe: (options: {
    args: z.infer<Args>;
    context: SchemaContext;
    connection: SchemaConnection;
  }) => string;

  /**
   * Computes the routing key from a single emitted change. Invoked
   * once for every individual row across every subscribed entity /
   * operation in an emit, so different rows in the same emit can
   * route to different subscribers. Return `null`/`undefined` to
   * skip dispatch for that particular row.
   *
   * Rows sharing the same resulting key are bundled into a single
   * `subscription:update` batch per matching subscriber before
   * `filter` is applied.
   *
   * `change` is a discriminated union over `(entity, operation)` so
   * implementations can branch on the variant and TypeScript will
   * narrow `change.row` to the corresponding entity shape.
   */
  keyFromChange: (options: { change: SubscribedChange<SchemaEntities, SubscribeTo> }) => string | null | undefined;

  /**
   * Optional per-row gating hook. Invoked once for every individual
   * row across every subscribed entity / operation in an emit, after
   * key matching. Return `false` to drop that one row from the
   * subscriber's update; if every row is dropped the update message
   * itself is suppressed.
   *
   * `change` is a discriminated union over `(entity, operation)` so
   * implementations can branch on the variant and TypeScript will
   * narrow `change.row` to the corresponding entity shape.
   */
  filter?: (options: {
    context: SchemaContext;
    connection: SchemaConnection;
    args: z.infer<Args>;
    change: SubscribedChange<SchemaEntities, SubscribeTo>;
  }) => boolean | Promise<boolean>;
};

export class Subscription<
  SchemaContext,
  SchemaEntities extends Record<string, any>,
  SchemaConnection,
  Args extends z.ZodObject<z.ZodRawShape>,
  SubscribeTo extends SubscribeToMap<SchemaEntities>,
> {
  private readonly subscriptionName: string;

  private readonly args: Args;

  private readonly subscribeTo: SubscribeTo;

  private readonly allow?: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['allow'];

  private readonly keyFromSubscribe: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['keyFromSubscribe'];

  private readonly keyFromChange: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['keyFromChange'];

  private readonly filter?: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['filter'];

  constructor(subscriptionName: string, options: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>) {
    this.subscriptionName = subscriptionName;
    this.args = options.args;
    this.subscribeTo = options.subscribeTo as SubscribeTo;
    this.allow = options.allow;
    this.keyFromSubscribe = options.keyFromSubscribe;
    this.keyFromChange = options.keyFromChange;
    this.filter = options.filter;
  }

  getSubscriptionName(): string {
    return this.subscriptionName;
  }

  getArgsSchema(): z.ZodObject<z.ZodRawShape> {
    return this.args;
  }

  getSubscribeTo(): SubscribeTo {
    return this.subscribeTo;
  }

  getAllow(): SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['allow'] {
    return this.allow;
  }

  getKeyFromSubscribe(): SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['keyFromSubscribe'] {
    return this.keyFromSubscribe;
  }

  getKeyFromChange(): SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['keyFromChange'] {
    return this.keyFromChange;
  }

  getFilter(): SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>['filter'] {
    return this.filter;
  }
}
