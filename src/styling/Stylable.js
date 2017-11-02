import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";

// {"backgroundColor":{"nativeObject":{}},"paddingLeft":10,"paddingRight":10,"paddingTop":null,"paddingBottom":10,"flexDirection":0,"alignItems":2,"direction":0,"flexWrap":0,"justifyContent":4}

// function addChild(componentAddChild, child, actor) {
//   componentAddChild(child);
//   actor.dispatch({ type: "invalidateContext" });
// }

// function addChild(componentAddChild, child, actor) {
//   componentAddChild(child);
// }

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
export default function makeStylable({component, classNames="", initialProps={}, name}) {
  const initialClassNames = classNames && classNames.split(" ") || [];
  initialProps = merge(initialProps);
  
  /**
   * Styable actor
   * @class
   */
  return new class Stylable extends Actor {
    constructor() {
      super(component);

      // this.name = name;
      this.classNames = [...initialClassNames];
      // componentVars.classNames && 
      //   (this.classNames = this.classNames.concat(componentVars.classNames.split(" ")));
      // className && this.classNames.push(className);
      // initialClassNames = [...this.classNames];
      this.styles = initialProps;
      this.isDirty = true;

      // if (typeof component.addChild === "function")
        // component.addContextChild = addChild.bind(component, this);
      // else if(name.indexOf("statusBar") == -1 && typeof component.layout.addChild === "function")
      //   component.layout.addContextChild = addChild.bind(component, component.layout.addChild.bind(component.layout), this);
    }
    
    getName = () => {
      return name;
    }

    /**
     * Sets styles
     *
     * @param {object} styles - a style object
     */
    setStyles = (style) => {
      
      const reduceDiffStyleHook = this.hook("reduceDiffStyleHook");

      let diffReducer = reduceDiffStyleHook 
        ? reduceDiffStyleHook(this.styles || {}, style) 
        : (acc, key) => {
            if (this.styles[key] !== undefined) {
              if (this.styles[key] !== style[key]) {
                acc[key] = style[key];
              } else {
                acc[key] = style[key];
              }
            }
  
            return acc;
          };

      let diff = Object.keys(style).reduce(diffReducer, {});
      
      this.styles === initialProps && (diff = merge(diff, initialProps));
      
      const beforeHook = this.hook("beforeStyleDiffAssign");
      beforeHook && (diff = beforeHook(diff));

      const comp = name.indexOf("_") === -1 && this._actorInternal_.component.layout
        ? this._actorInternal_.component.layout
        : this._actorInternal_.component;
      const hasDiff = Object.keys(diff).length > 0;
        
      typeof component.subscribeContext === "function" 
        ? hasDiff && component.subscribeContext({ type: "new-styles", data: Object.assign({}, diff) })
        : hasDiff && Object.keys(diff).forEach((key) => {
            try {
              // TODO: move this logic to pageContext's actor
              if (key == "scrollEnabled") {
                comp.ios && (comp.ios.scrollEnabled = diff[key]);
              } else if(key === "layoutHeight") {
                comp.layout['height'] = diff[key];
              } else if(key === "layoutWidth") {
                comp.layout['width'] = diff[key];
              } else if(key !== "font" && style[key] instanceof Object) {
                Object.keys(diff[key]).forEach((k) => {
                  comp[key][k] = diff[key][k];
                });
              } else {
                comp[key] = diff[key];
              }
              
            } catch (e) {
              throw new Error(key + " has invalid value " + String(style[key]) + " " + e.message);
            }
        });

      const afterHook = this.hook("afterStyleDiffAssign");
      afterHook && (style = afterHook(style));

      this.styles = style;
    }

    getStyles() {
      return this.styles ? Object.assign({}, this.styles) : {};
    }

    getInitialClassName() {
      return initialClassNames;
    }

    getClassName() {
      return this.classNames.join(" ");
    }
    
/*    addChild = (child) => {
      this.component.layout
      ? this.component.layout.addChild(child)
      : this.component.addChild(child);
    }

    removeChild = (child) => {
      this.component.layout
      ? this.component.layout.removeChild(child)
      : this.component.removeChild(child);
    }

*/
    classNamesCount() {
      return this.classNames.length;
    }

    removeClassName(className) {
      if (this.hasClassName(className)) {
        this.isDirty = true;
        this.classNames = this.classNames.filter((cname) => {
          return cname !== className;
        });
      }

      return this.getClassName();
    }

    resetClassNames(classNames = []) {
      this.classNames = [...initialClassNames, ...classNames];
      this.isDirty = true;
    }

    hasClassName(className) {
      return this.classNames.some((cname) => {
        return cname === className;
      });
    }

    pushClassNames(className) {
      if (!this.hasClassName(className)) {
        Array.isArray(className)
          ? this.classNames = [...this.className, ...className]
          : this.classNames.push(className);
          
        this.isDirty = true;
      }

      return this.getClassName();
    }

    addClassName(className, index) {
      if (!this.hasClassName(className)) {
        this.classNames.splice(index, 1, className);
        this.isDirty = true;
      }

      return this.getClassName();
    }

    dispose() {
      component = null;
      this._actorInternal_ = null;
      this.context = null;
      this.styles = null;
      this.component.setContextDispatcher &&
        this.component.setContextDispatcher(null);
    }
  };
}