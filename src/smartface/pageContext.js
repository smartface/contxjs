import * as StyleContext from "../styling/StyleContext";
import styler from "@smartface/styler/lib/styler";
import commands from "@smartface/styler/lib/commandsManager";
import merge from "@smartface/styler/lib/utils/merge";
import buildProps from "./sfCorePropFactory";
import Screen from 'sf-core/device/screen';
import Device from 'sf-core/device/';
import System from 'sf-core/device/system';
import isTablet from '../core/isTablet';
import makeStylable from '../styling/Stylable';
import hooks from '../core/hooks';
import Contants from "../core/constants";
import fromSFComponent, {createActorTreeFromSFComponent} from "./fromSFComponent";
// import Filtrex from 'filtrex'

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
				try{
  				var isOK = eval(opts.args);
				} catch(e) {
				  error && error(e);
				  return {};
				}
				
				return isOK ? opts.value : {};
			};
	}
});

function createPageContext(component, name, classMap = null, reducers = null) {
	var styleContext = fromSFComponent(
		component,
		name,
		//context hooks
		function(hook) {
			switch (hook) {
				case 'beforeAssignComponentStyles':
					return function beforeAssignComponentStyles(name, className) {
						return className;
					};
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
								delete acc[key];
								return acc;
							} else if (key == "flexProps") {
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
											} else {
												acc[name] = newStyles[key][name];
											}
										}
									});
							} else if (newStyles[key] !== null && typeof newStyles[key] === "object") {
								if (Object.keys(newStyles[key]).length > 0 && !isEqual(oldStyles[key] || {}, newStyles[key])) {
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
			
			return undefined;
		}
	);

	const _contextReducer = reducers 
		? function(context, action, target) {
				contextReducer(context, action, target);
				reducers(context, action, target);
			}
		: contextReducer;

	// creates an initial styling for the context
	// styleContext(styling, _contextReducer);

	return function setStyle(styling) {
		try {
			// const styling = styler(newStyles);
			// injects a new styling to the context
			styleContext(styling, _contextReducer);
		} catch (e) {
			throw e;
		}
	};
}

function contextReducer(context, action, target) {
	const state = context.getState();
	const newState = Object.assign({}, state);
	// console.log("page context : "+JSON.stringify(action));
	
	switch (action.type) {
		case "invalidate":
			context.map(function(actor) {
				actor.setDirty(true);
			});

			return newState;
    case 'addChild':
    	const ctree = createActorTreeFromSFComponent(action.component, target+"_"+action.name);
    	if(action.classNames && typeof action.classNames !== 'string' && !Array.isArray(action.classNames)){
    		throw new Error(action.classNames+" classNames must be String or Array");
    	}
  		
    	ctree[target+"_"+action.name]
    		&& action.classNames
    		&& Array.isArray(action.classNames)
    			? ctree[target+"_"+action.name].pushClassNames(action.classNames)
    			: ctree[target+"_"+action.name].pushClassNames(action.classNames.split(" "));
    	context.addTree(ctree);
    	
      return newState;
      break;
    case 'removeChild':
		  context.remove(target);
      return newState;
      break;
    case 'removeChildren':
		  context.removeChildren(target);
	  
      return newState;
      break;
    case 'pushClassNames':
    	context.map((actor, name) => {
    		if(name === target){
					actor.pushClassNames(action.classNames);
    		}
    	});

      return newState;
      break;
    case 'removeClassName':
    	context.map((actor) => {
    		if(actor.getName() === target){
    			actor.removeClassName(action.className);
    		}
    	});

      return newState;
      break;
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
