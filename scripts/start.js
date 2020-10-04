process.env.NODE_ENV = process.env.NODE_ENV || "development";

const overrides = require("./rewire");
const paths = require("./paths");
const path = require("path");
const webpackConfig = require(paths.webpackConfigPath);
const devServerConfig = require(paths.devServerConfigPath);
const argv = require("yargs").argv;

// override config in memory
require.cache[require.resolve(paths.webpackConfigPath)].exports = (env) => {
  const config = overrides.webpack(webpackConfig(env), env);
  config.entry = config.entry[0];
  return config;
};
require.cache[
  require.resolve(paths.devServerConfigPath)
].exports = overrides.devServer(devServerConfig, process.env.NODE_ENV);

// run original script
require(paths.scriptVersion + "/scripts/start");
