"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function raiseErrorMaybe(e, fn) {
    if (fn && fn(e) === false || !fn) {
        throw e;
    }
}
exports.default = raiseErrorMaybe;
//# sourceMappingURL=raiseErrorMaybe.js.map