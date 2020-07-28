"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates an action that add a context to ThemeContext as a Context element.
 *
 * @params {function} - Context wrapper function
 */
function addThemeableContext(context) {
    return {
        type: "addThemeableContext",
        context: context
    };
}
exports.default = addThemeableContext;
//# sourceMappingURL=addThemeableContext.js.map