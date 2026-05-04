import type { IncludeNode, QueryNode } from './plan.js';

export type AllowedShape = {
  select?: true | Record<string, true>;
  include?: Record<string, AllowedInclude>;
  paging?: { maxTake: number };
};

export type AllowedInclude = true | AllowedShape;

export type AllowedShapesMap = Record<string, AllowedShape>;

export type ShapeSubsetRejectionReason =
  | 'unknown-query'
  | 'unknown-include'
  | 'unknown-select-key'
  | 'terminal-violated'
  | 'select-all-not-allowed'
  | 'paging-take-exceeded';

export type ShapeSubsetResult =
  | { allowed: true }
  | {
      allowed: false;
      queryName: string;
      path: string;
      reason: ShapeSubsetRejectionReason;
    };

export const assertQueryNodeAllowed = (node: QueryNode, allowed: AllowedShape | undefined): ShapeSubsetResult => {
  if (!allowed) {
    return {
      allowed: false,
      queryName: node.queryName,
      path: node.queryName,
      reason: 'unknown-query',
    };
  }

  return assertShapeAllowed(node, allowed, node.queryName, node.queryName);
};

const assertShapeAllowed = (node: QueryNode | IncludeNode, allowed: AllowedShape, queryName: string, path: string): ShapeSubsetResult => {
  const selectResult = assertSelectAllowed(node, allowed, queryName, `${path}.select`);

  if (!selectResult.allowed) {
    return selectResult;
  }

  if ('pagingInfo' in node && node.pagingInfo && allowed.paging?.maxTake !== undefined && node.pagingInfo.take > allowed.paging.maxTake) {
    return {
      allowed: false,
      queryName,
      path: `${path}.paging.take`,
      reason: 'paging-take-exceeded',
    };
  }

  for (const include of node.includes) {
    const allowedInclude = allowed.include?.[include.includeName];

    const includePath = `${path}.include.${include.includeName}`;

    if (allowedInclude === undefined) {
      return {
        allowed: false,
        queryName,
        path: includePath,
        reason: 'unknown-include',
      };
    }

    if (allowedInclude === true) {
      if (include.includes.length > 0) {
        return {
          allowed: false,
          queryName,
          path: includePath,
          reason: 'terminal-violated',
        };
      }

      continue;
    }

    const result = assertShapeAllowed(include, allowedInclude, queryName, includePath);

    if (!result.allowed) {
      return result;
    }
  }

  return { allowed: true };
};

const assertSelectAllowed = (node: QueryNode | IncludeNode, allowed: AllowedShape, queryName: string, path: string): ShapeSubsetResult => {
  if (node.selectAll && allowed.select !== true) {
    return {
      allowed: false,
      queryName,
      path,
      reason: 'select-all-not-allowed',
    };
  }

  if (allowed.select === true || node.selectKeys.length === 0) {
    return { allowed: true };
  }

  const allowedKeys = allowed.select ?? {};

  for (const key of node.selectKeys) {
    if (allowedKeys[key] !== true) {
      return {
        allowed: false,
        queryName,
        path: `${path}.${key}`,
        reason: 'unknown-select-key',
      };
    }
  }

  return { allowed: true };
};
