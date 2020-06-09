/**
 * @module core/Actor
 */


/**
 * Abstract Actor Class
 */
export default abstract class Actor {
  /**
   * @constructor
   * @param {object} component - Wrapped Component
   */
  constructor(component: { [key: string]: any }, name: string, id: number);

  updateComponent(comp: { [key: string]: any }): void;

  getName(): string;

  setID(id: string | number): void;

  setName(name: string): void;

  getID(): string | number;

  getInstanceID(): string;

  onError(err: any): any; // onError - boolean

  getComponent(): { [key: string]: any };

  componentDidLeave(): void;

  reset(): void;

  setDirty(value: boolean): void;

  getDirty(): boolean;

  isChildof(parent: { [key: string]: any }): boolean;

  onRemove(): void;

  dispose(): void;

  componentDidEnter(dispatcher: any): void;
}
