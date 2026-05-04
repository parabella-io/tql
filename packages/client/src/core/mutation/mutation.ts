import { FormattedTQLServerError } from '@tql/server';
import { ClientSchema } from '../query/query.types';
import { ClientHandleMutation } from '../client/client';
import { createOptimisticUpdate } from '../query/query-optimistic-update';
import { createMutationHashKey, QueryStore } from '../query/query-store';
import { MutationState, MutationStore } from './mutation.store';
import {
  MutationPayloadFor,
  MutationNameFor,
  MutationOptions,
  MutationOutputFor,
  OptimisticQueryStorePublic,
  OnSuccessHookParams,
} from './mutation.types';

type MutationConstructor<
  S extends ClientSchema,
  MutationName extends MutationNameFor<S>,
  MutationInput extends MutationPayloadFor<S, MutationName>,
  MutationParams extends Record<string, any>,
> = {
  queryStore: QueryStore;
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

  private readonly mutationName: MutationName;

  private readonly mutationKey: string;

  private readonly mutationStore: MutationStore;

  private readonly mutationHandler: ClientHandleMutation<S>;

  private readonly setState: (mutationKey: string, mutationState: MutationState) => void;

  private readonly mutation: (input: MutationParams) => MutationInput;

  private readonly onOptimisticUpdate?: (params: { store: OptimisticQueryStorePublic; input: MutationInput }) => void | Promise<void>;

  private readonly onSuccess?: (params: OnSuccessHookParams<MutationInput, MutationOutputFor<S, MutationName>>) => void | Promise<void>;

  constructor(readonly options: MutationConstructor<S, MutationName, MutationInput, MutationParams>) {
    const { queryStore, mutationStore, mutationHandler, mutationName, mutationOptions } = this.options;

    this.queryStore = queryStore;
    this.mutationStore = mutationStore;
    this.setState = this.mutationStore.getState().setState;
    this.mutationHandler = mutationHandler;
    this.mutationName = mutationName;
    this.mutationKey = mutationOptions.mutationKey;
    this.mutation = mutationOptions.mutation;

    if (mutationOptions?.onOptimisticUpdate) {
      this.onOptimisticUpdate = mutationOptions.onOptimisticUpdate;
    }

    if (mutationOptions?.onSuccess) {
      this.onSuccess = mutationOptions.onSuccess;
    }
  }

  public async execute(params: MutationParams): Promise<MutationOutputFor<S, MutationName>> {
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
      output: null,
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

      const { data, error } = mutationResponse;

      if (error && Object.keys(error).length > 0) {
        throw error;
      }

      const output = data as MutationOutputFor<S, MutationName>;

      this.setState(mutationHashKey, {
        ...mutationState,
        output,
        error,
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      if (this.onSuccess) {
        const successStore = createOptimisticUpdate(this.queryStore);
        const successStorePublic: OptimisticQueryStorePublic = {
          getAll: successStore.getAll,
          get: successStore.get,
          where: successStore.where,
        };

        successStore.start();

        await this.onSuccess({
          store: successStorePublic,
          input: mutationInput,
          output,
        });

        successStore.commit();
      }

      return output;
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

    return this.mutationStore.subscribe(
      (state) => state.state[mutationHashKey],
      (currentState) => {
        if (currentState) {
          callback(currentState);
        }
      },
    );
  };

  public getHashKey = (params: MutationParams) => {
    return createMutationHashKey(this.mutationKey, this.mutation(params));
  };
}

export const singleMutationInput = <K extends string, V>(key: K, value: V): { [P in K]: V } => {
  return { [key]: value } as { [P in K]: V };
};
