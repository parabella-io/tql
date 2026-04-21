import type { ClientSchema } from '@tql/server/shared';
import type { OptimisticQueryStorePublic } from '../mutation/mutation.types';

export type SubscriptionNameFor<S extends ClientSchema> = keyof S['SubscriptionInputMap'] & string;

export type SubscriptionInputFor<S extends ClientSchema, Name extends SubscriptionNameFor<S>> = NonNullable<
  S['SubscriptionInputMap'][Name]
>;

export type SubscriptionArgsFor<S extends ClientSchema, Name extends SubscriptionNameFor<S>> =
  SubscriptionInputFor<S, Name> extends { args: infer Args } ? Args : never;

/**
 * Entity names a subscription has declared (`subscribeTo`) that also
 * exist in `SchemaEntities`. Drives the valid keys for
 * `SubscriptionOptions.onChange`.
 */
export type SubscriptionEntityNameFor<S extends ClientSchema, Name extends SubscriptionNameFor<S>> =
  Name extends keyof S['SubscriptionRegistry']
    ? S['SubscriptionRegistry'][Name] extends { subscribeTo: infer SubscribeTo }
      ? Extract<keyof SubscribeTo, keyof S['SchemaEntities'] & string>
      : never
    : never;

export type SubscriptionEntityShapeFor<S extends ClientSchema, Entity extends keyof S['SchemaEntities'] & string> =
  S['SchemaEntities'][Entity];

export type SubscriptionChangeHookParams<S extends ClientSchema, Name extends SubscriptionNameFor<S>, Entity extends SubscriptionEntityNameFor<S, Name>> = {
  store: OptimisticQueryStorePublic;
  change: SubscriptionEntityShapeFor<S, Entity>;
  args: SubscriptionArgsFor<S, Name>;
};

export type SubscriptionEntityHooks<S extends ClientSchema, Name extends SubscriptionNameFor<S>, Entity extends SubscriptionEntityNameFor<S, Name>> = {
  onInsert?: (params: SubscriptionChangeHookParams<S, Name, Entity>) => void;
  onUpdate?: (params: SubscriptionChangeHookParams<S, Name, Entity>) => void;
  onUpsert?: (params: SubscriptionChangeHookParams<S, Name, Entity>) => void;
  onDelete?: (params: SubscriptionChangeHookParams<S, Name, Entity>) => void;
};

export type SubscriptionOnChangeMap<S extends ClientSchema, Name extends SubscriptionNameFor<S>> = {
  [Entity in SubscriptionEntityNameFor<S, Name>]?: SubscriptionEntityHooks<S, Name, Entity>;
};

/**
 * Valid `transport` selections per query / mutation / subscription. WS
 * is only addressable when the client has been constructed with a WS
 * transport configured.
 */
export type CallTransport = 'http' | 'ws';

export type SubscriptionOptions<
  S extends ClientSchema,
  Name extends SubscriptionNameFor<S>,
  Params extends Record<string, any>,
> = {
  subscriptionKey: string;
  args: (params: Params) => SubscriptionArgsFor<S, Name>;
  onChange?: SubscriptionOnChangeMap<S, Name>;
};
