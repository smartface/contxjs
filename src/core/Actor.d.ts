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
  constructor(component: object, name: string, id: number);

  updateComponent(comp: object): void;

  getName(): string;

  setID(id: number): void;

  setName(name: string): void;

  getID(): number

  getInstanceID(): string

  onError(err: any): any; // onError - boolean

  getComponent(): object;

  componentDidLeave(): void;

  reset(): void;

  setDirty(value: boolean): void;

  getDirty(): boolean;

  isChildof(parent: object): boolean;

  onRemove(): void;

  dispose(): void;

  componentDidEnter(dispatcher: any): void;
}
