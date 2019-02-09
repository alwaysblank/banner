/**
 * @export
 * @param {string} dependency
 * @param {any} [fallback]
 * @return {any}
 * @link https://github.com/roots/sage
 */
module.exports = (dependency, fallback) => {
  try {
    require.resolve(dependency);
  } catch (err) {
    return fallback;
  }
  return require(dependency); // eslint-disable-line import/no-dynamic-require
};
