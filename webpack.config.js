const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      "crypto-browserify": false,
      request: false,
      url: require.resolve("url"),
      os: false,
      "os-browserify": false,
      querystring: false,
      buffer: false,
      constants: false,
      child_process: false,
    },
  },
  watch: true,
};
