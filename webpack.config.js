var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');

var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var copyWebpackPlugin = require('copy-webpack-plugin');
var pluginTools = [
  new htmlWebpackPlugin({
    template: 'src/index.html'
  }),
  new cleanWebpackPlugin(['dist']),
  new copyWebpackPlugin([{
    from: 'static',
    to: 'static'
  }])
]
var devTool = '';
if (process.env.NODE_ENV !== 'production') {
  devTool = 'cheap-module-eval-source-map';
  pluginTools.unshift(new webpack
    .optimize
    .UglifyJsPlugin({
      //...
    }));
}

module.exports = {
  devtool: devTool,
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].min.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }]
    }, {
      test: /\.html$/,
      use: ['html-loader']
    }]
  },
  plugins: pluginTools
}