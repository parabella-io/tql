import { z } from 'zod';

import { NotFoundError } from '../../src/errors.js';
import { Schema } from '../../src/schema.js';
import { createQueryResolver } from '../harness/resolvers.js';
import type { Comment, Post, Profile } from '../harness/schema-entities.js';
import type { PrismaClient } from '../prisma/database.js';
import { generateSchema } from '../../src/codegen/generate-schema.js';
import type { SchemaEntities } from '../harness/schema-entities.js';
import { ClientSchema } from './query-resolver.schema.js';

export type QueryResolverSchemaContext = {
  userId: string;
  isAuthenticated: boolean;
  database: PrismaClient;
  shouldAllow?: boolean;
};

export const registerQueryResolverModels = (schema: Schema<QueryResolverSchemaContext, SchemaEntities>) => {
  const profile = schema.model('profile', {
    schema: z.object({
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
    }),

    fields: ({ field }) => ({
      id: field(),
      name: field(),
      hobbies: field(),
      address: field(),
    }),

    allowEach: ({ context }) => {
      return context.shouldAllow ?? true;
    },

    queries: ({ querySingle, queryMany }) => ({
      profileById: querySingle({
        query: z.object({
          id: z.string(),
        }),
        resolve: async ({ context, query }): Promise<Profile> => {
          const row = await context.database.profile.findUniqueOrThrow({ where: { id: query.id } });

          return {
            id: row.id,
            name: row.name,
            hobbies: JSON.parse(row.hobbies),
            address: JSON.parse(row.address),
          };
        },
      }),

      profile: querySingle({
        query: z.object({
          name: z.string().nullable(),
        }),
        allow: async ({ context }) => {
          return context.shouldAllow ?? true;
        },
        resolve: async ({ context, query }) => {
          const row =
            query.name != null
              ? await context.database.profile.findFirst({ where: { name: query.name } })
              : await context.database.profile.findFirst();

          if (!row) {
            throw new NotFoundError();
          }

          return {
            id: row.id,
            name: row.name,
            hobbies: JSON.parse(row.hobbies),
            address: JSON.parse(row.address),
          };
        },
      }),

      profileNullable: querySingle({
        nullable: true,
        resolve: async ({}) => {
          return null;
        },
      }),

      profiles: queryMany({
        query: z.object({
          cursor: z
            .object({
              id: z.string(),
            })
            .nullable(),
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        allow: async ({ context }) => {
          return context.shouldAllow ?? true;
        },
        resolve: async ({ context, query }) => {
          const orderDir = query.order === 'desc' ? 'desc' : 'asc';

          const rows = await context.database.profile.findMany({
            where: query.cursor ? { id: orderDir === 'desc' ? { lt: query.cursor.id } : { gt: query.cursor.id } } : undefined,
            orderBy: { id: orderDir },
            take: query.limit,
          });

          return rows.map((row) => ({
            id: row.id,
            name: row.name,
            hobbies: JSON.parse(row.hobbies),
            address: JSON.parse(row.address),
          }));
        },
      }),
    }),

    includes: ({ includeMany }) => ({
      posts: includeMany('post', {
        matchKey: 'profileId',
        query: z.object({
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, parents, query }) => {
          const profileIds = parents.map((parent: Profile) => parent.id);

          const posts = await context.database.post.findMany({
            where: { profileId: { in: profileIds } },
            orderBy: { id: query.order === 'desc' ? 'desc' : 'asc' },
            take: query.limit,
          });

          return parents.flatMap((parent: Profile) => posts.filter((post) => post.profileId === parent.id).slice(0, query.limit));
        },
      }),

      comments: includeMany('comment', {
        matchKey: 'profileId',
        query: z.object({
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, parents, query }) => {
          const profileIds = parents.map((parent: Profile) => parent.id);

          const comments = await context.database.comment.findMany({
            where: { profileId: { in: profileIds } },
            orderBy: { id: query.order === 'desc' ? 'desc' : 'asc' },
            take: query.limit,
          });

          return parents.flatMap((parent: Profile) => comments.filter((comment) => comment.profileId === parent.id).slice(0, query.limit));
        },
      }),
    }),
  });

  const post = schema.model('post', {
    schema: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      profileId: z.string(),
    }),

    fields: ({ field }) => ({
      id: field(),
      title: field(),
      content: field(),
      profileId: field(),
    }),

    allowEach: ({}) => {
      return true;
    },

    externalFields: ({ externalField }) => ({
      commentsCount: externalField({
        schema: z.number(),
        resolve: async ({ context, entities }) => {
          if (entities.length === 0) {
            return [];
          }

          const postIds = entities.map((e: Post) => e.id);

          const rows = await context.database.comment.groupBy({
            by: ['postId'],
            where: { postId: { in: postIds } },
            _count: { postId: true },
          });

          const byPost = new Map(rows.map((r) => [r.postId, r._count.postId]));

          return entities.map((e: Post) => byPost.get(e.id) ?? 0);
        },
      }),
    }),

    queries: ({ querySingle, queryMany }) => ({
      postById: querySingle({
        query: z.object({
          id: z.string(),
        }),
        resolve: async ({ context, query }) => {
          return context.database.post.findUniqueOrThrow({ where: { id: query.id } });
        },
      }),

      post: querySingle({
        query: z.object({
          id: z.string(),
        }),
        resolve: async ({ context, query }) => {
          return context.database.post.findUniqueOrThrow({ where: { id: query.id } });
        },
      }),

      posts: queryMany({
        query: z.object({
          title: z.string().nullable(),
          orderBy: z.enum(['asc', 'desc']).optional(),
        }),
        withPaging: {
          maxTakeSize: 10,
          defaultTakeSize: 10,
          minTakeSize: 1,
        },
        resolve: async ({ context, query, pagingInfo }) => {
          const orderDir = query.orderBy === 'desc' ? 'desc' : 'asc';

          const allRows = await context.database.post.findMany({
            where: query.title != null ? { title: query.title } : undefined,
            orderBy: { id: orderDir },
          });

          const allPosts: Post[] = allRows.map((row) => ({
            id: row.id,
            title: row.title,
            content: row.content,
            profileId: row.profileId,
          }));

          const take = pagingInfo.take;
          const { before, after } = pagingInfo;

          const len = allPosts.length;
          let startIdx = 0;
          let endIdxExclusive = len;

          if (after !== null) {
            const idx = allPosts.findIndex((p) => p.id === after);
            startIdx = idx === -1 ? 0 : idx + 1;
          } else if (before !== null) {
            const idx = allPosts.findIndex((p) => p.id === before);
            endIdxExclusive = idx === -1 ? len : idx;
            startIdx = Math.max(0, endIdxExclusive - take);
          }

          const slice = allPosts.slice(startIdx, Math.min(startIdx + take, endIdxExclusive));

          const hasPreviousPage = startIdx > 0;
          const hasNextPage = startIdx + slice.length < endIdxExclusive;

          const startCursor = slice.length > 0 ? slice[0]!.id : null;
          const endCursor = slice.length > 0 ? slice[slice.length - 1]!.id : null;

          return {
            entities: slice,
            pagingInfo: {
              hasNextPage,
              hasPreviousPage,
              startCursor,
              endCursor,
            },
          };
        },
      }),

      postsPagingBadOutput: queryMany({
        query: z.object({}),
        withPaging: { maxTakeSize: 10 },
        resolve: async () =>
          ({
            entities: [],
            pagingInfo: {
              hasNextPage: 'not-a-boolean',
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          }) as any,
      }),
    }),

    includes: ({ includeSingle, includeMany }) => ({
      profile: includeSingle('profile', {
        matchKey: 'postId',
        query: z.object({
          comment: z.string().nullable(),
        }),
        resolve: async ({ context, parents }) => {
          const profileIds = parents.map((parent: Post) => parent.profileId);

          const rows = await context.database.profile.findMany({
            where: { id: { in: profileIds } },
          });

          const profiles: Profile[] = rows.map((row) => ({
            id: row.id,
            name: row.name,
            hobbies: JSON.parse(row.hobbies),
            address: JSON.parse(row.address),
          }));

          return parents.flatMap((parent: Post) => {
            const profile = profiles.find((item) => item.id === parent.profileId);

            return profile
              ? [
                  {
                    ...profile,
                    postId: parent.id,
                  },
                ]
              : [];
          });
        },
      }),

      firstComment: includeSingle('comment', {
        nullable: true,
        matchKey: 'postId',
        query: z.object({
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, query, parents }) => {
          const postIds = parents.map((parent: Post) => parent.id);

          const comments = await context.database.comment.findMany({
            where: { postId: { in: postIds } },
          });

          return parents.flatMap((parent: Post) => comments.filter((comment) => comment.postId === parent.id).slice(0, query.limit));
        },
      }),

      comments: includeMany('comment', {
        matchKey: 'postId',
        query: z.object({
          limit: z.number(),
          order: z.enum(['asc', 'desc']),
        }),
        resolve: async ({ context, query, parents }) => {
          const postIds = parents.map((parent: Post) => parent.id);

          const comments = await context.database.comment.findMany({
            where: { postId: { in: postIds } },
          });

          return parents.flatMap((parent: Post) => comments.filter((comment) => comment.postId === parent.id).slice(0, query.limit));
        },
      }),
    }),
  });

  const comment = schema.model('comment', {
    schema: z.object({
      id: z.string(),
      comment: z.string(),
      postId: z.string(),
      profileId: z.string(),
    }),

    fields: ({ field }) => ({
      id: field(),
      comment: field(),
      postId: field(),
      profileId: field(),
    }),

    allowEach: ({}) => {
      return true;
    },

    queries: ({ querySingle }) => ({
      commentById: querySingle<{ id: string }>({
        query: z.object({
          id: z.string(),
        }),
        resolve: async ({ context, query }) => {
          return context.database.comment.findUniqueOrThrow({ where: { id: query.id } });
        },
      }),
    }),

    includes: ({ includeSingle }) => ({
      profile: includeSingle('profile', {
        matchKey: 'commentId',
        resolve: async ({ context, parents }) => {
          const profileIds = parents.map((parent: Comment) => parent.profileId);

          const rows = await context.database.profile.findMany({
            where: { id: { in: profileIds } },
          });

          const profiles: Profile[] = rows.map((row) => ({
            id: row.id,
            name: row.name,
            hobbies: JSON.parse(row.hobbies),
            address: JSON.parse(row.address),
          }));

          return parents.flatMap((parent: Comment) => {
            const profile = profiles.find((item) => item.id === parent.profileId);

            return profile
              ? [
                  {
                    ...profile,
                    commentId: parent.id,
                  },
                ]
              : [];
          });
        },
      }),
    }),
  });

  return { profile, post, comment };
};

export const createQueryResolverSchema = () => {
  const schema = new Schema<QueryResolverSchemaContext, SchemaEntities>();
  registerQueryResolverModels(schema);
  generateSchema({ schema, outputPath: 'test/query/query-resolver.schema.d.ts' });
  return schema;
};

export const queryResolverSchema = createQueryResolverSchema();

export const queryResolver = createQueryResolver<ClientSchema>(queryResolverSchema);
