import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'tql',
  description: 'A typed, end-to-end query layer that exposes your API directly as an ORM.',
  base: '/tql/',
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/tql/favicon.svg' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Server', link: '/server/' },
      { text: 'Client', link: '/client/' },
      { text: 'Plugins', link: '/plugins/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Concepts', link: '/guide/concepts' },
          ],
        },
      ],
      '/server/': [
        {
          text: 'Server',
          items: [
            { text: 'Overview', link: '/server/' },
            { text: 'Schema', link: '/server/schema' },
            {
              text: 'Models',
              link: '/server/models',
              items: [
                { text: 'Queries', link: '/server/queries' },
                { text: 'Includes', link: '/server/includes' },
                { text: 'External Fields', link: '/server/external-fields' },
              ],
            },
            { text: 'Mutations', link: '/server/mutations' },
            { text: 'Server Runtime', link: '/server/server-runtime' },
            { text: 'Codegen', link: '/server/codegen' },
          ],
        },
      ],
      '/client/': [
        {
          text: 'Client',
          items: [
            { text: 'Overview', link: '/client/' },
            { text: 'Client Setup', link: '/client/client' },
            { text: 'Queries', link: '/client/queries' },
            { text: 'Paged Queries', link: '/client/paged-queries' },
            { text: 'Mutations', link: '/client/mutations' },
            {
              text: 'Integrations',
              link: '/client/integrations/',
              items: [{ text: 'React', link: '/client/integrations/react' }],
            },
          ],
        },
      ],
      '/plugins/': [
        {
          text: 'Plugins',
          items: [
            { text: 'Overview', link: '/plugins/' },
            { text: 'Authoring', link: '/plugins/authoring' },
            {
              text: 'Built-in',
              link: '/plugins/built-in/',
              items: [
                { text: 'Overview', link: '/plugins/built-in/' },
                { text: 'Request ID', link: '/plugins/built-in/request-id' },
                { text: 'Logging', link: '/plugins/built-in/logging' },
                { text: 'OpenTelemetry', link: '/plugins/built-in/otel' },
                { text: 'Security', link: '/plugins/built-in/security' },
                { text: 'Rate limit', link: '/plugins/built-in/rate-limit' },
                { text: 'Cache', link: '/plugins/built-in/cache' },
                { text: 'Effects', link: '/plugins/built-in/effects' },
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/parabella-io/tql' }],
    editLink: {
      pattern: 'https://github.com/parabella-io/tql/edit/docs/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
