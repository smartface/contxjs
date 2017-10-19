(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["module", "exports", "../lib/StyleContext", "@smartface/styler/lib/styler", "@smartface/styler/lib/commandsManager", "@smartface/styler/lib/utils/merge", "./sfCorePropFactory", "../core/constants", "@smartface/styler/lib/buildStyles"], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, exports, require("../lib/StyleContext"), require("@smartface/styler/lib/styler"), require("@smartface/styler/lib/commandsManager"), require("@smartface/styler/lib/utils/merge"), require("./sfCorePropFactory"), require("../core/constants"), require("@smartface/styler/lib/buildStyles"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, mod.exports, global.StyleContext, global.styler, global.commandsManager, global.merge, global.sfCorePropFactory, global.constants, global.buildStyles);
		global.pageContext = mod.exports;
	}
})(this, function (module, exports, _StyleContext, _styler, _commandsManager, _merge, _sfCorePropFactory, _constants, buildStyles) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _StyleContext2 = _interopRequireDefault(_StyleContext);

	var _styler2 = _interopRequireDefault(_styler);

	var _commandsManager2 = _interopRequireDefault(_commandsManager);

	var _merge2 = _interopRequireDefault(_merge);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	// const theme = buildStyles(require("../themes/blue"));
	var orientationState = "ended";

	_commandsManager2.default.addRuntimeCommandFactory(function (type) {
		/*switch (type) {
  	case '+page':
  		return function pageCommand(opts) {
  			opts = merge(opts);
  			var isOK = (function(Screen) { return eval(opts.args); }({ width: Screen.width, height: Screen.height }));
  			return isOK ? opts.value : {};
  		};
  	case '+orientationChange':
  		return function pageCommand(opts) {
  			opts = merge(opts);
  			var isOK = (function(Screen, orientation) {
  				return eval(opts.args);
  			}({ width: Screen.width, height: Screen.height }, orientationState));
  			return isOK ? opts.value : {};
  		};
  	case "+isTablet_landscape":
  		return function pageCommand(opts) {
  			opts = merge(opts);
  			var isOK = isTablet && Screen.width > Screen.height;
  			return isOK ? opts.value : {};
  		};
  	case "+isTablet_portrait":
  		return function pageCommand(opts) {
  			opts = merge(opts);
  			var isOK = isTablet && Screen.width < Screen.height;
  			return isOK ? opts.value : {};
  		};
  	case "+isTablet":
  		return function pageCommand(opts) {
  			opts = merge(opts);
  			return isTablet ? opts.value : {};
  		};
  }*/
	});

	function createContext(component, name) {
		var classMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
		var reducers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		var styleContext = _StyleContext2.default.fromSFComponent(component, name,
		//initial classNames
		function (name) {
			var id = "#" + name;

			return classMap ? id + " " + classMap(name) : id;
		},
		//context hooks
		function (hook) {
			switch (hook) {
				case 'beforeAssignComponentStyles':
					return function beforeStyleAssignment(name, className) {
						return className;
					};
				case 'beforeStyleDiffAssign':
					return function beforeStyleAssignment(styles) {
						Object.keys(styles).forEach(function (key) {
							styles[key] = (0, _sfCorePropFactory.createSFCoreProp)(key, styles[key]);
						});

						return styles;
					};
				case 'reduceDiffStyleHook':
					return function reduceDiffStyleHook(oldStyles, newStyles) {
						function isEqual(oldStyle, newStyle) {
							if (oldStyle === undefined) {
								return false;
							}

							var keys1 = Object.keys(oldStyle);
							var keys2 = Object.keys(newStyle);

							if (keys1.length !== keys2.length) {
								return false;
							}

							var res = keys2.some(function (key) {
								return oldStyle[key] !== newStyle[key];
							});

							return !res;
						}

						return function diffStylingReducer(acc, key) {
							// console.log(key+":::"+acc[key]+":::"+JSON.stringify(newStyles[key]))
							//align is readolnly issue
							if (key === 'align') {
								delete acc[key];
								return acc;
							} else if (key == "flexProps") {
								//if(!oldStyles[key] === undefined){
								// Object.assign(acc, newStyles[key]);
								// } else {
								Object.keys(newStyles[key]).forEach(function (name) {
									if (!oldStyles[key] || newStyles[key][name] !== oldStyles[key][name]) {
										acc[name] = newStyles[key][name];

										if (newStyles[key][name] === null) {
											acc[name] = NaN;
											if (name === "flexGrow") {
												acc[name] = 0;
											}
										} else {
											acc[name] = newStyles[key][name];
										}
									}
								});
								// }
							} else if (newStyles[key] !== null && _typeof(newStyles[key]) === "object") {
								if (Object.keys(newStyles[key]).length > 0 && !isEqual(oldStyles[key], newStyles[key])) {
									acc[key] = newStyles[key];
								}
							} else if (oldStyles[key] !== newStyles[key]) {
								acc[key] = newStyles[key];
							}

							if (acc[key] === null) {
								acc[key] = NaN;
							}

							return acc;
						};
					};
			}
		});

		var _contextReducer = reducers ? function (state, actors, action, target) {
			reducers(contextReducer(state, actors, action, target), actors, action, target);
		} : contextReducer;

		// creates an initial styling for the context
		// styleContext(styling, _contextReducer);

		return function setStyle(newStyles) {
			try {
				var styling = (0, _styler2.default)(newStyles);
				// injects a new styling to the context
				styleContext(styling, _contextReducer);
			} catch (e) {

				throw e;
			}
		};
	}

	function contextReducer(state, actors, action, target) {
		var newState = Object.assign({}, state);

		switch (action.type) {
			case "addChild":

				return newState;
			case "invalidate":
				Object.keys(actors).forEach(function (name) {
					var actor = actors[name];
					actor.setUgly(true);
				});

				return newState;
			case "orientationStarted":
				Object.keys(actors).forEach(function (name) {
					var actor = actors[name];
					actor.setUgly(true);
				});

				orientationState = "started";
				return newState;
			case "orientationEnded":
				Object.keys(actors).forEach(function (name) {
					var actor = actors[name];
					actor.setUgly(true);
				});

				orientationState = "ended";

				return newState;
		}

		return state;
	}

	exports.default = createContext;
	module.exports = exports["default"];
});