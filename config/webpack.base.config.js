const WebpackConfig = require("webpack-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const rootPath = path.join(__dirname, "../");
const nodeModulesPath = path.join(rootPath, "node_modules");
const buildPath = path.join(rootPath, "build");
const packageJson = require(path.join(rootPath, "package.json"));

var config = {
  entry: {
    vendors: [
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
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
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
    })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  }
}

module.exports = new WebpackConfig.Config().merge(config);
