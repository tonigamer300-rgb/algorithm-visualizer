import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// The base path must match the GitHub repository name so that assets resolve
// correctly when the site is served from https://<user>.github.io/<repo>/.
export default defineConfig({
  base: '/algorithm-visualizer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    // Split large, rarely-changing dependencies into their own chunks so the
    // main bundle stays small and lazily-loaded routes load quickly.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          prism: ['prismjs'],
        },
      },
    },
  },
});
