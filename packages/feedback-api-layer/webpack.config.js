const path = require('path');

module.exports = {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        open: true,
        compress: true,
        port: 4200,
    },
    entry: `${path.join(__dirname, 'src/feedback.js')}`,
    devtool: 'inline-source-map',
    optimization : {
        usedExports: true
    },
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.css|\.s(c|a)ss$/,
            use: [{
              loader: 'lit-scss-loader',
              options: {
                minify: true, // defaults to false
              },
            }, 'extract-loader', 'css-loader', 'sass-loader'],
        },
        ],
    },
    plugins: [],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'feedback.js',
        path: path.resolve(__dirname, 'dist'),
    },
};