const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  entry: {
    app: './assets/js/scripts.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname,'./dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        loader:ExtractTextPlugin.extract({use: ['css-loader', 'sass-loader']})
      },
      {
        test: '/\.js$/',
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: { limit: 10000, name: '[name].[ext]?[hash]' }
      },
      {
        test: /\.(woff|ttf|otf|eot|woff2)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ]
}

module.exports = config;
