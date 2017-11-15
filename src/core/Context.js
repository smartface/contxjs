import {INIT_CONTEXT_ACTION_TYPE} from "./constants";

export function createInitAction(){
  return {
    type: INIT_CONTEXT_ACTION_TYPE
  };
}

export default function createContext(actors, reducer, initialState={}, hookMaybe=null){
  class Context {
    constructor(){
      this.actors = {collection: {}, $$map: []};
      this.state = Object.assign({}, initialState);
      this.setActors(Object.assign({}, actors));
      this.dispatch({type: INIT_CONTEXT_ACTION_TYPE});
    }
    
    setActors = (actors) => {
      // const oldActors = this.actors;
      // this.actors = [];
      Object.keys(actors)
        .forEach((name) => {
          // if(oldActors.collection[name]){
          //   this.actors.collection[name] !== actors[name]
          //   this.actors.collection[name] = actors[name];
          //   actors[name].setContextDispatcher((action, target) => this.dispatch(action, target));
          //   this.actors.$$map.push(name);
          // } else {
            
            /*this.actors.collection[name] = actors[name];
            actors[name].hook = hookMaybe;
            actors[name].setContextDispatcher((action, target) => this.dispatch(action, target));
            this.actors.$$map.push(name);*/
            
            this.add(actors[name], name);
          // }
        });
  
      this.propagateAll();
    }
    
    map = (fn) => {
      const acc = {};
      this.actors.$$map.forEach((name, index) => {
        acc[name] = fn(this.actors.collection[name], name, index);
      });
      
      return acc;
    }
    
    addTree = (tree) => {
      Object.keys(tree).forEach((name) => this.add(tree[name], name));
    }
    
    add = (actor, name) => {
      this.actors.collection[name] = actor;
      actor.hook = hookMaybe;
      actor.setContextDispatcher((action, target) => this.dispatch(action, target));
      this.actors.$$map.push(name);
    }
    
    removeChildren = (name) => {
      this.actors.$$map.forEach(name => {
        if(name.indexOf(name+"_") === 0){
          this.actors.collection[name].dispose();
          delete this.actors.collection[name];
        }
      });
      
      this.actors.$$map = Object.keys(this.actors.collection);
    }
    
    remove = (name) => {
      this.removeChildren(name);
      
      const actor = this.actors.collection[name];
      
      if(actor){
        delete this.actors.collection[name];
        this.actors.$$map = Object.keys(this.actors.collection);
        actor.dispose();
      }
    }
    
    setState = (state) => {
      if(state !== this.state){
        const oldState = this.state;
        this.state = Object.assign({}, state);
        this.propagateAll(state, oldState);
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
      try {
        const state = reducer(this, action, target);
        this.setState(state);
      } catch (e) {
        e.message = `An Error is occurred When action [${action.type}] run on target [${target}]. ${e.message}`;
        throw new Error(e);
      }
    }
    
    dispose = () => {
      this.state = null;
      this.actors = null;
    }
    
    subcribe(fn){
    }
  };
  
  return new Context();
}
