import { INIT_CONTEXT_ACTION_TYPE } from "./constants";
import raiseErrorMaybe from "./util/raiseErrorMaybe";

export default class Context {

  constructor(actors, reducer, initialState = {}, hookFactory = null) {
    this._hookFactory = hookFactory;
    this.actors = { collection: [], $$map: [], $$idMap: {}, $$nameMap: {} };
    this.state = Object.assign({}, initialState);
    this._reducer = reducer;

    this.getReducer = () => {
      return this._reducer;
    };

    this.setActors = (actors) => {
      Object.keys(actors)
        .forEach((name) => {
          this.add(actors[name], name);
        });

      this.propagateAll();
    };

    this.reduce = (fn, acc = {}) => {
      return this.actors.collection.reduce((acc, name, index) => {
        return fn(acc, this.actors.collection[name], name, index);
      }, acc);
    };

    this.map = (fn) => {
      return this.actors.collection.map(fn);
    };

    this.find = (instance, notValue) => {
      return this.actors.collection[this.actors.$$idMap[instance]] || notValue;
    };

    this.addTree = (tree) => {
      Object.keys(tree).forEach((name) => this.add(tree[name], name));
    };

    this.add = (actor, name) => {
      //if(this.actors.$$nameMap[name]){
      //  throw new Error(name+" name must be unique");
      //  }
      // if(this.actors.collection[name]){
      // raiseErrorMaybe(new Error(`Child's name [${name}] must be unique in the same Container.`), actor.onError);
      // }
      !actor.getID() && actor.setID(Context.getID());
      const instance = actor.getInstanceID();
      //TODO: map by component type
      // const type = actor._actorInternal_.constructor.name;
      // this.actors.$$typeMap[type] ? this.actors.$$typeMap[type].push(id) : this.actors.$$typeMap[name] = [id];

      this.actors.$$idMap[instance] = this.actors.collection.length;
      // this.actors.$$map.push(this.actors.collection.length);
      // this.actors.$$nameMap[name] ?
      //   this.actors.$$nameMap[name].push(actor.getID()) :
      this.actors.$$nameMap[name] = this.actors.collection.length;
      this.actors.collection.push(actor);

      actor.hook = this._hookFactory;
      actor.componentDidEnter((action, target) => this.dispatch(action, target));

      return name;
    };

    this.removeChildren = (name) => {
      this.actors.collection.forEach(nm => {
        if (nm.getName().indexOf(name + "_") === 0) {
          this.remmove(name);
        }
      });
      // this.actors.collection = Object.keys(this.actors.collection);
    };

    this.remove = (instance) => {
      this.removeChildren(instance);

      const index = this.actors.$$idMap[instance];

      if (index >= 0) {
        const actor = this.actors.collection[index];
        delete this.actors.$$nameMap[actor.getName()];
        delete this.actors.$$idMap[actor.getInstanceID()];
        this.actors.collection.splice(index, 1);
        actor.componentDidLeave();
        actor.dispose();
      }
    };

    this.setState = (state) => {
      if (state !== this.state) {
        //const oldState = this.state;
        this.state = state;
        // this.propagateAll(state, oldState);
      }
    };

    this.propagateAll = () => {
      this.actors.collection.map((actor) => {
        actor.onContextChange && actor.onContextChange(this);
      });
    };

    this.getState = () => {
      return Object.assign({}, this.state);
    };

    this.dispatch = (action, target) => {
      try {
        const reducer = this.getReducer();
        const state = reducer(this, action, target, this.state || {});
        this.setState(state);
      }
      catch (e) {
        e.message = `An Error is occurred When action [${action.type}] run on target [${target}]. ${e.message}`;
        raiseErrorMaybe(e, target && !!this.actors.collection[target] && this.actors.collection[target].onError);
      }
    };

    this.dispose = () => {
      this.state = null;
      this.actors = null;
    };

    actors && this.setActors(Object.assign({}, actors));
    this.dispatch({ type: INIT_CONTEXT_ACTION_TYPE });

  }

  static getID = (function() {
    var ID = 1;
    return () => ++ID;
  })();

  subcribe(fn) {}

};
