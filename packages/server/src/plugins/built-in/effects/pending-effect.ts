export type PendingMutationEffect = {
  mutationName: string;
  run(): Promise<void>;
};
