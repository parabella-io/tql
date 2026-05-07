import type { FormattedTQLServerError, ResolvedPagingInfoShape } from '@parabella-io/tql-server/shared';
import type { ClientSchema, QueryDataFor, QueryInputFor, QueryNameFor, QueryResponse, SingleQueryRequestFor } from '../query/query.types';
import type { TransportKey } from '../transports';
import type { PagingInfoIn, PagedQueryChunk } from './paged-query-store';

export type { PagingInfoIn, PagedQueryChunk };

export type PagedQueryNameFor<S extends ClientSchema> = {
  [K in QueryNameFor<S>]: S['QueryRegistry'][K] extends { kind: 'many'; paginated: true } ? K : never;
}[QueryNameFor<S>];

export type PagedQueryOptions<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
  QueryParams extends Record<string, any>,
> = {
  queryKey: string;
  query: (params: QueryParams, pagingInfo: PagingInfoIn) => QueryInput;
  pageSize: number;
  staleTimeInMs?: number;
  isEnabled?: boolean;
  transport?: TransportKey;
};

export type PagedQueryDataFor<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
> = QueryDataFor<S, QueryName, QueryInput>;

export type PagedQueryEntityFor<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
> = [PagedQueryDataFor<S, QueryName, QueryInput>] extends [never]
  ? any
  : PagedQueryDataFor<S, QueryName, QueryInput> extends (infer Entity)[]
    ? Entity
    : never;

export type PagedQueryResponse<
  S extends ClientSchema,
  QueryName extends PagedQueryNameFor<S>,
  QueryInput extends QueryInputFor<S, QueryName>,
> = QueryResponse<S, SingleQueryRequestFor<S, QueryName, QueryInput>>;

export type PagedQueryResult<Entity> = {
  pages: PagedQueryChunk<Entity>[];
  pageIndex: number;
  pagingInfo: ResolvedPagingInfoShape | null;
  error: FormattedTQLServerError | null;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
