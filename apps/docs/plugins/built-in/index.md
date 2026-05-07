# Built-in plugins

Built-in plugins are published under `@parabella-io/tql-server/plugins/built-in/*`. Each has its own page in this section.

## Recommended registration order

```ts
plugins: [
  requestIdPlugin(),
  loggingPlugin({ slowQueryMs: 500 }),
  securityPlugin({ /* policies */ }),
  rateLimitPlugin({ /* limiter */ }),
  cachePlugin({ /* optional */ }),
  otelPlugin({ /* optional */ }),
  effectsPlugin({ queue }),
];
```

Put **request ID** early so logging and tracing can include it. Register **security** before expensive application work. Add **cache** and **OpenTelemetry** only when you need them.

## Pages

| Plugin | Import path |
| --- | --- |
| [Request ID](/plugins/built-in/request-id) | `@parabella-io/tql-server/plugins/built-in/request-id` |
| [Logging](/plugins/built-in/logging) | `@parabella-io/tql-server/plugins/built-in/logging` |
| [OpenTelemetry](/plugins/built-in/otel) | `@parabella-io/tql-server/plugins/built-in/otel` |
| [Security](/plugins/built-in/security) | `@parabella-io/tql-server/plugins/built-in/security` |
| [Rate limit](/plugins/built-in/rate-limit) | `@parabella-io/tql-server/plugins/built-in/rate-limit` |
| [Cache](/plugins/built-in/cache) | `@parabella-io/tql-server/plugins/built-in/cache` |
| [Effects](/plugins/built-in/effects) | `@parabella-io/tql-server/plugins/built-in/effects` |

For writing your own plugins, see [Authoring](/plugins/authoring).
