const paths = require("./paths");
// load environment variables from .env files
// before overrides scripts are read
require(paths.scriptVersion + "/config/env");
const override = require(paths.configOverrides);

const webpack = override.webpack || ((config, env) => config);

const devServer =
  override.devServer ||
  (configFunction => (proxy, allowedHost) => configFunction(proxy, allowedHost));

module.exports = {
  webpack,
  devServer
};
