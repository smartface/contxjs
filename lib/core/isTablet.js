"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var orientation = __importStar(require("@smartface/native/lib/orientation"));
var system_1 = __importDefault(require("@smartface/native/device/system"));
function load(src) {
    return require(src);
}
var AndroidConfig;
var isTablet = false;
if (system_1.default.OS === "iOS" && orientation.shortEdge >= 720) {
    isTablet = true;
}
else if (system_1.default.OS === "Android") {
    AndroidConfig = load('@smartface/native/util/Android/androidconfig');
    var Activity = AndroidConfig.activity;
    var context = Activity;
    var SCREENLAYOUT_SIZE_MASK = 15, SCREENLAYOUT_SIZE_LARGE = 3;
    var xlarge = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) === 4);
    var large = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) == SCREENLAYOUT_SIZE_LARGE);
    isTablet = (xlarge || large);
}
module.exports = isTablet;
//# sourceMappingURL=isTablet.js.map