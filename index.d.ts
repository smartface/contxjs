declare module "core/util/raiseErrorMaybe" {
    export default function raiseErrorMaybe(e: any, fn: any): void;
}
declare module "core/Actor" {
    /**
     * Abstract Actor Class
     */
    export default class Actor {
        /**
         * @constructor
         * @param {object} component - Wrapped Component
         */
        constructor(component: object, name: any, id: any);
        _actorInternal_: {};
        isDirty: boolean;
        hooks: any;
        updateComponent(comp: any): void;
        getName(): any;
        setID(id: any): void;
        setName(name: any): void;
        getID(): any;
        getInstanceID(): string;
        onError(err: any): any;
        getComponent(): any;
        componentDidLeave(): void;
        reset(): void;
        setDirty(value: any): void;
        getDirty(value: any): boolean;
        isChildof(parent: any): boolean;
        onRemove(): void;
        dispose(): void;
        context: any;
        styles: any;
        componentDidEnter(dispatcher: any): void;
        _dispatcher: any;
    }
}
declare module "core/Context" {
    export default class Context {
        static getID: () => number;
        constructor(actors: any, reducer: any, initialState?: {}, hookFactory?: any);
        _hookFactory: any;
        actors: {
            collection: any;
            $$map: never[];
            $$idMap: {};
            $$nameMap: {};
            $$lastID: null;
        };
        _reducers: any[];
        state: any;
        getReducer(): any;
        setActors(actors: any): void;
        getLastActorID(): null;
        reduce(fn: any, acc?: {}): {};
        map(fn: any): any[];
        find(instance: any, notValue: any): any;
        /**
         * @params {} tree
         */
        addTree(tree: any): void;
        add(actor: any, name: any): any;
        removeChildren(instance: any): void;
        remove(instance: any): void;
        setState(state: any): void;
        propagateAll(): void;
        getState(): any;
        dispatch(action: any, target: any): void;
        dispose(): void;
        subcribe(fn: any): void;
    }
}
declare module "core/constants" {
    /**
     * Context Initialize action key
     * @type {string}
     */
    export const INIT_CONTEXT_ACTION_TYPE: string;
}
declare module "core/hooks" {
    export default function hooks(hooksList: any): (hook: any, value: any) => any;
}
declare module "core/isTablet" {
    export {};
}
declare module "smartface/PageWithContx" {
    const _exports: any;
    export = _exports;
}
declare module "smartface/componentContextPatch" {
    export default function componentContextPatch(component: any, name: any): void;
}
declare module "smartface/fromSFComponent" {
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
    export function extractTreeFromSFComponent(root: any, rootName: any, defaultClassNames: any, acc?: Object | null): Function;
    export default function fromSFComponent(root: any, rootName: any, hooksList?: any, collection?: {}): import("core/Context").default;
    export function createActorTreeFromSFComponent(component: any, name: any, rootName: any, defaultClassNames: any): {};
}
declare module "smartface/index" {
    namespace _default {
        export { addChild };
        export { removeChild };
        export { removeChildren };
        export { pageContext };
        export { pageContextPatch };
        export { componentContextPatch };
    }
    export default _default;
    import addChild from "smartface/action/addChild";
    import removeChild from "smartface/action/removeChild";
    import removeChildren from "smartface/action/removeChildren";
    import pageContext from "smartface/pageContext";
    import pageContextPatch from "smartface/pageContextPatch";
    import componentContextPatch from "smartface/componentContextPatch";
}
declare module "smartface/pageContext" {
    export default createPageContext;
    /**
     * Creates new page context boundry
     *
     * @param {object} component - Root component of the context
     * @param {string} name - Root component ID
     * @param {function} reducers - Reducers function
     */
    function createPageContext(component: object, name: string, reducers?: Function): (styling: any) => void;
}
declare module "smartface/pageContextPatch" {
    export default function pageContextPatch(page: any, name: any): () => void;
}
declare module "smartface/sfCorePropFactory" {
    /**
     * Create a sf-core value
     *
     * @function
     *
     * @param {string} key
     * @param {string/number} [value] value of property
     * @return {object/string/number} properties.
     */
    export function createSFCoreProp(key: string, value: any): object;
    export default function buildProps(objectVal: any): {};
}
declare module "smartface/action/addChild" {
    /**
     * Add context child action
     *
     * @param {string} name - Context name of the root component
     * @param {Object} component - Specified component
     * @param {string} classnames - Component classnames
     * @param {Object} userProps - Initial properties of the specified component
     *
     * @returns {Object}
     */
    export default function addChild(name: string, component: Object, classNames: string | undefined, userStyle: any, defaultClassNames: any): Object;
}
declare module "smartface/action/removeChild" {
    /**
     * Removes component from the Context
     *
     * @returns {Object}
     */
    export default function removeChild(): Object;
}
declare module "smartface/action/removeChildren" {
    /**
     * Removes specified component's children from context
     *
     * @param {string} name - Context name of the root component
     * @param {Object} component - Specified component
     *
     * @returns {Object}
     */
    export default function removeChildren(): Object;
}
declare module "styling/Stylable" {
    /**
     * Styleable Actor HOC. Decorates specifeid component and return an actor component
     *
     * @param {object} component - A component to decorate
     * @param {string} className - initial className for actor
     * @param {function} hooks - context's hooks dispatcher
     *
     * @returns {Object} - A Stylable Actor
     */
    export default function makeStylable({ component, classNames, defaultClassNames, userStyle, name }: object): Object;
}
declare module "styling/StyleContext" {
    /**
     * Style Context. Returns context composer
     *
     * @param {Array.<Object>} actors - Actors List
     * @param {function} hookMaybe - Hooks factory
     * @returns {function} - Context Composer Function
     */
    export function createStyleContext(actors: Array<Object>, hookMaybe: Function, updateContextTree: any): Function;
}
declare module "styling/ThemeContext" {
    /**
     * Theme Context. Returns context bound
     *
     * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
     *
     * @returns {function} - Context dispatcher
     */
    export function createThemeContextBound(themes: Array<{
        name: string;
        rawStyles: Object;
        isDefault: boolean;
    }>): Function;
}
declare module "styling/index" {
    namespace _default {
        export { addThemeableContext };
        export { changeTheme };
        export { pushClassNames };
        export { removeClassNames as removeClassName };
        export { removeClassNames };
        export { updateContextTree };
        export { ThemeContext };
        export { StyleContext };
    }
    export default _default;
    import ThemeContext from "styling/ThemeContext";
    import StyleContext from "styling/StyleContext";
}
declare module "styling/action/addThemeableContext" {
    /**
     * Creates an action that add a context to ThemeContext as a Context element.
     *
     * @params {function} - Context wrapper function
     */
    export default function addThemeableContext(context: any): {
        type: string;
        context: any;
    };
}
declare module "styling/action/changeTheme" {
    export default function changeTheme(themeName: any): {
        type: string;
        themeName: any;
    };
}
declare module "styling/action/forceComponentUpdate" {
    /**
     * Forces Component's invalidated.
     *
     * @params {string} name - Component classnames
     * @returns {Object}
     */
    export default function forceComponentUpdate(name: any): Object;
}
declare module "styling/action/pushClassNames" {
    /**
     * Push classnames to the target actor
     *
     * @params {string} classnames - Component classnames
     * @returns {Object}
     */
    export default function pushClassNames(classNames: any): Object;
}
declare module "styling/action/removeClassName" {
    /**
     * Push classnames to the target actor
     *
     * @deprecated
     * @params {string} classnames - Component classnames
     * @returns {Object}
     */
    export default function removeClassName(className: any): Object;
}
declare module "styling/action/removeClassNames" {
    /**
     * Push classnames to the target actor
     *
     * @params {string} classnames - Component classnames
     * @returns {Object}
     */
    export default function removeClassNames(className: any): Object;
}
declare module "util/flush" {
    export default function flush(str: string | undefined, obj: any): string;
}
declare module "util/patchMethod" {
    export default function patchMethod(scope: any, method: any, bindingfFunc: any): any;
}
declare module "util/toStringUtil" {
    function _default(value: any): any;
    export default _default;
}
