// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // KEVIN-TODO: dominio real al hacer deploy
  site: 'https://portfolio-kevin.vercel.app',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [sitemap()],
});
