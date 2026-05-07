# Introduction

`tql` is pre-release. Package boundaries, generated schema shape, and the wire protocol may change before a stable v1.

## Why tql exists

`tql` merges two ideas:

1. **GraphQL-style behaviour** — one typed graph on the server: selectable fields, nested relational includes, batched resolution, and room to express complex reads in a single round trip.
2. **tRPC-style developer experience** — no SDL, no separate client query language, and no hand-written DTO layer. You stay in TypeScript with **end-to-end type safety**: from server schema and resolvers through to the shapes you `select` / `include` on the client and the inputs and outputs of mutations.

Many applications want a **typed graph and nested reads** without taking on the full surface area of GraphQL — federation, SDL authoring, client query languages, partial responses with per-field errors, and the operational weight that often comes with it. `tql` is aimed at that gap: a smaller, TypeScript-native contract that still feels like an ORM over your API.

The server defines what is allowed; the client composes ordinary TypeScript objects that TypeScript checks against the generated contract.

## Features

- ⚠️ **Pre-release** — APIs are still stabilising toward v1; not positioned as production-hardened yet.
- 🧙 **Full static type safety** — Query and mutation names, arguments, projected data from `select` / `include`, mutation payloads, and common error envelopes flow through TypeScript with inference from the generated `ClientSchema`.
- 🎯 **All-or-nothing responses** — Each root query or mutation resolves to success or failure as a whole. There is no GraphQL-style mix of partial `data` and per-field errors: if the request succeeds, you can treat the returned payload as complete for what you asked for, without field-level nullability driven by resolver errors.
- 🐎 **Snappy DX** — Plain TypeScript on both sides. No GraphQL schema language and no client-side query DSL. The server emits a **type-only** `ClientSchema` (no generated runtime client you have to run a CLI for).
- 🍃 **Focused footprint** — The client is a small HTTP-oriented runtime plus local query/mutation state (no GraphQL client or query planner in the browser).
- 🐻 **New or brownfield** — Add `@parabella-io/tql-server` to an API and `@parabella-io/tql-client` to a UI without adopting a specific meta-framework.
- 🔋 **HTTP-first, adapter-friendly** — Shipped Fastify integration and an `HttpAdapter` shape so other Node HTTP stacks can wire the same `/query` and `/mutation` contract.
- ⚡ **Request batching** — One JSON body can carry multiple root queries or mutations (subject to your security and batch limits).
- 👀 **Learn by example** — Follow the [Concepts](/guide/concepts) walkthrough; the framework repo includes a full-stack reference app you can read alongside the docs.

## Documentation

For full documentation, guides, and examples, visit the [tql Documentation](https://parabella-io.github.io/tql/)
