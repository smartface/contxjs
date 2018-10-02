/**
 * @module core/Actor
 */

const raiseErrorMaybe = require("./util/raiseErrorMaybe");

/**
 * Abstract Actor Class
 */
class Actor {
  /**
   * @constructor
   * @param {object} component - Wrapped Component
   */
  constructor(component, name, id) {
    this._actorInternal_ = {};
    this._actorInternal_.componentKey = {};
    this._actorInternal_.component = new WeakMap();
    this._actorInternal_.component.set(
      this._actorInternal_.componentKey,
      component
    );
    // this._actorInternal_.component = component;
    this._actorInternal_.name = name;
    this._actorInternal_.id = id;
    this.isDirty = true;
    this.hooks = null;
  }

  getName() {
    return this._actorInternal_.name;
  }

  setID(id) {
    if (!this._actorInternal_.id) {
      this._actorInternal_.id = id;
    }
  }

  setName(name) {
    if (!this._actorInternal_.name) {
      this._actorInternal_.name = name;
    }
  }

  getID() {
    return this._actorInternal_.id;
  }

  getInstanceID() {
    return this.getName() + "@@" + this.getID();
  }

  onError(err) {
    const component = this.getComponent();
    if (component.onError) return component.onError(err);
    return false;
  }

  getComponent() {
    return this._actorInternal_.component.get(
      this._actorInternal_.componentKey
    );
    // return this._actorInternal_.component;
  }

  componentDidLeave() {
    const component = this.getComponent();
    component.componentDidLeave && component.componentDidLeave();
  }

  reset() {}

  setDirty(value) {
    this.isDirty = value;
  }

  getDirty() {
    return this.isDirty;
  }

  makeDirty() {
    this.isDirty = true;
  }

  clearDirty() {
    this.isDirty = false;
  }

  isChildof(parent) {
    return this.name.indexOf(parent + "_") === 0;
  }

  onRemove() {
    const component = this.getComponent();
    component.onRemove && component.onRemove();
  }

  dispose() {
    this.getComponent().onDispose && this.component.onDispose();
    this.getComponent().onSafeAreaPaddingChange = null;
    this.getComponent().dispatch = null;
    this.getComponent().onUnload = null;
    this._actorInternal_.component = null;
    this._actorInternal_ = null;
    this.context = null;
    this.styles = null;
  }

  componentDidEnter(dispatcher) {
    this._dispatcher = dispatcher;

    const component = this.getComponent();
    this._dispatcher = dispatcher;

    // let _onUnload = component.onUnload;

    // component.onUnload = () => {
    //   dispatcher({
    //     type: "unload"
    //   },
    //   this.getInstanceID()
    //   );

    // _onUnload && _onUnload();
    // _onUnload = null;
    // };

    try {
      component.componentDidEnter
        ? component.componentDidEnter(action => {
            dispatcher(action, this.getInstanceID());
          })
        : (component.dispatch = action => {
            dispatcher(action, this.getInstanceID());
          });
    } catch (e) {
      e.message = `Error. When component ${this.getName()} entered the context.`;
      (0, raiseErrorMaybe)(
        e,
        !!this._actorInternal_ && !!component.component && component.onError
      );
    }
  }

  toString() {
    return `[object ${Actor}]`;
  }
}

module.exports = Actor;
