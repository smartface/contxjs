import View = require("sf-core/ui/view");

/**
 * Creates new page context boundry
 * 
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
export default function createPageContext(component: View, name: string, reducers: () => {} = null): void;

declare function contextReducer(context: any[], action: string, target: any, state: any): any;