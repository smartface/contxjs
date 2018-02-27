import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";
import findClassNames from "@smartface/styler/lib/utils/findClassNames";

const _findClassNames = (classNames) => findClassNames(classNames).reduce((acc, item) => !item && [] || [...acc, item.join('')] , []);

// TODO create new jsdoc type for the parameter
/**
 * Styleable Actor HOC. Decorates specifeid component and return an actor component
 * 
 * @param {object} component - A component to decorate
 * @param {string} className - initial className for actor
 * @param {function} hooks - context's hooks dispatcher
 * 
 * @returns {Object} - A Stylable Actor
 */
export default function makeStylable({component, classNames="", userStyle={}, name}) {
  const initialClassNames = _findClassNames(classNames);
  userStyle = merge(userStyle);
  let waitedStyle = {};
  
  /**
   * Styable actor
   * @class
   */
  return new class Stylable extends Actor {
    constructor() {
      super(component, name);

      this.classNames = [...initialClassNames];
      this.styles = {};
      this.inlinestyles = {};
      this.isDirty = true;
    }
    
    getUserStyle = () => {
      return merge(userStyle);
    }
    
    setSafeArea = (area) => {
      this.safeArea = area;
      this.isDirty = true;
      
      return this;
    }
    
    makeDirty = () => {
      this.isDirty = true;
    }
    
    clearDirty = () => {
      this.isDirty = false;
    }
    
    updateUserStyle = (props) => {
      userStyle = merge(userStyle, props);
      this.isDirty = true;
      
      return this;
    }
    
    reset = () => {
      this.setStyles(this.getStyles(), true);
      
      return this;
    }
    
    setUserStyle = (props) => {
      if(typeof props === 'function'){
        userStyle = props(this.getUserStyle());
      } else {
        userStyle = merge(props);
      }
      
      this.isDirty = true;
      
      return this;
    }
    
    computeAndAssignStyle = (style, force=false) => {
      const hooks = this.hook || (_ => null)
      
      const reduceDiffStyleHook = hooks("reduceDiffStyleHook") || null;
      style = merge(style, userStyle);
      
      const safeAreaProps = {};
      
      if(this.safeArea){
        const getNotEmpty = (v, y) => v !== undefined
            ? v
            : y !== undefined && y || null;
            
        const addValstoSafeAreaIfExists = (val, willAdd) => willAdd >= 0 && val >= 0 ? (val + willAdd) : willAdd;
        const assigntoSafeAreaIfNotEmpty = (prop) => 
          this.safeArea[prop] !== undefined && 
            (safeAreaProps[prop] = addValstoSafeAreaIfExists(
              getNotEmpty(style[prop], this.styles[prop]), 
              this.safeArea[prop]
            ));
        
        assigntoSafeAreaIfNotEmpty("paddingTop");
        assigntoSafeAreaIfNotEmpty("paddingBottom");
        assigntoSafeAreaIfNotEmpty("paddingRight");
        assigntoSafeAreaIfNotEmpty("paddingLeft");
      }
      
      let diffReducer = !force && reduceDiffStyleHook
        ? reduceDiffStyleHook(this.styles || {}, Object.assign({}, style, safeAreaProps))
        : null;
      
      const rawDiff = typeof diffReducer === 'function' 
        ? Object.keys(style).reduce(diffReducer, {})
        : merge(this.styles, style, safeAreaProps);

      const beforeHook = hooks("beforeStyleDiffAssign");
      const diff = beforeHook && beforeHook(rawDiff) || rawDiff;

      const comp = name.indexOf("_") === -1 && this._actorInternal_.component.layout
        ? this._actorInternal_.component.layout
        : this._actorInternal_.component;
      const hasDiff = diff !== null && Object.keys(diff).length > 0;
      
      //TODO: extract all specified area @cenk
      // ------------->
      
      const componentObjectProps = {
        "android": {},
        "ios": {},
        "layout": {}
      };

      const SCW_LAYOUT_PROPS = {
        "alignContent": "alignContent",
        "alignItems": "alignItems",
        "direction": "direction",
        "flexDirection": "flexDirection",
        "justifyContent": "justifyContent",
        "flexWrap": "flexWrap",
        "paddingLeft": "paddingLeft",
        "paddingTop": "paddingTop",
        "paddingRight": "paddingRight",
        "paddingBottom": "paddingBottom",
        "marginRight": "marginRight",
        "marginLeft": "marginLeft",
        "marginTop": "marginTop",
        "marginBottom": "marginBottom",
        "layoutHeight": "height",
        "layoutWidth": "width",
        "backgroundColor": "backgroundColor"
      };
      
      function componentAssign(component, key, value){
        if(value !== null && value instanceof Object && componentObjectProps[key]){
          Object.keys(value).forEach(k => componentAssign(component[key], k, value[k]));
        } else {
          component[key] = value;
        }
      }
      
      typeof component.subscribeContext === "function" 
        ? hasDiff && component.subscribeContext({ type: "new-styles", style: Object.assign({}, diff), rawStyle: merge(rawDiff) })
        : hasDiff && Object.keys(diff).forEach((key) => {
            try {
              if(component.layout && SCW_LAYOUT_PROPS[key]){
                componentAssign(component.layout, SCW_LAYOUT_PROPS[key], diff[key]);
              } else {
                componentAssign(component, key, diff[key]);
              }
            } catch (e) {
              throw new Error(key + " has invalid value " + JSON.stringify(style[key]) + " " + e.message);
            }
        });
      // <-------------------
      
      const afterHook = hooks("afterStyleDiffAssign");
      afterHook && (style = afterHook(style));
      
      this.styles = style;
      
      return this;
    }
    
    applyStyles = (force=false) => {
      this.computeAndAssignStyle(waitedStyle, force=false);
      this.clearDirty();
      
      return this;
    }
    
    /**
     * Sets styles
     *
     * @param {object} styles - a style object
     */
    setStyles = (style, force=false) => {
      waitedStyle = merge(waitedStyle, style);
      this.makeDirty();
      return this;
    }

    getStyles = () => {
      return this.styles ? Object.assign({}, this.styles) : {};
    }

    getInitialClassName() {
      return initialClassNames;
    }

    getClassName = () => {
      return this.classNames.join(" ");
    }
    
    classNamesCount = () => {
      return this.classNames.length;
    }
    
    /**
     * @deprecated since version 2
     */
    removeClassName = (className) => {
      return this.removeClassNames(className);
    }
    
    /**
     * Added v1.0.6
     * 
     * remove specified classnames
     * 
     * @return {string}
     */
    removeClassNames = (classNames) => {
      const classNamesArr = Array.isArray(classNames) 
        ? classNames 
        : _findClassNames(classNames);
        
      this.classNames = this.classNames.filter(cname => !classNamesArr.some(rname => cname === rname));
      classNamesArr.length && (this.isDirty = true);

      return this.getClassName();
    }

    resetClassNames = (classNames = []) => {
      this.classNames = [];
      [...initialClassNames, ...classNames].forEach(this.addClassName)
      this.isDirty = true;
      
      return this;
    }

    hasClassName = (className) => {
      return this.classNames.some((cname) => {
        return cname === className;
      });
    }

    pushClassNames = (classNames) => {
      const classNamesArr = Array.isArray(classNames) 
        ? classNames 
        : _findClassNames(classNames);

      if (!classNamesArr.some(this.hasClassName)) {
        this.classNames = [...this.classNames, ...classNamesArr];
        this.isDirty = true;
      }

      return this.getClassName();
    }

    addClassName = (className, index) => {
      if (!this.hasClassName(className)) {
        this.classNames.splice(index, 1, className);
        this.isDirty = true;
      }

      return this.getClassName();
    }

    dispose = () => {
      this._actorInternal_.component = null;
      this._actorInternal_ = null;
      this.context = null;
      this.styles = null;
      component.onSafeAreaPaddingChange = null;
      component.dispatch = null;
      component.onDispose && component.onDispose();
    }
  };
}