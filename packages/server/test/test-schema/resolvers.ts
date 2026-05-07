import './models.js';
import './mutations.js';

import { MutationResolver } from '../../src/mutation/mutation-resolver.js';
import { QueryResolver } from '../../src/query/query-resolver.js';
import { schema } from './schema.js';
import { ClientSchema } from './index.js';

export const queryResolver = new QueryResolver<ClientSchema>({
  schema,
});

export const mutationResolver = new MutationResolver<ClientSchema>({
  schema,
});
