const path = require('path');
const { argv } = require('yargs');
const merge = require('webpack-merge');

const desire = require('./util/desire');

const userConfig = merge(desire(`${__dirname}/../build`));

const isProduction = !!((argv.env && argv.env.production) || argv.p || argv.mode === 'production');
const rootPath = userConfig.paths && userConfig.paths.root ? userConfig.paths.root : process.cwd();

const config = merge(
    {
        open: true,
        proxyUrl: 'http://localhost:3000',
        cacheBusting: '[name]_[hash]',
        paths: {
            root: rootPath,
            assets: path.join(rootPath, 'resources/assets'),
            dist: path.join(rootPath, 'dist'),
        },
        enabled: {
            sourceMaps: !isProduction,
            optimize: isProduction,
            imagemin: isProduction,
            cacheBusting: isProduction,
            watcher: !!argv.watch,
            purgecss: isProduction,
        },
        patterns: {
            copy: 'images/**/*',
            html: ['config/*.php', 'app/**/*.php', 'resources/views/**/*.php', 'resources/lang/**/*'],
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
