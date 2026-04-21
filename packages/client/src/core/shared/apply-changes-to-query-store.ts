import { produce } from 'immer';
import { QueryState, QueryStore } from '../query/query-store';
import { QueryUpdateHooksMap } from '../query/query.types';

/**
 * Shape of a single entity's change bundle, mirroring what mutations
 * emit and what subscriptions deliver. Each bucket is optional because
 * both mutation `changes` and `subscription:batch` rows may only touch
 * a subset of operations.
 */
export type EntityChanges = {
  inserts?: any[];
  updates?: any[];
  upserts?: any[];
  deletes?: any[];
};

export type ChangesByEntity = Record<string, EntityChanges>;

/**
 * Walk an `{ [entity]: { inserts, updates, upserts, deletes } }` bundle
 * and run every registered `query.updateOnChange` hook against the
 * query store. Shared between `Mutation` (post-response) and
 * `Subscription` (on every `subscription:batch`) so both paths update
 * cached queries identically.
 *
 * The implementation matches the previous `Mutation.triggerQueryUpdateHooks`
 * behaviour one-for-one: produce a single coalesced `results` map
 * keyed by `queryHashKey`, then commit it back to the store in one
 * `setState` call so React subscribers only re-render once per batch.
 */
export const applyChangesToQueryStore = (options: {
  queryStore: QueryStore;
  queryUpdateHooks: QueryUpdateHooksMap;
  changes: ChangesByEntity;
}): void => {
  const { queryStore, queryUpdateHooks, changes } = options;

  const registeredQueryStates = queryStore.getState().state;

  const results: Record<string, any> = {};

  const handleChanges = (changeModelName: string, changeType: 'insert' | 'update' | 'upsert' | 'delete', entityChanges: any[]) => {
    const hooksForModel = queryUpdateHooks[changeModelName];

    if (!hooksForModel) return;

    for (const queryName in hooksForModel) {
      const entry = hooksForModel[queryName];
      
      if (!entry) continue;

      const { hooks } = entry;

      const queryStates = Object.values(registeredQueryStates).filter((query: QueryState) => query.queryName === queryName);

      for (const change of entityChanges) {
        for (const { data, queryHashKey, params } of queryStates) {
          const insertHook = hooks.onInsert;
          const updateHook = hooks.onUpdate;
          const upsertHook = hooks.onUpsert;
          const deleteHook = hooks.onDelete;

          const draftData = results[queryHashKey] ?? data;

          results[queryHashKey] = produce(draftData, (draft) => {
            if (changeType === 'insert' && insertHook) {
              const newData = insertHook({
                draft: draft as never,
                change,
                params: params,
              });

              if (newData !== undefined) {
                draft = newData;
              }
            }

            if (changeType === 'update' && updateHook !== undefined) {
              const newData = updateHook({
                draft: draft as never,
                change,
                params,
              });

              if (newData !== undefined) {
                draft = newData;
              }
            }

            if (changeType === 'delete' && deleteHook !== undefined) {
              const newData = deleteHook({
                draft: draft as never,
                change,
                params,
              });

              if (newData !== undefined) {
                draft = newData;
              }
            }

            if (changeType === 'upsert' && upsertHook !== undefined) {
              const newData = upsertHook({
                draft: draft as never,
                change,
                params,
              });

              if (newData !== undefined) {
                draft = newData;
              }
            }

            return draft;
          });
        }
      }
    }
  };

  for (const modelName of Object.keys(changes)) {
    const modelChanges = changes[modelName];

    if (modelChanges?.inserts) {
      handleChanges(modelName, 'insert', modelChanges.inserts);
    }

    if (modelChanges?.updates) {
      handleChanges(modelName, 'update', modelChanges.updates);
    }

    if (modelChanges?.upserts) {
      handleChanges(modelName, 'upsert', modelChanges.upserts);
    }

    if (modelChanges?.deletes) {
      handleChanges(modelName, 'delete', modelChanges.deletes);
    }
  }

  const existingState = queryStore.getState().state;

  const nextState = produce(existingState, (draftState) => {
    for (const hashKey in results) {
      if (draftState[hashKey]) {
        draftState[hashKey].data = results[hashKey];
      }
    }
  });

  queryStore.setState({
    state: nextState,
  });
};
