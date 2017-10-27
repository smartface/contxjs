import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import createContext from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";
import { makeStylable } from './Stylable';

function hooks(hooksList) {
  return function hookMaybe(hook, value) {
    return hooksList
      ? hooksList(hook)
      : value;
  };
}

function flush(str = "", obj) {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] != null && obj[key] instanceof Object) {
      str += key + ": " + flush("", obj[key]) + ", ";
    } else {
      str += key + ": " + obj[key] + ", ";
    }
  });

  return "{ " + str.trim(", ") + " }";
}


/**
 * Create styleContext tree from a SF Component and flat view tree to create actors
 * 
 * @param {Object} component - A sf-core component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * 
 * @return {function} - context helper
 */
export function fromSFComponent(root, rootName, initialClassNameMap, hooksList = null, acc = {}) {
  function buildContextTree(component, name) {
    let componentVars;
    
    if(name == rootName+"_statusBar"){
      componentVars = root.constructor.$$styleContext.statusBar || {};
    } else if(name == rootName+"_headerBar"){
      componentVars = root.constructor.$$styleContext.headerBar || {};
    } else {
      componentVars = component.constructor.$$styleContext || {};
    }
    const classNames = componentVars.classNames ? componentVars.classNames.trim()+" #"+name : "#"+name;
    
    if (acc[name] === undefined){
      acc[name] = makeStylable(
        component,
        {
          classNames,
          initialProps: componentVars.initialProps
        },
        name, 
        hooks(hooksList)
      );
    }

    component.children &&
      Object.keys(component.children).forEach((child) => {
        try {
          buildContextTree(component.children[child], name + "_" + child);
        } catch (e) {
          e.message = "Error when component would be collected: " + child + ". " + e.message;
          throw e;
        }
      });
  }

  buildContextTree(root, rootName);

  return createStyleContext(
    acc, 
    hooks(hooksList),
    function updateContextTree(contextElements) {
      fromSFComponent(root, rootName, initialClassNameMap, hooksList, contextElements);
   }
 );
}

/**
 * Style Context. Returns context composer
 * 
 * @param {Array.<Object>} actors - Actors List
 * @param {function} hookMaybe - Hooks factory
 * @returns {function} - Context Composer Function
 */
export function createStyleContext(actors, hookMaybe, updateContextTree) {
  var context;
  
  /**
   * Context builder.
   * 
   * @param {function) styling - Styling function from styler.
   * @param {function} reducer - Reducer function to run actions
   */
  return function composeContext(styling, reducer) {
    var latestState = context ? context.getState() : {};
    context && context.dispose();
    
    //creates new context
    context = createContext(
      actors,
      function contextUpdater(context, action, target) {
        var state = context.getState(),
          newState = state;
        
        console.log(JSON.stringify(action)+" : "+target);
        
        if (action.type === "invalidateContext") {
          // forces to re-build page's viewtree
          updateContextTree(context.actors);
        }

        if (target || action.type == INIT_CONTEXT_ACTION_TYPE) {
          newState = reducer(context, action, target);
          // state is not changed
          if (newState === state) {
            // return current state instance
            return state;
          }
        }

        context.map(
          function setInitialStyles(actor, name) {
            if (actor.isDirty === true || action.type === INIT_CONTEXT_ACTION_TYPE) {

              let className = actor.getClassName();
              const beforeHook = hookMaybe("beforeAssignComponentStyles", null);
              beforeHook && (className = beforeHook(name, className));

              try {
                if(className){
                  const styles = styling(className)();
                  actor.setStyles(styles);
                }
              } catch (e) {
                e.message = `While actor's style [${name}] is set. ${e.message}`;
                throw e;
              }

              actor.isDirty = false;
            }
          });

        latestState = newState;

        return newState;
      },
      latestState
    );

    return context;
  };
}
