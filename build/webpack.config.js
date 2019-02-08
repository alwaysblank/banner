const path = require('path');

const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin'); // removes dist folder
const CopyGlobsPlugin = require('copy-globs-webpack-plugin'); // copies assets not referenced in js/css
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // writes css file to disk
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // fancy console notifications
const Fiber = require('fibers');

const config = {
  cacheBusting: '[name]_[hash]',
  paths: {
    assets: path.resolve(__dirname, '../_assets')
  },
  env: {
    development: false // TODO: THIS NEEDS ACTUAL LOGIC
  },
  enabled: {
    cacheBusting: false //TODO: THIS NEEDS ACTUAL LOGIC
  }
};

const assetsFilenames = config.enabled.cacheBusting ? config.cacheBusting : '[name]';
const styleLoader = config.env.development ? 'style-loader' : MiniCssExtractPlugin.loader;

const webpackConfig = {
  mode: 'development',
  // Compile for usage in a browser-like environment
  // https://webpack.js.org/configuration/target/
  target: 'web',
  // Entry points for our main js file
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: [
    path.resolve(config.paths.assets, 'js/index.js'), 
    path.resolve(config.paths.assets, 'styles/style.css')
  ],
  // How and where it should output our bundles
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.resolve(__dirname, '../assets'),
    filename: 'js/[name].js?[hash]'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `styles/${assetsFilenames.replace('[hash', '[contenthash')}.css`,
      chunkFilename: `styles/${assetsFilenames.replace('[name]', '[id]')}.css`,
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|s?[ca]ss)$/,
        include: config.paths.assets,
        loader: 'import-glob',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: 'cache-loader' }, { loader: 'babel-loader' }],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: config.paths.assets,
        use: [
          { loader: styleLoader },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              config: { path: __dirname, ctx: config },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceComments: true,
              includePaths: [`${config.paths.assets}/styles`],
              implementation: require("sass"),
              fiber: Fiber
            },
          },
        ],
      },
    ]
  },
};

module.exports = webpackConfig;