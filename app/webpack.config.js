var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app/index.js',
    resolve: {
        alias: {
          vue: 'vue/dist/vue.js'
        }
      },
    plugins: [new HtmlWebpackPlugin({
        template: 'public/index.html'
    })]
};