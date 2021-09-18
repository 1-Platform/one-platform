const path = require('path');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require( 'copy-webpack-plugin' );
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPluginMinify = {
  collapseWhitespace: true,
  removeComments: false,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
};
const navBarConfig = `
  <script src="https://unpkg.com/@one-platform/opc-nav@0.0.1-prerelease/dist/opc-nav.js"></script>
  <script src="https://unpkg.com/@one-platform/opc-menu-drawer@0.0.1-prerelease/dist/opc-menu-drawer.js"></script>
  <script src="https://unpkg.com/@one-platform/opc-feedback@0.0.7-prerelease/dist/opc-feedback.js"></script>
  <script src="https://unpkg.com/@one-platform/opc-notification-drawer@0.0.1-prerelease/dist/opc-notification-drawer.js"></script>
  <script src="https://unpkg.com/@one-platform/opc-base@1.0.0-beta/dist/umd/opc-base.js"></script>
  <script src="https://unpkg.com/@one-platform/opc-base@1.0.0-beta/dist/umd/opc-provider.js"></script>
  <script>
    opcBase.configure({ apiBasePath: '${process.env.API_URL}',
       subscriptionsPath: '${process.env.OP_SUBSCRIPTIONS_URL}',
       keycloakUrl: '${process.env.KEYCLOAK_IDP_URL}',
       keycloakClientId: '${process.env.KEYCLOAK_CLIENT_ID}',
       keycloakRealm: '${process.env.KEYCLOAK_REALM}'});
   </script>
   <opc-provider>
    <opc-nav></opc-nav>
    <opc-menu-drawer></opc-menu-drawer>
    <opc-notification-drawer></opc-notification-drawer>
    <opc-feedback></opc-feedback>
  </opc-provider>
  `;
const webpackConfigs = [ '404', 'contact-us']
  .map(pageName => {
    return new HtmlWebpackPlugin({
      filename: `${pageName}/index.html`,
      template: `./src/${pageName}/${pageName}.html`,
      chunks: ['app'],
      navBarConfig,
      minify: htmlWebpackPluginMinify,
    })
});

module.exports = {
  mode: 'development',
  entry: {
      app: './src/index.js',
  },
  devtool: 'inline-source-map',
  output: {
      filename: 'bundle.js',
      path: path.resolve( __dirname, 'dist' ),
      publicPath: '/',
  },
  devServer: {
      contentBase: path.join(__dirname, 'dist'),
      open: true,
      compress: true,
      port: 5500,
  },
  optimization : {
      minimizer: [new TerserPlugin()],
      usedExports: true,
  },
  module: {
      rules: [
          {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-proposal-object-rest-spread']
                },
              }
          },
          {
              test: /\.css$/i,
              use: [MiniCssExtractPlugin, 'css-loader', 'postcss-loader']
          },
          {
              test: /\.(png|jpe?g|gif|svg)$/i,
              use: 'file-loader',
          },
          {
              test: /\.s[ac]ss$/i,
              use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader',
                ],
          },
      ],
  },
  resolve: {
      extensions: ['.js', '.scss', '.css'],
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
          patterns: [
              { from: 'res/img/**', context: 'src' },
              'favicon.ico',
              '.htaccess'
          ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app'],
      template: './src/home/home.html',
      navBarConfig,
      minify: htmlWebpackPluginMinify,
  }),
    new MiniCssExtractPlugin(),
  ].concat(webpackConfigs)
};

