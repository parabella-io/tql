import { z } from 'zod';

import { schema } from './schema.js';

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

export const createProfile = schema.mutation('createProfile', {
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

    context.database
      .prepare(`INSERT INTO profiles (id, name, hobbies, address) VALUES (?, ?, ?, ?)`)
      .run(id, input.name, JSON.stringify(input.hobbies), JSON.stringify(input.address));

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

export const createProfileNoChanges = schema.mutation('createProfileNoChanges', {
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

    context.database
      .prepare(`INSERT INTO profiles (id, name, hobbies, address) VALUES (?, ?, ?, ?)`)
      .run(id, input.name, JSON.stringify(input.hobbies), JSON.stringify(input.address));

    return {};
  },
});

export const createProfileUnauthorized = schema.mutation('createProfileUnauthorized', {
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

    context.database
      .prepare(`INSERT INTO profiles (id, name, hobbies, address) VALUES (?, ?, ?, ?)`)
      .run(id, input.name, JSON.stringify(input.hobbies), JSON.stringify(input.address));

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

export const createProfileMalformedResponse = schema.mutation('createProfileMalformedResponse', {
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

    context.database
      .prepare(`INSERT INTO profiles (id, name, hobbies, address) VALUES (?, ?, ?, ?)`)
      .run(id, input.name, JSON.stringify(input.hobbies), JSON.stringify(input.address));

    return {
      profile: {
        inserts: {},
      },
    } as any;
  },
});

export const createPost = schema.mutation('createPost', {
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
    context.database
      .prepare(`INSERT INTO posts (id, title, content, profileId) VALUES (?, ?, ?, ?)`)
      .run(input.id, input.title, input.content, input.profileId);

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

export const createComment = schema.mutation('createComment', {
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
    context.database
      .prepare(`INSERT INTO comments (id, comment, postId, profileId) VALUES (?, ?, ?, ?)`)
      .run(input.id, input.comment, input.postId, input.profileId);

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
