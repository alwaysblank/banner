# 👨🏻‍🔬 Banner
Jekyll boilerplate powered by gamma radiation.

## Featured

- CSS
  - [PostCSS](https://postcss.org/) - Manipulate CSS quickly and with understanding.
  - [SCSS/SASS](https://sass-lang.com/) - Write simpler CSS.
  - [TailwindCSS](https://tailwindcss.com) - Fast and easy design and prototyping.
- JavaScript
  - [Babel](https://babeljs.io/) - Write ES6 without worrying about compatibility.
- Optimization 
  - [Webpack](https://webpack.js.org/) - Collect, process, and build all your assets.
  - [PurgeCSS](https://www.purgecss.com/) - Remove unused CSS for the smallest build possible.
  - [Clean CSS](https://github.com/jakubpawlowicz/clean-css) - Minifies and simplifies your CSS.
  - [Terser](https://github.com/terser-js/terser) - Minifies and optimizes your final JS.
- Development
  - BrowserSync - **Coming Soon**

## Setup

### Requirements
- Node 10.14.2
- Yarn 1.13.0
- Ruby 2.4.3
  - Bundler 1.17.3

The versions listed above are the *specific* versions that Netlify uses to build the 
site remotely. It is *strongly* recommended that you use these versions when developing 
locally, or you may have to debug build errors on Netlify, which is a bad time.

### Installing

Set up Jekyll:
```bash
bundle install
```

Set up asset processing:
```bash
yarn
```

### Running

Build assets for development:
```bash
yarn build
```

Build assets for production:
```bash
yarn build:production
```

Build site for deployment:
```bash
yarn deploy
```

**COMING SOON**
Build and watch site and assets for development:
```bash
yarn develop
```

## Known Issues

### Bundler 2

Netlify's build image does not currently support Bundler 2, and if you create a
`Gemfile.lock` with Bundler 2 you'll get an error on deploy that looks like
this: 

> You must use Bundler 2 or greater with this lockfile.

This is a [known issue](https://github.com/netlify/build-image/issues/250) and will
hopefully eventually be addressed, but for now the workaround is to use an older version
of Bundler. 1.17.3 is the latest pre-2.0 version. You can install it with the following
command:

```bash
gem install bundler --version '1.17.3'
```

### Yarn

Older versions of yarn will throw an error that says something like this:

> [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.

Something's deprecated! The solution is to use a version of yarn newer than 1.10.0.

## Notes

### Cache-busting and Hashes

A common technique for invalidating cached versions of assets when they change is to add
a hash to the filename during the build process. This then requires some kind of system
that operates at runtime to determine what the correct hashed filename is. Fortunately,
with Netlify such a system is not necessary: Netlify has (Instant Cache Invalidation)[https://www.netlify.com/blog/2015/09/11/instant-cache-invalidation/]
that using its own fingerprinting of assets to determine when they've changed an
instantly invalidate those items cached across its CDN.
