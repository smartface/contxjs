/**
 * Update styles of the target actor
 * 
 * @params {Object} userStyle - Component styles
 * @returns {Object}
 */
 export default function updateUserStyle(userStyle){
  return {
      type: "updateUserStyle",
      userStyle
  };
}
