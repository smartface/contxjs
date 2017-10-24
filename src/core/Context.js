import {INIT_CONTEXT_ACTION_TYPE} from "./constants";

function addMiddleware(mware){
}

export function createInitAction(){
  return {
    type: INIT_CONTEXT_ACTION_TYPE
  }
}

export default function createContext(actors, reducer, initialState={}){
  class Context {
    constructor(){
      this.actors = {collection: {}, $$map: []};
      this.state = Object.assign({}, initialState);
      this.setActors(Object.assign({}, actors));
      this.dispatch({type: INIT_CONTEXT_ACTION_TYPE});
    }
    
    setActors = (actors) => {
      Object.keys(actors)
        .forEach((name) => {
          this.actors.$$map.push(name);
          this.actors.collection[name] = actors[name];
          actors[name].setContextDispatcher((action, target) => this.dispatch(action, target));
        });
  
      this.propagateAll();
    }
    
    map = (fn) => {
      this.actors.$$map.forEach(name => {
        fn(this.actors.collection[name], name);
      });
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
      this.setState(reducer(this, action, target));
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
