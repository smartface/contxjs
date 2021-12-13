import createPageContext from "./pageContext";
import patchMethod from '../util/patchMethod';

const Application = require("@smartface/native/application");

export default function componentContextPatch(component, name) {
  component.themeContext = Application.theme(createPageContext(component, name, null, null), name);

  component.onShow = patchMethod(component, "onShow", onShow);

  function onShow(superOnShow, params) {
    superOnShow && superOnShow(params);
  }
}
