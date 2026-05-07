import { describe, beforeEach, it, expect, vi } from 'vitest';
import { queryResolver, Profile, Post, create, Comment, SchemaContext } from '../test-schema';
import type { ClientSchema } from '../test-schema';
import Database from 'better-sqlite3';
import { Client } from '../../src/core/client/client';

describe('Client', () => {
  let database: Database.Database;

  let context: SchemaContext;

  let profileEntities: Profile[] = [];

  let postEntities: Post[] = [];

  let commentEntities: Comment[] = [];

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const data = await create();

    database = data.db;

    profileEntities = data.profileEntities;

    postEntities = data.postEntities;

    console.log(postEntities);

    commentEntities = data.commentEntities;

    context = {
      userId: '1',
      database: database,
      isAuthenticated: true,
    };
  });

  it('should be able to issue a profileById query directly with include', async () => {
    const profile = profileEntities[0]!;

    const comments = commentEntities.filter((c) => c.profileId === profile.id);

    const client = new Client<ClientSchema>({
      transports: {
        http: {
          query: async (query) => {
            return queryResolver.handle({
              context,
              query: query,
            });
          },
          mutation: vi.fn(),
        },
      },
    });

    const response = await client.query('profileById', {
      query: { id: profile.id },
      select: { name: true },
      include: {
        comments: {
          query: { limit: 10, order: 'asc' },
          select: {
            profileId: true,
            postId: true,
            comment: true,
          },
        },
      },
    });

    const data = response.profileById.data!;
    const selectedId = data.id;
    const selectedName = data.name;
    expect(selectedId).toEqual(profile.id);
    expect(selectedName).toEqual(profile.name);
    console.log(response.profileById.data);
    data.comments.forEach((comment) => {
      const expectedComment = comments.find((c) => c.id === comment.id);
      expect(comment.profileId).toEqual(expectedComment?.profileId);
      expect(comment.comment).toEqual(expectedComment?.comment);
      // @ts-expect-error - comment.postId is not selected
      const notSelectedComment = comment.postId;
    });
    // @ts-expect-error - hobbies is not selected
    const notSelectedHobbies = response.profileById.data.hobbies;
  });

  it('should be able to issue a createPost mutation directly', async () => {
    const input = {
      id: '1',
      title: 'Post Title',
      content: 'Post Content',
      profileId: '1',
    };

    const createdPost = {
      id: '1',
      title: 'Post Title',
      content: 'Post Content',
      profileId: '1',
      __model: 'post',
    };

    const client = new Client<ClientSchema>({
      transports: {
        http: {
          query: vi.fn(),
          mutation: async () => {
            return {
              createPost: {
                data: {
                  post: createdPost,
                },
                error: null,
              },
            } as any;
          },
        },
      },
    });

    const output = await client.mutation('createPost', input);

    expect(output).not.toBeNull();
    expect(output.post).toEqual(createdPost);
    expect(output.post.id).toEqual(createdPost.id);
    expect(output.post.title).toEqual(createdPost.title);
    expect(output.post.content).toEqual(createdPost.content);
    expect(output.post.profileId).toEqual(createdPost.profileId);
  });
});
