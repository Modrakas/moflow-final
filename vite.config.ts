import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      '@':       path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@data':   path.resolve(__dirname, './src/data'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Makes abstracts globally available in every .scss file
        // without needing to @use them manually each time
        additionalData: `@use "@styles/abstracts" as *;`,
      },
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});