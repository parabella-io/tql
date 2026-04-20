import { mutationResolver } from '../test-schema/resolvers.js';
import { schema } from '../test-schema/schema.js';
import { z } from 'zod';

const typeCheck = async () => {
  const result = await mutationResolver.handle({
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

  const _postInsertId: string | undefined = result.createPost.changes.post.inserts?.[0]?.id;

  const _createProfileNoChanges = result.createProfileNoChanges.changes;
  const _createPostError = result.createPost.error;

  // @ts-expect-error - profile was not marked changed for createPost
  const _profile = result.createPost.changes.profile;
};

schema.mutation('typeCheckUnknownChangedKey', {
  input: z.object({
    value: z.string(),
  }),
  // @ts-expect-error - changed keys must be schema entity names
  changed: {
    unknownModel: {
      inserts: true,
    },
  },
  allow: () => true,
  resolve: async () => {
    return undefined;
  },
});

schema.mutation('typeCheckChangedKeysAfterValid', {
  input: z.object({
    value: z.string(),
  }),
  // @ts-expect-error - changed keys must remain checked after a valid key
  changed: {
    profile: {
      inserts: true,
    },
    unknownModel: {
      inserts: true,
    },
  },
  allow: () => true,
  resolve: async () => {
    return {
      profile: {
        inserts: [],
      },
    };
  },
});

schema.mutation('typeCheckResolveInput', {
  input: z.object({
    value: z.string(),
  }),
  changed: {
    profile: {
      inserts: true,
    },
  },
  allow: () => true,
  resolve: async (options) => {
    const _inputValue: string = options.input.value;
    // @ts-expect-error - input should stay typed inside resolve
    const _badInput = options.input.missing;

    return {
      profile: {
        inserts: [
          {
            id: '1',
            name: 'ok',
            hobbies: [],
            address: { street: 'x', city: 'x', state: 'x', zip: 'x' },
          },
        ],
      },
    };
  },
});

schema.mutation('typeCheckUndeclaredCommentChange1', {
  input: z.object({
    value: z.string(),
  }),
  changed: {
    profile: {
      inserts: true,
    },
  },
  allow: () => true,
  // @ts-expect-error - comment was not declared changed
  resolve: async () => {
    return {
      comment: {
        inserts: [
          {
            id: '1',
            comment: 'x',
            postId: '1',
            profileId: '1',
          },
        ],
      },
    };
  },
});

schema.mutation('typeCheckUndeclaredCommentChange2', {
  input: z.object({
    value: z.string(),
  }),
  changed: {
    profile: {
      inserts: true,
    },
  },
  allow: () => true,
  // @ts-expect-error - comment was not declared changed
  resolve: async () => {
    return {
      comment: {
        inserts: [
          {
            id: '1',
            comment: 'x',
            postId: '1',
            profileId: '1',
          },
        ],
      },
    };
  },
});
