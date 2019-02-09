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

### PhpStorm Syntax Highlighting

By default, PhpStorm doesn't offer any syntax highlighting for Liquid templates (and in fact
if they are `.html` files it will complain about bad formatting) out of the box. Fortunately,
it has support for Twig templates, which appear to be identical.

To enable Liquid syntax highlighting for templates, you'll need to do the following:

1. Rename any templates with a `.html` extension to `.liquid`.
2. Go to *Settings > Editor > File Types*, find the "Twig" file type, and add `*.liquid`
to the list of file types it uses. Keep in mind that this also means you would need to
rename and `include` or similar tags: 
`{%- include head.html -%}` => `{%- include head.liquid -%}` 

**Note:** This only applies to using Liquid tags in HTML templates; I don't believe
this package would support the use of Liquid tags in CSS or JS files.

### Build Fails on Node or Ruby Version Constraint

You may run into an issue where you'll see a message like this in the Netlify log after a
build fails:

> 9:20:26 PM: Attempting node version '10.14.2
> ' from .nvmrc
> 9:20:26 PM: Version '10.14.2
> ' not found - try `nvm ls-remote` to browse available versions.
> 9:20:26 PM: Failed to install node version '10.14.2
> '

Those forced newlines sure look weird, don't they? That's because there's a newline in the
`.nvmrc` file that Netlify uses to determine what version of Node to use. (A similar
problem can also crop up with `.ruby-version`.)

Oftentimes these newlines are automatically added by your editor, so make sure it hasn't
been configured to do so. In PhpStorm, this setting can be found by going to 
*File | Settings | Editor | General --> Other ---> Ensure line feed at file end on Save*.
[Source](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207071445-On-save-new-line-added-to-end-of-file-How-stop-this-)

## Notes

### Cache-busting and Hashes

A common technique for invalidating cached versions of assets when they change is to add
a hash to the filename during the build process. This then requires some kind of system
that operates at runtime to determine what the correct hashed filename is. Fortunately,
with Netlify such a system is not necessary: Netlify has [Instant Cache Invalidation](https://www.netlify.com/blog/2015/09/11/instant-cache-invalidation/)
that using its own fingerprinting of assets to determine when they've changed an
instantly invalidate those items cached across its CDN.

## Thanks and Acknowledgements

The webpack configuration for this project borrows heavily from the excellent work
done on [Sage](https://github.com/roots/sage) by the [Roots team](https://roots.io).