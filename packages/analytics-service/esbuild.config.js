const { build } = require('esbuild');
const graphqlLoaderPlugin = require('@luckycatfactory/esbuild-graphql-loader').default;

build({
  entryPoints: ['./src/index.ts'],
  minify: true,
  platform: 'node',
  bundle: true,
  target: 'node16',
  outfile: 'dist/index.js',
  plugins: [graphqlLoaderPlugin()],
}).catch(() => {
  process.exit(1);
});
