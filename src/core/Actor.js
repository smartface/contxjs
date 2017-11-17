/**
 * @module core/Actor
 */

/**
 * Abstract Actor Class
 */
export default class Actor {
  /**
   * @constructor
   * @param {object} component - Wrapped Component
   */
  constructor(component) {
    this._actorInternal_ = {};
    this._actorInternal_.component = component;
    this.isDirty = true;
    this.hooks = null;
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
      this._actorInternal_.component.onError(err);
    // else
    //   console.log(err.message);
  }
  
  onContextInit = (dispatcher) => {
    // console.log("dispatcher : "+this.name+" : "+this._actorInternal_.component.setContextDispatcher+": "+dispatcher);
    this._dispatcher = dispatcher;
    this._actorInternal_.component.setContextDispatcher
      ? this._actorInternal_.component.setContextDispatcher((action) => {
          dispatcher(action, this.getName());
        })
      : this._actorInternal_.component.dispatch = (action) => {
          dispatcher(action, this.getName());
        };
  }
}
