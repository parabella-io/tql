import { z } from 'zod';
import { Field } from './query/field.js';
import { Model, ModelConstructor, IncludesMap, type ModelExternalFieldsMap } from './query/model.js';
import { ExtractEntityShape } from './extract-entity-shape.js';
import { Mutation, MutationOptions } from './mutation/mutation.js';
import { SchemaEntity } from './schema-entity.js';

export class Schema<SchemaContext extends Record<string, any>, SchemaEntities extends Record<string, SchemaEntity<Record<string, any>>>> {
  /**
   * Models registered via {@link Schema.model}. Populated lazily as each model
   * is constructed so codegen can introspect the full schema without needing a
   * live resolver.
   */
  public readonly models: Record<string, Model<SchemaContext, SchemaEntities, any, any, any, any, any, any>> = {};

  /**
   * Mutations registered via {@link Schema.mutation}. Each mutation is named
   * at registration so codegen and the {@link MutationResolver} can both look
   * them up by name without a separate resolver factory.
   */
  public readonly mutations: Record<string, Mutation<SchemaContext, SchemaEntities, any, any>> = {};

  model<
    ModelName extends keyof SchemaEntities,
    ModelSchema extends z.ZodObject<{
      [P in keyof ExtractEntityShape<SchemaEntities, ModelName>]: z.ZodType<ExtractEntityShape<SchemaEntities, ModelName>[P]>;
    }>,
    ModelFields extends Record<string, Field<SchemaContext, SchemaEntities, ModelName>>,
    ModelQueries extends Record<string, any>,
    ModelIncludes extends IncludesMap<SchemaContext, SchemaEntities, ModelName> = {},
    ModelExternalFields extends ModelExternalFieldsMap<SchemaContext, SchemaEntities, ModelName> = Record<string, never>,
  >(
    modelName: ModelName,
    options: ModelConstructor<SchemaContext, SchemaEntities, ModelName, ModelSchema, ModelFields, ModelQueries, ModelIncludes, ModelExternalFields>,
  ): Model<SchemaContext, SchemaEntities, ModelName, ModelSchema, ModelFields, ModelQueries, ModelIncludes, ModelExternalFields> {
    const model = new Model(modelName, options);

    this.models[modelName as string] = model as unknown as Model<SchemaContext, SchemaEntities, any, any, any, any, any, any>;

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
}
