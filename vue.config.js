const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Alpha Gym Access", // optional: sets the app name
        appId: "com.jmbcomputers.gymaccess",
        icon: "build/icons/alpha",
        // no need to add .ico or .icns here, builder auto-detects
        extraResources: [
          // keep your audio files
          {
            from: "src/assets/audio/",
            to: "assets/audio/",
            filter: ["**/*"],
          },
          // bundle your Laravel server
          {
            from: "../amici_server",
            to: "amici_server/",
            filter: ["**/*"],
          },
          // bundle PHP runtime
          {
            from: "../amici_server/php",
            to: "php/",
            filter: ["**/*"],
          },
          // bundle SQLite database (for backup purposes)
          {
            from: "../amici_server/database/",
            to: "database/",
            filter: ["*.sqlite"],
          },
        ],
      },
      outputDir: "dist_electron",
      mainProcessFile: "src/background.js",
      rendererProcessFile: "src/main.js",
    },
  },
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
  },
};
