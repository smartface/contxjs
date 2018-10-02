/**
 * Push classnames to the target actor
 *
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
function pushClassNames(classNames) {
  return {
    type: "pushClassNames",
    classNames
  };
}

module.exports = pushClassNames;
