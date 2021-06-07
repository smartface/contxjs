"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Actor_1 = __importDefault(require("../core/Actor"));
var merge_1 = __importDefault(require("@smartface/styler/lib/utils/merge"));
var findClassNames_1 = __importDefault(require("@smartface/styler/lib/utils/findClassNames"));
var toStringUtil_1 = __importDefault(require("../util/toStringUtil"));
var _findClassNames = function (classNames) { return findClassNames_1.default(classNames).reduce(function (acc, item) { return !item && [] || __spreadArrays(acc, [item.join('')]); }, []); };
var componentObjectProps = {
    "android": {},
    "ios": {},
    "layout": {},
    "layoutManager": {}
};
var SCW_LAYOUT_PROPS = {
    "alignContent": "alignContent",
    "alignItems": "alignItems",
    "direction": "direction",
    "flexDirection": "flexDirection",
    "justifyContent": "justifyContent",
    "flexWrap": "flexWrap",
    "paddingLeft": "paddingLeft",
    "paddingTop": "paddingTop",
    "paddingRight": "paddingRight",
    "paddingBottom": "paddingBottom",
    "marginRight": "marginRight",
    "marginLeft": "marginLeft",
    "marginTop": "marginTop",
    "marginBottom": "marginBottom",
    "layoutHeight": "height",
    "layoutWidth": "width",
    "backgroundColor": "backgroundColor"
};
function componentAssign(component, key, value) {
    if (value !== null && value instanceof Object && componentObjectProps[key]) {
        Object.keys(value).forEach(function (k) { return componentAssign(component[key], k, value[k]); });
    }
    else {
        component[key] = value;
    }
}
// TODO create new jsdoc type for the parameter
/**
 * Styleable Actor HOC. Decorates specifeid component and return an actor component
 *
 * @param {object} component - A component to decorate
 * @param {string} className - initial className for actor
 * @param {function} hooks - context's hooks dispatcher
 *
 * @returns {Object} - A Stylable Actor
 */
function makeStylable(_a) {
    var component = _a.component, _b = _a.classNames, classNames = _b === void 0 ? "" : _b, _c = _a.defaultClassNames, defaultClassNames = _c === void 0 ? "" : _c, _d = _a.userStyle, userStyle = _d === void 0 ? {} : _d, name = _a.name;
    userStyle = merge_1.default(userStyle);
    /**
     * Styable actor
     * @class
     */
    return new Stylable(component, name, classNames, defaultClassNames, userStyle);
}
exports.default = makeStylable;
var Stylable = /** @class */ (function (_super) {
    __extends(Stylable, _super);
    function Stylable(component, name, classNames, defaultClassNames, userStyle) {
        var _this = _super.call(this, component, name) || this;
        _this.waitedStyle = {};
        _this.defaultClassNames = defaultClassNames ? _findClassNames(defaultClassNames) : [];
        _this.initialClassNames = _findClassNames(classNames);
        _this.classNames = __spreadArrays(_this.initialClassNames);
        _this.styles = {};
        _this.inlinestyles = {};
        _this.isDirty = true;
        _this.userStyle = userStyle;
        _this.component = component;
        return _this;
    }
    Stylable.prototype.getUserStyle = function () {
        return (0, merge_1.default)(this.userStyle);
    };
    Stylable.prototype.setSafeArea = function (area) {
        this.safeArea = area;
        this.isDirty = true;
        return this;
    };
    Stylable.prototype.makeDirty = function () {
        this.isDirty = true;
    };
    Stylable.prototype.clearDirty = function () {
        this.isDirty = false;
    };
    Stylable.prototype.updateUserStyle = function (props) {
        this.userStyle = (0, merge_1.default)(this.userStyle, props);
        this.isDirty = true;
        return this;
    };
    Stylable.prototype.reset = function () {
        this.setStyles(this.getStyles(), true);
        return this;
    };
    Stylable.prototype.setUserStyle = function (props) {
        if (isFunction(props)) {
            this.userStyle = props(this.getUserStyle());
        }
        else {
            this.userStyle = (0, merge_1.default)(props);
        }
        this.isDirty = true;
        return this;
    };
    Stylable.prototype.computeAndAssignStyle = function (style, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var hooks = this.hook || (function () { return null; });
        var _component = this.getComponent();
        var reduceDiffStyleHook = hooks("reduceDiffStyleHook") || null;
        style = (0, merge_1.default)(style, this.userStyle);
        var safeAreaProps = {};
        if (this.safeArea) {
            var getNotEmpty_1 = function (v, y) { return v !== undefined ? v : y !== undefined && y || null; };
            var addValstoSafeAreaIfExists_1 = function (val, willAdd) { return typeof willAdd === "number" && typeof val === "number" ? val + willAdd : willAdd; };
            var assigntoSafeAreaIfNotEmpty = function (prop) { return _this.safeArea[prop] !== undefined && (safeAreaProps[prop] = addValstoSafeAreaIfExists_1(getNotEmpty_1(style[prop], _this.styles[prop]), _this.safeArea[prop])); };
            assigntoSafeAreaIfNotEmpty("paddingTop");
            assigntoSafeAreaIfNotEmpty("paddingBottom");
            assigntoSafeAreaIfNotEmpty("paddingRight");
            assigntoSafeAreaIfNotEmpty("paddingLeft");
        }
        var diffReducer = !force && reduceDiffStyleHook ? reduceDiffStyleHook(this.styles || {}, Object.assign({}, style)) : null;
        var rawDiff = isFunction(diffReducer) ? Object.keys(style).reduce(diffReducer, {}) : (0, merge_1.default)(this.styles, style);
        if (rawDiff) {
            Object.assign(rawDiff, safeAreaProps); // Object.assign(style, safeAreaProps);
        }
        var beforeHook = hooks("beforeStyleDiffAssign");
        var diff = beforeHook && beforeHook(rawDiff) || rawDiff;
        var hasDiff = diff !== null && Object.keys(diff).length > 0; //TODO: extract all specified area @cenk
        // ------------->
        var isScrollView = _component.layout && (_component instanceof require("@smartface/native/ui/scrollview"));
        _component.subscribeContext ? hasDiff && _component.subscribeContext({
            type: "new-styles",
            style: Object.assign({}, diff),
            rawStyle: (0, merge_1.default)(rawDiff)
        }) : hasDiff && Object.keys(diff).forEach(function (key) {
            try {
                if (!isScrollView && _component.layout && SCW_LAYOUT_PROPS[key]) {
                    componentAssign(_component.layout, SCW_LAYOUT_PROPS[key], diff[key]);
                }
                else {
                    componentAssign(_component, key, diff[key]);
                }
            }
            catch (e) {
                e.message = "When [" +
                    key +
                    "] raw value : [\n" +
                    toStringUtil_1.default(style[key]) +
                    "\n] \n is being assigned as : [\n" +
                    toStringUtil_1.default(diff[key]) +
                    "\n\r] " +
                    e.message;
                throw e;
            }
        }); // <-------------------
        var afterHook = hooks("afterStyleDiffAssign");
        //isScrollView && console.log("diff: " + JSON.stringify(diff)+"\nRawDiff: " + JSON.stringify(rawDiff)+"\n");
        //this.component.onStylesApply && this.component.onStylesApply(diff);
        afterHook && (style = afterHook(style));
        this.styles = style;
        return this;
    };
    Stylable.prototype.applyStyles = function (force) {
        if (force === void 0) { force = false; }
        this.computeAndAssignStyle(this.waitedStyle, force);
        this.clearDirty();
        return this;
    };
    Stylable.prototype.setStyles = function (style, force) {
        if (force === void 0) { force = false; }
        this.waitedStyle = (0, merge_1.default)(this.waitedStyle, style);
        this.makeDirty();
        return this;
    };
    Stylable.prototype.getStyles = function () {
        return this.styles ? Object.assign({}, this.styles) : {};
    };
    Stylable.prototype.getClassName = function () {
        return this.classNames.join(" ");
    };
    Stylable.prototype.setInitialStyles = function (style) {
        this.styles = Object.assign({}, style);
    };
    Stylable.prototype.getDefaultClassNames = function () {
        return this.defaultClassNames.join(" ");
    };
    Stylable.prototype.classNamesCount = function () {
        return this.classNames.length;
    };
    Stylable.prototype.removeClassName = function (className) {
        return this.removeClassNames(className);
    };
    Stylable.prototype.removeClassNames = function (classNames) {
        var classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
        this.classNames = this.classNames.filter(function (cname) { return !classNamesArr.some(function (rname) { return cname === rname; }); });
        classNamesArr.length && (this.isDirty = true);
        return this.getClassName();
    };
    Stylable.prototype.resetClassNames = function (classNames) {
        if (classNames === void 0) { classNames = []; }
        this.classNames = [];
        __spreadArrays(this.initialClassNames, classNames).forEach(this.addClassName.bind(this));
        this.isDirty = true;
        return this;
    };
    Stylable.prototype.hasClassName = function (className) {
        return this.classNames.some(function (cname) {
            return cname === className;
        });
    };
    Stylable.prototype.pushClassNames = function (classNames) {
        var _this = this;
        var classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
        var newClassNames = classNamesArr.filter(function (className) { return _this.classNames.some(function (cname) {
            return cname !== className;
        }); });
        if (newClassNames.length) {
            this.classNames = __spreadArrays(this.classNames, newClassNames);
            this.isDirty = true;
        }
        return this.getClassName();
    };
    Stylable.prototype.addClassName = function (className, index) {
        if (!this.hasClassName(className)) {
            this.classNames.splice(index, 1, className);
            this.isDirty = true;
        }
        return this.getClassName();
    };
    Stylable.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.styles = null;
    };
    Stylable.prototype.getInitialClassName = function () {
        return this.initialClassNames;
    };
    return Stylable;
}(Actor_1.default));
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
//# sourceMappingURL=Stylable.js.map