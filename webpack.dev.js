const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const htmlPath = "./src/template.html";

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: [htmlPath],
  },
});