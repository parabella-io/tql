# Logging

```ts
import { loggingPlugin } from '@parabella-io/tql-server/plugins/built-in/logging';

loggingPlugin({ slowQueryMs: 500 });
```

Emits structured request lifecycle logs through the server `logger`. Use `slowQueryMs` to flag expensive resolver trees.

Place this plugin after [Request ID](/plugins/built-in/request-id) so log lines can include the id.
