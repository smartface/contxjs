"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Push classnames to the target actor
 *
 * @deprecated
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
function removeClassName(className) {
    return {
        type: "removeClassName",
        className: className
    };
}
exports.default = removeClassName;
//# sourceMappingURL=removeClassName.js.map