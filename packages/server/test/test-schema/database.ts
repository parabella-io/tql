import Database from 'better-sqlite3';

import { faker } from '@faker-js/faker';

import { Comment, Post, Profile } from './schema.js';

import { v7 } from 'uuid';

type CreateOptions = {
  profileCount?: number;
  postCount?: number;
  commentCount?: number;
};

export const create = async (
  options: CreateOptions = { profileCount: 10, postCount: 10, commentCount: 10 },
): Promise<{ db: Database.Database; profileEntities: Profile[]; postEntities: Post[]; commentEntities: Comment[] }> => {
  const profileCount = options.profileCount ?? 10;
  const postCount = options.postCount ?? 10;
  const commentCount = options.commentCount ?? 10;

  const db = new Database(':memory:');

  db.exec(`
        CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY,
          name TEXT,
          hobbies TEXT,
          address TEXT
        )
      `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS posts (
          id TEXT PRIMARY KEY,
          title TEXT,
          content TEXT,
          profileId TEXT,
          FOREIGN KEY (profileId) REFERENCES profiles (id)
        )
      `);

  db.exec(`
        CREATE TABLE IF NOT EXISTS comments (
          id TEXT PRIMARY KEY,
          comment TEXT,
          postId TEXT,
          profileId TEXT,
          FOREIGN KEY (profileId) REFERENCES profiles (id),
          FOREIGN KEY (postId) REFERENCES posts (id)
        )
      `);

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
    db.prepare(`INSERT INTO profiles (id, name, hobbies, address) VALUES (?, ?, ?, ?)`).run(
      profile.id,
      profile.name,
      JSON.stringify(profile.hobbies),
      JSON.stringify(profile.address),
    );
  }

  for (const post of postEntities) {
    db.prepare(`INSERT INTO posts (id, title, content, profileId) VALUES (?, ?, ?, ?)`).run(
      post.id,
      post.title,
      post.content,
      post.profileId,
    );
  }

  for (const comment of commentEntities) {
    db.prepare(`INSERT INTO comments (id, comment, postId, profileId) VALUES (?, ?, ?, ?)`).run(
      comment.id,
      comment.comment,
      comment.postId,
      comment.profileId,
    );
  }

  return {
    db,
    profileEntities,
    postEntities,
    commentEntities,
  };
};
