process.env.NODE_ENV = "production";

const paths = require("./paths");
const overrides = require("./rewire");
const path = require("path");
const argv = require("yargs").argv;
// load original config
const webpackConfig = require(paths.webpackConfigPath);
// override config in memory
require.cache[require.resolve(paths.webpackConfigPath)].exports = (env) => {
  const config = overrides.webpack(webpackConfig(env), env);
  if (argv.entry) {
    config.entry = path.resolve(argv.entry);
  }
  return config;
};

// run original script
require(paths.scriptVersion + "/scripts/build");
