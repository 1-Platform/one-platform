const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: {
    'op-nav': path.join(__dirname, 'src', 'nav', 'nav'),
    'op-feedback-panel': path.join(__dirname, 'src', 'feedback-panel', 'feedback')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
        query: {
          presets: [
            ['@babel/env', {
              targets: {
                browsers: 'last 2 chrome versions'
              }
            }]
          ]
        }
      },
      {
        test: /\.css$/i,
        use: ['to-string-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.html', '.css']
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: './src/assets', to: './assets/' },
      { from: './src/default.html', to: './[name].[ext]' }
    ], { copyUnmodified: true }),
    new MinifyPlugin()
  ],
  devtool: 'source-map'
};
