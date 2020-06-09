import Actor from '../core/Actor';

declare class Theme {
  constructor(options: { name: string, rawStyles: string, isDefault: boolean });
  
  isDefault(): boolean;

  setDefault(value: boolean): boolean;

  build(): void;

  asStyler(): () => any;
}

declare class Themeable extends Actor {
  constructor(pageContext: () => any, name: string);
  
  changeStyling(styling: any): void;
  dispose(): void;
}

/**
 * Theme Context. Returns context bound
 * 
 * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
 * 
 * @returns {function} - Context dispatcher
 */
export function createThemeContextBound(themes: {name: string, rawStyles: { [key: string]: any }, isDefault: boolean}[]): () => any;