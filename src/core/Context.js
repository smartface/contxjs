import { INIT_CONTEXT_ACTION_TYPE } from "./constants";
import raiseErrorMaybe from "./util/raiseErrorMaybe";

const coreReduer = function(context, action, target, state) {
  switch (action.type) {
    case 'unload':
      context.remove(target);
      
      break;
    
    default:
      return state;
  }
};

export default class Context {

  constructor(actors, reducer, initialState = {}, hookFactory = null) {
    this._hookFactory = hookFactory;
    this.actors = {
      collection: {},
      $$map: [],
      $$idMap: {},
      $$nameMap: {},
      $$lastID: null
    };
    // new
    this._reducers = [];
    // new
    this.state = Object.assign({}, initialState);
    // new
    this._reducers.push(coreReduer);
    reducer && this._reducers.push(reducer);
    
    actors && this.setActors(Object.assign({}, actors));
    this.dispatch({
      type: INIT_CONTEXT_ACTION_TYPE
    });
  }

  getReducer() {
    return this._reducer;
  }

  setActors(actors) {
    Object.keys(actors).forEach(name => {
      this.add(actors[name], name);
    });
    this.propagateAll();
  }
  
  getLastActorID(){
    return this.actors.$$lastID;
  }

  reduce(fn, acc = {}) {
    return this.actors.$$map.reduce((acc, instance, index) => {
      return fn(acc, this.actors.collection[instance], instance, index);
    }, acc);
  }

  map(fn) {
    return this.actors.$$map.map((instance, index) => {
      return fn(this.actors.collection[instance], instance, index);
    });
  }

  find(instance, notValue) {
    return this.actors.collection[instance] || notValue;
  }

  addTree(tree) {
    Object.keys(tree).forEach(name => this.add(tree[name], name));
  }

  add(actor, name) {
    // if(this.actors.collection[name]){
    // raiseErrorMaybe(new Error(`Child's name [${name}] must be unique in the same Container.`), actor.onError);
    // }
    !actor.getID() && actor.setID(Context.getID());
    const instance = actor.getInstanceID(); //TODO: map by component type
    // const type = actor._actorInternal_.constructor.name;
    // this.actors.$$typeMap[type] ? this.actors.$$typeMap[type].push(id) : this.actors.$$typeMap[name] = [id];

    this.actors.collection[instance] = actor;
    this.actors.$$idMap[actor.getID()] = instance;
    this.actors.$$map.push(instance);
    this.actors.$$nameMap[name] ? this.actors.$$nameMap[name].push(actor.getID()) : this.actors.$$nameMap[name] = [actor.getID()];
    actor.hook = this._hookFactory;
    actor.componentDidEnter((action, target) => this.dispatch(action, target));
    this.actors.$$lastID = actor.getInstanceID();
    
    return name;
  }

  removeChildren(instance) {
    const actor = this.actors.collection[instance];
    
    this.actors.$$map.forEach(nm => {
      if (nm.indexOf(actor.getName() + "_") === 0) {
        const actor = this.actors.collection[nm];
        actor.componentDidLeave();
        actor.dispose();
        delete this.actors.collection[nm];
      }
    });
    
    this.actors.$$map = Object.keys(this.actors.collection);
  }

  remove(instance) {
    if(!instance){
      throw new Error("name cannot be empty");
    }
    
    this.removeChildren(instance);
    const actor = this.actors.collection[instance];
    
    // console.log("remove actor: "+actor.getInstanceID());

    if (actor) {
      delete this.actors.collection[instance];
      // console.log("before remove actor : "+JSON.stringify(this.actors.$$map));
      this.actors.$$map = Object.keys(this.actors.collection);
      // console.log("after remove actor : "+JSON.stringify(this.actors.$$map));
      actor.componentDidLeave();
      actor.dispose();
    }
  }

  setState(state) {
    if (state !== this.state) {
      this.state = state;
    }
  }

  propagateAll() {
    this.actors.$$map.map(instance => {
      const actor = this.actors.collection[instance];
      actor.onContextChange && actor.onContextChange(this);
    });
  }

  getState() {
    return Object.assign({}, this.state);
  }

  dispatch(action, target) {
    try {
      let state = this.state || {};
      this._reducers.forEach((reducer) => {
        state = reducer(this, action, target, state);
      });
      
      state && this.setState(state);
    } catch (e) {
      e.message = `An Error is occurred When action [${action.type}] run on target [${target}]. ${e.message}`;
      raiseErrorMaybe(e, target && !!this.actors.collection[target] && (e => this.actors.collection[target].onError(e)));
    }
  }

  dispose() {
    this.state = null;
    this.actors = null;
  }

  subcribe(fn) {}

  static getID = (function() {
    var ID = 1;
    return () => ++ID;
  })();
}
