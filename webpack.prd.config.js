var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src', 'script'),
  entry: {
    index: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  module: {
    loaders: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css/,
      loader: ExtractTextPlugin.extract('style', 'css', 'postcss')
    }, 
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css', 'sass')
    },
    {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=25000'
    }, {
      test: /\.wav$/,
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'],
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('style.min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      }
    }),
  ]
};
