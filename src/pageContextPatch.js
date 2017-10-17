const extend = require('js-base/core/extend');
const pageContext = require("./pageContext");

module.exports = function pageContextPatch(page, name){
  page.onLoad = onLoad.bind(page, page.onLoad.bind(page));
  page.onShow = onShow.bind(page, page.onShow.bind(page));
  page.onHide = onHide.bind(page, page.onHide ? page.onHide.bind(page) : null);
  const pageOnOrientationChange = onOrientationChange.bind(page, page.onOrientationChange ? page.onOrientationChange.bind(page) : null);
  
  function onLoad(superOnLoad) {
    superOnLoad();
  }
  
  function onHide(superOnHide) {
    superOnHide && superOnHide();
    this.onOrientationChange = function(){};
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
    

    this.onOrientationChange = pageOnOrientationChange;
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
};
