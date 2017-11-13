/**
 * Removes specified component's children from context
 * 
 * @params {string} name - Context name of the root component
 * @params {Object} component - Specified component
 *
 * @returns {Object}
 */
export default function removeChildren(){
    return {
        type: "removeChildren"
    };
};
