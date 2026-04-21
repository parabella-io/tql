import { describe, beforeEach, it, expect } from 'vitest';
import { Profile, Post, create, Comment } from '@tql/server/test-schema';
import type { ClientSchema } from '@tql/server/test-schema';
import Database from 'better-sqlite3';
import { Client } from '../../src/core/client/client';

type Schema = ClientSchema;

describe('Client', () => {
  let database: Database.Database;

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
  });

  it('should be able to issue a profileById query directly with include', async () => {
    const profile = profileEntities[0]!;

    const comments = commentEntities.filter((c) => c.profileId === profile.id);

    const client = new Client<Schema>({
      transports: {
        http: {
          url: 'http://localhost:3000',
        },
        sse: {
          eventsUrl: 'http://localhost:3000/subscription',
        },
      },
      subscriptionTransport: 'sse',
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
    };

    const client = new Client<Schema>({
      transports: {
        http: {
          url: 'http://localhost:3000',
        },
        sse: {
          eventsUrl: 'http://localhost:3000/subscription',
        },
      },
      subscriptionTransport: 'sse',
    });

    const changes = await client.mutation('createPost', input);

    expect(changes).not.toBeNull();
    const insertedPost = changes.post.inserts?.[0];
    expect(insertedPost).toEqual(createdPost);
    expect(insertedPost?.id).toEqual(createdPost.id);
    expect(insertedPost?.title).toEqual(createdPost.title);
    expect(insertedPost?.content).toEqual(createdPost.content);
    expect(insertedPost?.profileId).toEqual(createdPost.profileId);
  });
});
