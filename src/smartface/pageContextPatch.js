import extend from 'js-base/core/extend';
import createPageContext from "./pageContext";

const buildStyles = require("@smartface/styler/lib/buildStyles");
const Application = require("sf-core/application");

function wrapMethod(instance, method, bindingfFunc){
  return bindingfFunc.bind(instance, typeof instance[method] === "function" ? instance[method].bind(instance) : null) 
}

// monkey patching wrapper for any page.
export default function pageContextPatch(page, name){
  page.onLoad = wrapMethod(page, "onLoad", onLoad);
  page.onShow = wrapMethod(page, "onShow", onShow);
  page.onHide = wrapMethod(page, "onHide", onHide);
  page.onOrientationChange = wrapMethod(page, "onOrientationChange", onOrientationChange);
  page.themeDispatch = Application.theme();
  page.themeDispatch({
    type: "addPage",
    name: name,
    pageContext: createPageContext(page, name, null, null)
  });

  function onLoad(superOnLoad) {
    superOnLoad && superOnLoad();
  }
  
  function onHide(superOnHide) {
    superOnHide && superOnHide();
  }
  
  function onShow(superOnShow) {
    superOnShow && superOnShow();
    
    this.dispatch({
      type: "invalidate"
    });
    
    this.layout.applyLayout();
  }
  
  function onOrientationChange(superOnOrientationChange) {
    this.dispatch({
      type: "orientationStarted"
    });
    
    this.layout.applyLayout();

    superOnOrientationChange && setTimeout(superOnOrientationChange.bind(this),1);
    setTimeout(function() {
      this.dispatch({
        type: "orientationEnded"
      });

      this.layout.applyLayout();
    }.bind(this), 1);
  }
  
  page.setContextDispatcher = function(dispatcher) {
    alert("set");
    this.dispatch = dispatcher;
  };
  
  return function pageContextPatchDispose(){
    page.dispatch(null);
    page.dispatch = null;
    page.onLoad = null;
    page.onShow = null;
    page.onHide = null;
    page.onOrientationChange = null;
  };
};
