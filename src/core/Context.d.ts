import Actor from "./Actor";

declare interface IActorCollection {
    collection: Map<number, Actor>;
    $$map: any[];
    /**
     * Unused
     */
    $$idMap: { [key: string]: any };
    $$nameMap: { [key: string]: any };
    $$lastID: string | number | null;
}

declare function coreReduer(context: { [key: string]: any }, action: string, target: { [key: string]: any }, state: { [key: string]: any }): { [key: string]: any };

export default class Context {
  constructor(actors: IActorCollection, reducer: () => any, initialState: { [key: string]: any }, hookFactory: any);

  getReducer(): () => any;

  setActors(actors: IActorCollection): void;
  
  getLastActorID(): string | number;

  reduce(fn: () => any, acc: { [key: string]: any }): { [key: string]: any };
  map(fn: () => any): any[];

  find(instanceId: Actor, notValue?: any): Actor;
  
  /**
   * @params {} tree
   */
  addTree(tree: { [key: string]: any }): void;

  add(actor: Actor, name: string): string;

  removeChildren(instanceId: Actor): void;

  remove(instanceId: Actor): void;

  setState(state: { [key: string]: any }): void;

  propagateAll(): void;

  getState(): { [key: string]: any };

  dispatch(action: string, target: string): void;

  dispose(): void;

  subcribe(fn: () => any): void;
  
  static getID(): number;
}
