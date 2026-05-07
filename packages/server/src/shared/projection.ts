/**
 * Schema-agnostic projection helpers shared between codegen-emitted schema
 * modules, the server runtime, and `@parabella-io/tql-client`.
 *
 * Everything in this file is pure type machinery — no runtime dependencies.
 * Both the codegen output and the client import these helpers directly so
 * the projection rules live in exactly one place.
 */

export type WithId<T> = { id: string } & Omit<T, 'id'>;

export type MutationOp = 'inserts' | 'updates' | 'upserts' | 'deletes';

export type IncludeKind = 'single' | 'singleNullable' | 'many';

/**
 * Brand interface that every codegen-emitted include node extends. Carries
 * the include arity (`Kind`) and target entity shape (`Target`) as phantom
 * generics so {@link ResolveIncludeNode} can recover both without walking
 * through `QueryRegistry`.
 */
export interface IncludeNodeMarker<Kind extends IncludeKind, Target> {
  readonly __kind?: Kind;
  readonly __target?: Target;
}

export type ExtractSelect<Node> = [NonNullable<Node>] extends [{ select: infer S }] ? S : {};

export type ExtractInclude<Node> = [NonNullable<Node>] extends [{ include?: infer I }] ? Exclude<I, undefined> : undefined;

export type GetNestedIncludeMap<NodeDef> = NodeDef extends { include?: infer M } ? NonNullable<M> : never;

export type Selected<Entity, Sel> = [Sel] extends [Record<string, any>]
  ? { [K in (Extract<keyof Sel, keyof Entity> | 'id') & keyof Entity]: Entity[K] }
  : { [K in 'id' & keyof Entity]: Entity[K] };

export type IncludeProjection<UserInc, ParentMap> = [UserInc] extends [Record<string, any>]
  ? [ParentMap] extends [Record<string, any>]
    ? { [K in keyof UserInc & keyof ParentMap]: ResolveIncludeNode<UserInc[K], NonNullable<ParentMap[K]>> }
    : {}
  : {};

export type ResolveIncludeNode<UserNode, NodeDef> =
  NodeDef extends IncludeNodeMarker<infer Kind, infer Target>
    ? Target extends object
      ? Selected<Target, ExtractSelect<UserNode>> &
          IncludeProjection<ExtractInclude<UserNode>, GetNestedIncludeMap<NodeDef>> extends infer Projection
        ? Kind extends 'many'
          ? Projection[]
          : Kind extends 'singleNullable'
            ? Projection | null
            : Projection
        : never
      : never
    : never;

/**
 * Strip the legacy entity `__model` brand recursively for callers that still
 * consume older generated schemas.
 */
export type Remove__Model<T> =
  T extends Array<infer U>
    ? Array<Remove__Model<U>>
    : T extends object
      ? T extends Function
        ? T
        : { [K in keyof T as K extends '__model' ? never : K]: Remove__Model<T[K]> }
      : T;
