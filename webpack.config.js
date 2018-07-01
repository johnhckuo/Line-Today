var path = require('path');
var Webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var autoprefixer = require('autoprefixer');

var extractPlugin = new ExtractTextPlugin({
   filename: 'bundle.css'
});

module.exports = {
  entry: path.join(__dirname, 'src', 'script', 'index.js'),
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
              },
            },
          ],
        },
        {
          test: /\.css/,
          loader: ExtractTextPlugin.extract('style', 'css', 'postcss')
        }
    ],
    rules: [
        {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
      			test: /\.scss$/,
      			use: extractPlugin.extract({
      			    use: [
      			        'css-loader',
      			        'sass-loader'
      			    ]
      			})
      	},
        {test: /\.jpg$/, use: 'url-loader?mimetype=image/jpg'},
        {test: /\.png$/, use: 'url-loader?mimetype=image/png'},
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    extractPlugin,
    new CleanWebpackPlugin(['docs']),
    autoprefixer
  ]
};
