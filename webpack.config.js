const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    trix: "./src/js/trix.js",
    vacantesForm: "./src/js/vacantesForm.js",
    buscador: "./src/js/buscador.js",
    cleanAlerts: "./src/js/cleanAlerts.js",
    deleteVacantes: "./src/js/deleteVacantes.js",
  },
  output: {
    path: path.resolve(__dirname, "public/js"),
    filename: "[name].min.js",
    chunkFilename: "[name].min.js",
    publicPath: "/js/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  devtool: "source-map",
  mode: "development",
};
