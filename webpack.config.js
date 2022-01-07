const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = async function (env, argv) {
  const isDev = env.mode === 'development';
  const config = await createExpoWebpackConfigAsync(env, argv);

  /// Use the React refresh plugin in development mode
  if (isDev) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin()
    );
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  );

  config.resolve.alias['process'] = 'process/browser';

  return config;
};
