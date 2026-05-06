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
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Server', link: '/server/' },
      { text: 'Client', link: '/client/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
      },
      {
        text: 'Server',
        items: [{ text: 'Overview', link: '/server/' }],
      },
      {
        text: 'Client',
        items: [{ text: 'Overview', link: '/client/' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/parabella-io/tql' }],
    editLink: {
      pattern: 'https://github.com/parabella-io/tql/edit/docs/apps/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
