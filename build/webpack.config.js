const path = require('path');

module.exports = {
  entry: './_assets/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../assets/js')
  }
};
