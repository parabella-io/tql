import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOptimisticUpdate } from '../../src/core/query/query-optimistic-update';
import { Query } from '../../src/core/query/query';
import { createQueryStore } from '../../src';
import { QueryStore } from '../../src/core/query/query-store';

describe('Query Optimistic Update - get()', () => {
  const profileQueryResponse = vi.fn().mockResolvedValue({
    profile: {
      data: {
        id: '1',
        name: 'Name 1',
        hobbies: [],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
        },
      },
      error: null,
    },
  });

  const profilesQueryResponse = vi.fn().mockResolvedValue({
    profiles: {
      data: [
        {
          id: '1',
          name: 'Name 1',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
        {
          id: '2',
          name: 'Name 2',
          hobbies: [],
          address: {
            street: '456 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
      ],
      error: null,
    },
  });

  let store: QueryStore;

  const profileQueryName = 'profile';
  let profileQuery: Query<any, typeof profileQueryName, any, any>;

  const profilesQueryName = 'profiles';
  let profilesQuery: Query<any, typeof profilesQueryName, any, any>;

  beforeEach(() => {
    store = createQueryStore();

    profileQuery = new Query<any, typeof profileQueryName, any, any>({
      store: store,
      queryHandler: profileQueryResponse,
      queryName: profileQueryName,
      queryOptions: {
        queryKey: profileQueryName,
        query: (params) => ({
          query: { name: params.name },
          select: {
            name: true,
            hobbies: true,
            address: true,
          },
        }),
      },
    });

    profilesQuery = new Query<any, typeof profilesQueryName, any, any>({
      store: store,
      queryHandler: profilesQueryResponse,
      queryName: profilesQueryName,
      queryOptions: {
        queryKey: profilesQueryName,
        query: () => ({
          query: { cursor: null, limit: 100, order: 'asc' },
          cursor: null,
          limit: 100,
          order: 'asc',
          select: {
            name: true,
            hobbies: true,
            address: true,
          },
        }),
      },
    });
  });

  describe('get()', () => {
    it('should be able to create and apply an optimistic update to multiple individual queries atomically', async () => {
      const profileParamsOne = { name: 'John Doe' };

      const profilesParams = { limit: 100, order: 'asc' };

      await profileQuery.execute(profileParamsOne);

      const profileHashKey = profileQuery.getHashKey(profileParamsOne);

      await profilesQuery.execute(profilesParams);

      const profilesHashKey = profilesQuery.getHashKey(profilesParams);

      const optimisticUpdate = createOptimisticUpdate(store);

      const profileToUpdate = optimisticUpdate.get(profileQuery, profileParamsOne);

      profileToUpdate.update((draft: any) => {
        draft!.name = `${draft!.name} Updated`;
      });

      const profilesToUpdate = optimisticUpdate.get(profilesQuery, { limit: 100, order: 'asc' });

      profilesToUpdate.update((draft: any) => {
        draft!.forEach((profile: any) => {
          profile.name = `${profile.name} Updated`;
        });
      });

      const commit = optimisticUpdate.commit();

      expect(commit).toEqual({
        [profileHashKey]: {
          id: '1',
          name: 'Name 1 Updated',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
        [profilesHashKey]: [
          {
            id: '1',
            name: 'Name 1 Updated',
            hobbies: [],
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zip: '12345',
            },
          },
          {
            id: '2',
            name: 'Name 2 Updated',
            hobbies: [],
            address: {
              street: '456 Main St',
              city: 'Anytown',
              state: 'CA',
              zip: '12345',
            },
          },
        ],
      });

      const updatedProfileData = store.getState().getData(profileHashKey) as Record<string, any>;

      const updatedProfilesData = store.getState().getData(profilesHashKey) as Record<string, any>[];

      expect(updatedProfileData.name).toEqual('Name 1 Updated');

      for (const profile of updatedProfilesData) {
        expect(profile.name).toEqual(`Name ${profile.id} Updated`);
      }
    });
  });

  describe('getAll()', () => {
    it('should be able to create and apply an optimistic update to all queries at once atomically', async () => {
      const profileParamsOne = { name: 'John Doe' };

      const profileParamsTwo = { name: 'Jane Doe' };

      await profileQuery.execute(profileParamsOne);

      const profileOneHashKey = profileQuery.getHashKey(profileParamsOne);

      await profileQuery.execute(profileParamsTwo);

      const profileTwoHashKey = profileQuery.getHashKey(profileParamsTwo);

      const optimisticUpdate = createOptimisticUpdate(store);

      const profileToUpdate = optimisticUpdate.getAll(profileQuery);

      profileToUpdate.update((draft: any) => {
        draft.name = `${draft.name} Updated`;
      });

      const commit = optimisticUpdate.commit();

      expect(commit).toEqual({
        [profileOneHashKey]: {
          id: '1',
          name: 'Name 1 Updated',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
        [profileTwoHashKey]: {
          id: '1',
          name: 'Name 1 Updated',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
      });

      const updatedProfileOneData = store.getState().getData(profileOneHashKey) as Record<string, any>;

      const updatedProfileTwoData = store.getState().getData(profileTwoHashKey) as Record<string, any>;

      expect(updatedProfileOneData.name).toEqual('Name 1 Updated');

      expect(updatedProfileTwoData.name).toEqual('Name 1 Updated');
    });
  });

  describe('where()', () => {
    it('should be able to create and apply an optimistic update queries that partially match the params atomically', async () => {
      const paramsOne = { name: 'John Doe', id: '1' };

      const paramsTwo = { name: 'Jane Doe', id: '2' };

      const paramsThree = { name: 'Jim Doe', id: '3' };

      await profileQuery.execute(paramsOne);

      const profileOneHashKey = profileQuery.getHashKey(paramsOne);

      await profileQuery.execute(paramsTwo);

      const profileTwoHashKey = profileQuery.getHashKey(paramsTwo);

      await profileQuery.execute(paramsThree);

      const profileThreeHashKey = profileQuery.getHashKey(paramsThree);

      const optimisticUpdate = createOptimisticUpdate(store);

      const profileToUpdate = optimisticUpdate.where(profileQuery, { name: 'John Doe' });

      profileToUpdate.update((draft: any) => {
        draft!.name = `${draft!.name} Updated`;
      });

      const commit = optimisticUpdate.commit();

      expect(commit).toEqual({
        [profileOneHashKey]: {
          id: '1',
          name: 'Name 1 Updated',
          hobbies: [],
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          },
        },
      });

      const updatedProfileOneData = store.getState().getData(profileOneHashKey) as Record<string, any>;

      const updatedProfileTwoData = store.getState().getData(profileTwoHashKey) as Record<string, any>;

      const updatedProfileThreeData = store.getState().getData(profileThreeHashKey) as Record<string, any>;

      expect(updatedProfileOneData.name).toEqual('Name 1 Updated');

      expect(updatedProfileTwoData.name).toEqual('Name 1');

      expect(updatedProfileThreeData.name).toEqual('Name 1');
    });
  });
});
