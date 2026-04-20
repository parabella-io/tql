export type EffectMeta = {
  mutationName: string;
};

export type EffectTask = () => Promise<void> | void;

export interface EffectQueue {
  enqueue(task: EffectTask, meta: EffectMeta): void;
  drain(): Promise<void>;
}
