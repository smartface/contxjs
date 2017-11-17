/**
 * Removes specified component's children from context
 * 
 * @param {string} name - Context name of the root component
 * @param {Object} component - Specified component
 *
 * @returns {Object}
 */
export default function removeChildren(){
    return {
        type: "removeChildren"
    };
};
