import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/'; // fallback to root
  const PORT = 3000; // number

  return {
    server: {
      open: true,
      port: PORT,
    },
    define: {
      global: 'window',
    },
    resolve: {
      alias: [],
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        less: { charset: false },
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => atRule.remove(),
            },
          },
        ],
      },
    },
    base: API_URL, // '/' if deploying at root, '/subfolder/' if deploying under subfolder
    plugins: [react(), jsconfigPaths()],
    // Removed experimental.renderBuiltUrl entirely
  };
});