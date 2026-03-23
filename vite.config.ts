import { defineConfig, createLogger } from 'vite';
import path from 'path';

const customLogger = createLogger();
const projectRoot = process.cwd(); // This gets your folder path

// Intercept error messages
const loggerError = customLogger.error;
customLogger.error = (msg, options) => {
  // Replace your full computer path with the "Lab" name
  const cleanMsg = msg.replace(new RegExp(projectRoot, 'g'), 'modrak/MoFlow Lab');
  loggerError(cleanMsg, options);
};
export default defineConfig({
  customLogger: customLogger,
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