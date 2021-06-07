"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pageContext_1 = __importDefault(require("./pageContext"));
var patchMethod_1 = __importDefault(require("../util/patchMethod"));
var buildStyles = require("@smartface/styler/lib/buildStyles");
var Application = require("@smartface/native/application");
function onSafeAreaPaddingChange(onSafeAreaPaddingChange, paddings) {
    var style = {};
    paddings.left != undefined && (style.paddingLeft = paddings.left);
    paddings.right != undefined && (style.paddingRight = paddings.right);
    paddings.top != undefined && (style.paddingTop = paddings.top);
    paddings.bottom != undefined && (style.paddingBottom = paddings.bottom);
    onSafeAreaPaddingChange && onSafeAreaPaddingChange.call(this, paddings);
    if (this.ios.safeAreaLayoutMode === true) {
        this.dispatch({
            type: "updatePageSafeArea",
            safeArea: style
        });
        this.layout.applyLayout();
    }
}
function onHide(superOnHide) {
    superOnHide && superOnHide();
}
function updateHeaderBar() {
    if (this.parentController &&
        this.parentController.headerBar &&
        this.headerBar.dispatch &&
        !this.headerBar.__isUpdated) {
        this.headerBar.__isUpdated = true;
        this.headerBar.dispatch({
            type: "updateComponent",
            component: this.parentController.headerBar
        });
    }
}
function onShow(superOnShow, data) {
    superOnShow && superOnShow(data);
    updateHeaderBar.call(this);
    this.dispatch && this.dispatch({
        type: "invalidate"
    });
    this.dispatch && this.dispatch({
        type: "forceComponentUpdate",
        name: "statusbar"
    });
    this.layout.applyLayout();
}
function onOrientationChange(superOnOrientationChange) {
    var _this = this;
    superOnOrientationChange && superOnOrientationChange();
    this.dispatch && this.dispatch({
        type: "orientationStarted"
    });
    this.layout.applyLayout();
    // superOnOrientationChange && setTimeout(superOnOrientationChange.bind(this),1);
    setTimeout(function () {
        _this.dispatch && _this.dispatch({
            type: "orientationEnded"
        });
        _this.layout.applyLayout();
    }, 1);
}
function componentDidEnter(componentDidEnter, dispatcher) {
    componentDidEnter
        &&
            componentDidEnter(dispatcher) ||
        (this.dispatch = dispatcher);
}
// monkey patching wrapper for any page.
function pageContextPatch(page, name) {
    page.onLoad = patchMethod_1.default(page, "onLoad", onLoad);
    page.onShow = patchMethod_1.default(page, "onShow", onShow);
    page.onHide = patchMethod_1.default(page, "onHide", onHide);
    page.componentDidEnter = patchMethod_1.default(page, "componentDidEnter", componentDidEnter);
    page.onOrientationChange = patchMethod_1.default(page, "onOrientationChange", onOrientationChange);
    // hides unload logic
    // page.onUnload = patchMethod(page, "onUnload", onPageUnload);
    if (page.ios) {
        page.ios.onSafeAreaPaddingChange = onSafeAreaPaddingChange.bind(page, page.ios.onSafeAreaPaddingChange);
    }
    function onPageUnload(superOnUnload) {
        superOnUnload && superOnUnload();
        this.themeContext(null);
        // pageContextPatchDispose();
    }
    function onLoad(superOnLoad) {
        superOnLoad && superOnLoad();
        this.themeContext = Application.theme(pageContext_1.default(page, name, null, null), name);
        updateHeaderBar.call(this);
    }
    function pageContextPatchDispose() {
        page.dispatch(null);
        page.dispatch = null;
        page.onLoad = null;
        page.onShow = null;
        page.onHide = null;
        page.onOrientationChange = null;
        page = null;
    }
    ;
    return pageContextPatchDispose;
}
exports.default = pageContextPatch;
;
//# sourceMappingURL=pageContextPatch.js.map