"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hooks(hooksList) {
    return function hookMaybe(hook, value) {
        return hooksList
            ? hooksList(hook)
            : value;
    };
}
exports.default = hooks;
//# sourceMappingURL=hooks.js.map