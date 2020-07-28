"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function patchMethod(scope, method, bindingfFunc) {
    return bindingfFunc.bind(scope, typeof scope[method] === "function" ? scope[method].bind(scope) : null);
}
exports.default = patchMethod;
//# sourceMappingURL=patchMethod.js.map