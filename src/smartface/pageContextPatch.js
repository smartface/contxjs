import extend from 'js-base/core/extend';
import createPageContext from "./pageContext";
import patchMethod from '../util/patchMethod';

const buildStyles = require("@smartface/styler/lib/buildStyles");
const Application = require("sf-core/application");

// monkey patching wrapper for any page.
export default function pageContextPatch(page, name){
  page.onLoad = patchMethod(page, "onLoad", onLoad);
  page.onShow = patchMethod(page, "onShow", onShow);
  page.onHide = patchMethod(page, "onHide", onHide);
  page.setContextDispatcher = patchMethod(page, "setContextDispatcher", setContextDispatcher);
  page.onOrientationChange = patchMethod(page, "onOrientationChange", onOrientationChange);
  page.themeContext = Application.theme();
  
  function onLoad(superOnLoad) {
    superOnLoad && superOnLoad();
    page.themeContext({
      type: "addThemeableContext",
      name: name,
      pageContext: createPageContext(page, name, null, null)
    });
  }
  
  function onHide(superOnHide) {
    superOnHide && superOnHide();
  }
  
  function onShow(superOnShow, data) {
    superOnShow && superOnShow(data);
    this.dispatch && this.dispatch({
      type: "onShowUpdate"
    });
    
    this.dispatch && this.dispatch({
      type: "invalidate"
    });
    
    this.layout.applyLayout();
  }
  
  function onOrientationChange(superOnOrientationChange) {
    superOnOrientationChange && superOnOrientationChange();

    this.dispatch({
      type: "orientationStarted"
    });
    
    this.layout.applyLayout();

    // superOnOrientationChange && setTimeout(superOnOrientationChange.bind(this),1);
    setTimeout(() => {
      this.dispatch({
        type: "orientationEnded"
      });

      this.layout.applyLayout();
    }, 1);
  }
  
  function setContextDispatcher(setContextDispatcher, dispatcher) {
    setContextDispatcher && setContextDispatcher(dispatcher);
    this.dispatch = dispatcher;
  }
  
  return function pageContextPatchDispose(){
    page.dispatch(null);
    page.dispatch = null;
    page.onLoad = null;
    page.onShow = null;
    page.onHide = null;
    page.onOrientationChange = null;
    page = null;
  };
};
