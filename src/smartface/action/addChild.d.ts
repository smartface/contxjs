import View = require("sf-core/ui/view");
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
export default function addChild(name: string, component: View, classNames: string, userStyle: object, defaultClassNames: string[] | string): {
    type: string,
    name: string,
    component: string,
    classNames: string[] | string,
    defaultClassNames: string[] | string,
    userStyle: object
};