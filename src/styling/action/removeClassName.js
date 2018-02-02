/**
 * Push classnames to the target actor
 * 
 * @deprecated
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
export default function removeClassName(className){
    return {
        type: "removeClassName",
        className
    };
}
