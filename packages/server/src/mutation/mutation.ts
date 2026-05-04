import { z } from 'zod';

export type MutationOptions<SchemaContext, Input extends z.ZodObject<z.ZodRawShape>, Output extends z.ZodTypeAny> = {
  input: Input;
  output: Output;
  allow: (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean;
  resolve: (options: {
    input: z.infer<Input>;
    context: SchemaContext;
  }) => Promise<z.infer<Output>> | z.infer<Output>;
  resolveEffects?: (options: {
    input: z.infer<Input>;
    context: SchemaContext;
    output: z.infer<Output>;
  }) => Promise<void> | void;
};

export class Mutation<SchemaContext, Input extends z.ZodObject<z.ZodRawShape>, Output extends z.ZodTypeAny> {
  declare Output: z.infer<Output>;

  private readonly mutationName: string;

  private readonly input: Input;

  private readonly output: Output;

  private readonly allow: (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean;

  private readonly resolve: MutationOptions<SchemaContext, Input, Output>['resolve'];

  private readonly resolveEffects?: MutationOptions<SchemaContext, Input, Output>['resolveEffects'];

  constructor(mutationName: string, options: MutationOptions<SchemaContext, Input, Output>) {
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

  getAllow(): (options: { context: SchemaContext; input: z.infer<Input> }) => Promise<boolean> | boolean {
    return this.allow;
  }

  getResolve(): (options: {
    input: z.infer<Input>;
    context: SchemaContext;
  }) => Promise<z.infer<Output>> | z.infer<Output> {
    return this.resolve;
  }

  getResolveEffects():
    | ((options: {
        input: z.infer<Input>;
        context: SchemaContext;
        output: z.infer<Output>;
      }) => Promise<void> | void)
    | undefined {
    return this.resolveEffects;
  }
}
