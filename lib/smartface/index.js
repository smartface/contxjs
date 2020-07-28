"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var addChild_1 = __importDefault(require("./action/addChild"));
var removeChild_1 = __importDefault(require("./action/removeChild"));
var removeChildren_1 = __importDefault(require("./action/removeChildren"));
var pageContext_1 = __importDefault(require("./pageContext"));
var pageContextPatch_1 = __importDefault(require("./pageContextPatch"));
var componentContextPatch_1 = __importDefault(require("./componentContextPatch"));
exports.default = {
    addChild: addChild_1.default,
    removeChild: removeChild_1.default,
    removeChildren: removeChildren_1.default,
    pageContext: pageContext_1.default,
    pageContextPatch: pageContextPatch_1.default,
    componentContextPatch: componentContextPatch_1.default
};
//# sourceMappingURL=index.js.map