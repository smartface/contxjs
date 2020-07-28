"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function addChild(name, component, classNames, userStyle, defaultClassNames) {
    if (classNames === void 0) { classNames = ""; }
    if (userStyle === void 0) { userStyle = null; }
    return {
        type: "addChild",
        name: name,
        component: component,
        classNames: classNames,
        defaultClassNames: defaultClassNames,
        userStyle: userStyle
    };
}
exports.default = addChild;
;
//# sourceMappingURL=addChild.js.map