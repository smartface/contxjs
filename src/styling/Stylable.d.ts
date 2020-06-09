import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";
import findClassNames from "@smartface/styler/lib/utils/findClassNames";
import toStringUtil from '../util/toStringUtil';
import View = require("sf-core/ui/view");

const _findClassNames = (classNames) => findClassNames(classNames).reduce((acc, item) => !item && [] || [...acc, item.join('')], []);


declare function componentAssign(component: View, key: string, value: object): void;

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
export default function makeStylable(options: { component: View, classNames: string[] | string, defaultClassNames: string[] | string, userStyle: object, name: string }): Stylable;

declare class Stylable extends Actor {
  constructor(component: View, name: string, classNames: string[] | string, defaultClassNames: string[] | string, userStyle: object);
  getUserStyle(): object;

  setSafeArea(area: object): Stylable;

  makeDirty(): void;

  clearDirty(): void;

  updateUserStyle(props: object): Stylable;
  reset(): Stylable;

  setUserStyle(props: object): Stylable;

  computeAndAssignStyle(style: object, force: boolean = false): Stylable;

  applyStyles(force: boolean = false): Stylable;

  setStyles(style: object, force: boolean = false): Stylable;

  getStyles(): object;

  getClassName(): string

  setInitialStyles(style: object): void;

  getDefaultClassNames(): string;

  classNamesCount(): number;

  removeClassName(className: string): string;

  removeClassNames(classNames: string[] | string): string;

  resetClassNames(classNames: string[] = []): Stylable

  hasClassName(className: string): boolean;

  pushClassNames(classNames: string[] | string): string;

  addClassName(className: string, index: number): string

  dispose(): void;

  getInitialClassName(): string[];
}


declare function isFunction(functionToCheck: () => any): boolean;