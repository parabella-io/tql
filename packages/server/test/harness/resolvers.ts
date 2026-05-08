import { MutationResolver } from '../../src/mutation/mutation-resolver.js';
import { QueryResolver } from '../../src/query/query-resolver.js';
import type { ClientSchema } from '../../src/shared/client-schema.js';
import type { Schema } from '../../src/schema.js';

export type TestClientSchema = {
  QueryInputMap: Record<string, any>;
  QueryResponseMap: Record<string, any>;
  QueryRegistry: Record<string, any>;
  MutationInputMap: Record<string, any>;
  MutationOutputMap: Record<string, any>;
  MutationResponseMap: Record<string, any>;
  SchemaEntities: Record<string, any>;
};

export const createQueryResolver = <S extends ClientSchema = TestClientSchema>(schema: Schema<any, any>): QueryResolver<S> => {
  return new QueryResolver<S>({ schema });
};

export const createMutationResolver = <S extends ClientSchema = TestClientSchema>(schema: Schema<any, any>): MutationResolver<S> => {
  return new MutationResolver<S>({ schema });
};
