import { z } from 'zod';

import { Schema } from '../../src/schema.js';
import type { SchemaEntity } from '../../src/schema-entity.js';

type SecurityProfile = SchemaEntity<{ name: string }>;
type SecurityPost = SchemaEntity<{ title: string; profileId: string }>;

type SecurityPlanSchemaEntities = {
  profile: SecurityProfile;
  post: SecurityPost;
};

type SecurityPlanSchemaContext = {
  profiles: SecurityProfile[];
  posts: SecurityPost[];
};

export const createSecurityPlanSchema = () => {
  const schema = new Schema<SecurityPlanSchemaContext, SecurityPlanSchemaEntities>();

  schema.model('profile', {
    schema: z.object({
      id: z.string(),
      name: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      name: field(),
    }),
    queries: ({ queryMany }) => ({
      profiles: queryMany({
        query: z.object({
          cursor: z.object({ id: z.string() }).nullable(),
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, query }) => context.profiles.slice(0, query.limit),
      }),
    }),
    includes: ({ includeMany }) => ({
      posts: includeMany('post', {
        matchKey: 'profileId',
        query: z.object({
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, parents, query }) =>
          parents.flatMap((parent: SecurityProfile) => context.posts.filter((post) => post.profileId === parent.id).slice(0, query.limit)),
      }),
    }),
  });

  schema.model('post', {
    schema: z.object({
      id: z.string(),
      title: z.string(),
      profileId: z.string(),
    }),
    fields: ({ field }) => ({
      id: field(),
      title: field(),
      profileId: field(),
    }),
    queries: ({ queryMany }) => ({
      posts: queryMany({
        query: z.object({
          title: z.string().nullable(),
        }),
        withPaging: {
          maxTakeSize: 10,
        },
        resolve: async ({ context }) => ({
          entities: context.posts,
          pagingInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: context.posts[0]?.id ?? null,
            endCursor: context.posts[context.posts.length - 1]?.id ?? null,
          },
        }),
      }),
    }),
    includes: ({ includeSingle }) => ({
      profile: includeSingle('profile', {
        matchKey: 'profileId',
        query: z.object({
          comment: z.string().nullable(),
        }),
        resolve: async ({ context, parents }) =>
          parents.flatMap((parent: SecurityPost) => {
            const profile = context.profiles.find((item) => item.id === parent.profileId);
            return profile ? [{ profileId: parent.profileId, ...profile }] : [];
          }),
      }),
    }),
  });

  return schema;
};

export const securityPlanSchema = createSecurityPlanSchema();
