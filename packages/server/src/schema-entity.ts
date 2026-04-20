export type SchemaEntity<T extends Record<string, any>> = T & {
  id: string;
};
