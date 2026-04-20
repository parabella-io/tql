import { NotFoundError } from '../../src/errors.js';
import { z } from 'zod';
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
    anotherField: field(),
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
      metadata: ({ queryMetadata }) => ({
        totalCount: queryMetadata({
          schema: z.number(),
          resolve: async ({ context, query }) => {
            if (false) {
              const _queryName: string | null = query.name;
              // @ts-expect-error - metadata query inherits the parent querySingle shape
              query.id;
              void _queryName;
            }

            const result: any = context.database.prepare('SELECT COUNT(*) as totalCount FROM profiles').get();

            return result.totalCount as number;
          },
        }),
      }),
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
      metadata: ({ queryMetadata }) => ({
        totalCount: queryMetadata({
          schema: z.number(),
          resolve: async ({ context, query }) => {
            if (false) {
              const _queryLimit: number = query.limit;
              const _queryOrder: 'asc' | 'desc' = query.order;
              const _queryCursorId: string | undefined = query.cursor?.id;
              // @ts-expect-error - metadata query inherits the parent queryMany shape
              query.name;
              void _queryLimit;
              void _queryOrder;
              void _queryCursorId;
            }

            const result: any = context.database.prepare('SELECT COUNT(*) as totalCount FROM profiles').get();

            return result.totalCount as number;
          },
        }),
      }),
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

  queries: ({ querySingle, queryMany }) => ({
    postById: querySingle<{ id: string }>({
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

    post: querySingle<{ id: string }>({
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

    posts: queryMany<{
      title: string | null;
      cursor: { id: string } | null;
      limit: number;
      order: 'asc' | 'desc';
    }>({
      query: z.object({
        title: z.string().nullable(),
        cursor: z
          .object({
            id: z.string(),
          })
          .nullable(),
        limit: z.number(),
        order: z.enum(['asc', 'desc']),
      }),
      resolve: async ({ context, query }) => {
        let posts: Post[] = [];

        if (query.title === undefined) {
          posts = context.database.prepare('SELECT * FROM posts').all() as any[];
        } else {
          posts = context.database.prepare('SELECT * FROM posts WHERE title = ?').all(query.title) as any[];
        }

        return posts;
      },
    }),
  }),

  includes: ({ includeSingle, includeMany }) => ({
    profile: includeSingle('profile', {
      matchKey: 'postId',
      query: z.object({
        comment: z.string().nullable(),
      }),
      resolve: async ({ context, query, parents }) => {
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
