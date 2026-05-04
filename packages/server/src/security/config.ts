import type { AllowedShapesMap } from './shape-subset.js';
import type { ClientSchema } from '../client-schema.js';

export type SecurityLogger = {
  warn?: (...args: unknown[]) => void;
};

type SelectShape<Select> = true | { [K in keyof NonNullable<Select>]?: true };

type IncludeShapeMap<Include> = {
  [K in keyof NonNullable<Include>]?: true | AllowedShapeFromInput<NonNullable<NonNullable<Include>[K]>>;
};

type AllowedShapeFromInput<Input> = {
  select?: Input extends { select: infer Select } ? SelectShape<Select> : true;
  paging?: { maxTake: number };
} & (Input extends { include?: infer Include } ? { include?: IncludeShapeMap<Include> } : { include?: never });

export type AllowedShapesFor<S extends ClientSchema> = {
  [K in keyof S['QueryInputMap']]?: AllowedShapeFromInput<S['QueryInputMap'][K]>;
};

export const defineAllowedShapes = <S extends ClientSchema>(shapes: AllowedShapesFor<S>): AllowedShapesMap => shapes as AllowedShapesMap;

