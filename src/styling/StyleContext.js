import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import createContext from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";

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
    var latestState = context 
      ? context.getState() 
      : {};
    context && context.dispose();
    
    //creates new context
    context = createContext(
      // context actors
      actors,
      // context reducer
      function contextUpdater(context, action, target) {
        var state = context.getState(),
          newState = state;
          
        if (target || action.type == INIT_CONTEXT_ACTION_TYPE){
          newState = reducer(context, action, target);
        }
          
        switch (action.type) {
          case 'updateContext':
            updateContextTree(context.actors);
            break;
            /*case 'addContextChild':
              Array.isArray(action.newComp)
                ? action.newComp.forEach((component) => {
                    context.add(component);
                  })
                : context.add(action.newComp);
            break;*/
          case 'removeContextChild':
            context.remove(action.name);
            break;
        }
        
        if (target || action.type == INIT_CONTEXT_ACTION_TYPE) {
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
      latestState,
      hookMaybe
    );

    return context;
  };
}
