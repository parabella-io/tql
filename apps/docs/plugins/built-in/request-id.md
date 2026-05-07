# Request ID

```ts
import { requestIdPlugin } from '@parabella-io/tql-server/plugins/built-in/request-id';

requestIdPlugin({ header: 'x-request-id' });
```

Reads the configured header when present, otherwise generates a request id. The value is stored on plugin context and copied into schema context so resolvers and other plugins can log or trace consistently.

Register this plugin **before** logging or OpenTelemetry so downstream plugins see the id.
