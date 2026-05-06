import { createHash } from 'node:crypto';

import type { IncludeNode, QueryNode } from '../../../request-plan/plan.js';

export type CacheKeyParts = {
  keyPrefix?: string;
  path: string;
  query?: unknown;
  pagingInfo?: unknown;
  shape?: unknown;
  scope?: string[];
  parentId?: string;
};

export type ExternalFieldCacheKeyParts = {
  keyPrefix?: string;
  path: string;
  entityId: string;
  scope?: string[];
};

export const buildQueryKey = (parts: CacheKeyParts): string => {
  return [
    parts.keyPrefix ?? '',
    parts.path,
    `q=${hashStable(parts.query ?? {})}`,
    `p=${hashStable(parts.pagingInfo ?? null)}`,
    `shape=${hashStable(parts.shape ?? null)}`,
    `s=${normaliseScope(parts.scope).join(',')}`,
  ].join('|');
};

export const buildIncludePerParentKey = (parts: CacheKeyParts & { parentId: string }): string => {
  return [
    parts.keyPrefix ?? '',
    parts.path,
    `q=${hashStable(parts.query ?? {})}`,
    `parent=${parts.parentId}`,
    `s=${normaliseScope(parts.scope).join(',')}`,
  ].join('|');
};

export const buildExternalFieldKey = (parts: ExternalFieldCacheKeyParts): string => {
  return [
    parts.keyPrefix ?? '',
    parts.path,
    `entity=${parts.entityId}`,
    `s=${normaliseScope(parts.scope).join(',')}`,
  ].join('|');
};

export const buildPathTag = (path: string): string => `__path:${path}`;

export const buildQueryIdentityTag = (parts: { path: string; query?: unknown; pagingInfo?: unknown; scope?: string[] }): string => {
  return `__query:${parts.path}|q=${hashStable(parts.query ?? {})}|p=${hashStable(parts.pagingInfo ?? null)}|s=${normaliseScope(parts.scope).join(',')}`;
};

export const buildPathParentTag = (path: string, parentId: string): string => `__path:${path}|parent:${parentId}`;

export const buildPathEntityTag = (path: string, entityId: string): string => `__path:${path}|entity:${entityId}`;

export const withPathTags = (options: { path: string; tags?: string[]; parentId?: string; entityId?: string }): string[] => {
  const tags = new Set(options.tags ?? []);

  tags.add(buildPathTag(options.path));

  if (options.parentId !== undefined) {
    tags.add(buildPathParentTag(options.path, options.parentId));
  }

  if (options.entityId !== undefined) {
    tags.add(buildPathEntityTag(options.path, options.entityId));
  }

  return Array.from(tags);
};

export const buildQueryShape = (node: QueryNode | IncludeNode): unknown => {
  return {
    kind: node.kind,
    selectAll: node.selectAll,
    selectKeys: node.selectKeys.slice().sort(),
    includes: node.includes.map(buildIncludeShape).sort(compareShapeNames),
  };
};

const buildIncludeShape = (node: IncludeNode): unknown => ({
  includeName: node.includeName,
  kind: node.kind,
  query: node.query,
  selectAll: node.selectAll,
  selectKeys: node.selectKeys.slice().sort(),
  includes: node.includes.map(buildIncludeShape).sort(compareShapeNames),
});

export const hashStable = (value: unknown): string => createHash('sha1').update(stableStringify(value)).digest('hex');

export const stableStringify = (value: unknown): string => {
  if (value === undefined) {
    return '"__undefined__"';
  }

  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const object = value as Record<string, unknown>;

  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
    .join(',')}}`;
};

export const normaliseScope = (scope: string[] | undefined): string[] => Array.from(new Set(scope ?? [])).sort();

const compareShapeNames = (a: unknown, b: unknown): number => {
  const left = typeof a === 'object' && a !== null && 'includeName' in a ? String((a as { includeName: unknown }).includeName) : '';
  const right = typeof b === 'object' && b !== null && 'includeName' in b ? String((b as { includeName: unknown }).includeName) : '';

  return left.localeCompare(right);
};
