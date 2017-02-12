const WebpackConfig = require("webpack-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const rootPath = path.join(__dirname, "../");
const nodeModulesPath = path.join(rootPath, "node_modules");
const buildPath = path.join(rootPath, "build");
const packageJson = require(path.join(rootPath, "package.json"));
const OfflinePlugin = require('offline-plugin');

var config = {
  entry: {
    vendors: [
      "bluebird",
      "material-design-lite"
    ],
    app: [
      path.resolve(rootPath, "src", "block-fly", "app.ts")
    ]
  },
  output: {
    filename: path.resolve(buildPath, "app.js"),
    publicPath: "/",
    path: buildPath
  },
  resolveLoader: {
    root: nodeModulesPath
  },
  devtool: "source-map",
  resolve: {
    extensions: ["", ".scss", ".css", ".webpack.js", ".web.js", ".ts", ".js"],
    fallback: rootPath,
    modulesDirectories: [
      "node_modules",
      nodeModulesPath
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(rootPath, "src/public/index.html"),
      inject: "body",
      version: packageJson.version
    }),
    new OfflinePlugin({
      externals: [
        "assets/favicon.ico",
        "assets/fonts/material-icons.css",
        "assets/fonts/materialicons-18066d41cf693a9c57a574f72643b71018074055.ttf",
        "assets/fonts/materialicons-2e98914db9e079f28281d243c5fe4e8b6a2e5fa2.eot",
        "assets/fonts/materialicons-a768c28a15e2475bb7611a98b7bcd08de024699b.svg",
        "assets/default-levels.json",
        "assets/children-levels.json",
        "assets/imgs/player1-left.gif",
        "assets/imgs/player1-right.gif",
        "assets/imgs/empty.gif",
        "assets/imgs/wall.gif",
        "assets/imgs/block.gif",
        "assets/imgs/door.gif"
      ]
    })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /(\.scss|\.css)$/,
        loaders: [
          "style",
          "css?sourceMap&importLoaders=1&localIdentName=[local]",
          "postcss",
          "sass?sourceMap"
        ]
      }
    ]
  }
}

module.exports = new WebpackConfig.Config().merge(config);
