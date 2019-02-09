const path = require(`path`);
const { argv } = require(`yargs`);
const merge = require(`webpack-merge`);

const desire = require(`./util/desire`);

const userConfig = merge(desire(`${__dirname}/../build`));

const isProduction = !!((argv.env && argv.env.production) || argv.p || argv.mode === `production`);
const rootPath = userConfig.paths && userConfig.paths.root ? userConfig.paths.root : process.cwd();

const config = merge(
    {
        open: true,
        proxyUrl: `http://localhost:3000`,
        paths: {
          root: path.resolve(__dirname, rootPath),
          assets: path.resolve(__dirname, `../_assets`),
          dist: path.resolve(__dirname, `../assets`),
        },
        enabled: {
            sourceMaps: !isProduction,
            optimize: isProduction,
            imagemin: isProduction,
            watcher: !!argv.watch,
            purgecss: isProduction,
        },
        patterns: {
            copy: `images/**/*`,
            html: [`_layouts/*.html`, `_includes/*.html`],
        },
    },
    userConfig
);

config.patterns.html = config.patterns.html.map(pattern => `${rootPath}/${pattern}`);

module.exports = merge(config, {
    env: Object.assign({ production: isProduction, development: !isProduction }, argv.env),
    publicPath: `${config.publicPath}/${path.basename(config.paths.dist)}/`,
    manifest: {},
});

if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = isProduction ? `production` : `development`;
}
