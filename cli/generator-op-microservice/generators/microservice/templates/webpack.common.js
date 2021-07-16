const nodeExternals = require( 'webpack-node-externals' );
const path = require( 'path' );
const Dotenv = require( 'dotenv-webpack' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const NodemonPlugin = require( 'nodemon-webpack-plugin' );

let envPath;

if ( !process.env.NODE_ENV || process.env.NODE_ENV === 'local' ) {
  envPath = '.env';
} else if ( process.env.NODE_ENV === 'test' ) {
  envPath = 'e2e/.test.env';
}

module.exports = {
  entry: './service.ts',
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve( __dirname, 'dist' ),
  },
  target: 'node',
  externals: [ nodeExternals() ],
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv( {
      path: envPath
    } ),
    new NodemonPlugin( {
      watch: path.resolve( './dist' ),
      script: './dist/bundle.js',
      ext: 'js,ts,json',
    } ),
  ],
};
