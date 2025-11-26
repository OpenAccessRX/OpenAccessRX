import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  server: {
      port: 4321,
      host: true,
  },

  vite: {
      server: {
          proxy: {
              '/api': 'http://localhost:5000'

          }
      }
  },

  integrations: [svelte()]
});