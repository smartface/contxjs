"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Removes specified component's children from context
 *
 * @param {string} name - Context name of the root component
 * @param {Object} component - Specified component
 *
 * @returns {Object}
 */
function removeChildren() {
    return {
        type: "removeChildren"
    };
}
exports.default = removeChildren;
;
//# sourceMappingURL=removeChildren.js.map