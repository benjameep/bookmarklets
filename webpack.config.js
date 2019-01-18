const path = require("path");
const fs = require("fs");

module.exports = {
  mode: "production",
  entry: {
    quizsaver: path.join(__dirname, "./src/quizsaver.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: path.join(__dirname, "./src/quizsaver.js"),
        use: [{ loader: `expose-loader`, options: "quizsaver" }]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};