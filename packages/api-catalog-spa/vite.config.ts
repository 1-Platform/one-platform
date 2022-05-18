import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/developers/api-catalog/',
  plugins: [
    viteCommonjs(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    react(),
    tsconfigPaths(),
  ],
  preview: { port: 5500 },
  build: {
    target: 'es2015',
    minify: 'terser',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        esbuildCommonjs([
          '@patternfly/react-styles',
          '@patternfly/react-tokens',
          '@patternfly/react-core',
        ]),
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
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
