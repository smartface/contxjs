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
exports.createActorTreeFromSFComponent = exports.extractTreeFromSFComponent = void 0;
var hooks_1 = __importDefault(require("../core/hooks"));
var StyleContext = __importStar(require("../styling/StyleContext"));
var Stylable_1 = __importDefault(require("../styling/Stylable"));
var addChild_1 = __importDefault(require("./action/addChild"));
var removeChild_1 = __importDefault(require("./action/removeChild"));
var removeChildren_1 = __importDefault(require("./action/removeChildren"));
var raiseErrorMaybe_1 = __importDefault(require("../core/util/raiseErrorMaybe"));
var application_1 = __importDefault(require("sf-core/application"));
function addChild(superAddChild, child, name, classNames, userProps, defaultClassNames) {
    if (classNames === void 0) { classNames = ""; }
    if (userProps === void 0) { userProps = null; }
    if (defaultClassNames === void 0) { defaultClassNames = ""; }
    superAddChild(child);
    name && this.dispatch(addChild_1.default(name, child, classNames, userProps, defaultClassNames));
}
function removeChild(superRemoveChild, child) {
    if (child) {
        superRemoveChild && superRemoveChild(child);
        child.dispatch && child.dispatch(removeChild_1.default());
    }
    else {
        this.getParent && this.getParent() && this.getParent().removeChild(this);
        this.dispatch && this.dispatch(removeChild_1.default());
    }
}
function removeChildren(superRemoveAll) {
    superRemoveAll();
    this.dispatch && this.dispatch(removeChildren_1.default());
}
function createOriginals(component) {
    !component.__original_addChild && (component.__original_addChild = component.addChild);
    !component.__original_removeChild && (component.__original_removeChild = component.removeChild);
    !component.__original_removeAll && (component.__original_removeAll = component.removeAll);
}
function patchComponent(component, rootName, name) {
    try {
        if (component.layout && component.layout.addChild) {
            createOriginals(component.layout);
            Object.defineProperties(component.layout, {
                addChild: {
                    enumerable: true,
                    configurable: true,
                    value: addChild.bind(component, component.layout.__original_addChild.bind(component.layout))
                },
                removeChild: {
                    enumerable: true,
                    configurable: true,
                    value: removeChild.bind(component, component.layout.__original_removeChild.bind(component.layout))
                },
                removeAll: {
                    enumerable: true,
                    configurable: true,
                    value: removeChildren.bind(component, component.layout.__original_removeAll.bind(component.layout))
                }
            });
        }
        else if (component.addChild) {
            createOriginals(component);
            Object.defineProperties(component, {
                addChild: {
                    enumerable: true,
                    configurable: true,
                    value: addChild.bind(component, component.__original_addChild.bind(component))
                },
                removeChild: {
                    enumerable: true,
                    configurable: true,
                    value: removeChild.bind(component, component.__original_removeChild.bind(component))
                },
                removeAll: {
                    enumerable: true,
                    configurable: true,
                    value: removeChildren.bind(component, component.__original_removeAll.bind(component))
                }
            });
        }
        else {
            !component.removeChild && (component.removeChild = removeChild.bind(component));
        }
    }
    catch (e) {
        e.message = "An Error is occurred when component [" + name + "] is patched in the [" + rootName + "]. " + e.message;
        raiseErrorMaybe_1.default(e, component.onError);
    }
}
function createTreeItem(component, name, rootName, root, defaultClassNames) {
    var componentVars;
    var classNames = component.__tree_item === true ? component.classNames : "";
    if (name == rootName + "_statusBar") {
        componentVars = root.constructor && root.constructor.$$styleContext.statusBar || {};
        component = application_1.default.statusBar || component;
    }
    else if (name == rootName + "_headerBar") {
        componentVars = root.constructor && root.constructor.$$styleContext.headerBar || {};
    }
    else {
        componentVars = component.constructor && component.constructor.$$styleContext || {};
    }
    patchComponent(component, rootName, name);
    classNames = componentVars.classNames ?
        componentVars.classNames + " " + classNames + " #" + name :
        classNames + " #" + name;
    return {
        component: component,
        classNames: classNames,
        defaultClassNames: componentVars.defaultClassNames ?
            componentVars.defaultClassNames + (defaultClassNames ? (" " + defaultClassNames) : "") : defaultClassNames,
        userStyle: componentVars.userProps,
        name: name,
        __tree_item: true
    };
    // }
}
function buildContextTree(component, name, root, rootName, defaultClassNames, acc) {
    if (acc[name] === undefined) {
        acc[name] = createTreeItem(component, name, rootName, root, defaultClassNames);
    }
    component.children &&
        Object.keys(component.children).forEach(function (child) {
            var comp = component.children[child];
            try {
                if (comp.component !== undefined && comp.classNames !== undefined) {
                    buildContextTree(comp.component, createName(name, child), root, rootName, "", acc);
                }
                else {
                    buildContextTree(comp, createName(name, child), root, rootName, "", acc);
                }
            }
            catch (e) {
                e.message = "Error when component would be collected: " + child + ". " + e.message;
                raiseErrorMaybe_1.default(e, component.onError);
            }
        });
}
function createName(root, name) {
    return root + "_" + name;
}
/**
 * Extract components tree from a SF Component
 *
 * @param {Object} component - A sf-core component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * @param {?Object} acc [={}] - Initial Accumulator value
 *
 * @return {function} - context helper
 */
function extractTreeFromSFComponent(root, rootName, defaultClassNames, acc) {
    if (acc === void 0) { acc = {}; }
    buildContextTree(root, rootName, root, rootName, defaultClassNames, acc);
    return acc;
}
exports.extractTreeFromSFComponent = extractTreeFromSFComponent;
function fromSFComponent(root, rootName, hooksList, collection) {
    if (hooksList === void 0) { hooksList = null; }
    if (collection === void 0) { collection = {}; }
    var ctree = extractTreeFromSFComponent(root, rootName, null);
    Object.keys(ctree).forEach(function (name) {
        var item = ctree[name];
        ctree[name] = collection[name] || Stylable_1.default(item);
    });
    return StyleContext.createStyleContext(ctree, hooks_1.default(hooksList), function updateContextTree(contextElements) {
        if (contextElements === void 0) { contextElements = {}; }
        return fromSFComponent(root, rootName, hooksList, contextElements);
    });
}
exports.default = fromSFComponent;
function createActorTreeFromSFComponent(component, name, rootName, defaultClassNames) {
    var _a;
    if (component.addChild || component.layout) {
        var ctree_1 = extractTreeFromSFComponent(component, name, defaultClassNames);
        var _ctree_1 = {};
        Object.keys(ctree_1).forEach(function (name) { return _ctree_1[createName(rootName, name)] = Stylable_1.default(ctree_1[name]); });
        return _ctree_1;
    }
    else {
        return _a = {},
            _a[createName(rootName, name)] = Stylable_1.default(createTreeItem(component, name, rootName, component, defaultClassNames)),
            _a;
    }
}
exports.createActorTreeFromSFComponent = createActorTreeFromSFComponent;
//# sourceMappingURL=fromSFComponent.js.map