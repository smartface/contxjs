import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import Context from "../core/Context";
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
  return function recomposeStylingContext(styling, reducer) {
    
    // context reducer
    function contextUpdater(context, action, target, state) {
      var newState = Object.assign({}, state);
        
      switch (action.type) {
        case 'updateContext':
          updateContextTree(context.actors);
          
          break;
        case 'forceComponentUpdate':
          const actor = context.find(target+"_"+action.name, null);
          actor && actor.reset();
          
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
      
      if (target && action.type !== INIT_CONTEXT_ACTION_TYPE) {
        newState = reducer(context, action, target, state);
        // state is not changed
        if (newState === state) {
          // return current state instance
          return state;
        }
      }
      
      context.map(
        function invalidateStyles(actor, name) {
          if (actor.isDirty === true || action.type === INIT_CONTEXT_ACTION_TYPE) {
            let className = actor.getClassName();
            const beforeHook = hookMaybe("beforeAssignComponentStyles", null);
            beforeHook && (className = beforeHook(name, className));
            if(action.type === INIT_CONTEXT_ACTION_TYPE){
              actor.setInitialStyles(styling(actor.getDefaultClassNames())())
            }
            
            try {
              if(className){
                const styles = styling(className)();
                actor.setStyles(styles);
              }
              
              actor.applyStyles();
            } catch (e) {
              e.message = `While actor's style [${name || className}] is set. \nActor name: [${actor.getName()}]\n${e.message}`;
              throw e;
            }
          }
        });
      
      latestState = newState;
      
      return newState;
    }
      
    var latestState = context 
      ? context.getState() 
      : {};
    //creates new context
    context = new Context(
          context && context.reduce((acc, actor, name) => {acc[name] = actor; return acc;}, {}) || actors,
          contextUpdater,
          latestState,
          hookMaybe
        );
        
    return context;
  };
}
