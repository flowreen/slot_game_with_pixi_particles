const path = require('path');


module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    output: {
        path: path.resolve(__dirname, ''),
        filename: './build/bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(path.join(__dirname, 'node_modules'))]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader']
            }
        ]
    },
    devServer: {
        host:'localhost',
        port: 8080
    },
    performance: { hints: false }
};