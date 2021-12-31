import { Style } from "@smartface/styler";
import Actor from "../core/Actor";

declare class Theme {
  constructor(options: { name: string; rawStyles: string; isDefault: boolean });

  isDefault(): boolean;

  setDefault(value: boolean): boolean;

  build(): void;

  asStyler(): (classNames?: string) => any;
}

export type ThemeContextAction =
  | { type: "unload" }
  | { type: "addThemeable"; name: string; pageContext: any }
  | { type: "removeThemeable" }
  | { type: "changeTheme"; theme: any };

declare class Themeable extends Actor {
  constructor(pageContext: () => any, name: string);

  changeStyling(styling: any): void;
  dispose(): void;
}

type ThemeGetStyleFn = (param: string) => undefined | Style;
type ThemeDispatchFn = (param: ThemeContextAction | null) => void;

type ThemeBoundryFn = (
  context?: any,
  name?: string
) => ThemeGetStyleFn | ThemeDispatchFn;
/**
 * Theme Context. Returns context bound
 *
 * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
 *
 * @returns {function} - Context dispatcher
 */
function createThemeContextBound(
  themes: {
    name: string;
    rawStyles: { [key: string]: any };
    isDefault: boolean;
  }[]
): ThemeBoundryFn;
