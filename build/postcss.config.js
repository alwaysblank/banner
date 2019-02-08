/* eslint-disable */
const cleancss = require('postcss-clean');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

const cleancssConfig = {
  level: {
    1: {
      all: true,
      specialComments: 0
    },
    2: {
      all: false,
      removeDuplicateRules: true
    }
  }
};

module.exports = ({file, options}) => {
  return {
    parser: options.enabled.optimize ? 'postcss-safe-parser' : undefined,
    plugins: [
      tailwindcss(`./build/tailwind.js`),
      postcssPresetEnv(),
      cleancss(options.enabled.optimize ? cleancssConfig : false),
    ]
  };
};
