"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pageContext_1 = __importDefault(require("./pageContext"));
var patchMethod_1 = __importDefault(require("../util/patchMethod"));
var Application = require("@smartface/native/application");
function componentContextPatch(component, name) {
    component.themeContext = Application.theme(pageContext_1.default(component, name, null, null), name);
    component.onShow = patchMethod_1.default(component, "onShow", onShow);
    function onShow(superOnShow, params) {
        superOnShow && superOnShow(params);
    }
}
exports.default = componentContextPatch;
//# sourceMappingURL=componentContextPatch.js.map