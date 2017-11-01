/**
 * Add child action
 * 
 * @params {string} name - Context name of the root component
 * @params {Object} component - Specified component
 * @params {string} classnames - Component classnames
 * @params {object} initialProps - Initial properties of the specified component
 * @returns {Object}
 */
export default function addContextChild(name, component, classNames="", initialProps={}){
    return {
        type: "addContextChild",
        name,
        component,
        classNames,
        initialProps
    };
}
