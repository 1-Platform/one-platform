import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/feedback/',
  plugins: [
    viteCommonjs(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    react(),
    tsconfigPaths(),
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs([
          '@patternfly/react-styles',
          '@patternfly/react-tokens',
          '@patternfly/react-core',
        ]),
      ],
    },
  },
  server: {
    port: 5500,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
