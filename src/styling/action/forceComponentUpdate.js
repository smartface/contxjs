/**
 * Forces Component's invalidated.
 * 
 * @params {string} name - Component classnames
 * @returns {Object}
 */
export default function forceComponentUpdate(name){
    return {
        type: "forceComponentUpdate",
        name
    };
}
