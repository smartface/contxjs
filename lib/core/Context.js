(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./constants"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./constants"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.constants);
    global.Context = mod.exports;
  }
})(this, function (exports, _constants) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createInitAction = createInitAction;
  exports.default = createContext;

  var _constants2 = _interopRequireDefault(_constants);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function addMiddleware(mware) {}

  function createInitAction() {
    return {
      type: _constants2.default.INIT_CONTEXT_ACTION_TYPE
    };
  }

  function createContext(actors, updater, middlewares) {
    var initialState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var Context = function () {
      function Context() {
        var _this = this;

        _classCallCheck(this, Context);

        this.setState = function (state) {
          _this.state = Object.assign({}, state);
        };

        this.getState = function () {
          return Object.assign({}, _this.state);
        };

        this.dispatch = function (action, target) {
          _this.setState(updater(_this, action, target));
        };

        this.dispose = function () {
          _this.state = null;
          _this.actors = null;
        };

        // this.__id            = __id++;
        // this._subscribers    = new WeakMap();
        // this._subscriberKeys = new Map();
        this.actors = Object.assign({}, actors);
        this.state = Object.assign({}, initialState);
        // this.dispatch = this.dispatch.bind(this);
        // this.setState = this.setState.bind(this);
        // this.getState = tbbbbbbbbbhis.getState.bind(this);

        this.dispatch({ type: _constants2.default.INIT_CONTEXT_ACTION_TYPE });
      }

      Context.prototype.map = function map(fn) {
        return Object.keys(this.actors).map(function (name, index) {
          return fn(actors[name], name, index);
        });
      };

      Context.prototype.subcribe = function subcribe(fn) {};

      return Context;
    }();

    ;

    return new Context();
  }
});