const path = require('path');
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

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js',
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 4200,
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
                use: [MiniCssExtractPlugin, 'css-loader']
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
        new CopyPlugin( {
            patterns: [
                { from: 'img/**', context: 'src' },
                'favicon.ico',
            ],
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            chunks: ['app'],
            template: './src/index.html',
            minify: htmlWebpackPluginMinify,
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            chunks: ['app'],
            template: './src/404.html',
            minify: htmlWebpackPluginMinify,
        }),
        new HtmlWebpackPlugin({
            filename: 'contact-us/index.html',
            chunks: ['app'],
            template: './src/contact-us/index.html',
            minify: htmlWebpackPluginMinify,
        }),
        new MiniCssExtractPlugin(),
    ]
};
