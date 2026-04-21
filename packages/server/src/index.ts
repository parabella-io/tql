export { Schema } from './schema.js';

export { type SchemaEntity } from './schema-entity.js';

export { type ClientSchema } from './client-schema.js';

export { Server, type ServerOptions, type EffectsConfig, type SubscriptionsConfig } from './server/server.js';
export { createFastifyHttpAdapter } from './server/adapters/http/fastify.js';
export type { HttpAdapter, HttpHandler, HttpHandlerHooks, SseHandler, SseStream } from './server/adapters/http/http-adapter.js';
export {
  createWsWebSocketAdapter,
  type WebSocketAdapter,
  type WebSocketConnection,
  type WsLikeServer,
  type WsLikeSocket,
} from './server/adapters/websocket/index.js';

export {
  InMemoryEffectQueue,
  type InMemoryEffectQueueOptions,
  type EffectLogger,
  type EffectQueue,
  type EffectMeta,
  type EffectTask,
} from './effects/index.js';

export {
  InMemoryBackbone,
  type Backbone,
  type BackboneListener,
  type BackboneMessage,
  type EmittedChange,
  type EmittedChanges,
  type InMemoryBackboneLogger,
  type InMemoryBackboneOptions,
} from './backbone/index.js';

export {
  Subscription,
  SubscriptionRegistry,
  SubscriptionResolver,
  type SubscribeOptions,
  type SubscribeResult,
  type SubscribeToMap,
  type SubscribedChange,
  type SubscribedChangeOperation,
  type SubscriptionOptions,
  type SubscriptionResolverOptions,
  type RegisteredSubscriber,
  type SubscriberMessage,
  type SubscriberChangeOperation,
  type SubscriberBatchRow,
  type SubscriberBatchRows,
  type SubscriberBatchMatch,
} from './subscription/index.js';

export * from './query/index.js';
export * from './mutation/index.js';

export { type FormattedTQLServerError, TQLServerErrorType } from './errors.js';

export * from './codegen/index.js';
