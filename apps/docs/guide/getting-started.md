# Getting Started

::: warning Experimental
`tql` is pre-release. Package APIs, generated schema shape, and the wire protocol may change before v1.
:::

Install the server and client packages:

```sh
pnpm add @tql/server @tql/client zod
```

If your API and web app are separate packages, install only what each package needs:

```sh
pnpm add @tql/server zod
```

```sh
pnpm add @tql/client
```

Next, read [Concepts](/guide/concepts) for the framework model.
