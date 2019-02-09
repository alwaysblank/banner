const path = require(`path`);

/** Load local config */
const config = require(`./config`);
const babelConfig = require(`./babel.config`);
const purgecssConfig = require(`./purgecss.config`);

const webpack = require(`webpack`);
const CleanPlugin = require(`clean-webpack-plugin`); // removes dist folder
const CopyGlobsPlugin = require(`copy-globs-webpack-plugin`); // copies assets not referenced in js/css
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`); // writes css file to disk
const FriendlyErrorsWebpackPlugin = require(`friendly-errors-webpack-plugin`); // fancy console notifications
const Fiber = require(`fibers`); // Improves (Dart) SASS processing speed

/** dependencies used during optimizations */
const TerserPlugin = require(`terser-webpack-plugin`); // minify js
const PurgecssPlugin = require(`purgecss-webpack-plugin`); // remove unnecessary CSS

const styleLoader = config.env.development ? `style-loader` : MiniCssExtractPlugin.loader;

const webpackConfig = {
  mode: config.env.production ? `production` : config.env.development ? `development` : `none`,
  // Compile for usage in a browser-like environment
  // https://webpack.js.org/configuration/target/
  target: `web`,
  context: config.paths.assets,
  // Entry points for our main js file
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: config.entry,
  // How and where it should output our bundles
  // https://webpack.js.org/configuration/output/
  output: {
    path: path.resolve(__dirname, `../assets`),
    filename: `scripts/[name].js`,
  },
  optimization: {
    noEmitOnErrors: config.env.production || config.enabled.watcher,
    namedModules: config.env.development,
    occurrenceOrder: config.enabled.watcher,
    runtimeChunk: { name: `manifest` },
    splitChunks: {
      name: true,
      cacheGroups: {
        styles: {
          name: `styles`,
          test: /\.css$/,
          chunks: `all`,
          enforce: true,
        },
        vendors: {
          test: /node_modules/,
          name: `vendor`,
          chunks: `all`,
          priority: -10,
        },
      },
    },
    minimize: config.enabled.optimization,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: config.enabled.sourceMaps,
        terserOptions: {
          ecma: 8,
          compress: {
            warnings: true,
            drop_console: true,
          },
        },
      }),
      new webpack.HashedModuleIdsPlugin(),
    ],
  },
  plugins: [
    new CleanPlugin([config.paths.dist], {
      root: config.paths.root,
      verbose: false,
    }),
    new CopyGlobsPlugin({
      pattern: config.patterns.copy,
      output: `[path][name].[ext]`,
    }),
    new MiniCssExtractPlugin({
      filename: `styles/[name].css`,
      chunkFilename: `styles/[name]_[id].css`,
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
  resolve: {
    modules: [config.paths.assets, `node_modules`],
    enforceExtension: false,
  },
  module: {
    rules: [
      {
        enforce: `pre`,
        test: /\.(js|s?[ca]ss)$/,
        include: config.paths.assets,
        loader: `import-glob`,
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{loader: `cache-loader`}, {
          loader: `babel-loader`,
          options: babelConfig,
        }],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: config.paths.assets,
        use: [
          {loader: styleLoader},
          {loader: `css-loader`, options: {importLoaders: 1}},
          {
            loader: `postcss-loader`,
            options: {
              config: {path: __dirname, ctx: config},
            },
          },
          {
            loader: `sass-loader`,
            options: {
              sourceComments: true,
              includePaths: [`${config.paths.assets}/styles`],
              implementation: require(`sass`),
              fiber: Fiber,
            },
          },
        ],
      },
    ],
  },
};

if (config.enabled.purgecss && PurgecssPlugin) {
  webpackConfig.optimization.minimizer.push(new PurgecssPlugin(purgecssConfig));
}

module.exports = webpackConfig;
