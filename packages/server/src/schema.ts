import { z } from 'zod';
import { Field } from './query/field.js';
import { Model, ModelConstructor, IncludesMap } from './query/model.js';
import { ExtractEntityShape } from './extract-entity-shape.js';
import { Mutation, MutationOptions } from './mutation/mutation.js';
import { SchemaEntity } from './schema-entity.js';
import { Subscription, type SubscribeToMap, type SubscriptionOptions } from './subscription/subscription.js';

export class Schema<
  SchemaContext extends Record<string, any>,
  SchemaEntities extends Record<string, SchemaEntity<Record<string, any>>>,
  SchemaConnection = unknown,
> {
  /**
   * Phantom slot so the `SchemaConnection` generic has a consumer on the
   * class. Users never read this — it's here to prevent TypeScript from
   * inferring `unknown` at call sites that need the connection shape.
   */
  declare __connection: SchemaConnection;

  /**
   * Models registered via {@link Schema.model}. Populated lazily as each model
   * is constructed so codegen can introspect the full schema without needing a
   * live resolver.
   */
  public readonly models: Record<string, Model<SchemaContext, SchemaEntities, any, any, any, any, any>> = {};

  /**
   * Mutations registered via {@link Schema.mutation}. Each mutation is named
   * at registration so codegen and the {@link MutationResolver} can both look
   * them up by name without a separate resolver factory.
   */
  public readonly mutations: Record<string, Mutation<SchemaContext, SchemaEntities, any, any>> = {};

  /**
   * Subscriptions registered via {@link Schema.subscription}. Exposed to
   * codegen and the runtime {@link SubscriptionResolver} alongside
   * {@link Schema.mutations}.
   */
  public readonly subscriptions: Record<string, Subscription<SchemaContext, SchemaEntities, SchemaConnection, any, any>> = {};

  model<
    ModelName extends keyof SchemaEntities,
    ModelSchema extends z.ZodObject<{
      [P in keyof ExtractEntityShape<SchemaEntities, ModelName>]: z.ZodType<ExtractEntityShape<SchemaEntities, ModelName>[P]>;
    }>,
    ModelFields extends Record<keyof ExtractEntityShape<SchemaEntities, ModelName>, Field<SchemaContext, SchemaEntities, ModelName>>,
    ModelQueries extends Record<string, any>,
    ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName> = {},
  >(
    modelName: ModelName,
    options: ModelConstructor<SchemaContext, SchemaEntities, ModelName, ModelSchema, ModelFields, ModelQueries, ModelIncludes>,
  ): Model<SchemaContext, SchemaEntities, ModelName, ModelSchema, ModelFields, ModelQueries, ModelIncludes> {
    const model = new Model(modelName, options);

    this.models[modelName as string] = model as unknown as Model<SchemaContext, SchemaEntities, any, any, any, any, any>;

    return model;
  }

  mutation<
    Input extends z.ZodObject<z.ZodRawShape>,
    const Changed extends Partial<Record<string, Partial<Record<'inserts' | 'updates' | 'upserts' | 'deletes', true>>>> = {},
  >(
    mutationName: string,
    options: MutationOptions<SchemaContext, SchemaEntities, Input, Changed>,
  ): Mutation<SchemaContext, SchemaEntities, Input, Changed> {
    const mutation = new Mutation(mutationName, options);

    this.mutations[mutationName] = mutation as unknown as Mutation<SchemaContext, SchemaEntities, any, any>;

    return mutation;
  }

  subscription<Args extends z.ZodObject<z.ZodRawShape>, const SubscribeTo extends SubscribeToMap<SchemaEntities>>(
    subscriptionName: string,
    options: SubscriptionOptions<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>,
  ): Subscription<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo> {
    const subscription = new Subscription<SchemaContext, SchemaEntities, SchemaConnection, Args, SubscribeTo>(subscriptionName, options);

    this.subscriptions[subscriptionName] = subscription as unknown as Subscription<
      SchemaContext,
      SchemaEntities,
      SchemaConnection,
      any,
      any
    >;

    return subscription;
  }
}
