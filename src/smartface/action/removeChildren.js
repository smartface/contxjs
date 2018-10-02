/**
 * Removes specified component's children from context
 *
 * @param {string} name - Context name of the root component
 * @param {Object} component - Specified component
 *
 * @returns {Object}
 */
module.exports = function removeChildren() {
  return {
    type: "removeChildren"
  };
};
