/* eslint-disable no-var,object-shorthand,prefer-template */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var PATHS = {
  OUTPUT : path.join(__dirname, 'dist'),
  SOURCE : path.join(__dirname, 'src')
};

var config = {
  output : {
    path : PATHS.OUTPUT,
    publicPath : '/static/',
    filename : 'main.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        exclude : /node_modules/,
        loader : 'babel'
      },
      {
        test : /\.css$/,
        exclude : /node_modules/,
        loader : ExtractTextPlugin.extract('style',
          'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss')
      }
    ]
  },
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : {
      src : PATHS.SOURCE
    }
  },
  plugins : [
    new ExtractTextPlugin('style.css', { allChunks : true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
    })
  ],
  postcss : [
    require('postcss-normalize'),
    require('autoprefixer')
  ]
};

var buildConfig = Object.assign({}, config, {
  entry : [PATHS.SOURCE + '/main.jsx']
});

var devConfig = Object.assign({}, buildConfig, {
  entry : [
    'webpack-hot-middleware/client'
  ].concat(buildConfig.entry),
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(buildConfig.plugins),
  devtool: '#source-map'
});

module.exports = {
  buildConfig : buildConfig,
  devConfig : devConfig
};

/* eslint-enable no-var,object-shorthand,prefer-template */

