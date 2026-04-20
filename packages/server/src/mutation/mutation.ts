import { z } from 'zod';

// Utility type to ensure { id: string } is present and rest are partial
type WithId<T> = { id: string } & Omit<T, 'id'>;

type MutationChangeOperation = 'inserts' | 'updates' | 'upserts' | 'deletes';

type MutationChangeDeclaration = Partial<Record<MutationChangeOperation, true>>;

export type MutationChangedMap<SchemaEntities extends Record<string, any>> = Partial<
  Record<keyof SchemaEntities & string, MutationChangeDeclaration>
>;

type MutationChangedInput = Partial<Record<string, MutationChangeDeclaration>>;

type ExactChangeOperationKeys<Change extends Record<string, any>> =
  Exclude<keyof Change, MutationChangeOperation> extends never ? Change : never;

type ExactChangedKeys<SchemaEntities extends Record<string, any>, Changed extends Record<string, any>> =
  Exclude<keyof Changed, keyof SchemaEntities & string> extends never
    ? {
        [K in keyof Changed]: Changed[K] extends Record<string, any> ? ExactChangeOperationKeys<Changed[K]> : never;
      }
    : never;

export type NormalizeMutationChangedMap<SchemaEntities extends Record<string, any>, Changed extends MutationChangedInput> = {
  [K in Extract<keyof Changed, keyof SchemaEntities & string>]: Changed[K] extends MutationChangeDeclaration
    ? {
        [O in Extract<keyof Changed[K], MutationChangeOperation>]: true;
      }
    : never;
};

type MutationChangeResult<Entity, Change> = (Change extends { inserts: true } ? { inserts?: WithId<Entity>[] } : {}) &
  (Change extends { updates: true } ? { updates?: WithId<Entity>[] } : {}) &
  (Change extends { upserts: true } ? { upserts?: WithId<Entity>[] } : {}) &
  (Change extends { deletes: true } ? { deletes?: WithId<Entity>[] } : {});

export type MutationResolveResult<SchemaEntities extends Record<string, any>, Changed extends MutationChangedInput> = {
  [K in Extract<keyof Changed, keyof SchemaEntities & string>]: MutationChangeResult<SchemaEntities[K], Changed[K]>;
};

type StrictMutationResolveResult<SchemaEntities extends Record<string, any>, Changed extends MutationChangedInput> = MutationResolveResult<
  SchemaEntities,
  Changed
> & {
  [K in Exclude<keyof SchemaEntities & string, Extract<keyof Changed, keyof SchemaEntities & string>>]?: never;
};

export type MutationOptions<
  SchemaContext,
  SchemaEntities extends Record<string, any>,
  Input extends z.ZodObject<z.ZodRawShape>,
  Changed extends MutationChangedInput = {},
> = {
  input: Input;
  allow: (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean;
  changed?: MutationChangedMap<SchemaEntities> & ExactChangedKeys<SchemaEntities, Changed>;
  resolve: (options: {
    input: z.infer<Input>;
    context: SchemaContext;
  }) => Promise<StrictMutationResolveResult<SchemaEntities, NormalizeMutationChangedMap<SchemaEntities, NoInfer<Changed>>> | void>;
  resolveEffects?: (options: {
    input: z.infer<Input>;
    context: SchemaContext;
    changes: MutationResolveResult<SchemaEntities, NormalizeMutationChangedMap<SchemaEntities, NoInfer<Changed>>>;
  }) => Promise<void> | void;
};

export class Mutation<
  SchemaContext,
  SchemaEntities extends Record<string, any>,
  Input extends z.ZodObject<z.ZodRawShape>,
  Changed extends MutationChangedInput = {},
> {
  declare Changes: MutationResolveResult<SchemaEntities, NormalizeMutationChangedMap<SchemaEntities, Changed>>;

  private readonly mutationName: string;

  private readonly input: Input;

  private readonly changed?: Changed;

  private readonly allow: (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean;

  private readonly resolve: MutationOptions<SchemaContext, SchemaEntities, Input, Changed>['resolve'];

  private readonly resolveEffects?: MutationOptions<SchemaContext, SchemaEntities, Input, Changed>['resolveEffects'];

  constructor(mutationName: string, options: MutationOptions<SchemaContext, SchemaEntities, Input, Changed>) {
    this.mutationName = mutationName;
    this.input = options.input;
    this.changed = options.changed;
    this.allow = options.allow;
    this.resolve = options.resolve;
    this.resolveEffects = options.resolveEffects;
  }

  getMutationName(): string {
    return this.mutationName;
  }

  getChanged(): Changed | undefined {
    return this.changed;
  }

  getInputSchema(): z.ZodObject<z.ZodRawShape> {
    return this.input;
  }

  getAllow(): (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean {
    return this.allow;
  }

  getResolve(): (options: {
    input: z.infer<Input>;
    context: SchemaContext;
  }) => Promise<StrictMutationResolveResult<SchemaEntities, NormalizeMutationChangedMap<SchemaEntities, Changed>> | void> {
    return this.resolve;
  }

  getResolveEffects():
    | ((options: {
        input: z.infer<Input>;
        context: SchemaContext;
        changes: MutationResolveResult<SchemaEntities, NormalizeMutationChangedMap<SchemaEntities, Changed>>;
      }) => Promise<void> | void)
    | undefined {
    return this.resolveEffects;
  }
}
