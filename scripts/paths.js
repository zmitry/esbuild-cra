var path = require("path");
var fs = require("fs");

//Allow custom overrides package location
const projectDir = path.resolve(fs.realpathSync(process.cwd()));
var config_overrides = `${projectDir}/config-overrides`;

const modulePath = path.join(require.resolve(`react-scripts/package.json`), "..");

const paths = require(modulePath + "/config/paths");

const webpackConfigPath = path.resolve(modulePath + "/config/webpack.config");
const devServerConfigPath = path.resolve(modulePath + "/config/webpackDevServer.config.js");

module.exports = Object.assign(
  {
    scriptVersion: modulePath,
    configOverrides: config_overrides,
    customScriptsIndex: -1,
    webpackConfigPath,
    devServerConfigPath
  },
  paths
);
