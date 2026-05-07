import { z } from 'zod';

import { NotFoundError } from '../../src/errors.js';
import { Comment, Post, Profile, schema } from './schema.js';

export const profile = schema.model('profile', {
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
        const result: any = context.database.prepare('SELECT * FROM profiles WHERE id = ?').get(query.id);

        return {
          id: result.id,
          name: result.name,
          hobbies: JSON.parse(result.hobbies),
          address: JSON.parse(result.address),
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
        let profile: any | null = null;

        if (query.name === undefined) {
          profile = context.database.prepare('SELECT * FROM profiles').get() as any;
        } else {
          profile = context.database.prepare('SELECT * FROM profiles WHERE name = ?').get(query.name) as any;
        }

        if (!profile) {
          throw new NotFoundError();
        }

        return {
          id: profile.id,
          name: profile.name,
          hobbies: JSON.parse(profile.hobbies),
          address: JSON.parse(profile.address),
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
        const order = query.order && (query.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC');

        let result: any[] = [];

        if (query.cursor) {
          const op = order === 'DESC' ? '<' : '>';

          result = context.database
            .prepare(`SELECT * FROM profiles WHERE id ${op} ? ORDER BY id ${order} LIMIT ?`)
            .all(query.cursor.id, query.limit);
        } else {
          result = context.database.prepare(`SELECT * FROM profiles ORDER BY id ${order} LIMIT ?`).all(query.limit);
        }

        return result.map((row: any) => ({
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
        const profileId = parents.map((parent: Profile) => parent.id);

        const placeholders = profileId.map((id) => `'${id}'`).join(', ');

        let posts = context.database
          .prepare(`SELECT * FROM posts WHERE profileId IN (${placeholders}) ORDER BY id ${query.order} LIMIT ?`)
          .all(query.limit) as any[];

        posts = posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          profileId: post.profileId,
        }));

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

        const placeholders = profileIds.map((id) => `'${id}'`).join(', ');

        let comments: Comment[] = context.database
          .prepare(`SELECT * FROM comments WHERE profileId IN (${placeholders}) ORDER BY id ${query.order} LIMIT ?`)
          .all(query.limit) as any[];

        comments = comments.map((comment: any) => ({
          id: comment.id,
          comment: comment.comment,
          postId: comment.postId,
          profileId: comment.profileId,
        }));

        return parents.flatMap((parent: Profile) => comments.filter((comment) => comment.profileId === parent.id).slice(0, query.limit));
      },
    }),
  }),
});

export const post = schema.model('post', {
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

        const placeholders = entities.map(() => '?').join(', ');

        const rows = context.database
          .prepare(`SELECT postId, COUNT(*) as c FROM comments WHERE postId IN (${placeholders}) GROUP BY postId`)
          .all(...entities.map((e: Post) => e.id)) as { postId: string; c: number }[];

        const byPost = new Map(rows.map((r) => [r.postId, Number(r.c)]));

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
        const result: any = context.database.prepare('SELECT * FROM posts WHERE id = ?').get(query.id);

        return {
          id: result.id,
          title: result.title,
          content: result.content,
          profileId: result.profileId,
        };
      },
    }),

    post: querySingle({
      query: z.object({
        id: z.string(),
      }),
      resolve: async ({ context, query }) => {
        const result: any = context.database.prepare('SELECT * FROM posts WHERE id = ?').get(query.id);

        return {
          id: result.id,
          title: result.title,
          content: result.content,
          profileId: result.profileId,
        };
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
        const orderSql = query.orderBy === 'desc' ? 'DESC' : 'ASC';

        let rows: any[];
        if (query.title === undefined) {
          rows = context.database.prepare(`SELECT * FROM posts ORDER BY id ${orderSql}`).all() as any[];
        } else {
          rows = context.database.prepare(`SELECT * FROM posts WHERE title = ? ORDER BY id ${orderSql}`).all(query.title) as any[];
        }

        const allPosts: Post[] = rows.map((row: any) => ({
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

    /** Test-only: invalid resolver pagingInfo to exercise output validation. */
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

        let profiles: Profile[] = context.database.prepare('SELECT * FROM profiles WHERE id IN (?)').all(profileIds) as any[];

        profiles = profiles.map((profile: any) => ({
          id: profile.id,
          name: profile.name,
          hobbies: JSON.parse(profile.hobbies),
          address: JSON.parse(profile.address),
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

        const placeholders = postIds.map((id) => `'${id}'`).join(', ');

        let comments: Comment[] = context.database.prepare(`SELECT * FROM comments WHERE postId IN (${placeholders})`).all() as any[];

        comments = comments.map((comment: any) => ({
          id: comment.id,
          comment: comment.comment,
          postId: comment.postId,
          profileId: comment.profileId,
        }));

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

        const placeholders = postIds.map((id) => `'${id}'`).join(', ');

        let comments: Comment[] = context.database.prepare(`SELECT * FROM comments WHERE postId IN (${placeholders})`).all() as any[];

        return parents.flatMap((parent: Post) => comments.filter((comment) => comment.postId === parent.id).slice(0, query.limit));
      },
    }),
  }),
});

export const comment = schema.model('comment', {
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
        const result: any = context.database.prepare('SELECT * FROM comments WHERE id = ?').get(query.id);

        return {
          id: result.id,
          comment: result.comment,
          postId: result.postId,
          profileId: result.profileId,
        };
      },
    }),
  }),

  includes: ({ includeSingle }) => ({
    profile: includeSingle('profile', {
      matchKey: 'commentId',
      resolve: async ({ context, parents }) => {
        const profileIds = parents.map((parent: Comment) => parent.profileId);

        const placeholders = profileIds.map((id) => `'${id}'`).join(', ');

        let profiles: Profile[] = context.database.prepare(`SELECT * FROM profiles WHERE id IN (${placeholders})`).all() as any[];

        profiles = profiles.map((profile: any) => ({
          id: profile.id,
          name: profile.name,
          hobbies: JSON.parse(profile.hobbies),
          address: JSON.parse(profile.address),
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
