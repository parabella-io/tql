import { describe, test, beforeEach, expect } from 'vitest';
import { create } from '../test-schema/database.js';
import Database from 'better-sqlite3';
import { queryResolver } from '../test-schema/resolvers.js';
import { Comment, Post, Profile } from '../test-schema/schema.js';
import { IncludedDataMap, mergeIncludeData } from '../../src/query/query-resolver.js';
import { TQLServerErrorType } from '../../src/errors.js';

describe('QueryResolver explicit single-query aliases - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create();

    database = data.db;

    profileEntities = data.profileEntities;
  });

  test('should resolve profileById', async () => {
    const profile = profileEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profileById: {
          query: { id: profile.id },
          select: {
            name: true,
          },
        },
      },
    });

    expect(response.profileById.data?.id).toBe(profile.id);
    expect(response.profileById.data?.name).toBe(profile.name);
    expect(response.profileById.data?.__model).toBe('profile');
  });

  test('should resolve profile', async () => {
    const profile = profileEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profile: {
          query: { name: profile.name },
          select: {
            name: true,
          },
        },
      },
    });

    expect(response.profile.data?.id).toBe(profile.id);

    expect(response.profile.data?.name).toBe(profile.name);

    expect(response.profile.data?.__model).toBe('profile');
  });
});

describe('QueryResolver QuerySingle- Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create();

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;
  });

  test('should resolve profile', async () => {
    const profile = profileEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profile: {
          query: { name: profile.name },
          select: {
            name: true,
          },
        },
      },
    });

    expect(response.profile.data?.id).toBe(profile.id);
    expect(response.profile.data?.name).toBe(profile.name);
    expect(response.profile.data?.__model).toBe('profile');
  });
});

describe('QueryResolver QueryMany- Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 50,
    });

    database = data.db;

    profileEntities = data.profileEntities;
  });

  test('should resolve profiles list successfully', async () => {
    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'desc' },
          select: true,
        },
      },
    });

    expect(response.profiles.data).toHaveLength(10);
    for (const profile of response.profiles.data!) {
      expect(profile.__model).toBe('profile');
    }
  });
});

describe('QueryResolver IncludeSingle - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 20,
    });

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    commentEntities = data.commentEntities;
  });

  test('should resolve postById include profile successfully', async () => {
    const post = postEntities[0];

    const profile = profileEntities.find((p) => p.id === post.profileId);

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: true,
          include: {
            profile: {
              query: { comment: null },
              select: {
                name: true,
                hobbies: true,
                address: true,
              },
            },
          },
        },
      },
    });

    expect(response.postById.data?.id).toBe(post.id);
    expect(response.postById.data?.profile?.id).toBe(post.profileId);
    expect(response.postById.data?.__model).toBe('post');
    expect(response.postById.data?.profile?.name).toBe(profile!.name);
    expect(response.postById.data?.profile?.hobbies).toEqual(profile!.hobbies);
    expect(response.postById.data?.profile?.address).toEqual(profile!.address);
    expect(response.postById.data?.profile?.__model).toBe('profile');
  });

  test('should only return selected include profile fields', async () => {
    const post = postEntities[0];

    const profile = profileEntities.find((p) => p.id === post.profileId);

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: {
            title: true,
          },
          include: {
            profile: {
              query: { comment: null },
              select: {
                name: true,
                hobbies: true,
                address: true,
              },
            },
          },
        },
      },
    });

    const runtimePost = response.postById.data as any;
    const runtimeProfile = runtimePost?.profile;

    expect(response.postById.data?.id).toBe(post.id);
    expect(response.postById.data?.title).toBe(post.title);
    expect(response.postById.data?.profile?.id).toBe(profile!.id);
    expect(response.postById.data?.profile?.name).toBe(profile!.name);
    expect('content' in runtimePost).toBe(false);
    expect(runtimeProfile.hobbies).toEqual(profile!.hobbies);
    expect(runtimeProfile.address).toEqual(profile!.address);
  });

  test('should group matchKey includeSingle results for nested parents', async () => {
    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profiles: {
          query: { cursor: null, limit: 5, order: 'asc' },
          select: {
            name: true,
          },
          include: {
            posts: {
              query: { limit: 10, order: 'asc' },
              select: {
                title: true,
              },
              include: {
                firstComment: {
                  query: { limit: 1, order: 'asc' },
                  select: {
                    comment: true,
                    postId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    for (const profile of response.profiles.data ?? []) {
      for (const post of profile.posts ?? []) {
        const expectedComment = commentEntities.find((comment) => comment.postId === post.id) ?? null;

        if (expectedComment) {
          expect(post.firstComment?.id).toBe(expectedComment.id);
          expect(post.firstComment?.comment).toBe(expectedComment.comment);
          expect(post.firstComment?.postId).toBe(post.id);
          expect(post.firstComment?.__model).toBe('comment');
        } else {
          expect(post.firstComment).toBeNull();
        }
      }
    }
  });

  test('should return null for unmatched matchKey includeSingle results', async () => {
    const emptyData = await create({
      profileCount: 2,
      postCount: 2,
      commentCount: 0,
    });

    database.close();
    database = emptyData.db;

    const post = emptyData.postEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: true,
          include: {
            firstComment: {
              query: { limit: 1, order: 'asc' },
              select: true,
            },
          },
        },
      },
    });

    expect(response.postById.data?.id).toBe(post.id);
    expect(response.postById.data?.firstComment).toBeNull();
  });
});

describe('QueryResolver IncludeMany - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 20,
    });

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    commentEntities = data.commentEntities;
  });

  test('should resolve postById include comments successfully', async () => {
    const post = postEntities[0];

    const comments = commentEntities.filter((c) => c.postId === post.id);

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: true,
          include: {
            comments: {
              query: {
                limit: 10,
                order: 'asc',
              },
              select: true,
              include: {
                profile: {
                  query: {
                    comment: null,
                    limit: 10,
                    order: 'asc',
                  },
                  select: true,
                },
              },
            },
          },
        },
      },
    });

    expect(response.postById.data?.id).toBe(post.id);

    expect(response.postById.data?.comments?.length).toBe(10);

    for (const comment of response.postById.data?.comments!) {
      const expectedComment = comments.find((c) => c.id === comment.id);
      const expectedProfile = profileEntities.find((p) => p.id === expectedComment!.profileId);
      expect(comment.id).toBe(expectedComment!.id);
      expect(comment.comment).toBe(expectedComment!.comment);
      expect(comment.postId).toBe(expectedComment!.postId);
      expect(comment.profileId).toBe(expectedComment!.profileId);
      expect(comment.__model).toBe('comment');
      expect(comment.profile.id).toBe(expectedProfile!.id);
      expect(comment.profile.name).toBe(expectedProfile!.name);
      expect(comment.profile.__model).toBe('profile');
    }

    expect(queryResolver.invokeCount).toBe(3);
  });

  test('should only return selected nested include fields for includeMany', async () => {
    const post = postEntities[0];

    const comments = commentEntities.filter((c) => c.postId === post.id);

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: {
            title: true,
          },
          include: {
            comments: {
              query: {
                limit: 10,
                order: 'asc',
              },
              select: {
                comment: true,
              },
              include: {
                profile: {
                  query: {},
                  select: {
                    name: true,
                    hobbies: true,
                    address: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    expect(response.postById.data?.id).toBe(post.id);
    expect(response.postById.data?.title).toBe(post.title);
    expect(response.postById.data?.comments?.length).toBe(10);

    for (const comment of response.postById.data?.comments!) {
      const expectedComment = comments.find((c) => c.id === comment.id)!;
      const expectedProfile = profileEntities.find((p) => p.id === expectedComment.profileId)!;
      const runtimeComment = comment as any;

      expect(comment.id).toBe(expectedComment.id);
      expect(comment.comment).toBe(expectedComment.comment);
      expect(comment.profile.id).toBe(expectedProfile.id);
      expect(comment.profile.name).toBe(expectedProfile.name);
      expect('postId' in runtimeComment).toBe(false);
      expect('profileId' in runtimeComment).toBe(false);
      expect(runtimeComment.profile.hobbies).toEqual(expectedProfile.hobbies);
      expect(runtimeComment.profile.address).toEqual(expectedProfile.address);
    }
  });

  test('should return empty arrays for unmatched matchKey includeMany results', async () => {
    const emptyData = await create({
      profileCount: 2,
      postCount: 0,
      commentCount: 0,
    });

    database.close();
    database = emptyData.db;

    const profile = emptyData.profileEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        profileById: {
          query: { id: profile.id },
          select: true,
          include: {
            posts: {
              query: { limit: 10, order: 'asc' },
              select: true,
            },
          },
        },
      },
    });

    expect(response.profileById.data?.id).toBe(profile.id);
    expect(response.profileById.data?.posts).toEqual([]);
  });
});

describe('QueryResolver Multiple Top Level Queries - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 20,
    });

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    commentEntities = data.commentEntities;
  });

  test('should resolve postById include comments successfully', async () => {
    const posts = postEntities.filter((p) => p.title === 'test');

    const postById = postEntities[5];

    const post = postEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      query: {
        posts: {
          query: {
            title: 'test',
            cursor: null,
            limit: 10,
            order: 'desc',
          },
          select: true,
        },
        postById: {
          query: { id: postById.id },
          select: true,
        },
        post: {
          query: { id: post.id },
          select: true,
        },
      },
    });

    expect(response.posts.data?.length).toBe(posts.length);

    for (const post of response.posts.data!) {
      const expectedPost = posts.find((p) => p.id === post.id);
      expect(post.id).toBe(expectedPost!.id);
      expect(post.title).toBe(expectedPost!.title);
      expect(post.content).toBe(expectedPost!.content);
      expect(post.profileId).toBe(expectedPost!.profileId);
    }

    expect(response.postById.data?.id).toBe(postById.id);
    expect(response.postById.data?.title).toBe(postById.title);
    expect(response.postById.data?.content).toBe(postById.content);
    expect(response.postById.data?.profileId).toBe(postById.profileId);

    expect(response.post.data?.id).toBe(post.id);
    expect(response.post.data?.title).toBe(post.title);
    expect(response.post.data?.content).toBe(post.content);
    expect(response.post.data?.profileId).toBe(post.profileId);
  });
});

describe('QueryResolver Merge Include Data - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 20,
    });

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    commentEntities = data.commentEntities;
  });

  test('should merge include data successfully', async () => {
    const post = postEntities[0];

    const postById = {
      id: post.id,
      title: post.title,
      content: post.content,
      profileId: post.profileId,
    };

    const includeData: IncludedDataMap = {
      'post.comments': [
        {
          parentId: post.id,
          entities: commentEntities.filter((c) => c.postId === post.id),
        },
      ],
      'post.profile': commentEntities.map((c) => ({
        parentId: c.id,
        entity: profileEntities.find((p) => p.id === c.profileId),
      })),
    };

    const mergedData = mergeIncludeData(postById, includeData);

    expect(mergedData).toEqual({
      ...postById,
      comments: commentEntities
        .filter((c) => c.postId === post.id)
        .map((c) => ({
          id: c.id,
          comment: c.comment,
          postId: c.postId,
          profileId: c.profileId,
          profile: profileEntities.find((p) => p.id === c.profileId),
        })),
    });
  });

  test('should merge empty array if entities is empty', async () => {
    const post = postEntities[0];

    const postById = {
      id: post.id,
      title: post.title,
      content: post.content,
      profileId: post.profileId,
    };

    const includeData: IncludedDataMap = {
      'post.comments': [
        {
          parentId: post.id,
          entities: [],
        },
      ],
      'post.profile': commentEntities.map((c) => ({
        parentId: c.id,
        entity: profileEntities.find((p) => p.id === c.profileId),
      })),
    };

    const mergedData = mergeIncludeData(postById, includeData);

    expect(mergedData).toEqual({
      ...postById,
      comments: [],
    });
  });

  test('should merge include data into array data successfully', async () => {
    const posts = postEntities.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      profileId: p.profileId,
    }));

    const postsComments = commentEntities.map((c) => ({
      id: c.id,
      comment: c.comment,
      postId: c.postId,
      profileId: c.profileId,
    }));

    const includeData: IncludedDataMap = {
      'posts.comments': posts.map((p) => ({
        parentId: p.id,
        entities: commentEntities.filter((c) => c.postId === p.id),
      })),
      'posts.profile': postsComments.map((c) => ({
        parentId: c.id,
        entity: profileEntities.find((p) => p.id === c.profileId),
      })),
    };

    const mergedData = mergeIncludeData(posts, includeData);

    expect(mergedData).toEqual(
      posts.map((p) => ({
        ...p,
        comments: commentEntities
          .filter((c) => c.postId === p.id)
          .map((c) => ({
            id: c.id,
            comment: c.comment,
            postId: c.postId,
            profileId: c.profileId,
            profile: profileEntities.find((p) => p.id === c.profileId),
          })),
      })),
    );
  });
});

describe('QueryResolver HandleBatch - Success', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 20,
    });

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    commentEntities = data.commentEntities;
  });

  test('should resolve handleBatch', async () => {
    const postOne = postEntities[0];

    const postTwo = postEntities[1];

    const postThree = postEntities[2];

    const response = await queryResolver.handleBatch({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
      },
      queries: {
        queryOne: {
          postById: {
            query: { id: postThree.id },
            select: true,
          },
        },
        queryTwo: {
          postById: {
            query: { id: postTwo.id },
            select: true,
          },
        },
        queryThree: {
          postById: {
            query: { id: postOne.id },
            select: true,
          },
        },
      },
    });

    expect(response.queryOne.postById.data?.id).toBe(postThree.id);
    expect(response.queryTwo.postById.data?.id).toBe(postTwo.id);
    expect(response.queryThree.postById.data?.id).toBe(postOne.id);
  });
});

describe('QueryResolver explicit single-query aliases - Errors', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 10,
    });

    database = data.db;

    profileEntities = data.profileEntities;
  });

  test('should not allow query if allowEach returns false', async () => {
    const profile = profileEntities[0];

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        shouldAllow: false,
      },
      query: {
        profileById: {
          query: { id: profile.id },
          select: true,
        },
      },
    });

    expect(response.profileById.data).toBeNull();
    expect(response.profileById.error?.type).toEqual(TQLServerErrorType.QueryNotAllowedError);
  });
});

describe('QueryResolver QuerySingle - Errors', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 10,
    });

    database = data.db;

    profileEntities = data.profileEntities;
  });

  test('should not allow query if allow returns false', async () => {
    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        shouldAllow: false,
      },
      query: {
        profile: {
          query: { name: null },
          select: true,
        },
      },
    });

    expect(response.profile.data).toBeNull();
    expect(response.profile.error?.type).toEqual(TQLServerErrorType.QueryNotAllowedError);
  });
});

describe('QueryResolver QueryMany - Errors', () => {
  let database: Database.Database;

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 10,
      postCount: 10,
      commentCount: 10,
    });

    database = data.db;

    profileEntities = data.profileEntities;
  });

  test('should not allow query if allow returns false', async () => {
    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        shouldAllow: false,
      },
      query: {
        profiles: {
          query: { cursor: null, limit: 10, order: 'desc' },
          select: true,
        },
      },
    });

    expect(response.profiles.data).toBeNull();
    expect(response.profiles.error?.type).toEqual(TQLServerErrorType.QueryNotAllowedError);
  });
});

describe('QueryResolver externalField (commentsCount)', () => {
  let database: Database.Database;

  let postEntities: Post[] = [];

  let profileEntities: Profile[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create({
      profileCount: 3,
      postCount: 3,
      commentCount: 10,
    });

    database = data.db;

    postEntities = data.postEntities;

    profileEntities = data.profileEntities;
  });

  test('batch-resolves commentsCount when selected', async () => {
    const post = postEntities[0];

    const probe = { n: 0 };

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        __commentsCountResolveCalls: probe,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: {
            title: true,
            commentsCount: true,
          },
        },
      },
    });

    expect(probe.n).toBe(1);

    expect(response.postById.data?.commentsCount).toBe(10);

    expect(response.postById.data?.title).toBe(post.title);
  });

  test('does not invoke commentsCount resolve when not selected', async () => {
    const post = postEntities[0];

    const probe = { n: 0 };

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        __commentsCountResolveCalls: probe,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: {
            title: true,
          },
        },
      },
    });

    expect(probe.n).toBe(0);

    expect(response.postById.data?.title).toBe(post.title);

    expect((response.postById.data as { commentsCount?: number }).commentsCount).toBeUndefined();
  });

  test('runs external field resolve in parallel with include', async () => {
    const post = postEntities[0];

    const profile = profileEntities.find((p) => p.id === post.profileId);

    const probe = { n: 0 };

    const response = await queryResolver.handle({
      context: {
        userId: '1',
        database: database,
        isAuthenticated: true,
        __commentsCountResolveCalls: probe,
      },
      query: {
        postById: {
          query: { id: post.id },
          select: {
            title: true,
            commentsCount: true,
          },
          include: {
            profile: {
              query: { comment: null },
              select: { name: true },
            },
          },
        },
      },
    });

    expect(probe.n).toBe(1);

    expect(response.postById.data?.commentsCount).toBe(10);

    expect(response.postById.data?.profile?.name).toBe(profile?.name);
  });
});
