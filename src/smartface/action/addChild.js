/**
 * Add context child action
 * 
 * @param {string} name - Context name of the root component
 * @param {Object} component - Specified component
 * @param {string} classnames - Component classnames
 * @param {Object} initialProps - Initial properties of the specified component
 * @returns {Object}
 */
export default function addChild(name, component, classNames="", initialProps={}){
    return {
        type: "addChild",
        name,
        component,
        classNames,
        initialProps
    };
};
