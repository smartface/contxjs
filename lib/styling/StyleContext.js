"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStyleContext = void 0;
var constants_1 = require("../core/constants");
var Context_1 = __importDefault(require("../core/Context"));
/**
 * Style Context. Returns context composer
 *
 * @param {Array.<Object>} actors - Actors List
 * @param {function} hookMaybe - Hooks factory
 * @returns {function} - Context Composer Function
 */
function createStyleContext(actors, hookMaybe, updateContextTree) {
    var context;
    /**
     * Context builder.
     *
     * @param {function) styling - Styling function from styler.
     * @param {function} reducer - Reducer function to run actions
     */
    return function recomposeStylingContext(styling, reducer) {
        // context reducer
        function contextUpdater(context, action, target, state) {
            var newState = Object.assign({}, state);
            switch (action.type) {
                case 'updateContext':
                    updateContextTree(context.actors);
                    break;
                case 'forceComponentUpdate':
                    var actor = context.find(target + "_" + action.name, null);
                    actor && actor.reset();
                    break;
                /*case 'addContextChild':
                  Array.isArray(action.newComp)
                    ? action.newComp.forEach((component) => {
                        context.add(component);
                      })
                    : context.add(action.newComp);
                break;*/
                case 'removeContextChild':
                    context.remove(action.name);
                    break;
            }
            if (target && action.type !== constants_1.INIT_CONTEXT_ACTION_TYPE) {
                newState = reducer(context, action, target, state);
                // state is not changed
                if (newState === state) {
                    // return current state instance
                    return state;
                }
            }
            context.map(function invalidateStyles(actor, name) {
                if (actor.isDirty === true || action.type === constants_1.INIT_CONTEXT_ACTION_TYPE) {
                    var className = actor.getClassName();
                    var beforeHook = hookMaybe("beforeAssignComponentStyles", null);
                    beforeHook && (className = beforeHook(name, className));
                    if (action.type === constants_1.INIT_CONTEXT_ACTION_TYPE || action.type === "addChild") {
                        var defaultClassNames = actor.getDefaultClassNames();
                        actor.setInitialStyles(defaultClassNames ? styling(defaultClassNames)() : {});
                    }
                    try {
                        if (className) {
                            actor.setStyles(styling(className)());
                        }
                        actor.applyStyles();
                    }
                    catch (e) {
                        e.message = "While actor's style [" + (name || className) + "] is set. \nActor name: [" + actor.getName() + "]\n" + e.message;
                        throw e;
                    }
                }
            });
            latestState = newState;
            return newState;
        }
        var latestState = context ?
            context.getState() : {};
        //creates new context
        context = new Context_1.default(context && context.reduce(function (acc, actor, name) { acc[name] = actor; return acc; }, {}) || actors, contextUpdater, latestState, hookMaybe);
        return context;
    };
}
exports.createStyleContext = createStyleContext;
//# sourceMappingURL=StyleContext.js.map