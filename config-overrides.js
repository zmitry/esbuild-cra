/* eslint-disable */
const path = require("path");
const watcher = require("@parcel/watcher");
const execSync = require("child_process").execSync;
const CopyPlugin = require("copy-webpack-plugin");

let cb;

module.exports = {
  devServer: (config) => {
    watcher.subscribe(path.resolve(process.cwd(), "./src"), (err, events) => {
      if (cb) {
        cb(events);
      }
    });
    return (...args) => {
      let rs = config(...args);
      let originalBefore = rs.after;
      try {
        code = execSync("go run ./build.go", {
          cwd: path.resolve(__dirname, "./esbuild"),
        });
      } catch (e) {
        console.error(e.stderr, e.stdout);
      }
      rs.after = (app, server) => {
        if (originalBefore) {
          originalBefore(app, server);
        }
        cb = () => {
          try {
            code = execSync("go run ./build.go", {
              cwd: path.resolve(__dirname, "./esbuild"),
            });
            server.sockWrite(server.sockets, "content-changed");
          } catch (e) {
            server.sockWrite(server.sockets, "errors", e.stderr.toString());
            console.error(e.stderr, e.stdout);
          }
        };
      };
      return rs;
    };
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: "./es_dist", to: "" }],
      })
    );
    return config;
  },
};
