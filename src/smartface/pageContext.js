import * as StyleContext from "../styling/StyleContext";
import styler from "@smartface/styler/lib/styler";
import commands from "@smartface/styler/lib/commandsManager";
import merge from "@smartface/styler/lib/utils/merge";
import buildProps from "./sfCorePropFactory";
import Screen from 'sf-core/device/screen';
import System from 'sf-core/device/system';
import isTablet from '../core/isTablet';
import makeStylable from '../styling/Stylable';
import hooks from '../core/hooks';
import Contants from "../core/constants";
import fromSFComponent, { createActorTreeFromSFComponent } from "./fromSFComponent";

var orientationState = "ended";

commands.addRuntimeCommandFactory(function pageContextRuntimeCommandFactory(type, error) {
	switch (type) {
		case '+Device':
			return function deviceRule(opts) {
				var Device = {
					screen: {
						width: Screen.width,
						height: Screen.height
					},
					os: System.OS,
					osVersion: System.OSVersion,
					type: isTablet ? "tablet" : "phone",
					orientation: Screen.width > Screen.height ? "landscape" : "portrait",
					language: System.language
				};

				opts = merge(opts);
				let isOK = false;

				try {
					isOK = eval(opts.args);
				} catch (e) {
					error && error(e);
					return {};
				}

				return isOK ? opts.value : {};
			};
	}
});

/**
 * Creates new page context boundry
 * 
 * @param {object} component - Root component of the context
 * @param {string} name - Root component ID
 * @param {function} reducers - Reducers function
 */
function createPageContext(component, name, reducers = null) {
	var styleContext = fromSFComponent(
		component,
		name,
		//context hooks
		function(hook) {
			switch (hook) {
				case 'beforeStyleDiffAssign':
					return function beforeStyleDiffAssign(styles) {
						return buildProps(styles);
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
							// align is readolnly issue on Android
							if (key === 'align') {
								acc[key] = undefined;
								return acc;
							}
							else if(key === "layout"){
								var diffReducer = reduceDiffStyleHook(oldStyles[key] || {}, newStyles[key] || {});
								Object.keys(newStyles[key] || {}).reduce(diffReducer, acc[key] = {} );
							}
							else if (key == "flexProps") {
								Object.keys(newStyles[key])
									.forEach(function(name) {
										if (oldStyles[key] === undefined || newStyles[key][name] !== oldStyles[key][name]) {
											acc[name] = newStyles[key][name];

											if (newStyles[key][name] === null) {
												acc[name] = NaN;
												// fixes flexgrow NaN value bug
												if (name === "flexGrow") {
													acc[name] = 0;
												}
											}
											else {
												acc[name] = newStyles[key][name];
											}
										}
									});
							}
							else if (newStyles[key] !== null && newStyles[key] instanceof Object) {
								if (Object.keys(newStyles[key]).length > 0 && !isEqual(oldStyles[key] || {}, newStyles[key])) {
									acc[key] = merge(oldStyles[key], newStyles[key]);
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

			return undefined;
		}
	);

	const _contextReducer = reducers ?
		function(context, action, target, state) {
			const newState = contextReducer(context, action, target, state);
			return reducers(context, action, target, newState || state);
		} :
		contextReducer;

	// creates an initial styling for the context
	// styleContext(styling, _contextReducer);

	return function setStyle(styling) {
		try {
			// const styling = styler(newStyles);
			// injects a new styling to the context
			styleContext(styling, _contextReducer);
		}
		catch (e) {
			throw e;
		}
	};
}

function contextReducer(context, action, target, state) {
	const newState = Object.assign({}, state);

	switch (action.type) {
		case "updateUserStyle":
			context
				.find(target, { updateUserStyle: () => { throw new TypeError(`Target ${target} component cannot be found.`) } })
				.updateUserStyle(action.userStyle);

			return newState;
		case "changeUserStyle":
			context.find(target, { setUserStyle: () => { throw new TypeError(`Target ${target} component cannot be found.`) } })
				.setUserStyle(action.userStyle);

			return newState;
		case "updatePageSafeArea":
			context
				.find(target, { setSafeArea: () => { throw new TypeError(`Target ${target} component cannot be found.`) } })
				.setSafeArea(Object.assign({}, action.safeArea));

			return newState;
		case "invalidate":
			context.map(function(actor) {
				actor.setDirty(true);
			});

			return newState;
		case 'addChild':
			const rootName = target + "_" + action.name;
			const ctree = createActorTreeFromSFComponent(action.component, action.name, target);

			/*if(action.classNames && typeof action.classNames !== 'string' && !Array.isArray(action.classNames)){
				throw new Error(action.classNames+" classNames must be String or Array");
			}*/

			ctree[target + "_" + action.name] &&
				action.classNames &&
				ctree[rootName].pushClassNames(action.classNames);

			action.userStyle && ctree[rootName].setUserStyle(action.userStyle);
			context.addTree(ctree);

			return newState;
		case 'removeChild':
			context.remove(target);
			return newState;
		case 'removeChildren':
			context.removeChildren(target);

			return newState;
		case 'pushClassNames':
			if (!action.classNames)
				throw new Error("Classnames must not be null or undefined");
			context.find(target).pushClassNames(action.classNames);

			return newState;
		case 'removeClassName':
			context.find(target).removeClassName(action.className);

			return newState;
		case "orientationStarted":
			context.map(function(actor) {
				actor.setDirty(true);
			});

			orientationState = "started";
			return newState;
		case "orientationEnded":
			context.map(function(actor) {
				actor.setDirty(true);
			});

			orientationState = "ended";
			return newState;
	}

	return state;
}

export default createPageContext;
