import { produce } from 'immer';
import { FormattedTQLServerError } from '@tql/server';
import { ClientSchema, QueryUpdateHooksMap } from '../query/query.types';
import { ClientHandleMutation } from '../client/client';
import { createOptimisticUpdate } from '../query/query-optimistic-update';
import { createMutationHashKey, QueryStore } from '../query/query-store';
import { applyChangesToQueryStore } from '../shared/apply-changes-to-query-store';
import { MutationState, MutationStore } from './mutation.store';
import {
  DeleteHookParams,
  DeletePayload,
  InsertHookParams,
  InsertPayload,
  MutationPayloadFor,
  MutationNameFor,
  MutationOptions,
  OptimisticQueryStorePublic,
  SingleMutationChangesForName,
  UpdateHookParams,
  UpdatePayload,
  UpsertHookParams,
  UpsertPayload,
} from './mutation.types';

type MutationConstructor<
  S extends ClientSchema,
  MutationName extends MutationNameFor<S>,
  MutationInput extends MutationPayloadFor<S, MutationName>,
  MutationParams extends Record<string, any>,
> = {
  queryStore: QueryStore;
  queryUpdateHooks: QueryUpdateHooksMap;
  mutationStore: MutationStore;
  mutationHandler: ClientHandleMutation<S>;
  mutationName: MutationName;
  mutationOptions: MutationOptions<S, MutationName, MutationInput, MutationParams>;
};

export class Mutation<
  S extends ClientSchema,
  MutationName extends MutationNameFor<S>,
  MutationInput extends MutationPayloadFor<S, MutationName>,
  MutationParams extends Record<string, any>,
> {
  private readonly queryStore: QueryStore;

  private readonly queryUpdateHooks: QueryUpdateHooksMap;

  private readonly mutationName: MutationName;

  private readonly mutationKey: string;

  private readonly mutationStore: MutationStore;

  private readonly mutationHandler: ClientHandleMutation<S>;

  private readonly setState: (mutationKey: string, mutationState: MutationState) => void;

  private readonly mutation: (input: MutationParams) => MutationInput;

  private readonly onInsert?: (params: InsertHookParams<MutationInput, S, MutationName>) => void;

  private readonly onUpdate?: (params: UpdateHookParams<MutationInput, S, MutationName>) => void;

  private readonly onUpsert?: (params: UpsertHookParams<MutationInput, S, MutationName>) => void;

  private readonly onDelete?: (params: DeleteHookParams<MutationInput, S, MutationName>) => void;

  private readonly onOptimisticUpdate?: (params: { store: OptimisticQueryStorePublic; input: MutationInput }) => void | Promise<void>;

  constructor(readonly options: MutationConstructor<S, MutationName, MutationInput, MutationParams>) {
    const { queryStore, queryUpdateHooks, mutationStore, mutationHandler, mutationName, mutationOptions } = this.options;

    this.queryStore = queryStore;

    this.queryUpdateHooks = queryUpdateHooks;

    this.mutationStore = mutationStore;

    this.setState = this.mutationStore.getState().setState;

    this.mutationHandler = mutationHandler;

    this.mutationName = mutationName;

    this.mutationKey = mutationOptions.mutationKey;

    this.mutation = mutationOptions.mutation;

    if (mutationOptions?.onInsert) {
      this.onInsert = mutationOptions.onInsert;
    }

    if (mutationOptions?.onUpdate) {
      this.onUpdate = mutationOptions.onUpdate;
    }

    if (mutationOptions?.onUpsert) {
      this.onUpsert = mutationOptions.onUpsert;
    }

    if (mutationOptions?.onDelete) {
      this.onDelete = mutationOptions.onDelete;
    }

    if (mutationOptions?.onOptimisticUpdate) {
      this.onOptimisticUpdate = mutationOptions.onOptimisticUpdate;
    }
  }

  public async execute(params: MutationParams): Promise<SingleMutationChangesForName<S, MutationName>> {
    const mutationInput = this.mutation(params);

    const mutationHashKey = this.getHashKey(params);

    const mutationState: MutationState = {
      isLoading: true,
      isSuccess: null,
      isError: false,
      mutationName: this.mutationName as string,
      mutationKey: this.mutationKey,
      mutationHashKey,
      mutationInput,
      changes: null,
      error: null,
    };

    const optimisticStore = createOptimisticUpdate(this.queryStore);

    const optimisticStorePublic: OptimisticQueryStorePublic = {
      getAll: optimisticStore.getAll,
      get: optimisticStore.get,
      where: optimisticStore.where,
    };

    let hasOptimisticSnapshot = false;

    try {
      this.setState(mutationHashKey, mutationState);

      if (this.onOptimisticUpdate) {
        optimisticStore.start();

        hasOptimisticSnapshot = true;

        await this.onOptimisticUpdate({
          store: optimisticStorePublic,
          input: mutationInput,
        });

        optimisticStore.commit();
      }

      const response = await this.mutationHandler({
        [this.mutationName]: {
          input: mutationInput,
        },
      } as any);

      if (!response) throw new Error('Invalid response from mutation');

      const mutationResponse = response[this.mutationName];

      if (!mutationResponse) throw new Error('Invalid response from mutation');

      const { changes, error } = mutationResponse;

      if (error && Object.keys(error).length > 0) {
        throw error;
      }

      this.setState(mutationHashKey, {
        ...mutationState,
        changes,
        error,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      this.triggerMutationHooks(params, changes);

      this.triggerQueryUpdateHooks(changes);

      return changes as SingleMutationChangesForName<S, MutationName>;
    } catch (error) {
      console.error(error);

      if (hasOptimisticSnapshot) {
        optimisticStore.rollback();
      }

      const formattedError: FormattedTQLServerError =
        (error as any)?.type && (error as any)?.details
          ? (error as FormattedTQLServerError)
          : ({
              type: 'unknown',
              details: {
                message: 'Unknown error',
                fullError: error,
              },
            } as FormattedTQLServerError);

      this.setState(mutationHashKey, {
        ...mutationState,
        error: formattedError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      throw formattedError;
    }
  }

  public getState(params: MutationParams): MutationState {
    const { state } = this.mutationStore.getState();

    const mutationHashKey = this.getHashKey(params);

    const mutationState = state[mutationHashKey];

    if (!mutationState) {
      throw new Error(`Mutation ${this.mutationKey} has not been executed yet`);
    }

    return mutationState as MutationState;
  }

  public getStateOrNull(params: MutationParams): MutationState | null {
    const { state } = this.mutationStore.getState();

    const mutationHashKey = this.getHashKey(params);

    const mutationState = state[mutationHashKey];

    if (!mutationState) {
      return null;
    }

    return mutationState as MutationState | null;
  }

  public subscribe = (params: MutationParams, callback: (mutationState: MutationState) => void) => {
    const mutationHashKey = this.getHashKey(params);

    return this.mutationStore.subscribe((state) => {
      const mutationState = state[mutationHashKey];

      if (mutationState) {
        callback(mutationState);
      }
    });
  };

  public subscribeAll = (callback: () => void) => {
    return this.mutationStore.subscribe(() => {
      callback();
    });
  };

  private triggerMutationHooks(
    params: MutationParams,
    changes: Record<
      string,
      {
        inserts?: any[];
        updates?: any[];
        upserts?: any[];
        deletes?: { id: string }[];
      }
    >,
  ) {
    const optimisticStore = createOptimisticUpdate(this.queryStore);

    const mutationInput = this.mutation(params);

    for (const modelName of Object.keys(changes)) {
      const modelChanges = changes[modelName];

      if (!modelChanges) {
        continue;
      }

      if (this.onInsert) {
        for (const inserted of modelChanges.inserts ?? []) {
          this.onInsert({
            store: optimisticStore,
            input: mutationInput,
            inserted: { [modelName]: inserted } as InsertPayload<SingleMutationChangesForName<S, MutationName>>,
          });
        }
      }

      if (this.onUpdate) {
        for (const updated of modelChanges.updates ?? []) {
          this.onUpdate({
            store: optimisticStore,
            input: mutationInput,
            updated: { [modelName]: updated } as UpdatePayload<SingleMutationChangesForName<S, MutationName>>,
          });
        }
      }

      if (this.onDelete) {
        for (const deleted of modelChanges.deletes ?? []) {
          this.onDelete({
            store: optimisticStore,
            input: mutationInput,
            deleted: { [modelName]: deleted } as DeletePayload<SingleMutationChangesForName<S, MutationName>>,
          });
        }
      }

      if (this.onUpsert) {
        for (const upserted of modelChanges.upserts ?? []) {
          this.onUpsert({
            store: optimisticStore,
            input: mutationInput,
            upserted: { [modelName]: upserted } as UpsertPayload<SingleMutationChangesForName<S, MutationName>>,
          });
        }
      }
    }

    const commit = optimisticStore.commit();

    const existingState = this.queryStore.getState().state;

    const nextState = produce(existingState, (draftState) => {
      for (const hashKey in commit) {
        if (draftState[hashKey]) {
          draftState[hashKey].data = commit[hashKey];
        }
      }
    });

    this.queryStore.setState({
      state: nextState,
    });
  }

  private triggerQueryUpdateHooks(
    changes: Record<
      string,
      {
        inserts?: any[];
        updates?: any[];
        upserts?: any[];
        deletes?: any[];
      }
    >,
  ) {
    applyChangesToQueryStore({
      queryStore: this.queryStore,
      queryUpdateHooks: this.queryUpdateHooks,
      changes,
    });
  }

  public getHashKey = (params: MutationParams) => {
    return createMutationHashKey(this.mutationKey, this.mutation(params));
  };
}

export const singleMutationInput = <K extends string, V>(key: K, value: V): { [P in K]: V } => {
  return { [key]: value } as { [P in K]: V };
};
