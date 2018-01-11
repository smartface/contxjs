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
  
  reset = () => {
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
  
  componentDidLeave = () => {
    typeof this._actorInternal_.component.componentDidLeave === 'function' && this._actorInternal_.component.componentDidLeave();
  }
  
  componentDidEnter = (dispatcher) => {
    this._dispatcher = dispatcher;
    
    try {
      this._actorInternal_.component.componentDidEnter
        ? this._actorInternal_.component.componentDidEnter((action) => {
            dispatcher(action, this.getInstanceID());
          })
        : this._actorInternal_.component.dispatch = (action) => {
            dispatcher(action, this.getInstanceID());
          };
    } catch(e){
      e.message = `Error. When component ${this.getName()} entered the context.`;
      raiseErrorMaybe(e, !!this._actorInternal_ && !!this._actorInternal_.component && this._actorInternal_.component.onError);
    }
  }
}
