import Actor from "../core/Actor";
import View = require("@smartface/native/ui/view");

declare function componentAssign(component: View, key: string, value: { [key: string]: any }): void;

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
export default function makeStylable(options: { component: View, classNames: string[] | string, defaultClassNames: string[] | string, userStyle: { [key: string]: any }, name: string }): Stylable;

declare class Stylable extends Actor {
  constructor(component: View, name: string, classNames: string[] | string, defaultClassNames: string[] | string, userStyle: { [key: string]: any });
  getUserStyle(): { [key: string]: any };

  setSafeArea(area: { [key: string]: any }): Stylable;

  makeDirty(): void;

  clearDirty(): void;

  updateUserStyle(props: { [key: string]: any }): Stylable;
  reset(): Stylable;

  setUserStyle(props: { [key: string]: any }): Stylable;

  computeAndAssignStyle(style: { [key: string]: any }, force: boolean): Stylable;

  applyStyles(force: boolean): Stylable;

  setStyles(style: { [key: string]: any }, force: boolean): Stylable;

  getStyles(): { [key: string]: any };

  getClassName(): string

  setInitialStyles(style: { [key: string]: any }): void;

  getDefaultClassNames(): string;

  classNamesCount(): number;

  removeClassName(className: string): string;

  removeClassNames(classNames: string[] | string): string;

  resetClassNames(classNames: string[]): Stylable

  hasClassName(className: string): boolean;

  pushClassNames(classNames: string[] | string): string;

  addClassName(className: string, index: number): string

  dispose(): void;

  getInitialClassName(): string[];
}


declare function isFunction(functionToCheck: () => any): boolean;