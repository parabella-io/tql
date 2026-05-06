import { Mutation } from './mutation.js';
import { Schema } from '../schema.js';
import { FormattedTQLServerError, TQLServerError, TQLServerErrorType } from '../errors.js';
import type { ClientSchema } from '../client-schema.js';
import { runWithTimeout } from '../run-with-timeout.js';

export type MutationResolverOptions = {
  schema: Schema<any, any>;
};

export type MutationExecutionOptions = {
  signal?: AbortSignal;
  resolverTimeouts?: Map<string, number>;
  wrapMutation?: <T>(mutationName: string, final: () => Promise<T>) => Promise<T>;
};

/**
 * Project the full {@link MutationResponseMap} down to just the keys present in
 * a given mutation input `Q`. This is the per-call return type for `handle`.
 */
export type ApplyMutationResponseMap<MutationResponseMap, Q> = {
  [K in keyof Q & keyof MutationResponseMap]: MutationResponseMap[K];
};

export type MutationHandleResult<S extends ClientSchema, Q extends Partial<S['MutationInputMap']>> = {
  results: ApplyMutationResponseMap<S['MutationResponseMap'], Q>;
  inputs: Record<string, unknown>;
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
    execution?: MutationExecutionOptions;
  }): Promise<MutationHandleResult<S, Q>> {
    const { context, mutation: mutationInput, execution } = options;

    const results = {} as Record<
      string,
      {
        data: unknown;
        error: FormattedTQLServerError | null;
      }
    >;

    const inputs: Record<string, unknown> = {};

    if (Object.keys(mutationInput as Record<string, unknown>).length === 0) {
      return { results: results as any, inputs };
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
          input: input.data,
        });

        if (!isAllowed) {
          throw new TQLServerError(TQLServerErrorType.MutationNotAllowedError, { mutationName });
        }

        const resolver = mutation.getResolve();

        const result = await runMutationResolver({
          mutationName,
          execution,
          task: (signal) =>
            resolver({
              context,
              input: input.data,
              signal,
            }),
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

        inputs[mutationName] = input.data;
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

    return { results: results as any, inputs };
  }
}

const runMutationResolver = async <T>(options: {
  mutationName: string;
  execution?: MutationExecutionOptions;
  task: (signal: AbortSignal | undefined) => Promise<T> | T;
}): Promise<T> => {
  const timeoutMs = options.execution?.resolverTimeouts?.get(options.mutationName);

  const runTask = (signal: AbortSignal | undefined) => {
    const final = () => Promise.resolve(options.task(signal));
    return options.execution?.wrapMutation?.(options.mutationName, final) ?? final();
  };

  return runWithTimeout({
    signal: options.execution?.signal,
    timeoutMs,
    runTask: (signal) => runTask(signal),
    makeTimeoutError: (ms) =>
      new TQLServerError(TQLServerErrorType.SecurityTimeoutError, { mutationName: options.mutationName, timeoutMs: ms }),
    makeAbortError: () =>
      new TQLServerError(TQLServerErrorType.SecurityTimeoutError, { mutationName: options.mutationName, reason: 'aborted' }),
  });
};
