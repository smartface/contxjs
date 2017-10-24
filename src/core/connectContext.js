import { INIT_CONTEXT_ACTION_TYPE } from "./constants";
import createContext from "./Context";
import merge from "@smartface/styler/lib/utils/merge";

function connectContext(actors, hooks, updateContextTree, reducer){
    var latestState = context ? context.getState() : {};
    context && context.dispose();
    
    context = createContext(
      actors, 
      function contextUpdater(context, action, target){
        var state = context.getState(), newState = state;
        if(action.type === "invalidateContext"){
          updateContextTree(context.actors);
        }
        
        if(target || action.type == INIT_CONTEXT_ACTION_TYPE){
          newState = reducer(state, context.actors, action, target);
          // state is not changed
          if(newState === state){
            // return current state instance
            return state;
          }
        }
        
        Object.keys(context.actors).forEach(
          function setInitialStyles(name){
            const comp = context.actors[name];
            
            if(comp.isDirty === true || action.type === INIT_CONTEXT_ACTION_TYPE){

              let className = context.actors[name].getClassName();
              const beforeHook = hooks("beforeAssignComponentStyles");
              beforeHook && (className = beforeHook(name, className));

              try {
                const styles = styling(className)();
                context.actors[name].setStyles(styles);
              } catch (e) {
                console.log(e.message);
              }

              comp.isDirty = false;
            }
          });
        
        latestState = newState;
        
        return newState;
      },
      latestState
    );
    
    Object.keys(context.actors)
      .forEach(function assignContext(name){
        context.actors[name].isDirty = true;
        context.actors[name].setContext(context);
      });
    
    return context;
  };