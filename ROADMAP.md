### Roadmap

#### Upcoming Improvements

- **Async Effects After Mutations**
  - Execute side effect logic automatically and asynchronously after mutation responses.

- **Async Reactors via Message Buses**
  - Decouple heavy/slow processing into reactors backed by message queues. (Redis, BullMQ)

- **Real-Time Subscriptions**
  - Allow clients to subscribe to specific entity updates with advanced filtering, ensuring users receive only relevant live updates. (Redis)

- **Comprehensive Testing**
  - Implement full integration and end-to-end tests, plus strict type-checking, to enhance stability and code confidence.

- **Entity-Level Caching with Redis**
  - Explore implementing fine-grained caching for resolver entities (not just query responses), keyed by parent entities and params. (Redis) _Still evaluating technical feasibility._
