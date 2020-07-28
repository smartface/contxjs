"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Forces Component's invalidated.
 *
 * @params {string} name - Component classnames
 * @returns {Object}
 */
function forceComponentUpdate(name) {
    return {
        type: "forceComponentUpdate",
        name: name
    };
}
exports.default = forceComponentUpdate;
//# sourceMappingURL=forceComponentUpdate.js.map