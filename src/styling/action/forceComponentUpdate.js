/**
 * Forces Component's invalidated.
 *
 * @params {string} name - Component classnames
 * @returns {Object}
 */
function forceComponentUpdate(name) {
  return {
    type: "forceComponentUpdate",
    name
  };
}

module.exports = forceComponentUpdate;
