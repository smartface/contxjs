import {INIT_CONTEXT_ACTION_TYPE} from "../core/constants";
import createContext from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";

function hooks(hooksList){
  return function hookMaybe(hook){
    return hooksList
      ? hooksList(hook)
      : null;
    // ? hooksList[hook] : elseValue;
  };
}

function flush(str="", obj){
  Object.keys(obj).forEach(function (key) {
    if(obj[key] != null && obj[key] instanceof Object)
      str += key+": "+flush("", obj[key])+", ";
    else
      str += key+": "+obj[key]+", ";
  });
  
  return "{ "+str.trim(", ")+" }";
}


/**
 * Create styleContext tree from a SF Component and flat component tree to create actors
 * 
 * @param {Object} component - A sf-core component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * 
 * @return {function} - context helper
 */
export function fromSFComponent(component, name, initialClassNameMap, hooksList=null, acc = {}){
  
  function buildContextTree(component, name, initialClassNameMap){
    if(acc[name] === undefined )
      acc[name] = makeStylable(component, initialClassNameMap(name), name, hooks(hooksList));

      component.children && 
        Object.keys(component.children).forEach((child) => {
          try {
            buildContextTree(component.children[child], name+"_"+child, initialClassNameMap);
          } catch(e) {
            throw new Error("Error when component would be collected: "+child+". "+e.message);
          }
        });
  }
  
  buildContextTree(component, name, initialClassNameMap);
  
  return createStyleContext(acc, hooks(hooksList), function updateContextTree(contextElements){
    fromSFComponent(component, name, initialClassNameMap, hooksList, contextElements);
  });
}

/**
 * Creates context from a children hash (not tested)
 * 
 * 
 */
// export function fromObject(children, maker, mapper){
//   return Object.keys(children).reduce((acc, child) => {
//     acc[child] = maker(children[child], child, mapper);
//     return acc;
//   }, {});
// }

/**
 * Creates context from an array
 *
 */
// export function fromArray(children, maker, mapper){
//   return children.map((child) => {
//     return maker(child, mapper);
//   });
// }

/**
 * Styleable Actor HOC. Decorates specifeid component and return an actor component
 * 
 * @param {object} component - A component to decorate
 * @param {string} className - initial className for actor
 * @param {function} hooks - context's hooks dispatcher
 * 
 * @returns {Object} - A Stylable Actor
 */
export function makeStylable(component, className, name, hooks){
  /**
   * Styable actor
   * @class
   */
   
  function addChild(componentAddChild, child, actor){
    componentAddChild(child);
    
    actor.dispatch({type: "invalidateContext"});
  }
  
  return new class Stylable {
    constructor(){
      this.name = name;
      var componentVars = Object.getPrototypeOf(component).constructor.$$styleContext || {};
      this.initialClassName = componentVars.classNames || className;
      this.classNames = [className];
      this.component = component;
      this.styles = {};
      this.setStyles(componentVars.initialProps || {});
      this.isDirty = true;
      
      if(typeof component.addChild === "function")
        component.addChild = addChild.bind(component, component.addChild.bind(component), this);
      else if(typeof component.layout.addChild === "function")
        component.layout.addChild = addChild.bind(component, component.layout.addChild.bind(component.layout), this);
    }
    
    /**
     * Sets styles
     *
     * @param {object} styles - a style object
     */
    setStyles(style) {
      const reduceDiffStyleHook = hooks("reduceDiffStyleHook");
      
      let diffReducer = reduceDiffStyleHook
        ? reduceDiffStyleHook(this.styles, style)
        : (acc, key) => {
            if(this.styles[key] !== undefined) {
              if(this.styles[key] !== style[key]) {
                acc[key] = style[key];
              } else {
                acc[key] = style[key];
              }
            }
            
            return acc;
          };
      
      let diff = Object.keys(style).reduce(diffReducer, {});
      
     /* global.benchmarkLog && 
        global.benchmarkLog(Object.keys(diff));*/
      
      const beforeHook = hooks("beforeStyleDiffAssign");
      beforeHook && (diff = beforeHook(diff));
      
      // Object.keys(diff).length && 
      //   Object.assign(this.component, diff);
      
      try {
        this.component.subscribeContext
          ? Object.keys(diff).length && this.component.subscribeContext({type:"new-styles", data: diff})
          : Object.keys(diff).length && Object.keys(diff).forEach(function(key) {
            if(key == "scrollEnabled"){
              this.component.ios && (this.component.ios.scrollEnabled = diff[key]);
            } else if(this.component[key] !== diff[key]){
              this.component[key] = diff[key];
            }
          }.bind(this));
      } catch(e){
        throw new Error(JSON.stringify(diff)+" is invalid. "+e.message);
      }
      
      const afterHook = hooks("afterStyleDiffAssign");
      afterHook && (style = afterHook(style));
      
      this.styles = style;
    }
    
    setContext(context){
      this.context = context;
      component.setContextDispatcher 
      ? component.setContextDispatcher((action) => {
          this.context.dispatch(action, this.name);
        })
      : component.dispatch = (action) => {
          this.context.dispatch(action, this.name);
        }
    }
    
    getStyles(){
      return Object.assign({}, this.styles);
    }
    
    setDirty(value){
      this.isDirty = value;
    }
    
    getInitialClassName(){
      return this.initialClassName;
    }
    
    getClassName(){
      return this.classNames.join(" ");
    }
    
    classNamesCount(){
      return this.classNames.length;
    }
    
    removeClassName(className){
      if(this.hasClassName(className)){
        this.isDirty = true;
        this.classNames = this.classNames.filter((cname) => {
          return cname !== className;
        });
      }
      
      return this.getClassName();
    }
    
    resetClassNames(classNames=[]){
      this.classNames = classNames.slice() || [this.getInitialClassName()];
      this.isDirty = true;
    }
    
    hasClassName(className){
      return this.classNames.some((cname) => {
        return cname === className;
      });
    }
    
    pushClassName(className){
      if(!this.hasClassName(className)){
        this.classNames.push(className);
        this.isDirty = true;
      }
      
      return this.getClassName();
    }
    
    addClassName(className, index){
      if(!this.hasClassName(className)){
        this.classNames.splice(index, 1, className);
        this.isDirty = true;
      }
      
      return this.getClassName();
    }
    
    dispose(){
      this.component = null;
      this.context = null;
      this.styles = null;
      this.component.setContextDispatcher && 
        this.component.setContextDispatcher(null);
    }
  };
}

/**
 * Style Context. Returns context composer
 * 
 * @param {Array.<Object>} actors - Actors List
 * @param {function} hooks - Hooks callback
 * @returns {function} - Context Composer Function
 */
export function createStyleContext(actors, hooks, updateContextTree){
  var context;
  
  /**
   * Composes a context.
   * 
   * @param {function) styling - Styling function from styler.
   * @param {function} reducer - Reducer function to run actions
   */
  return function composeContext(styling, reducer){
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
}
