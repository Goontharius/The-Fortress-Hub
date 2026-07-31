const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve = {
    ...config.resolve,
    fallback: {
      ...(config.resolve?.fallback || {}),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  };

  config.plugins = [
    ...(config.plugins || []),
    new NodePolyfillPlugin(),
  ];

  return config;
};
