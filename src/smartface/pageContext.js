import StyleContext from "../lib/StyleContext";
import styler from "@smartface/styler/lib/styler";
import commands from "@smartface/styler/lib/commandsManager";
import merge from "@smartface/styler/lib/utils/merge";
import {createSFCoreProp} from "./sfCorePropFactory";
// stylerBuilder = require("library/styler-builder");

import Contants from "../core/constants";

const buildStyles = require("@smartface/styler/lib/buildStyles");
// const theme = buildStyles(require("../themes/blue"));
var orientationState = "ended";

commands.addRuntimeCommandFactory(function(type) {
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

function createContext(component, name, classMap = null, reducers = null) {
	var styleContext = StyleContext.fromSFComponent(
		component,
		name,
		//initial classNames
		function(name) {
			const id = "#" + name;

			return classMap ? id + " " + classMap(name) : id;
		},
		//context hooks
		function(hook) {
			switch (hook) {
				case 'beforeAssignComponentStyles':
					return function beforeStyleAssignment(name, className) {
						return className;
					};
				case 'beforeStyleDiffAssign':
					return function beforeStyleAssignment(styles) {
						Object.keys(styles)
							.forEach(function(key) {
								styles[key] = createSFCoreProp(key, styles[key]);
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

							let res = keys2.some(function(key) {
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
								Object.keys(newStyles[key])
									.forEach(function(name) {
										if (!oldStyles[key] || newStyles[key][name] !== oldStyles[key][name]) {
											acc[name] = newStyles[key][name];

											if (newStyles[key][name] === null) {
												acc[name] = NaN;
												if (name === "flexGrow") {
													acc[name] = 0;
												}
											}
											else {
												acc[name] = newStyles[key][name];
											}
										}
									});
								// }
							}
							else if (newStyles[key] !== null && typeof newStyles[key] === "object") {
								if (Object.keys(newStyles[key]).length > 0 && !isEqual(oldStyles[key], newStyles[key])) {
									acc[key] = newStyles[key];
								}
							}
							else if (oldStyles[key] !== newStyles[key]) {
								acc[key] = newStyles[key];
							}

							if (acc[key] === null) {
								acc[key] = NaN;
							}

							return acc;
						};
					};
			}
		}
	);

	const _contextReducer = reducers 
		? function(state, actors, action, target) {
				reducers(contextReducer(state, actors, action, target), actors, action, target);
			} 
		: contextReducer;

	// creates an initial styling for the context
	// styleContext(styling, _contextReducer);

	return function setStyle(newStyles) {
		try {
			const styling = styler(newStyles);
			// injects a new styling to the context
			styleContext(styling, _contextReducer);
		} catch (e) {
			
			throw e;
		}
	};
}

function contextReducer(state, actors, action, target) {
	const newState = Object.assign({}, state);
	
	switch (action.type) {
		case "addChild": 
			
			return newState;
		case "invalidate":
			Object.keys(actors).forEach(function(name) {
				var actor = actors[name];
				actor.setUgly(true);
			});

			return newState;
		case "orientationStarted":
			Object.keys(actors).forEach(function(name) {
				var actor = actors[name];
				actor.setUgly(true);
			});

			orientationState = "started";
			return newState;
		case "orientationEnded":
			Object.keys(actors).forEach(function(name) {
				var actor = actors[name];
				actor.setUgly(true);
			});

			orientationState = "ended";

			return newState;
	}

	return state;
}

export default createContext;
