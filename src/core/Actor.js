/**
 * @module core/Actor
 */
 
import raiseErrorMaybe from "./util/raiseErrorMaybe";

/**
 * Abstract Actor Class
 */
export default class Actor {
  /**
   * @constructor
   * @param {object} component - Wrapped Component
   */
  constructor(component, name, id) {
    this._actorInternal_ = {};
    this._actorInternal_.component = component;
    this._actorInternal_.name = name;
    this._actorInternal_.id = id;
    this.isDirty = true;
    this.hooks = null;
  }
  
  getName = () => {
    return this._actorInternal_.name;
  }
  
  setID = (id) => {
    if(!this._actorInternal_.id){
      this._actorInternal_.id = id;
    } 
  }
  
  setName = (name) => {
    if(!this._actorInternal_.name){
      this._actorInternal_.name = name;
    } 
  }
  
  getID = () => {
    return this._actorInternal_.id;
  }
  
  getInstanceID = () => {
    return this.getName()+"@@"+this.getID();
  }
  
  setDirty = (value) => {
    this.isDirty = value;
  }
  
  getDirty = (value) => {
    return this.isDirty;
  }
  
  onRemove = () => {
    this._actorInternal_.component.onRemove && this._actorInternal_.component.onRemove();
  }
  
  onError = (err) => {
    if(this._actorInternal_.component.onError)
      return this._actorInternal_.component.onError(err);
    return false;
  }
  
  didComponentLeave = () => {
    typeof this._actorInternal_.component.didComponentLeave === 'function' && this._actorInternal_.component.didComponentLeave();
  }
  
  didComponentEnter = (dispatcher) => {
    this._dispatcher = dispatcher;
    
    try {
      this._actorInternal_.component.didComponentEnter
        ? this._actorInternal_.component.didComponentEnter((action) => {
            dispatcher(action, this.getInstanceID());
          })
        : this._actorInternal_.component.dispatch = (action) => {
            dispatcher(action, this.getInstanceID());
          };
    } catch(e){
      e.message = `Error when component ${this.getName()} enter the context.`;
      raiseErrorMaybe(e, !!this._actorInternal_ && !!this._actorInternal_.component && this._actorInternal_.component.onError)
    }
  }
}
