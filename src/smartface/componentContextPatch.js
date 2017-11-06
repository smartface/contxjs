import createPageContext from "./pageContext";
import patchMethod from '../util/patchMethod';

const Application = require("sf-core/application");

export default function componentContextPatch(component, name){
   component.themeContext = Application.theme();
   component.themeContext({
      type: "addThemeableContext",
      name: name,
      pageContext: createPageContext(component, name, null, null)
    });
  component.onShow = patchMethod(component, "onShow", onShow);
  
  function onShow(superOnShow, params){
    superOnShow(params);
    
    this.dispatch && this.dispatch({
      type: "onShowUpdate"
    }); 
  }
}
