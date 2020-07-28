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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createThemeContextBound = void 0;
var Context_1 = __importDefault(require("../core/Context"));
var buildStyles_1 = __importDefault(require("@smartface/styler/lib/buildStyles"));
var styler_1 = __importDefault(require("@smartface/styler/lib/styler"));
var Actor_1 = __importDefault(require("../core/Actor"));
var Theme = /** @class */ (function () {
    function Theme(_a) {
        var name = _a.name, rawStyles = _a.rawStyles, _b = _a.isDefault, isDefault = _b === void 0 ? false : _b;
        this.name = name;
        this.rawStyles = rawStyles;
        this.setDefault(isDefault);
    }
    Theme.prototype.isDefault = function () {
        return this._isDefault;
    };
    Theme.prototype.setDefault = function (value) {
        this._isDefault = value;
        value && !this.bundle && this.build();
        return value;
    };
    Theme.prototype.build = function () {
        this.bundle = buildStyles_1.default(typeof this.rawStyles === 'function' ? this.rawStyles() : this.rawStyles);
    };
    Theme.prototype.asStyler = function () {
        return styler_1.default(this.bundle);
    };
    return Theme;
}());
var Themeable = /** @class */ (function (_super) {
    __extends(Themeable, _super);
    function Themeable(pageContext, name) {
        var _this = _super.call(this, pageContext, name) || this;
        _this.pageContext = pageContext;
        return _this;
    }
    Themeable.prototype.changeStyling = function (styling) {
        this.pageContext(styling);
        this.isDirty = true;
    };
    Themeable.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.pageContext(null);
        this.pageContext = null;
    };
    return Themeable;
}(Actor_1.default));
/**
 * Theme Context. Returns context bound
 *
 * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
 *
 * @returns {function} - Context dispatcher
 */
function createThemeContextBound(themes) {
    var themesCollection = themes.map(function (theme) { return new Theme(theme); });
    function themesReducer(context, action, target, state) {
        var newState = Object.assign({}, state);
        switch (action.type) {
            case 'unload':
                context.remove(target);
                return newState;
            case 'addThemeable':
                var actor = new Themeable(action.pageContext, action.name);
                context.add(actor, action.name);
                var theme = themesCollection.find(function (theme) { return theme.isDefault(); });
                actor.changeStyling(theme.asStyler());
                return newState;
            case 'removeThemeable':
                // context.map((actor) => {
                //   if(actor.getName() === action.name){
                //     context.remove(actor.getInstanceID());
                //   }
                // })
                context.remove(target);
                return newState;
            case 'changeTheme':
                themesCollection.forEach(function (theme) {
                    if (theme.name === action.theme) {
                        theme.setDefault(true);
                        context.map(function (actor) {
                            actor.changeStyling(theme.asStyler());
                        });
                    }
                    else {
                        theme.setDefault(false);
                    }
                });
                return __assign(__assign({}, state), { theme: action.theme });
        }
        return state;
    }
    var themeContext = new Context_1.default(
    // creates themes actors
    {}, themesReducer, 
    // initial state
    { theme: themesCollection.find(function (theme) { return theme.isDefault === true; }) });
    return function (pageContext, name) {
        pageContext === null
            ? themeContext.dispose()
            : pageContext !== undefined &&
                themeContext.dispatch({
                    type: "addThemeable",
                    name: name,
                    pageContext: pageContext
                });
        var id = themeContext.getLastActorID();
        return function themeContextDispatch(action) {
            if (action === null) {
                name && themeContext.dispatch({
                    type: "removeThemeable"
                }, id);
            }
            else {
                themeContext.dispatch(action);
            }
        };
    };
}
exports.createThemeContextBound = createThemeContextBound;
//# sourceMappingURL=ThemeContext.js.map