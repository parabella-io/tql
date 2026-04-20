import type { ClientSchema, HandleQueryResponseFor } from '@tql/server/shared';
import type { ClientSchema as TestSchema } from '@tql/server/test-schema';

type S = TestSchema;

type ProfileByIdQueryInput = {
  query: { id: string };
  select: true;
};

type Q = { profileById: ProfileByIdQueryInput };

type Apply = HandleQueryResponseFor<S['QueryRegistry'], S['QueryInputMap'], Q>;
export type ApplyKeys = keyof Apply;

type ApplyData = Apply['profileById']['data'];
export type IsNull = [ApplyData] extends [null] ? 'all-null' : 'has-data';

const k: ApplyKeys = 'profileById';
const i: IsNull = 'has-data';

void k;
void i;

export type _S = ClientSchema;
