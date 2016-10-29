const path = require("path");
const webpack = require("webpack");
const WebpackConfig = require("webpack-config");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");

const rootPath = path.join(__dirname, "../");
const deployPath = path.join(rootPath, "build/deploy");

module.exports = new WebpackConfig.Config().extend({
  "./config/webpack.base.config.js": (config) => {
    return config;
  }
}).merge({
  output: {
    filename: "[name]_[chunkhash].js",
    path: deployPath
  },

  module: {
    loaders: [
      {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass!toolbox"
        )
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(["build/deploy"], {
      root: rootPath
    }),
    new ExtractTextPlugin("[name]_[chunkhash].css", { allChunks: true }),
    new CopyWebpackPlugin([
      {
        from: path.join(rootPath, "src", "public", "assets"),
        to: path.join(deployPath, "assets")
      }
    ]),
    new webpack.optimize.CommonsChunkPlugin("vendors", "vendors_[chunkhash].js"),
    new WebpackMd5Hash(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
});
