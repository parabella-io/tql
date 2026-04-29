import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { Query } from '../core/query/query';

type AnyQuery = Query<any, any, any, any>;

type QueryParamsFor<QueryType extends AnyQuery> = QueryType extends Query<any, any, any, infer Params> ? Params : never;

type UseQueryResult<QueryType extends AnyQuery> = {
  data: ReturnType<QueryType['getData']>;
  error: ReturnType<QueryType['getError']>;
  isLoading: boolean;
  isError: boolean;
};

export const useQuery = <QueryType extends AnyQuery>(options: {
  isEnabled?: boolean;
  query: QueryType;
  params: QueryParamsFor<QueryType>;
}): UseQueryResult<QueryType> => {
  const { query, params, isEnabled = true } = options;

  useEffect(() => {
    if (!isEnabled) return;
    query.register(params);
  }, [params, isEnabled]);

  const state = useSyncExternalStore(
    (callback) => query.subscribe(params, () => callback()),
    () => query.getStateOrNull(params) ?? null,
    () => null,
  );

  useEffect(() => {
    console.log(`Query [${query.options.queryName}]: state changed`, state);
  }, [state]);

  return useMemo(
    () =>
      ({
        data: state?.data ?? null,
        error: state?.error ?? null,
        isLoading: !!state?.isLoading,
        isError: !!state?.error,
      }) as UseQueryResult<QueryType>,
    [state],
  );
};
