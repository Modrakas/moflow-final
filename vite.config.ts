import { defineConfig, createLogger } from 'vite';
import path from 'path';

const customLogger = createLogger();
const projectRoot = process.cwd();
const displayRoot = 'modrak/MoFlow Lab';

// Clean terminal output
const loggerError = customLogger.error;
customLogger.error = (msg, options) => {
  const cleanMsg = msg.replace(new RegExp(projectRoot, 'g'), displayRoot);
  loggerError(cleanMsg, options);
};

const loggerWarn = customLogger.warn;
customLogger.warn = (msg, options) => {
  const cleanMsg = msg.replace(new RegExp(projectRoot, 'g'), displayRoot);
  loggerWarn(cleanMsg, options);
};

export default defineConfig({
  customLogger: customLogger,
  root: './',
  resolve: {
    alias: {
      '@':        path.resolve(__dirname, './src'),
      '@styles':  path.resolve(__dirname, './src/styles'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@data':    path.resolve(__dirname, './src/data'),
    },
  },
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
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
  plugins: [
    {
      name: 'clean-error-overlay',
      // Intercepts the error before Vite sends it to the browser overlay
      transformIndexHtml(html) {
        return html;
      },
      configureServer(server) {
        server.ws.on('connection', (socket) => {
          const originalSend = socket.send.bind(socket);
          socket.send = (data) => {
            if (typeof data === 'string') {
              data = data.replace(new RegExp(projectRoot.replace(/\//g, '\\/'), 'g'), displayRoot);
            }
            return originalSend(data);
          };
        });
      },
    },
  ],
});