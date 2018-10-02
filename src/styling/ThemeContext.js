const { INIT_CONTEXT_ACTION_TYPE } = require("../core/constants");
const Context = require("../core/Context");
const merge = require("@smartface/styler/lib/utils/merge");
const buildStyles = require("@smartface/styler/lib/buildStyles");
const styler = require("@smartface/styler/lib/styler");
const Actor = require("../core/Actor");

class Theme {
  constructor({ name, rawStyles, isDefault = false }) {
    this.name = name;
    this.rawStyles = rawStyles;
    this.setDefault(isDefault);
  }

  toString() {
    return `[objsct Theme]`;
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
    this.bundle = buildStyles(
      typeof this.rawStyles === "function" ? this.rawStyles() : this.rawStyles
    );
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

  dispose() {
    super.dispose();

    this.pageContext(null);
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
function createThemeContextBound(themes) {
  const themesCollection = themes.map(theme => new Theme(theme));

  function themesReducer(context, action, target, state) {
    var newState = Object.assign({}, state);

    switch (action.type) {
      case "unload":
        context.remove(target);

        return newState;
      case "addThemeable":
        const actor = new Themeable(action.pageContext, action.name);
        context.add(actor, action.name);

        const theme = themesCollection.find(theme => theme.isDefault());
        actor.changeStyling(theme.asStyler());

        return newState;
      case "removeThemeable":
        // context.map((actor) => {
        //   if(actor.getName() === action.name){
        //     context.remove(actor.getInstanceID());
        //   }
        // })
        context.remove(target);
        return newState;
      case "changeTheme":
        themesCollection.forEach(theme => {
          if (theme.name === action.theme) {
            theme.setDefault(true);
            context.map(actor => {
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

  return function(pageContext, name) {
    pageContext === null
      ? themeContext.dispose()
      : pageContext !== undefined &&
        themeContext.dispatch({
          type: "addThemeable",
          name: name,
          pageContext: pageContext
        });

    const id = themeContext.getLastActorID();

    return function themeContextDispatch(action) {
      if (action === null) {
        name &&
          themeContext.dispatch(
            {
              type: "removeThemeable"
            },
            id
          );
      } else {
        themeContext.dispatch(action);
      }
    };
  };
}

module.exports = createThemeContextBound;
