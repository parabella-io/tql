import { z } from 'zod';
import type { MutationOptionsExtensions, SchemaContextExtensions } from '../plugins/extensions.js';

export type MutationOptions<SchemaContext, Input extends z.ZodObject<z.ZodRawShape>, Output extends z.ZodTypeAny> = {
  input: Input;
  output: Output;
  allow: (options: { context: SchemaContext & SchemaContextExtensions; input: z.infer<Input> }) => Promise<boolean> | boolean;
  resolve: (options: {
    input: z.infer<Input>;
    context: SchemaContext & SchemaContextExtensions;
    signal?: AbortSignal;
  }) => Promise<z.infer<Output>> | z.infer<Output>;
  resolveEffects?: (options: {
    input: z.infer<Input>;
    context: SchemaContext & SchemaContextExtensions;
    output: z.infer<Output>;
  }) => Promise<void> | void;
} & MutationOptionsExtensions<z.infer<Input>>;

export class Mutation<SchemaContext, Input extends z.ZodObject<z.ZodRawShape>, Output extends z.ZodTypeAny> {
  declare Output: z.infer<Output>;

  private readonly mutationName: string;

  private readonly input: Input;

  private readonly output: Output;

  private readonly allow: (options: { context: SchemaContext & SchemaContextExtensions; input: z.infer<Input> }) => Promise<boolean> | boolean;

  private readonly resolve: MutationOptions<SchemaContext, Input, Output>['resolve'];

  private readonly resolveEffects?: MutationOptions<SchemaContext, Input, Output>['resolveEffects'];

  private readonly options: MutationOptions<SchemaContext, Input, Output>;

  constructor(mutationName: string, options: MutationOptions<SchemaContext, Input, Output>) {
    this.options = options;
    this.mutationName = mutationName;
    this.input = options.input;
    this.output = options.output;
    this.allow = options.allow;
    this.resolve = options.resolve;
    this.resolveEffects = options.resolveEffects;
  }

  getMutationName(): string {
    return this.mutationName;
  }

  getInputSchema(): z.ZodObject<z.ZodRawShape> {
    return this.input;
  }

  getOutputSchema(): Output {
    return this.output;
  }

  getAllow(): (options: { context: SchemaContext & SchemaContextExtensions; input: z.infer<Input> }) => Promise<boolean> | boolean {
    return this.allow;
  }

  getResolve(): (options: {
    input: z.infer<Input>;
    context: SchemaContext & SchemaContextExtensions;
    signal?: AbortSignal;
  }) => Promise<z.infer<Output>> | z.infer<Output> {
    return this.resolve;
  }

  getExtensions(): MutationOptionsExtensions<z.infer<Input>> {
    return this.options;
  }

  getResolveEffects():
    | ((options: {
        input: z.infer<Input>;
        context: SchemaContext & SchemaContextExtensions;
        output: z.infer<Output>;
      }) => Promise<void> | void)
    | undefined {
    return this.resolveEffects;
  }
}
