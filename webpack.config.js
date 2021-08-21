const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            util: require.resolve(`util/`),
            url: require.resolve(`url/`),
            assert: require.resolve(`assert/`),
            crypto: require.resolve(`crypto-browserify`),
            os: require.resolve(`os-browserify/browser`),
            https: require.resolve(`https-browserify`),
            http: require.resolve(`stream-http`),
            stream: require.resolve(`stream-browserify`),
        },
    },
};
