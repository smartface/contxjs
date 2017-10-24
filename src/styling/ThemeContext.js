import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import createContext from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";
import styleBuild from "@smartface/styler/lib/buildStyles";
import styler from '@smartface/styler/lib/styler';
import Actor from '../core/Actor';

class Theme {
  constructor({ name, rawStyles, isDefault }) {
    this.name = name;
    this.rawStyles = rawStyles;
    this.setDefault(isDefault);
  }

  setDefault(value) {
    this.isDefault = value;
    value && this.build();
  }

  build() {
    if (!this.bundle) {
      this.bundle = styleBuild(this.rawStyles);
    }
  }

  asStyler() {
    return styler(this.bundle);
  }
}

class Themeable extends Actor {
  constructor(pageContext) {
    super(pageContext);

    this.pageContext = pageContext;
  }

  changeTheme(theme) {
    this.pageContext(theme.asStyler());
  }

  whenContextChanged = (state, oldState) => {
    if (state.theme !== oldState.theme) {
      this.pageContext(state.theme.asStyler());
    }
  }
}

export function fromPageContext() {}

export function fromPage() {}

/**
 * Style Context. Returns context composer
 * 
 * @param {Array.<{name:string, rawStyles:Object, isDefault:boolean}>} themes - h List
 * @param {function} hooks - Hooks factory
 * 
 * @returns {function} - Context dispatcher
 */
export function createThemeContext(themes) {
  const themesCollection = themes.map(theme => new Theme(theme));
  const context = createContext(
    // creates themes actors
    {},
    // updates context
    function themesReducer(context, action, target) {
      var state = context.getState(),
        newState = state;

      switch (action.type) {
        case 'addPage':
          context.setActors({[action.name]: new Themeable(action.pageContext) });
          context.map((actor) => {
            state.theme instanceof Theme && actor.changeTheme(state.theme);
          });

          break;
        case 'changeTheme':
          return {
            ...state,
            theme: themesCollection.find(theme => theme.name === action.name)
          };
        default:
          return newState;
      }

      // if (target || action.type == INIT_CONTEXT_ACTION_TYPE) {
      // newState = reducer(state, context.actors, action, target);
      // state is not changed
      /*  if (newState === state) {
          // return current state instance
          return state;
        }*/
      // }
    },
    // initial state
    { theme: themesCollection.find(theme => theme.isDefault === true) }
  )

  return function dispatcher(action) {
    if (action === null) {
      context.dispose();
    } else if (context) {
      context.dispatch(action);
    }
  }
}
