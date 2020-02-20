const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/app.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization : {
        minimizer: true,
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
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                  ],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin, 'css-loader']
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'img',
                            name: '[name].[ext]',
                            esModule: false,
                        },
                    }
                ]
            },        
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.scss', '.css'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['app'],
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
        new HtmlWebpackPlugin({
            template: './src/404.html',
            filename: '404.html',
            chunks: ['app'],
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        }),
        new MiniCssExtractPlugin(),
    ]
};