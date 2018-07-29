import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";
import findClassNames from "@smartface/styler/lib/utils/findClassNames";

const _findClassNames = (classNames) => findClassNames(classNames).reduce((acc, item) => !item && [] || [...acc, item.join('')], []);

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


function componentAssign(component, key, value) {
  if (value !== null && value instanceof Object && componentObjectProps[key]) {
    Object.keys(value).forEach(k => componentAssign(component[key], k, value[k]));
  }
  else {
    component[key] = value;
  }
}

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
export default function makeStylable({ component, classNames = "", userStyle = {}, name }) {
  userStyle = merge(userStyle);
  /**
   * Styable actor
   * @class
   */
  return new Stylable(component, name, classNames, userStyle);
}

class Stylable extends Actor {
  constructor(component, name, classNames, userStyle) {
    super(component, name);
    this.waitedStyle = {};
    this.initialClassNames = _findClassNames(classNames);
    this.classNames = [...this.initialClassNames];
    this.styles = {};
    this.inlinestyles = {};
    this.isDirty = true;
    this.userStyle = userStyle;
    this.component = component;

    var that = this;
    this.getUserStyle = () => {
      return (0, merge)(that.userSt);
    };

    this.setSafeArea = (area) => {
      this.safeArea = area;
      this.isDirty = true;
      return this;
    };

    this.makeDirty = () => {
      that.isDirty = true;
    };

    this.clearDirty = () => {
      that.isDirty = false;
    };

    this.updateUserStyle = (props) => {
      that.userStyle = (0, merge)(that.userStyle, props);
      that.isDirty = true;
      return that;
    };

    this.reset = () => {
      that.setStyles(that.getStyles(), true);
      return that;
    };

    this.setUserStyle = (props) => {
      if (typeof props === 'function') {
        that.userSt = props(that.getUserStyle());
      }
      else {
        that.userSt = (0, merge)(props);
      }

      that.isDirty = true;
      return that;
    };

    this.computeAndAssignStyle = (style, force = false) => {
      const hooks = that.hook || (_ => null);

      const reduceDiffStyleHook = hooks("reduceDiffStyleHook") || null;
      style = (0, merge)(style, that.userSt);
      const safeAreaProps = {};

      if (that.safeArea) {
        const getNotEmpty = (v, y) => v !== undefined ? v : y !== undefined && y || null;

        const addValstoSafeAreaIfExists = (val, willAdd) => typeof willAdd === "number" && typeof val === "number" ? val + willAdd : willAdd;

        const assigntoSafeAreaIfNotEmpty = prop => that.safeArea[prop] !== undefined && (safeAreaProps[prop] = addValstoSafeAreaIfExists(getNotEmpty(style[prop], that.styles[prop]), that.safeArea[prop]));

        assigntoSafeAreaIfNotEmpty("paddingTop");
        assigntoSafeAreaIfNotEmpty("paddingBottom");
        assigntoSafeAreaIfNotEmpty("paddingRight");
        assigntoSafeAreaIfNotEmpty("paddingLeft");
      }

      let diffReducer = !force && reduceDiffStyleHook ? reduceDiffStyleHook(that.styles || {}, Object.assign({}, style)) : null;
      const rawDiff = typeof diffReducer === 'function' ? Object.keys(style).reduce(diffReducer, {}) : (0, merge)(that.styles, style);

      if (rawDiff) {
        Object.assign(rawDiff, safeAreaProps); // Object.assign(style, safeAreaProps);
      }

      const beforeHook = hooks("beforeStyleDiffAssign");
      const diff = beforeHook && beforeHook(rawDiff) || rawDiff;
      const hasDiff = diff !== null && Object.keys(diff).length > 0; //TODO: extract all specified area @cenk
      // ------------->

      typeof that.component.subscribeContext === "function" ? hasDiff && that.component.subscribeContext({
        type: "new-styles",
        style: Object.assign({}, diff),
        rawStyle: (0, merge)(rawDiff)
      }) : hasDiff && Object.keys(diff).forEach(key => {
        try {
          if (that.component.layout && SCW_LAYOUT_PROPS[key]) {
            componentAssign(that.component.layout, SCW_LAYOUT_PROPS[key], diff[key]);
          }
          else {
            componentAssign(that.component, key, diff[key]);
          }
        }
        catch (e) {
          throw new Error(key + " has invalid value " + JSON.stringify(style[key]) + " " + e.message);
        }
      }); // <-------------------

      const afterHook = hooks("afterStyleDiffAssign");
      afterHook && (style = afterHook(style));
      that.styles = style;
      return that;
    };

    this.applyStyles = (force = false) => {
      that.computeAndAssignStyle(that.waitedStyle, force = false);
      that.clearDirty();
      return that;
    };

    this.setStyles = (style, force = false) => {
      that.waitedStyle = (0, merge)(that.waitedStyle, style);
      that.makeDirty();
      return that;
    };

    this.getStyles = () => {
      return that.styles ? Object.assign({}, that.styles) : {};
    };

    this.getClassName = () => {
      return that.classNames.join(" ");
    };

    this.classNamesCount = () => {
      return that.classNames.length;
    };

    this.removeClassName = (className) => {
      return that.removeClassNames(className);
    };

    this.removeClassNames = (classNames) => {
      const classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
      that.classNames = that.classNames.filter(cname => !classNamesArr.some(rname => cname === rname));
      classNamesArr.length && (that.isDirty = true);
      return that.getClassName();
    };

    this.resetClassNames = (classNames = []) => {
      that.classNames = [];
      [...that.initialClassNames, ...classNames].forEach(that.addClassName);
      that.isDirty = true;
      return that;
    };

    this.hasClassName = (className) => {
      return that.classNames.some(cname => {
        return cname === className;
      });
    };



    this.pushClassNames = (classNames) => {
      const classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
      var newClassNames = classNamesArr.filter(className => that.classNames.some(cname => {
        return cname !== className;
      }));

      if (newClassNames.length) {
        that.classNames = [...that.classNames, ...newClassNames];
        that.isDirty = true;
      }

      return that.getClassName();
    };

    this.addClassName = (className, index) => {
      if (!that.hasClassName(className)) {
        that.classNames.splice(index, 1, className);
        that.isDirty = true;
      }

      return that.getClassName();
    };

    this.dispose = () => {
      that._actorInternal_.component = null;
      that._actorInternal_ = null;
      that.context = null;
      that.styles = null;
      that.component.onSafeAreaPaddingChange = null;
      that.component.dispatch = null;
      that.component.onDispose && that.component.onDispose();
    };

    this.getInitialClassName = () => {
      return that.initialClassNames;
    };

  }

}
