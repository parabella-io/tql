import { faker } from '@faker-js/faker';
import { v7 } from 'uuid';

import type { Comment, Post, Profile } from './schema-entities.js';
import { createPrismaClient, type PrismaClient } from '../prisma/database.js';

export type CreateTestDataOptions = {
  profileCount?: number;
  postCount?: number;
  commentCount?: number;
};

export type TestData = {
  db: PrismaClient;
  profileEntities: Profile[];
  postEntities: Post[];
  commentEntities: Comment[];
};

const createProfileTable = async (db: PrismaClient): Promise<void> => {
  await db.$executeRaw`
    CREATE TABLE Profile (
      id      TEXT PRIMARY KEY,
      name    TEXT NOT NULL,
      hobbies TEXT NOT NULL,
      address TEXT NOT NULL
    )
  `;
};

const createPostTable = async (db: PrismaClient): Promise<void> => {
  await db.$executeRaw`
    CREATE TABLE Post (
      id        TEXT PRIMARY KEY,
      title     TEXT NOT NULL,
      content   TEXT NOT NULL,
      profileId TEXT NOT NULL
    )
  `;
};

const createCommentTable = async (db: PrismaClient): Promise<void> => {
  await db.$executeRaw`
    CREATE TABLE Comment (
      id        TEXT PRIMARY KEY,
      comment   TEXT NOT NULL,
      postId    TEXT NOT NULL,
      profileId TEXT NOT NULL
    )
  `;
};

const createTables = async (db: PrismaClient): Promise<void> => {
  await createProfileTable(db);
  await createPostTable(db);
  await createCommentTable(db);
};

export const seedTestData = async (
  options: CreateTestDataOptions = { profileCount: 10, postCount: 10, commentCount: 10 },
): Promise<TestData> => {
  const db = createPrismaClient();

  await createTables(db);

  const profileCount = options.profileCount ?? 10;
  const postCount = options.postCount ?? 10;
  const commentCount = options.commentCount ?? 10;

  const profileEntities: Profile[] = [];
  const postEntities: Post[] = [];
  const commentEntities: Comment[] = [];

  for (let i = 0; i < profileCount; i++) {
    profileEntities.push({
      id: v7(),
      name: faker.person.fullName(),
      hobbies: [
        { level: 1, name: faker.lorem.word() },
        { level: 2, name: faker.lorem.word() },
        { level: 3, name: faker.lorem.word() },
      ],
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      },
    });
  }

  for (let i = 0; i < postCount; i++) {
    postEntities.push({
      id: v7(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      profileId: faker.helpers.arrayElement(profileEntities).id,
    });
  }

  for (const post of postEntities) {
    for (let i = 0; i < commentCount; i++) {
      commentEntities.push({
        id: v7(),
        comment: faker.lorem.sentence(),
        postId: post.id,
        profileId: faker.helpers.arrayElement(profileEntities).id,
      });
    }
  }

  for (const profile of profileEntities) {
    await db.profile.create({
      data: {
        id: profile.id,
        name: profile.name,
        hobbies: JSON.stringify(profile.hobbies),
        address: JSON.stringify(profile.address),
      },
    });
  }

  for (const post of postEntities) {
    await db.post.create({
      data: {
        id: post.id,
        title: post.title,
        content: post.content,
        profileId: post.profileId,
      },
    });
  }

  for (const comment of commentEntities) {
    await db.comment.create({
      data: {
        id: comment.id,
        comment: comment.comment,
        postId: comment.postId,
        profileId: comment.profileId,
      },
    });
  }

  return { db, profileEntities, postEntities, commentEntities };
};
