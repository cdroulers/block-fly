/* eslint no-console:0 */

var express = require("express");
var path = require("path");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("../config/webpack.dev.config");

var APP_PORT = process.env.APP_PORT || 5555;
var APP_HOST = process.env.APP_HOST || "localhost";

var compiler = webpack(config);
var app = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  stats: { colors: true }
});

// Serve static resources
app.use("/assets", express.static(path.resolve(__dirname, "public/assets")));
app.listen(APP_PORT, APP_HOST, () => {
  console.log(`App is now running on http://${APP_HOST}:${APP_PORT}`);
});
