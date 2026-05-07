# OpenTelemetry

```ts
import { otelPlugin } from '@parabella-io/tql-server/plugins/built-in/otel';

otelPlugin({ tracerProvider, meterProvider });
```

Creates root request spans and child resolver spans. `tql` does not configure exporters or global SDK setup — your application supplies the providers from its OpenTelemetry bootstrap.

Use when you already run OpenTelemetry and want resolver-level visibility without instrumenting every handler by hand.
