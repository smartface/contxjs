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
    this._actorInternal_.componentKey = {};
    this._actorInternal_.component = new WeakMap();
    this._actorInternal_.component.add(this._actorInternal_.componentKey, component);
    this._actorInternal_.name = name;
    this._actorInternal_.id = id;
    this.isDirty = true;
    this.hooks = null;
  }
  
  getName() {
    return this._actorInternal_.name;
  }

  setID(id){
    if (!this._actorInternal_.id) {
      this._actorInternal_.id = id;
    }
  }

  setName(name ){
    if (!this._actorInternal_.name) {
      this._actorInternal_.name = name;
    }
  }

  getID () {
    return this._actorInternal_.id;
  }

  getInstanceID () {
    return this.getName() + "@@" + this.getID();
  }

  reset () {}

  setDirty (value) {
    this.isDirty = value;
  }

  getDirty (value) {
    return this.isDirty;
  }

  onRemove() {
    const component = this.getComponent();
    component.onRemove && component.onRemove();
  }

  onError(err) {
    const component = this.getComponent();
    if (component.onError) return component.onError(err);
    return false;
  }
  
  getComponent(){
    return this._actorInternal_.component.get(this._actorInternal_.componentKey);
  }

  componentDidLeave(){
    const component = this.getComponent();
    component.componentDidLeave && component.componentDidLeave();
  }

  componentDidEnter(dispatcher){
    const component = this.getComponent();
    this._dispatcher = dispatcher;
    
    component.onUnload = function(){
      dispatcher({
        type: "unload"
      });
    };

    try {
      component.componentDidEnter ? component.componentDidEnter(action => {
        dispatcher(action, this.getInstanceID());
      }) : component.dispatch = action => {
        dispatcher(action, this.getInstanceID());
      };
    } catch (e) {
      e.message = `Error. When component ${this.getName()} entered the context.`;
      (raiseErrorMaybe)(e, !!this._actorInternal_ && !!component && component.onError);
    }
  }
}
