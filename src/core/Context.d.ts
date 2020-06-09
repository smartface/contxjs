import Actor from "./Actor";

declare interface IActorCollection {
    collection: Map<number, Actor>;
    $$map: any[];
    /**
     * Unused
     */
    $$idMap: object;
    $$nameMap: object;
    $$lastID: number | null;
}

declare function coreReduer(context: object, action: string, target: object, state: object): object;

export default class Context {
  constructor(actors: IActorCollection, reducer: () => any, initialState: object, hookFactory: any);

  getReducer(): () => any;

  setActors(actors: IActorCollection): void;
  
  getLastActorID(): number

  reduce(fn: () => any, acc: object): object;
  map(fn: () => any): any[];

  find(instance: Actor, notValue: any): Actor;
  
  /**
   * @params {} tree
   */
  addTree(tree: object): void;

  add(actor: Actor, name: string): string;

  removeChildren(instance: Actor): void;

  remove(instance: Actor): void;

  setState(state: object): void;

  propagateAll(): void;

  getState(): object;

  dispatch(action: string, target: string): void;

  dispose(): void;

  subcribe(fn: () => any): void;
  
  static getID(): number;
}
