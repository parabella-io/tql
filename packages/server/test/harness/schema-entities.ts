import type { SchemaEntity } from '../../src/schema-entity.js';

export type Profile = SchemaEntity<{
  name: string;
  hobbies: { level: number; name: string }[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}>;

export type Post = SchemaEntity<{
  title: string;
  content: string;
  profileId: string;
}>;

export type Comment = SchemaEntity<{
  comment: string;
  postId: string;
  profileId: string;
}>;

export type SchemaEntities = {
  profile: Profile;
  post: Post;
  comment: Comment;
};
