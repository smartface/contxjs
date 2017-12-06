import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import Context from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";
import buildStyles from "@smartface/styler/lib/buildStyles";
import styler from '@smartface/styler/lib/styler';
import Actor from '../core/Actor';


class Theme {
  constructor({ name, rawStyles, isDefault=false }) {
    this.name = name;
    this.rawStyles = rawStyles;
    this.setDefault(isDefault);
  }
  
  isDefault = () => {
    return this._isDefault;
  }

  setDefault = (value) => {
    this._isDefault = value;
    value && !this.bundle && this.build();
    
    return value;
  }

  build = () => {
    this.bundle = buildStyles(this.rawStyles);
  }

  asStyler = () => {
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
  
  function themesReducer(context, action, target) {
    var state = context.getState();
    var newState = state;
      
    switch (action.type) {
      case 'addThemeable':
        // make declarative
        
        const actor = new Themeable(action.pageContext, action.name);
        context.add(actor, action.name);
        
        const theme = themesCollection.find(theme => theme.isDefault());
        actor.changeStyling(theme.asStyler());
        
        break;
      case 'removeThemeable':
        context.remove(action.name);
        break;
      case 'changeTheme':
        // const current = themesCollection.find(theme => theme.isDefault());
        // context.map((actor) => {
        //   actor.changeStyling(current.asStyler());
        // });
        
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
      default:
          return newState;
    }
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
    
    return function themeContextDispatch(action) {
      if (action === null) {
        name && themeContext.dispatch({
          type: "removeThemeable",
          name: name
        });
      } else {
        themeContext.dispatch(action);
      }
    };
  };
}
