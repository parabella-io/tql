// Re-exports the canonical `ClientSchema` constraint from the shared
// surface. Kept as a thin alias so internal modules can continue to import
// from `'../client-schema.js'` while the type itself lives in
// `./shared/client-schema.js` (and is re-exported from `@tql/server/shared`).
export type { ClientSchema } from './shared/client-schema.js';
