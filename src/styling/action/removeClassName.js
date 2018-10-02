/**
 * Push classnames to the target actor
 *
 * @deprecated
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
function removeClassName(className) {
  return {
    type: "removeClassName",
    className
  };
}

module.exports = removeClassName;
