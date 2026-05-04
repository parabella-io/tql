import { z } from 'zod';

import { mutationResolver } from '../test-schema/resolvers.js';
import { schema } from '../test-schema/schema.js';

const typeCheck = async () => {
  const { results: result } = await mutationResolver.handle({
    context: {} as any,
    mutation: {
      createProfileNoChanges: {
        input: {
          name: 'x',
          hobbies: [{ level: 1, name: 'x' }],
          address: { street: 'x', city: 'x', state: 'x', zip: 'x' },
        },
      },
      createPost: {
        input: {
          id: '1',
          title: 'x',
          content: 'x',
          profileId: '1',
        },
      },
    },
  });

  const _postId: string = result.createPost.data.post.id;
  const _createProfileNoChanges = result.createProfileNoChanges.data;
  const _createPostError = result.createPost.error;

  // @ts-expect-error - profile is not part of createPost output
  const _profile = result.createPost.data.profile;
};

schema.mutation('typeCheckResolveInput', {
  input: z.object({
    value: z.string(),
  }),
  output: z.object({
    value: z.string(),
  }),
  allow: () => true,
  resolve: async (options) => {
    const _inputValue: string = options.input.value;
    // @ts-expect-error - input should stay typed inside resolve
    const _badInput = options.input.missing;

    return {
      value: options.input.value,
    };
  },
});

schema.mutation('typeCheckOutputShape', {
  input: z.object({
    value: z.string(),
  }),
  output: z.object({
    value: z.string(),
  }),
  allow: () => true,
  // @ts-expect-error - resolve must match output schema
  resolve: async () => {
    return {
      missing: 'value',
    };
  },
});
