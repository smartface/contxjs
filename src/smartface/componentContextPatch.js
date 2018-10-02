const createPageContext = require("./pageContext");
const patchMethod = require("../util/patchMethod");
const Application = require("sf-core/application");

module.exports = function componentContextPatch(component, name) {
  component.themeContext = Application.theme(
    createPageContext(component, name, null, null),
    name
  );

  component.onShow = patchMethod(component, "onShow", onShow);

  function onShow(superOnShow, params) {
    superOnShow && superOnShow(params);
  }
};
