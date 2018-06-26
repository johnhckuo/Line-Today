var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src', 'script'),
  entry: {
    bundle: './index.js',
    vendor: ['react']
  },
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: '[name].js'
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
    }],
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css'],
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: process.env.NODE_ENV !== 'production'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new ExtractTextPlugin( "bundle.css" )

  ],
  devServer: {
    historyApiFallback: true
  }
};
