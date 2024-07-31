const path = require('path');

module.exports = {
    entry: "./client/src/main.ts",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { 
                test: /\.css$/, 
                use: [ 'style-loader', 'css-loader' ] 
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: 'index_bundle.js'
    },
    mode: 'development'
}
