import { Mutation } from './mutation.js';
import { Schema } from '../schema.js';
import { FormattedTQLServerError, TQLServerError, TQLServerErrorType } from '../errors.js';
import type { ClientSchema } from '../client-schema.js';

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
 * A single pending mutation effect returned alongside a batch of results. The
 * resolver never invokes these itself - it is the server's responsibility to
 * decide *when* and *how* they run (e.g. after the HTTP response is flushed,
 * via the configured {@link EffectQueue}).
 */
export type PendingMutationEffect = {
  mutationName: string;
  run(): Promise<void>;
};

/**
 * Return shape for {@link MutationResolver.handle}. Pending effects are
 * surfaced as data so a caller (typically the `Server`) can enqueue them
 * against its own queue once the transport layer signals "response sent".
 */
export type MutationHandleResult<S extends ClientSchema, Q extends Partial<S['MutationInputMap']>> = {
  results: ApplyMutationResponseMap<S['MutationResponseMap'], Q>;
  effects: PendingMutationEffect[];
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
    MutationOutput: S['MutationOutputMap'];
    SchemaEntities: S['SchemaEntities'];
  };

  private readonly mutations: Record<string, Mutation<any, any, any>> = {};

  constructor(options: MutationResolverOptions) {
    for (const mutationName of Object.keys(options.schema.mutations)) {
      this.mutations[mutationName] = options.schema.mutations[mutationName] as Mutation<any, any, any>;
    }
  }

  public getMutations(): Record<string, Mutation<any, any, any>> {
    return this.mutations;
  }

  public async handle<const Q extends Partial<S['MutationInputMap']>>(options: {
    context: any;
    mutation: Q;
  }): Promise<MutationHandleResult<S, Q>> {
    const { context, mutation: mutationInput } = options;

    const results = {} as Record<
      string,
      {
        data: unknown;
        error: FormattedTQLServerError | null;
      }
    >;

    const effects: PendingMutationEffect[] = [];

    if (Object.keys(mutationInput as Record<string, unknown>).length === 0) {
      return { results: results as any, effects };
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

        const outputSchema = mutation.getOutputSchema();
        const parsedResult = outputSchema.safeParse(result);

        if (parsedResult.error) {
          throw new TQLServerError(TQLServerErrorType.MutationResponseMalformedError, { mutationName, result });
        }

        results[mutationName] = {
          data: parsedResult.data,
          error: null,
        };

        this.collectEffect(effects, mutation, mutationName, context, input.data, parsedResult.data);
      } catch (error: unknown) {
        if (error instanceof TQLServerError) {
          results[mutationName] = {
            data: null,
            error: error.getFormattedError(),
          };
        } else {
          results[mutationName] = {
            data: null,
            error: new TQLServerError(TQLServerErrorType.MutationError, { mutationName, error }).getFormattedError(),
          };
        }
      }
    }

    return { results: results as any, effects };
  }

  private collectEffect(
    sink: PendingMutationEffect[],
    mutation: Mutation<any, any, any>,
    mutationName: string,
    context: unknown,
    input: unknown,
    output: unknown,
  ): void {
    const resolveEffects = mutation.getResolveEffects();

    if (!resolveEffects) {
      return;
    }

    sink.push({
      mutationName,
      run: async () => {
        await resolveEffects({ context, input, output } as any);
      },
    });
  }
}
