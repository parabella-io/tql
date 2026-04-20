import { describe, expect, it } from 'vitest';

import { createQueryStore, QueryState } from '../../src/core/query/query-store';

describe('Query Store', () => {
  it('should be able to set getByIdState', () => {
    const store = createQueryStore();

    const getByIdState: QueryState = {
      queryName: 'profileById',
      queryKey: 'profileById',
      query: { args: { id: '1' } },
      queryHashKey: '1',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const storeState = store.getState();

    storeState.setState('1', getByIdState);

    const { state } = store.getState();

    expect(state['1']).toBe(getByIdState);
  });

  it('should be able to set querySingleState', () => {
    const store = createQueryStore();

    const querySingleState: QueryState = {
      queryName: 'profileById',
      queryKey: 'profileById',
      query: { args: { id: '1' } },
      queryHashKey: 'profileById',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const storeState = store.getState();

    storeState.setState('1', querySingleState);

    const updatedStoreState = store.getState();

    expect(updatedStoreState.state['1']).toBe(querySingleState);
  });

  it('should be able to set queryManyState', () => {
    const store = createQueryStore();

    const queryManyState: QueryState = {
      queryName: 'profiles',
      queryKey: 'profiles',
      query: { args: { limit: 10, order: 'createdAt', cursor: null } },
      queryHashKey: 'profiles',
      error: null,
      data: [],
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const storeState = store.getState();

    storeState.setState('1', queryManyState);

    const updatedStoreState = store.getState();

    expect(updatedStoreState.state['1']).toBe(queryManyState);
  });

  it('should be able to update states', () => {
    const store = createQueryStore();

    const storeState = store.getState();

    const queryOneState: QueryState = {
      queryName: 'queryOne',
      queryKey: 'queryOne',
      query: { args: { id: '1' } },
      queryHashKey: 'queryOne',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const queryTwoState: QueryState = {
      queryName: 'queryTwo',
      queryKey: 'queryTwo',
      query: { args: { id: '2' } },
      queryHashKey: 'queryTwo',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    storeState.setState('queryOne', queryOneState);

    storeState.setState('queryTwo', queryTwoState);

    const initialStoreState = store.getState();

    const updatedQueryOneState: QueryState = {
      ...queryOneState,
      data: {
        name: 'test',
      },
    };

    const updatedQueryTwoState: QueryState = {
      ...queryTwoState,
      data: {
        name: 'test',
      },
    };

    initialStoreState.setStates({
      queryOne: updatedQueryOneState,
      queryTwo: updatedQueryTwoState,
    });

    const updatedStoreState = store.getState();

    expect(updatedStoreState.state['queryOne']).toBe(updatedQueryOneState);

    expect(updatedStoreState.state['queryTwo']).toBe(updatedQueryTwoState);
  });

  it('should be able to set data for multiple keys', () => {
    const store = createQueryStore();

    const storeState = store.getState();

    const queryOneState: QueryState = {
      queryName: 'queryOne',
      queryKey: 'queryOne',
      query: { args: { id: '1' } },
      queryHashKey: 'queryOne',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const queryTwoState: QueryState = {
      queryName: 'queryTwo',
      queryKey: 'queryTwo',
      query: { args: { id: '2' } },
      queryHashKey: 'queryTwo',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    storeState.setState('queryOne', queryOneState);

    storeState.setState('queryTwo', queryTwoState);

    const initialStoreState = store.getState();

    expect(initialStoreState.state['queryOne']).toBe(queryOneState);

    expect(initialStoreState.state['queryTwo']).toBe(queryTwoState);

    initialStoreState.setData(['queryOne', 'queryTwo'], (data) => {
      data.name = 'test';
    });

    const updatedStoreState = store.getState();

    const updatedQueryOneState = updatedStoreState.state['queryOne'] as QueryState;

    const updatedQueryTwoState = updatedStoreState.state['queryTwo'] as QueryState;

    expect((updatedQueryOneState.data as Record<string, any>)?.name).toBe('test');

    expect((updatedQueryTwoState.data as Record<string, any>)?.name).toBe('test');
  });

  it('should be able to set metadata for multiple keys', () => {
    const store = createQueryStore();

    const storeState = store.getState();

    const queryOneState: QueryState = {
      queryName: 'queryOne',
      queryKey: 'queryOne',
      query: { args: { id: '1' } },
      queryHashKey: 'queryOne',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const queryTwoState: QueryState = {
      queryName: 'queryTwo',
      queryKey: 'queryTwo',
      query: { args: { id: '2' } },
      queryHashKey: 'queryTwo',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    storeState.setState('queryOne', queryOneState);

    storeState.setState('queryTwo', queryTwoState);

    const initialStoreState = store.getState();

    expect(initialStoreState.state['queryOne']).toBe(queryOneState);

    expect(initialStoreState.state['queryTwo']).toBe(queryTwoState);

    initialStoreState.setMetadata(['queryOne', 'queryTwo'], (data) => {
      data.page = 1;
    });

    const updatedStoreState = store.getState();

    const updatedQueryOneState = updatedStoreState.state['queryOne'] as QueryState;

    const updatedQueryTwoState = updatedStoreState.state['queryTwo'] as QueryState;

    expect(updatedQueryOneState.metadata?.page).toBe(1);

    expect(updatedQueryTwoState.metadata?.page).toBe(1);
  });

  it('should be able to set loading for multiple keys', () => {
    const store = createQueryStore();

    const storeState = store.getState();

    const queryOneState: QueryState = {
      queryName: 'queryOne',
      queryKey: 'queryOne',
      query: { args: { id: '1' } },
      queryHashKey: 'queryOne',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    const queryTwoState: QueryState = {
      queryName: 'queryTwo',
      queryKey: 'queryTwo',
      query: { args: { id: '2' } },
      queryHashKey: 'queryTwo',
      error: null,
      data: null,
      params: {},
      isLoading: false,
      isStale: false,
      metadata: null,
      isEnabled: true,
      staleTimeInMs: 0,
      staleAtTimestamp: null,
    };

    storeState.setState('queryOne', queryOneState);

    storeState.setState('queryTwo', queryTwoState);

    storeState.setLoading(['queryOne', 'queryTwo'], true);

    const updatedStoreState = store.getState();

    expect(updatedStoreState.state['queryOne']?.isLoading).toBe(true);

    expect(updatedStoreState.state['queryTwo']?.isLoading).toBe(true);
  });
});
