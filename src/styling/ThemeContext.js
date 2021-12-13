import Context from "../core/Context";
import buildStyles from "@smartface/styler/lib/buildStyles";
import styler from '@smartface/styler/lib/styler';
import Actor from '../core/Actor';


class Theme {
  constructor({ name, rawStyles, isDefault=false }) {
    this.name = name;
    this.rawStyles = rawStyles;
    this.setDefault(isDefault);
  }
  
  isDefault() {
    return this._isDefault;
  }

  setDefault(value) {
    this._isDefault = value;
    value && !this.bundle && this.build();
    
    return value;
  }

  build() {
    this.bundle = buildStyles(typeof this.rawStyles === 'function' ? this.rawStyles() : this.rawStyles);
  }

  asStyler() {
    return styler(this.bundle);
  }
}

class Themeable extends Actor {
  constructor(pageContext, name) {
    super(pageContext, name);

    this.pageContext = pageContext;
  }
  
  changeStyling(styling) {
    this.pageContext(styling);
    this.isDirty = true;
  }
  
  dispose(){
    super.dispose();
    
    this.pageContext(null)
    this.pageContext = null;
  }
}

/**
 * Theme Context. Returns context bound
 * 
 * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
 * 
 * @returns {function} - Context dispatcher
 */
export function createThemeContextBound(themes) {
  const themesCollection = themes.map(theme => new Theme(theme));
  
  function themesReducer(context, action, target, state) {
    var newState = Object.assign({}, state);

    switch (action.type) {
      case 'unload':
        context.remove(target);
        
        return newState;
      case 'addThemeable':
        const actor = new Themeable(action.pageContext, action.name);
        context.add(actor, action.name);
        
        const theme = themesCollection.find(theme => theme.isDefault());
        actor.changeStyling(theme.asStyler());
        
        return newState;
      case 'removeThemeable':
        // context.map((actor) => {
        //   if(actor.getName() === action.name){
        //     context.remove(actor.getInstanceID());
        //   }
        // })
        context.remove(target);
        return newState;
      case 'changeTheme':
        themesCollection.forEach(theme => {
          if(theme.name === action.theme){
            theme.setDefault(true);
            context.map((actor) => {
              actor.changeStyling(theme.asStyler());
            });
          } else {
            theme.setDefault(false);
          }
        });
        
        return {
          ...state,
          theme: action.theme
        };
    }
    
    return state;
  }
  
  const themeContext = new Context(
    // creates themes actors
    {},
    themesReducer,
    // initial state
    { theme: themesCollection.find(theme => theme.isDefault === true) }
  );

  return function(pageContext, name){
    pageContext === null 
      ? themeContext.dispose()
      : pageContext !== undefined && 
          themeContext.dispatch({
            type: "addThemeable",
            name: name,
            pageContext: pageContext
          });
          
    const id = themeContext.getLastActorID();
    let currentTheme = themesCollection.find(theme => theme.isDefault());
    let styles = currentTheme.asStyler();
    /**
     * @param {object | null | string} action
     */
    return function themeContextDispatch(action) {
      if (action === null) {
        name && themeContext.dispatch({
          type: "removeThemeable"
        }, id);
      } else if(typeof action === 'object' && typeof action.type === "string") {
        themeContext.dispatch(action);
        if(action.type === "changeTheme") {
          currentTheme = themesCollection.find(theme => theme.isDefault());
          styles = currentTheme.asStyler();
        }
      } else if(typeof action === 'string' && currentTheme) {
        return styles(action)();
      }
    };
  };
}
