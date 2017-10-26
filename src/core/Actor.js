export default class Actor {
  constructor(component) {
    this._actorInternal_ = {};
    this._actorInternal_.component = component;
    this.isDirty = true;
  }
  
  setDirty = (value) => {
    this.isDirty = value;
  }
  
  getDirty = (value) => {
    return this.isDirty;
  }
  
  setContextDispatcher = (dispatcher) => {
    console.log("dispatcher : "+this.name+" : "+this._actorInternal_.component.setContextDispatcher+": "+dispatcher);
    
    this._dispatcher = dispatcher;
    this._actorInternal_.component.setContextDispatcher
    ? this._actorInternal_.component.setContextDispatcher((action) => {
        dispatcher(action, this.name);
      })
    : this._actorInternal_.component.dispatch = (action) => {
        dispatcher(action, this.name);
      };
  }
}
