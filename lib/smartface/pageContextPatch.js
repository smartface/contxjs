(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports", "js-base/core/extend", "./pageContext"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require("js-base/core/extend"), require("./pageContext"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.extend, global.pageContext);
    global.pageContextPatch = mod.exports;
  }
})(this, function (module, exports, _extend, _pageContext) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = pageContextPatch;

  var _extend2 = _interopRequireDefault(_extend);

  var _pageContext2 = _interopRequireDefault(_pageContext);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function pageContextPatch(page, name) {
    page.onLoad = onLoad.bind(page, page.onLoad.bind(page));
    page.onShow = onShow.bind(page, page.onShow.bind(page));
    page.onHide = onHide.bind(page, page.onHide ? page.onHide.bind(page) : null);
    var pageOnOrientationChange = onOrientationChange.bind(page, page.onOrientationChange ? page.onOrientationChange.bind(page) : null);

    function onLoad(superOnLoad) {
      superOnLoad();
    }

    function onHide(superOnHide) {
      superOnHide && superOnHide();
      this.onOrientationChange = function () {};
    }

    function onShow(superOnShow) {
      superOnShow();

      if (!this.styleContext) {
        this.styleContext = _pageContext2.default.createContext(this, name, null, function reducers(state, actors, action, target) {
          return state;
        });
        setTimeout(function () {
          this.dispatch({
            type: "invalidate"
          });

          this.layout.applyLayout();
        }.bind(this), 50);
      } else {
        this.dispatch({
          type: "invalidate"
        });
        this.layout.applyLayout();
      }

      this.onOrientationChange = pageOnOrientationChange;
    }

    function onOrientationChange(superOnOrientationChange) {
      this.dispatch({
        type: "orientationStarted"
      });

      this.layout.applyLayout();

      superOnOrientationChange && setTimeout(superOnOrientationChange.bind(this), 1);
      setTimeout(function () {
        this.dispatch({
          type: "orientationEnded"
        });

        this.layout.applyLayout();
      }.bind(this), 1);
    };

    page.setContextDispatcher = function (dispatcher) {
      this.dispatch = dispatcher;
    };
  };
  module.exports = exports["default"];
});