// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://portfolio-kevin.vercel.app', // KEVIN-TODO: dominio real al hacer deploy
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
});
