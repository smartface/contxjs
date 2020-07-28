"use strict";
/**
 * @module core/Actor
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var raiseErrorMaybe_1 = __importDefault(require("./util/raiseErrorMaybe"));
/**
 * Abstract Actor Class
 */
var Actor = /** @class */ (function () {
    /**
     * @constructor
     * @param {object} component - Wrapped Component
     */
    function Actor(component, name, id) {
        this._actorInternal_ = {};
        this._actorInternal_.componentKey = {};
        this._actorInternal_.component = new WeakMap();
        this._actorInternal_.component.set(this._actorInternal_.componentKey, component);
        // this._actorInternal_.component = component;
        this._actorInternal_.name = name;
        this._actorInternal_.id = id;
        this.isDirty = true;
        this.hooks = null;
    }
    Actor.prototype.updateComponent = function (comp) {
        this._actorInternal_.component.set(this._actorInternal_.componentKey, comp);
        this.setDirty(true);
    };
    Actor.prototype.getName = function () {
        return this._actorInternal_.name;
    };
    Actor.prototype.setID = function (id) {
        if (!this._actorInternal_.id) {
            this._actorInternal_.id = id;
        }
    };
    Actor.prototype.setName = function (name) {
        if (!this._actorInternal_.name) {
            this._actorInternal_.name = name;
        }
    };
    Actor.prototype.getID = function () {
        return this._actorInternal_.id;
    };
    Actor.prototype.getInstanceID = function () {
        return this.getName() + "@@" + this.getID();
    };
    Actor.prototype.onError = function (err) {
        var component = this.getComponent();
        if (component.onError)
            return component.onError(err);
        return false;
    };
    Actor.prototype.getComponent = function () {
        return this._actorInternal_.component.get(this._actorInternal_.componentKey);
        // return this._actorInternal_.component;
    };
    Actor.prototype.componentDidLeave = function () {
        var component = this.getComponent();
        component.componentDidLeave && component.componentDidLeave();
    };
    Actor.prototype.reset = function () { };
    Actor.prototype.setDirty = function (value) {
        this.isDirty = value;
    };
    Actor.prototype.getDirty = function (value) {
        return this.isDirty;
    };
    Actor.prototype.isChildof = function (parent) {
        return this.name.indexOf(parent + "_") === 0;
    };
    Actor.prototype.onRemove = function () {
        var component = this.getComponent();
        component.onRemove && component.onRemove();
    };
    Actor.prototype.dispose = function () {
        this.getComponent().onDispose && this.component.onDispose();
        this.getComponent().onSafeAreaPaddingChange = null;
        this.getComponent().dispatch = null;
        this.getComponent().onUnload = null;
        this._actorInternal_.component = null;
        this._actorInternal_ = null;
        this.context = null;
        this.styles = null;
    };
    Actor.prototype.componentDidEnter = function (dispatcher) {
        var _this = this;
        this._dispatcher = dispatcher;
        var component = this.getComponent();
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
            component.componentDidEnter ? component.componentDidEnter(function (action) {
                dispatcher(action, _this.getInstanceID());
            }) : component.dispatch = function (action) {
                dispatcher(action, _this.getInstanceID());
            };
        }
        catch (e) {
            e.message = "Error. When component " + this.getName() + " entered the context.";
            (0, raiseErrorMaybe_1.default)(e, !!this._actorInternal_ && !!component.component && component.onError);
        }
    };
    return Actor;
}());
exports.default = Actor;
//# sourceMappingURL=Actor.js.map