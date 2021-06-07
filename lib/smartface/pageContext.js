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
var commandsManager_1 = __importDefault(require("@smartface/styler/lib/commandsManager"));
var merge_1 = __importDefault(require("@smartface/styler/lib/utils/merge"));
var sfCorePropFactory_1 = __importDefault(require("./sfCorePropFactory"));
var screen_1 = __importDefault(require("@smartface/native/device/screen"));
var system_1 = __importDefault(require("@smartface/native/device/system"));
var isTablet_1 = __importDefault(require("../core/isTablet"));
var fromSFComponent_1 = __importStar(require("./fromSFComponent"));
var orientationState = "ended";
commandsManager_1.default.addRuntimeCommandFactory(function pageContextRuntimeCommandFactory(type, error) {
    switch (type) {
        case '+Device':
            return function deviceRule(opts) {
                var Device = {
                    screen: {
                        width: screen_1.default.width,
                        height: screen_1.default.height
                    },
                    os: system_1.default.OS,
                    osVersion: system_1.default.OSVersion,
                    type: isTablet_1.default ? "tablet" : "phone",
                    orientation: screen_1.default.width > screen_1.default.height ? "landscape" : "portrait",
                    language: system_1.default.language
                };
                opts = merge_1.default(opts);
                var isOK = false;
                try {
                    isOK = eval(opts.args);
                }
                catch (e) {
                    error && error(e);
                    return {};
                }
                return isOK ? opts.value : {};
            };
    }
});
/**
 * Creates new page context boundry
 *
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
function createPageContext(component, name, reducers) {
    if (reducers === void 0) { reducers = null; }
    var styleContext = fromSFComponent_1.default(component, name, 
    //context hooks
    function (hook) {
        switch (hook) {
            case 'beforeStyleDiffAssign':
                return function beforeStyleDiffAssign(styles) {
                    return sfCorePropFactory_1.default(styles);
                };
            case 'reduceDiffStyleHook':
                return function reduceDiffStyleHook(oldStyles, newStyles) {
                    function isEqual(oldStyle, newStyle) {
                        if (oldStyle === undefined) {
                            return false;
                        }
                        var keys1 = Object.keys(oldStyle);
                        var keys2 = Object.keys(newStyle);
                        if (keys1.length !== keys2.length) {
                            return false;
                        }
                        var res = keys2.some(function (key) {
                            return oldStyle[key] !== newStyle[key];
                        });
                        return !res;
                    }
                    return function diffStylingReducer(acc, key) {
                        // align is readolnly issue on Android
                        if (key === 'align') {
                            acc[key] = undefined;
                            return acc;
                        }
                        else if (key === "layout") {
                            var diffReducer = reduceDiffStyleHook(oldStyles[key] || {}, newStyles[key] || {});
                            Object.keys(newStyles[key] || {}).reduce(diffReducer, acc[key] = {});
                        }
                        else if (key == "flexProps" && newStyles[key]) {
                            Object.keys(newStyles[key])
                                .forEach(function (name) {
                                if (oldStyles[key] === undefined || newStyles[key][name] !== oldStyles[key][name]) {
                                    acc[name] = newStyles[key][name];
                                    if (newStyles[key][name] === null) {
                                        acc[name] = NaN;
                                        // fixes flexgrow NaN value bug
                                        if (name === "flexGrow") {
                                            acc[name] = 0;
                                        }
                                    }
                                    else {
                                        acc[name] = newStyles[key][name];
                                    }
                                }
                            });
                        }
                        else if (newStyles[key] !== null && newStyles[key] instanceof Object) {
                            if (Object.keys(newStyles[key]).length > 0 && !isEqual(oldStyles[key] || {}, newStyles[key])) {
                                acc[key] = merge_1.default(oldStyles[key], newStyles[key]);
                            }
                        }
                        else if (oldStyles[key] !== newStyles[key]) {
                            acc[key] = newStyles[key];
                        }
                        if (acc[key] === null) {
                            acc[key] = NaN;
                        }
                        return acc;
                    };
                };
        }
        return undefined;
    });
    var _contextReducer = reducers ?
        function (context, action, target, state) {
            var newState = contextReducer(context, action, target, state);
            return reducers(context, action, target, newState || state);
        } :
        contextReducer;
    // creates an initial styling for the context
    // styleContext(styling, _contextReducer);
    return function setStyle(styling) {
        try {
            // const styling = styler(newStyles);
            // injects a new styling to the context
            styleContext(styling, _contextReducer);
        }
        catch (e) {
            throw e;
        }
    };
}
function contextReducer(context, action, target, state) {
    var newState = Object.assign({}, state);
    switch (action.type) {
        case "updateUserStyle":
            context
                .find(target, { updateUserStyle: function () { throw new TypeError("Target " + target + " component cannot be found."); } })
                .updateUserStyle(action.userStyle);
            return newState;
        case "changeUserStyle":
            context.find(target, { setUserStyle: function () { throw new TypeError("Target " + target + " component cannot be found."); } })
                .setUserStyle(action.userStyle);
            return newState;
        case "updatePageSafeArea":
            context
                .find(target, { setSafeArea: function () { throw new TypeError("Target " + target + " component cannot be found."); } })
                .setSafeArea(Object.assign({}, action.safeArea));
            return newState;
        case "invalidate":
            context.map(function (actor) {
                actor.setDirty(true);
            });
            return newState;
        case 'addChild':
            var rootName = target + "_" + action.name;
            var ctree = fromSFComponent_1.createActorTreeFromSFComponent(action.component, action.name, target, action.defaultClassNames);
            /*if(action.classNames && typeof action.classNames !== 'string' && !Array.isArray(action.classNames)){
                throw new Error(action.classNames+" classNames must be String or Array");
            }*/
            ctree[target + "_" + action.name] &&
                action.classNames &&
                ctree[rootName].pushClassNames(action.classNames);
            action.userStyle && ctree[rootName].setUserStyle(action.userStyle);
            context.addTree(ctree);
            return newState;
        case 'removeChild':
            context.remove(target);
            return newState;
        case 'removeChildren':
            context.removeChildren(target);
            return newState;
        case 'pushClassNames':
            if (!action.classNames)
                throw new Error("Classnames must not be null or undefined");
            context.find(target).pushClassNames(action.classNames);
            return newState;
        case 'removeClassName':
            context.find(target).removeClassName(action.className);
            return newState;
        case "orientationStarted":
            context.map(function (actor) {
                actor.setDirty(true);
            });
            orientationState = "started";
            return newState;
        case "orientationEnded":
            context.map(function (actor) {
                actor.setDirty(true);
            });
            orientationState = "ended";
            return newState;
        case "updateComponent":
            var stylable = context.find(target);
            stylable.updateComponent(action.component);
            stylable.applyStyles(true);
            return newState;
    }
    return state;
}
exports.default = createPageContext;
//# sourceMappingURL=pageContext.js.map