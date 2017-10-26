import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";

// {"backgroundColor":{"nativeObject":{}},"paddingLeft":10,"paddingRight":10,"paddingTop":null,"paddingBottom":10,"flexDirection":0,"alignItems":2,"direction":0,"flexWrap":0,"justifyContent":4}

function addChild(componentAddChild, child, actor) {
  componentAddChild(child);
  actor.dispatch({ type: "invalidateContext" });
}

/**
 * Styleable Actor HOC. Decorates specifeid component and return an actor component
 * 
 * @param {object} component - A component to decorate
 * @param {string} className - initial className for actor
 * @param {function} hooks - context's hooks dispatcher
 * 
 * @returns {Object} - A Stylable Actor
 */
export function makeStylable(component, className, name, hooks) {
  /**
   * Styable actor
   * @class
   */
  function addChild(componentAddChild, child, actor) {
    componentAddChild(child);
  }

  return new class Stylable extends Actor {
    constructor() {
      super(component);

      this.name = name;
      
      var componentVars = Object.getPrototypeOf(component).constructor.$$styleContext || {};
      this.initialProps = componentVars.initialProps || {};
      this.classNames = [];
      componentVars.classNames ? this.classNames = this.classNames.concat(componentVars.classNames.split(" ")) : null;
      className && this.classNames.push(className);
      this.initialClassName = [...this.classNames];
      this.styles = {};
      this.isDirty = true;

      // if (typeof component.addChild === "function")
      //   component.addChild = addChild.bind(component, component.addChild.bind(component), this);
      // else if(name.indexOf("statusBar") == -1 && typeof component.layout.addChild === "function")
      //   component.layout.addChild = addChild.bind(component, component.layout.addChild.bind(component.layout), this);
    }

    /**
     * Sets styles
     *
     * @param {object} styles - a style object
     */
    setStyles = (style) => {
      
      if(this.name == "page1"){
        console.log(JSON.stringify(style));
      }

      const reduceDiffStyleHook = hooks("reduceDiffStyleHook");

      let diffReducer = reduceDiffStyleHook ?
        reduceDiffStyleHook(this.styles, style) :
        (acc, key) => {
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
      
      this.initialProps && (diff = merge(diff, this.initialProps));
      
      this.initialProps = null;

      const beforeHook = hooks("beforeStyleDiffAssign");
      beforeHook && (diff = beforeHook(diff));

      const component = this._actorInternal_.component.layout || this._actorInternal_.component;
      const hasDiff = Object.keys(diff).length > 0;
        
      typeof this._actorInternal_.component.subscribeContext === "function" 
        ? hasDiff && this._actorInternal_.component.subscribeContext({ type: "new-styles", data: diff }) 
        : hasDiff && Object.keys(diff).forEach((key) => {
            try {
              if (key == "scrollEnabled") {
                component.ios && (component.ios.scrollEnabled = diff[key]);
              }
              
              component[key] = diff[key];
              
            } catch (e) {
              throw new Error(key + " has invalid value " + String(style[key]) + " " + e.message);
            }
        });

      const afterHook = hooks("afterStyleDiffAssign");
      afterHook && (style = afterHook(style));

      this.styles = style;
    }

    getStyles() {
      return Object.assign({}, this.styles);
    }

    getInitialClassName() {
      return this.initialClassName;
    }

    getClassName() {
      return this.classNames.join(" ");
    }

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
      this.classNames = classNames.slice() || [this.getInitialClassName()];
      this.isDirty = true;
    }

    hasClassName(className) {
      return this.classNames.some((cname) => {
        return cname === className;
      });
    }

    pushClassName(className) {
      if (!this.hasClassName(className)) {
        this.classNames.push(className);
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
      this._actorInternal_.component = null;
      this._actorInternal_ = null;
      this.context = null;
      this.styles = null;
      this.component.setContextDispatcher &&
        this.component.setContextDispatcher(null);
    }
  };
}