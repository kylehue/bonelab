const path = require("path");

module.exports = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist/client/js/"),
    filename: "app.js",
  }
};