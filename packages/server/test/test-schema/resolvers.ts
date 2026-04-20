import './models.js';
import './mutations.js';

import { MutationResolver } from '../../src/mutation/mutation-resolver.js';

import { QueryResolver } from '../../src/query/query-resolver.js';

import type { ClientSchema } from './generated/schema.js';

import { schema } from './schema.js';

export type { ClientSchema } from './generated/schema.js';

/**
 * Backwards-compatible alias kept for any tests that still spell out the
 * individual maps. The canonical generic is now {@link ClientSchema}.
 */
export type TestSchemaTypes = ClientSchema;

export const queryResolver = new QueryResolver<ClientSchema>({
  schema,
});

export const mutationResolver = new MutationResolver<ClientSchema>({
  schema,
});
