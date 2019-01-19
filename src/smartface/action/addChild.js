/**
 * Add context child action
 * 
 * @param {string} name - Context name of the root component
 * @param {Object} component - Specified component
 * @param {string} classnames - Component classnames
 * @param {Object} userProps - Initial properties of the specified component
 * 
 * @returns {Object}
 */
export default function addChild(name, component, classNames="", userStyle=null, defaultClassNames){
    return {
        type: "addChild",
        name,
        component,
        classNames,
        defaultClassNames,
        userStyle
    };
};
