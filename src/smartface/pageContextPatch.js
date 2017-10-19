import extend from 'js-base/core/extend';
import pageContext from "./pageContext";

const buildStyles = require("@smartface/styler/lib/buildStyles");
const theme = buildStyles(require("../themes/Defaults"));

function wrapMethod(instance, method, bindingfFunc){
  return bindingfFunc.bind(instance, typeof instance[method] === "function" ? instance[method].bind(instance) : null) 
}

export default function pageContextPatch(page, name){
  page.onLoad = wrapMethod(page, "onLoad", onLoad);
  page.onShow = wrapMethod(page, "onShow", onShow);
  page.onHide = wrapMethod(page, "onHide", onHide);
  page.onOrientationChange = wrapMethod(page, "onOrientationChange", onOrientationChange);

  function onLoad(superOnLoad) {
    superOnLoad();
  }
  
  function onHide(superOnHide) {
    superOnHide && superOnHide();
  }
  
  function onShow(superOnShow) {
    superOnShow();
    
    if(!this.styleContext) {
      this.styleContext = pageContext.createContext(
        this,
        name,
        null,
        function reducers(state, actors, action, target) {
          return state;
        });
        setTimeout(function(){
          this.dispatch({
            type: "invalidate"
          });
          
          this.layout.applyLayout();
        }.bind(this), 50);
    } else {
      this.dispatch({
        type: "invalidate"
      });
      this.layout.applyLayout();
    }
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
  };
  
  page.setContextDispatcher = function(dispatcher) {
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
