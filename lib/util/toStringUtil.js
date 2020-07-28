"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (value) {
    if (value instanceof Object)
        return JSON.stringify(value, null, "\t");
    return value;
});
//# sourceMappingURL=toStringUtil.js.map