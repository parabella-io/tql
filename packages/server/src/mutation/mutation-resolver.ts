import { Mutation } from './mutation.js';
import { Schema } from '../schema.js';
import { FormattedTQLServerError, TQLServerError, TQLServerErrorType } from '../errors.js';
import type { ClientSchema } from '../client-schema.js';
import { z } from 'zod';

export type MutationResolverOptions = {
  schema: Schema<any, any>;
};

/**
 * Project the full {@link MutationResponseMap} down to just the keys present in
 * a given mutation input `Q`. This is the per-call return type for `handle`.
 */
export type ApplyMutationResponseMap<MutationResponseMap, Q> = {
  [K in keyof Q & keyof MutationResponseMap]: MutationResponseMap[K];
};

/**
 * MutationResolver is constructed against a {@link Schema} plus the codegen-emitted
 * {@link ClientSchema} aggregate (which carries `MutationInputMap`,
 * `MutationResponseMap` and `SchemaEntities`). Runtime behaviour is unchanged —
 * every mutation registered on the schema becomes addressable by its name — but
 * the return type of `handle` is narrowed to only the mutations the caller
 * actually requested.
 */
export class MutationResolver<S extends ClientSchema> {
  /**
   * Phantom type bag. Grouped under a single property so hovering the
   * resolver instance only resolves one member instead of expanding four
   * giant mapped types per inspection.
   *
   * Use `typeof mutationResolver.$types.MutationInput` etc. to recover the shapes.
   */
  declare $types: {
    MutationInput: Partial<S['MutationInputMap']>;
    MutationResponse: S['MutationResponseMap'];
    MutationChanges: S['MutationResponseMap'] extends Record<string, { changes: infer C }> ? C : never;
    SchemaEntities: S['SchemaEntities'];
  };

  private readonly mutations: Record<string, Mutation<any, any, any, any>> = {};

  constructor(options: MutationResolverOptions) {
    for (const mutationName of Object.keys(options.schema.mutations)) {
      this.mutations[mutationName] = options.schema.mutations[mutationName] as Mutation<any, any, any, any>;
    }
  }

  public getMutations(): Record<string, Mutation<any, any, any, any>> {
    return this.mutations;
  }

  public async handle<const Q extends Partial<S['MutationInputMap']>>(options: {
    context: any;
    mutation: Q;
  }): Promise<ApplyMutationResponseMap<S['MutationResponseMap'], Q>> {
    const { context, mutation: mutationInput } = options;

    const results = {} as Record<
      string,
      {
        changes: Record<string, { inserts?: any[]; updates?: any[]; upserts?: any[]; deletes?: any[] }>;
        error: FormattedTQLServerError | null;
      }
    >;

    if (Object.keys(mutationInput as Record<string, unknown>).length === 0) {
      return results as any;
    }

    for (const mutationName of Object.keys(mutationInput as Record<string, unknown>)) {
      try {
        const mutation = this.mutations[mutationName];

        if (!mutation) {
          throw new TQLServerError(TQLServerErrorType.MutationNotFoundError, { mutationName });
        }

        const allowMethod = mutation.getAllow();

        const inputSchema = mutation.getInputSchema();

        const input = inputSchema.safeParse((mutationInput as any)[mutationName]?.input);

        if (input.error) {
          throw new TQLServerError(TQLServerErrorType.MutationInputSchemaError, {
            mutationName,
            input: (mutationInput as any)[mutationName]?.input,
            message: input.error.message,
          });
        }

        const isAllowed = await allowMethod({
          context,
          input: (mutationInput as any)[mutationName]?.input,
        });

        if (!isAllowed) {
          throw new TQLServerError(TQLServerErrorType.MutationNotAllowedError, { mutationName });
        }

        const resolver = mutation.getResolve();

        const result = await resolver({
          context,
          input: (mutationInput as any)[mutationName]?.input,
        });

        const parsedResult = MutationResponseSchema.safeParse(result);

        if (parsedResult.error) {
          throw new TQLServerError(TQLServerErrorType.MutationResponseMalformedError, { mutationName, result });
        }

        const changed = mutation.getChanged() as
          | Partial<Record<string, Partial<Record<'inserts' | 'updates' | 'upserts' | 'deletes', boolean>>>>
          | undefined;

        if (!changed || Object.keys(changed).length === 0) {
          results[mutationName] = {
            changes: {},
            error: null,
          };
          continue;
        }

        const payload = (parsedResult.data ?? {}) as Record<
          string,
          { inserts?: any[]; updates?: any[]; upserts?: any[]; deletes?: any[] }
        >;
        const changes: Record<string, { inserts?: any[]; updates?: any[]; upserts?: any[]; deletes?: any[] }> = {};

        for (const modelName of Object.keys(changed)) {
          const declaredChanges = changed[modelName];

          if (!declaredChanges) continue;

          const change = payload[modelName] ?? {};

          changes[modelName] = {};

          if (declaredChanges.inserts) {
            changes[modelName].inserts = [...((change as any).inserts ?? [])];
          }

          if (declaredChanges.updates) {
            changes[modelName].updates = [...((change as any).updates ?? [])];
          }

          if (declaredChanges.upserts) {
            changes[modelName].upserts = [...((change as any).upserts ?? [])];
          }

          if (declaredChanges.deletes) {
            changes[modelName].deletes = [...((change as any).deletes ?? [])];
          }
        }

        results[mutationName] = {
          changes,
          error: null,
        };
      } catch (error: unknown) {
        if (error instanceof TQLServerError) {
          results[mutationName] = {
            changes: {},
            error: error.getFormattedError(),
          };
        } else {
          results[mutationName] = {
            changes: {},
            error: new TQLServerError(TQLServerErrorType.MutationError, { mutationName, error }).getFormattedError(),
          };
        }
      }
    }

    return results as any;
  }
}

const MutationResponseSchema = z
  .record(
    z.string(),

    z.object({
      inserts: z
        .array(
          z
            .object({
              id: z.string(),
            })
            .catchall(z.any()),
        )
        .optional(),

      updates: z
        .array(
          z
            .object({
              id: z.string(),
            })
            .catchall(z.any()),
        )
        .optional(),

      upserts: z
        .array(
          z
            .object({
              id: z.string(),
            })
            .catchall(z.any()),
        )
        .optional(),

      deletes: z
        .array(
          z
            .object({
              id: z.string(),
            })
            .catchall(z.any()),
        )
        .optional(),
    }),
  )
  .optional();
