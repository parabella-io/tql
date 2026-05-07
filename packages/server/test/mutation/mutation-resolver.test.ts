import { beforeEach, describe, test, expect } from 'vitest';
import Database from 'better-sqlite3';

import { create } from '../test-schema/database.js';
import { mutationResolver } from '../test-schema/resolvers.js';
import { Comment, Post, SchemaContext } from '../test-schema/index.js';
import { TQLServerErrorType } from '../../src/errors.js';

describe('MutationResolver - Success', () => {
  const userId = '1';

  let database: Database.Database;

  let context: SchemaContext = {} as any;

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const { db } = await create();

    database = db;

    context = {
      userId,
      isAuthenticated: true,
      database: database,
    };
  });

  test('should invoke a createProfile mutation successfully', async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfile: {
          input: {
            name,
            hobbies,
            address,
          },
        },
      },
    });

    expect(result.createProfile.error).toBeNull();
    expect(result.createProfile.data.profile.id).toBeDefined();
    expect(result.createProfile.data.profile.name).toBe(name);
    expect(result.createProfile.data.profile.hobbies).toEqual(hobbies);
    expect(result.createProfile.data.profile.address).toEqual(address);

    const databaseProfile: any = database.prepare(`SELECT * FROM profiles WHERE id = ?`).get(userId);
    expect(databaseProfile.name).toBe(name);
    expect(JSON.parse(databaseProfile.hobbies)).toEqual(hobbies);
    expect(JSON.parse(databaseProfile.address)).toEqual(address);
  });

  test('should invoke createProfile, createPost and createComment mutations successfully', async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];

    const postTitle = 'Test Post';
    const postId = '1';
    const postContent = 'Test Post';

    const commentId = '1';
    const commentContent = 'Test Comment';

    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfile: {
          input: {
            name,
            hobbies,
            address,
          },
        },
        createPost: {
          input: {
            id: postId,
            title: postTitle,
            content: postContent,
            profileId: userId,
          },
        },
        createComment: {
          input: {
            id: commentId,
            comment: commentContent,
            postId: userId,
            profileId: userId,
          },
        },
      },
    });

    expect(result.createProfile.error).toBeNull();
    expect(result.createPost.error).toBeNull();
    expect(result.createComment.error).toBeNull();

    expect(result.createProfile.data.profile.id).toBe(userId);
    expect(result.createProfile.data.profile.name).toBe(name);
    expect(result.createProfile.data.profile.hobbies).toEqual(hobbies);
    expect(result.createProfile.data.profile.address).toEqual(address);

    expect(result.createPost.data.post.id).toBe(postId);
    expect(result.createPost.data.post.content).toBe('Test Post');
    expect(result.createPost.data.post.profileId).toBe(userId);

    expect(result.createComment.data.comment.id).toBe(commentId);
    expect(result.createComment.data.comment.comment).toBe(commentContent);
    expect(result.createComment.data.comment.postId).toBe(userId);
    expect(result.createComment.data.comment.profileId).toBe(userId);

    const databasePost: Post = database.prepare(`SELECT * FROM posts WHERE id = ?`).get(postId) as Post;
    expect(databasePost.content).toBe(postContent);
    expect(databasePost.profileId).toBe(userId);

    const databaseComment: Comment = database.prepare(`SELECT * FROM comments WHERE id = ?`).get(commentId) as Comment;
    expect(databaseComment.comment).toBe(commentContent);
    expect(databaseComment.postId).toBe(postId);
    expect(databaseComment.profileId).toBe(userId);
  });

  test('should invoke createProfileNoChanges mutation successfully', async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfileNoChanges: {
          input: {
            name,
            hobbies,
            address,
          },
        },
      },
    });

    expect(result.createProfileNoChanges.error).toBeNull();

    expect(result.createProfileNoChanges.data).toEqual({});
  });
});

describe('MutationResolver - Errors', () => {
  const userId = '1';

  let database: Database.Database;

  let context: SchemaContext = {} as any;

  beforeEach(async () => {
    if (database) {
      database.close();
    }

    const { db } = await create();

    database = db;

    context = {
      userId,
      isAuthenticated: true,
      database: database,
    };
  });

  test(`should invoke createProfileUnauthorized mutation and return a MutationNotAllowed error`, async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfileUnauthorized: {
          input: {
            name,
            hobbies,
            address,
          },
        },
      },
    });

    const error = result.createProfileUnauthorized.error;
    expect(error?.type).toEqual(TQLServerErrorType.MutationNotAllowedError);
    expect(error?.details?.mutationName).toBe('createProfileUnauthorized');
    expect(result.createProfileUnauthorized.data).toBeNull();
  });

  test(`should invoke createProfile mutation and return a MutationInputSchemaError error`, async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfile: {
          input: {
            name,
            address,
          },
        } as any,
      },
    });

    const error = result.createProfile.error;
    expect(error?.type).toEqual(TQLServerErrorType.MutationInputSchemaError);
    expect(result.createProfile.data).toBeNull();
  });

  test(`should invoke createProfileMalformedResponse mutation and return a MutationResponseMalformed error`, async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        createProfileMalformedResponse: {
          input: {
            name,
            hobbies,
            address,
          },
        },
      },
    });

    const error = result.createProfileMalformedResponse.error;
    expect(error?.type).toEqual(TQLServerErrorType.MutationResponseMalformedError);
    expect(result.createProfileMalformedResponse.data).toBeNull();
  });

  test(`should invoke invalidMutation mutation and return a MutationNotFound error`, async () => {
    const name = 'John doe';
    const hobbies = [{ level: 1, name: 'Test Hobby' }];
    const address = {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    };

    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {
        invalidMutation: {
          input: {
            name,
            hobbies,
            address,
          },
        },
      } as any,
    });

    const error = (result as any).invalidMutation.error;
    expect(error?.type).toEqual(TQLServerErrorType.MutationNotFoundError);
    expect(error?.details?.mutationName).toBe('invalidMutation');
  });

  test(`should invoke with no mutations and return a MutationNotSpecified error`, async () => {
    const { results: result } = await mutationResolver.handle({
      context,
      mutation: {} as any,
    });

    expect(result).toEqual({});
  });
});
