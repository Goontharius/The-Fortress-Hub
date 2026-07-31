const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = {
    ...config.resolve,
    fallback: {
      ...(config.resolve?.fallback || {}),
      assert: require.resolve("assert/"),
      browserify-zlib: require.resolve("browserify-zlib"),
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib"),
    },
  };

  config.plugins = [
    ...(config.plugins || []),
    new NodePolyfillPlugin(),
  ];

  return config;
};
