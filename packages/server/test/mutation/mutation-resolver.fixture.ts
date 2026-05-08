import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import { createMutationResolver } from '../harness/resolvers.js';
import type { SchemaEntities } from '../harness/schema-entities.js';
import type { PrismaClient } from '../prisma/database.js';
import { generateSchema } from '../../src/codegen/generate-schema.js';
import { ClientSchema } from './mutation-resolver.schema.js';

export type { Comment, Post, Profile } from '../harness/schema-entities.js';

export type MutationResolverSchemaContext = {
  userId: string;
  isAuthenticated: boolean;
  database: PrismaClient;
  shouldAllow?: boolean;
};

export const registerMutationResolverMutations = (schema: Schema<MutationResolverSchemaContext, SchemaEntities>) => {
  const profileOutput = z.object({
    id: z.string(),
    name: z.string(),
    hobbies: z.array(
      z.object({
        level: z.number(),
        name: z.string(),
      }),
    ),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
  });

  const postOutput = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    profileId: z.string(),
  });

  const commentOutput = z.object({
    id: z.string(),
    comment: z.string(),
    postId: z.string(),
    profileId: z.string(),
  });

  const createProfile = schema.mutation('createProfile', {
    input: z.object({
      name: z.string(),
      hobbies: z.array(
        z.object({
          level: z.number(),
          name: z.string(),
        }),
      ),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    }),
    output: z.object({
      profile: profileOutput,
    }),
    allow: ({ context }) => {
      return context.isAuthenticated;
    },
    resolve: async ({ input, context }) => {
      const id = context.userId;

      await context.database.profile.create({
        data: {
          id,
          name: input.name,
          hobbies: JSON.stringify(input.hobbies),
          address: JSON.stringify(input.address),
        },
      });

      return {
        profile: {
          id,
          name: input.name,
          hobbies: input.hobbies,
          address: input.address,
        },
      };
    },
  });

  const createProfileNoChanges = schema.mutation('createProfileNoChanges', {
    input: z.object({
      name: z.string(),
      hobbies: z.array(
        z.object({
          level: z.number(),
          name: z.string(),
        }),
      ),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    }),
    output: z.object({}),
    allow: ({ context }) => {
      return context.isAuthenticated;
    },
    resolve: async ({ input, context }) => {
      const id = context.userId;

      await context.database.profile.create({
        data: {
          id,
          name: input.name,
          hobbies: JSON.stringify(input.hobbies),
          address: JSON.stringify(input.address),
        },
      });

      return {};
    },
  });

  const createProfileUnauthorized = schema.mutation('createProfileUnauthorized', {
    input: z.object({
      name: z.string(),
      hobbies: z.array(
        z.object({
          level: z.number(),
          name: z.string(),
        }),
      ),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    }),
    output: z.object({
      profile: profileOutput,
    }),
    allow: ({}) => {
      return false;
    },
    resolve: async ({ input, context }) => {
      const id = context.userId;

      await context.database.profile.create({
        data: {
          id,
          name: input.name,
          hobbies: JSON.stringify(input.hobbies),
          address: JSON.stringify(input.address),
        },
      });

      return {
        profile: {
          id,
          name: input.name,
          hobbies: input.hobbies,
          address: input.address,
        },
      };
    },
  });

  const createProfileMalformedResponse = schema.mutation('createProfileMalformedResponse', {
    input: z.object({
      name: z.string(),
      hobbies: z.array(
        z.object({
          level: z.number(),
          name: z.string(),
        }),
      ),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      }),
    }),
    output: z.object({
      profile: profileOutput,
    }),
    allow: ({}) => {
      return true;
    },
    resolve: async ({ input, context }) => {
      const id = context.userId;

      await context.database.profile.create({
        data: {
          id,
          name: input.name,
          hobbies: JSON.stringify(input.hobbies),
          address: JSON.stringify(input.address),
        },
      });

      return {
        profile: {
          inserts: {},
        },
      } as any;
    },
  });

  const createPost = schema.mutation('createPost', {
    input: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      profileId: z.string(),
    }),
    output: z.object({
      post: postOutput,
    }),
    allow: ({ context }) => {
      return context.isAuthenticated;
    },
    resolve: async ({ input, context }) => {
      await context.database.post.create({
        data: {
          id: input.id,
          title: input.title,
          content: input.content,
          profileId: input.profileId,
        },
      });

      return {
        post: {
          id: input.id,
          content: input.content,
          title: input.title,
          profileId: input.profileId,
        },
      };
    },
  });

  const createComment = schema.mutation('createComment', {
    input: z.object({
      id: z.string(),
      comment: z.string(),
      postId: z.string(),
      profileId: z.string(),
    }),
    output: z.object({
      comment: commentOutput,
    }),
    allow: ({}) => {
      return true;
    },
    resolve: async ({ input, context }) => {
      await context.database.comment.create({
        data: {
          id: input.id,
          comment: input.comment,
          postId: input.postId,
          profileId: input.profileId,
        },
      });

      return {
        comment: {
          id: input.id,
          comment: input.comment,
          postId: input.postId,
          profileId: input.profileId,
        },
      };
    },
  });

  return {
    createProfile,
    createProfileNoChanges,
    createProfileUnauthorized,
    createProfileMalformedResponse,
    createPost,
    createComment,
  };
};

export const createMutationResolverSchema = () => {
  const schema = new Schema<MutationResolverSchemaContext, SchemaEntities>();
  generateSchema({ schema, outputPath: 'test/mutation/mutation-resolver.schema.d.ts' });
  registerMutationResolverMutations(schema);
  return schema;
};

export const mutationResolverSchema = createMutationResolverSchema();

export const mutationResolver = createMutationResolver<ClientSchema>(mutationResolverSchema);
