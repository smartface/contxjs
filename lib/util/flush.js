"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flush(str, obj) {
    if (str === void 0) { str = ""; }
    Object.keys(obj).forEach(function (key) {
        if (obj[key] != null && obj[key] instanceof Object) {
            str += key + ": " + flush("", obj[key]) + ", ";
        }
        else {
            str += key + ": " + obj[key] + ", ";
        }
    });
    return "{ " + str.trim(", ") + " }";
}
exports.default = flush;
//# sourceMappingURL=flush.js.map