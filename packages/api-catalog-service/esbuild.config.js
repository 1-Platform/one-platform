const { build } = require('esbuild');
const graphqlLoaderPlugin = require('@luckycatfactory/esbuild-graphql-loader').default;
const copyStaticFiles = require('esbuild-copy-static-files');

build({
  entryPoints: ['./src/index.ts'],
  minify: true,
  platform: 'node',
  bundle: true,
  target: 'node16',
  outfile: 'dist/index.js',
  plugins: [
    graphqlLoaderPlugin(),
    copyStaticFiles({
      src: './src/subscriptions/templates',
      dest: './dist/templates',
    }),
  ],
})
  .catch(() => {
    process.exit(1);
  })
  .then(() => 'Finished bundling');
