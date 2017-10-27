import extend from 'js-base/core/extend';
import createPageContext from "./pageContext";

const buildStyles = require("@smartface/styler/lib/buildStyles");
const Application = require("sf-core/application");

function wrapMethod(scope, method, bindingfFunc){
  return bindingfFunc.bind(scope, typeof scope[method] === "function" ? scope[method].bind(scope) : null) 
}

// monkey patching wrapper for any page.
export default function pageContextPatch(page, name){
  page.onLoad = wrapMethod(page, "onLoad", onLoad);
  page.onShow = wrapMethod(page, "onShow", onShow);
  page.onHide = wrapMethod(page, "onHide", onHide);
  page.setContextDispatcher = wrapMethod(page, "setContextDispatcher", setContextDispatcher);
  page.onOrientationChange = wrapMethod(page, "onOrientationChange", onOrientationChange);
  page.themeDispatch = Application.theme();

  function onLoad(superOnLoad) {
    superOnLoad && superOnLoad();
    page.themeDispatch({
      type: "addPage",
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
      type: "invalidate"
    });
    
    this.layout.applyLayout();
  }
  
  function onOrientationChange(superOnOrientationChange) {
    superOnOrientationChange && superOnOrientationChange();
    console.log("onOrientationChange"+this.dispatch);
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
