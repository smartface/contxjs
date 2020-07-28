"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Push classnames to the target actor
 *
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
function removeClassNames(className) {
    return {
        type: "removeClassName",
        className: className
    };
}
exports.default = removeClassNames;
//# sourceMappingURL=removeClassNames.js.map