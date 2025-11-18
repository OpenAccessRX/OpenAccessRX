import { defineConfig } from 'astro/config';

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
    }
});