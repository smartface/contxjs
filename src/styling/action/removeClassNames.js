/**
 * Push classnames to the target actor
 *
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
function removeClassNames(className) {
  return {
    type: "removeClassName",
    className
  };
}

module.exports = removeClassNames;
