import addThemeableContext from "action/addThemeableContext";
import changeTheme from "action/changeTheme";
import pushClassNames from "action/pushClassNames";
import removeClassNames from "action/removeClassNames";
import updateContextTree from "action/updateContextTree";
import ThemeContext from "./ThemeContext";
import StyleContext from "./StyleContext";

export default {
  addThemeableContext,
  changeTheme,
  pushClassNames,
  removeClassName: removeClassNames,
  removeClassNames,
  updateContextTree,
  ThemeContext,
  StyleContext
};
