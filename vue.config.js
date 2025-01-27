const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: [
          {
            from: "src/assets/audio/",
            to: "assets/audio/",
            filter: ["**/*"],
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
