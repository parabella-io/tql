import { queryResolver } from '../test-schema/resolvers.js';

type ResolverQueryInput = typeof queryResolver.$types.QueryInput;

const profileSelect = {
  name: true,
  hobbies: true,
  address: true,
} as const;

const postSelect = {
  title: true,
  content: true,
  profileId: true,
} as const;

const commentSelect = {
  comment: true,
  postId: true,
  profileId: true,
} as const;

const typeCheck = async () => {
  const _validDeclaredInput: ResolverQueryInput = {
    profile: {
      query: {
        name: 'Declan',
      },
      select: profileSelect,
    },
  };

  const _invalidDeclaredInput: ResolverQueryInput = {
    profile: {
      query: {
        name: 'Declan',
        // @ts-expect-error - extra root query arg should be rejected in QueryInput too
        id: '1',
      },
      select: profileSelect,
    },
  };

  const _validDeclaredNestedInput: ResolverQueryInput = {
    postById: {
      query: { id: '1' },
      select: postSelect,
      include: {
        profile: {
          query: { comment: null },
          select: profileSelect,
        },
      },
    },
  };

  const _invalidDeclaredIncludeInput: ResolverQueryInput = {
    postById: {
      query: { id: '1' },
      select: postSelect,
      include: {
        profile: {
          query: {
            comment: null,
            // @ts-expect-error - extra include query arg should be rejected in QueryInput too
            id: '1',
          },
          select: profileSelect,
        },
      },
    },
  };

  const _invalidDeclaredIncludeName: ResolverQueryInput = {
    postById: {
      query: { id: '1' },
      select: postSelect,
      include: {
        comments: {
          query: {
            limit: 10,
            order: 'asc',
          },
          select: commentSelect,
          include: {
            // @ts-expect-error - comments only defines the profile include
            posts: {},
          },
        },
      },
    },
  };

  const selected = await queryResolver.handle({
    context: {} as any,
    query: {
      profileById: {
        query: { id: '1' },
        select: {
          name: true,
          address: true,
          hobbies: true,
        },
      },
    },
  });

  const _selectedProfileId: string | undefined = selected.profileById.data?.id;
  const _selectedProfileName: string | undefined = selected.profileById.data?.name;
  const _selectedProfileCity: string | undefined = selected.profileById.data?.address.city;
  const _selectedHobbyName: string | undefined = selected.profileById.data?.hobbies[0]?.name;

  const full = await queryResolver.handle({
    context: {} as any,
    query: {
      profileById: {
        query: { id: '1' },
        select: profileSelect,
      },
    },
  });

  const _fullHobbyLevel: number | undefined = full.profileById.data?.hobbies[0]?.level;
  const _fullProfileZip: string | undefined = full.profileById.data?.address.zip;

  const included = await queryResolver.handle({
    context: {} as any,
    query: {
      postById: {
        query: { id: '1' },
        select: {
          title: true,
        },
        include: {
          profile: {
            query: { comment: null },
            select: profileSelect,
          },
          comments: {
            query: {
              limit: 10,
              order: 'asc',
            },
            select: {
              comment: true,
              profileId: true,
            },
            include: {
              profile: {
                query: {},
                select: profileSelect,
              },
            },
          },
        },
      },
    },
  });

  const _includedPostId: string | undefined = included.postById.data?.id;
  const _includedPostTitle: string | undefined = included.postById.data?.title;
  const _includedProfileHobbies = included.postById.data?.profile?.hobbies[0]?.level;
  const _includedCommentText: string | undefined = included.postById.data?.comments?.[0]?.comment;
  const _includedCommentProfileId: string | undefined = included.postById.data?.comments?.[0]?.profileId;
  const _includedCommentProfileName: string | undefined = included.postById.data?.comments?.[0]?.profile.name;
  const _includedCommentProfileHobbyName: string | undefined = included.postById.data?.comments?.[0]?.profile.hobbies[0]?.name;
  const _includedCommentProfileZip: string | undefined = included.postById.data?.comments?.[0]?.profile.address.zip;

  const postsPaged = await queryResolver.handle({
    context: {} as any,
    query: {
      posts: {
        query: { title: null, orderBy: 'asc' },
        select: postSelect,
        pagingInfo: { take: 5 },
      },
    },
  });

  const _postEntityTitle: string | undefined = postsPaged.posts.data?.[0]?.title;
  void _postEntityTitle;

  const _hasNext: boolean | undefined = postsPaged.posts.pagingInfo?.hasNextPage;
  void _hasNext;

  // @ts-expect-error paginated many `data` is Entity[], not `{ entities }`
  const _wrongPostsEntitiesAccess = postsPaged.posts.data?.entities;

  await queryResolver.handle({
    context: {} as any,
    query: {
      profile: {
        query: {
          name: 'Declan',
        },
        select: profileSelect,
      },
    },
  });

  await queryResolver.handle({
    context: {} as any,
    query: {
      profile: {
        query: {
          name: 'Declan',
        },
        select: profileSelect,
      },
    },
  });
};

void typeCheck;
