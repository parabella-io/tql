# Integrations

The core [`Client`](/client/client) API is framework-agnostic: query and mutation objects, stores, and transports work in any JavaScript environment.

This section documents **UI framework adapters**—bindings that subscribe those stores to component lifecycles and re-render when data changes.

## Available integrations

- **[React](/client/integrations/react)** — hooks for queries, mutations, paged queries, and infinite paged queries.

Additional frameworks may be added over time; the patterns in the React guide (subscribe via `useSyncExternalStore`, no global provider required) are the model other adapters follow.
