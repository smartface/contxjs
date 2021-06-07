import View = require("@smartface/native/ui/view");

type styling = { [key: string]: any };
/**
 * Creates new page context boundry
 *
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
export default function createPageContext(
  component: View,
  name: string,
  reducers: () => any
): (styles: styling | null) => void;

declare function contextReducer(
  context: any[],
  action: string,
  target: any,
  state: any
): (styling: styling) => void;
