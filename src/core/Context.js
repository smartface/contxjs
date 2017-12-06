import { INIT_CONTEXT_ACTION_TYPE } from "./constants";
import raiseErrorMaybe from "./util/raiseErrorMaybe";

export default class Context {
  
  constructor(actors, reducer, initialState = {}, hookFactory = null) {
    this._hookFactory = hookFactory;
    this.actors = { collection: {}, $$map: [], $$idMap: {}, $$nameMap: {} };
    this.state = Object.assign({}, initialState);
    this._reducer = reducer;
    actors && this.setActors(Object.assign({}, actors));
    this.dispatch({ type: INIT_CONTEXT_ACTION_TYPE });
  }
  
  static getID = (function() {
    var ID = 1;
    return () => ++ID;
  }());

  getReducer = () => {
    return this._reducer;
  }

  setActors = (actors) => {
    Object.keys(actors)
      .forEach((name) => {
        this.add(actors[name], name);
      });

    this.propagateAll();
  }
  
  reduce = (fn, acc = {}) => {
    return this.actors.$$map.reduce((acc, name, index) => {
      return fn(acc, this.actors.collection[name], name, index);
    }, acc);
  }

  map = (fn) => {
    return this.actors.$$map.map((name, index) => {
      return fn(this.actors.collection[name], name, index);
    });
  }

  find = (name, notValue) => {
    return this.actors.collection[name] || notValue;
  }

  addTree = (tree) => {
    Object.keys(tree).forEach((name) => this.add(tree[name], name));
  }

  add = (actor, name) => {
    // if(this.actors.collection[name]){
    // raiseErrorMaybe(new Error(`Child's name [${name}] must be unique in the same Container.`), actor.onError);
    // }
    !actor.getID() && actor.setID(Context.getID());
    const instance = actor.getInstanceID();
    //TODO: map by component type
    // const type = actor._actorInternal_.constructor.name;
    // this.actors.$$typeMap[type] ? this.actors.$$typeMap[type].push(id) : this.actors.$$typeMap[name] = [id];

    this.actors.collection[instance] = actor;
    this.actors.$$idMap[actor.getID()] = instance;
    this.actors.$$map.push(instance);
    this.actors.$$nameMap[name] ?
      this.actors.$$nameMap[name].push(actor.getID()) :
      this.actors.$$nameMap[name] = [actor.getID()];

    actor.hook = this._hookFactory;
    actor.didComponentEnter((action, target) => this.dispatch(action, target));

    return name;
  }

  removeChildren = (name) => {
    this.actors.$$map.forEach(nm => {
      if (nm.indexOf(name + "_") === 0) {
        const actor = this.actors.collection[nm];
        actor.didComponentLeave();
        actor.dispose();
        delete this.actors.collection[nm];
      }
    });

    this.actors.$$map = Object.keys(this.actors.collection);
  }

  remove = (name) => {
    this.removeChildren(name);

    const actor = this.actors.collection[name];

    if (actor) {
      delete this.actors.collection[name];
      this.actors.$$map = Object.keys(this.actors.collection);
      actor.didComponentLeave();
      actor.dispose();
    }
  }

  setState = (state) => {
    if (state !== this.state) {
      const oldState = this.state;
      this.state = Object.assign({}, state);
      // this.propagateAll(state, oldState);
    }
  }

  propagateAll = () => {
    this.actors.$$map.map((name) => {
      const actor = this.actors.collection[name];
      actor.onContextChange && actor.onContextChange(this);
    });
  }

  getState = () => {
    return Object.assign({}, this.state);
  }

  dispatch = (action, target) => {
    // if(!this.getReducer()){
    //   console.log("Reducer cannot be empty! "+this.getReducer());
    //   return;
    // }
    
    try {
      const state = this.getReducer()(this, action, target);

      this.setState(state);
    }
    catch (e) {
      e.message = `An Error is occurred When action [${action.type}] run on target [${target}] in the ${e.pageName}. ${e.message}`;
      raiseErrorMaybe(e, target && !!this.actors.collection[target] && this.actors.collection[target].onError);
    }
  }

  dispose = () => {
    this.state = null;
    this.actors = null;
  }

  subcribe(fn) {}
};
