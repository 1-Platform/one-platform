const path = require( 'path' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const Dotenv = require( 'dotenv-webpack' );
require( 'dotenv' ).config();

module.exports = ( _, { mode } ) => {
  const config = {
    mode: mode || 'development',
    entry: {
      'op-auth': path.join( __dirname, 'src', 'auth' ),
      'op-nav': path.join( __dirname, 'src', 'nav', 'nav' ),
      'op-feedback-panel': path.join( __dirname, 'src', 'feedback-panel', 'feedback' )
    },
    output: {
      path: path.join( __dirname, 'dist' ),
      publicPath: '/dist/',
      filename: '[name].js',
      chunkFilename: '[name].[id].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            path.resolve( __dirname, 'src' )
          ],
          exclude: [
            path.resolve( __dirname, 'node_modules' )
          ],
          loader: 'babel-loader',
        },
        {
          test: /\.css$/i,
          use: [ 'css-loader' ]
        }
      ]
    },
    resolve: {
      extensions: [ '.json', '.js', '.jsx', '.html', '.css' ]
    },
    plugins: [
      new Dotenv(),
      new CleanWebpackPlugin( {
        cleanOnceBeforeBuildPatterns: [ '*/' ]
      } ),
      new HtmlWebPackPlugin( {
        template: './src/default.html',
        filename: 'default.html',
        inject: false,
        ssiHostname: process.env.ASSETS_HOST || '.',
        cache: false,
      } ),
      new CopyPlugin( {
        patterns: [
          { from: './src/assets', to: './assets/' },
        ],
      } ),
    ],
    devtool: mode !== 'production' ? 'source-map' : undefined,
  };

  return config;
};
