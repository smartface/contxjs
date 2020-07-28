"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var raiseErrorMaybe_1 = __importDefault(require("./util/raiseErrorMaybe"));
var coreReduer = function (context, action, target, state) {
    switch (action.type) {
        case 'unload':
            context.remove(target);
            break;
        default:
            return state;
    }
};
var Context = /** @class */ (function () {
    function Context(actors, reducer, initialState, hookFactory) {
        if (initialState === void 0) { initialState = {}; }
        if (hookFactory === void 0) { hookFactory = null; }
        this._hookFactory = hookFactory;
        this.actors = {
            collection: new Map(),
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
            type: constants_1.INIT_CONTEXT_ACTION_TYPE
        });
    }
    Context.prototype.getReducer = function () {
        return this._reducer;
    };
    Context.prototype.setActors = function (actors) {
        var _this = this;
        Object.keys(actors).forEach(function (name) {
            _this.add(actors[name], name);
        });
        this.propagateAll();
    };
    Context.prototype.getLastActorID = function () {
        return this.actors.$$lastID;
    };
    Context.prototype.reduce = function (fn, acc) {
        if (acc === void 0) { acc = {}; }
        var res = [];
        this.actors.collection.forEach(function (actor, name) {
            acc = fn(acc, actor, name);
        });
        return acc;
    };
    Context.prototype.map = function (fn) {
        var res = [];
        this.actors.collection.forEach(function (actor, name) {
            res.push(fn(actor, name));
        });
        return res;
    };
    Context.prototype.find = function (instance, notValue) {
        return this.actors.collection.get(instance) || notValue;
    };
    Context.prototype.addTree = function (tree) {
        var _this = this;
        Object.keys(tree).forEach(function (name) { return _this.add(tree[name], name); });
    };
    Context.prototype.add = function (actor, name) {
        var _this = this;
        !actor.getID() && actor.setID(Context.getID());
        var instance = actor.getInstanceID(); //TODO: map by component type
        this.actors.collection.set(instance, actor);
        actor.hook = this._hookFactory;
        actor.componentDidEnter(function (action, target) { return _this.dispatch(action, target); });
        this.actors.$$lastID = actor.getInstanceID();
        return name;
    };
    Context.prototype.removeChildren = function (instance) {
        var _this = this;
        var removeActor = this.actors.collection.get(instance);
        this.actors.collection.forEach(function (actor, nm) {
            if (nm.indexOf(removeActor.getName() + "_") === 0) {
                actor.componentDidLeave();
                actor.dispose();
                _this.actors.collection.delete(nm);
            }
        });
    };
    Context.prototype.remove = function (instance) {
        if (!instance) {
            throw new Error("name cannot be empty");
        }
        this.removeChildren(instance);
        var actor = this.actors.collection.get(instance);
        if (actor) {
            this.actors.collection.delete(instance);
            actor.componentDidLeave();
            actor.dispose();
        }
    };
    Context.prototype.setState = function (state) {
        if (state !== this.state) {
            this.state = state;
        }
    };
    Context.prototype.propagateAll = function () {
        var _this = this;
        this.map(function (actor) {
            actor.onContextChange && actor.onContextChange(_this);
        });
    };
    Context.prototype.getState = function () {
        return Object.assign({}, this.state);
    };
    Context.prototype.dispatch = function (action, target) {
        var _this = this;
        try {
            var state_1 = this.state || {};
            this._reducers.forEach(function (reducer) {
                state_1 = reducer(_this, action, target, state_1);
            });
            state_1 && this.setState(state_1);
        }
        catch (e) {
            e.message = "An Error is occurred When action [" + action.type + "] run on target [" + (target || "") + "]. " + e.message;
            raiseErrorMaybe_1.default(e, target && !!this.actors.collection[target] && (function (e) { return _this.actors.collection[target].onError(e); }));
        }
    };
    Context.prototype.dispose = function () {
        this.state = null;
        this.actors = null;
    };
    Context.prototype.subcribe = function (fn) { };
    Context.getID = (function () {
        var ID = 1;
        return function () { return ++ID; };
    })();
    return Context;
}());
exports.default = Context;
//# sourceMappingURL=Context.js.map