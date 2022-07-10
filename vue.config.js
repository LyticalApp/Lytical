const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = 'Lytical';
        return args;
      });
  },
  transpileDependencies: true,
});
