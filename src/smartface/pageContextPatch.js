import extend from 'js-base/core/extend';
import createPageContext from "./pageContext";
import patchMethod from '../util/patchMethod';

const buildStyles = require("@smartface/styler/lib/buildStyles");
const Application = require("sf-core/application");

function onSafeAreaPaddingChange(onSafeAreaPaddingChange, paddings) {
  const style = {};
  paddings.left != undefined && (style.paddingLeft = paddings.left);
  paddings.right != undefined && (style.paddingRight = paddings.right);
  paddings.top != undefined && (style.paddingTop = paddings.top);
  paddings.bottom != undefined && (style.paddingBottom = paddings.bottom);

  onSafeAreaPaddingChange && onSafeAreaPaddingChange.call(this, paddings);

  if (this.ios.safeAreaLayoutMode === true) {
    this.dispatch({
      type: "updatePageSafeArea",
      safeArea: style
    });

    this.layout.applyLayout();
  }
}

function onHide(superOnHide) {
  superOnHide && superOnHide();
}

function onShow(superOnShow, data) {
  superOnShow && superOnShow(data);

  this.dispatch && this.dispatch({
    type: "invalidate"
  });
  this.dispatch && this.dispatch({
    type: "forceComponentUpdate",
    name: "statusbar"
  });

  this.layout.applyLayout();
}

function onOrientationChange(superOnOrientationChange) {
  superOnOrientationChange && superOnOrientationChange();

  this.dispatch && this.dispatch({
    type: "orientationStarted"
  });

  this.layout.applyLayout();

  // superOnOrientationChange && setTimeout(superOnOrientationChange.bind(this),1);
  setTimeout(() => {
    this.dispatch && this.dispatch({
      type: "orientationEnded"
    });

    this.layout.applyLayout();
  }, 1);
}

function componentDidEnter(componentDidEnter, dispatcher) {
  componentDidEnter
    &&
    componentDidEnter(dispatcher) ||
    (this.dispatch = dispatcher);
}

// monkey patching wrapper for any page.
export default function pageContextPatch(page, name) {
  page.onLoad = patchMethod(page, "onLoad", onLoad);
  page.onShow = patchMethod(page, "onShow", onShow);
  page.onHide = patchMethod(page, "onHide", onHide);

  page.componentDidEnter = patchMethod(page, "componentDidEnter", componentDidEnter);
  page.onOrientationChange = patchMethod(page, "onOrientationChange", onOrientationChange);
  // hides unload logic
  // page.onUnload = patchMethod(page, "onUnload", onPageUnload);

  if (page.ios) {
    page.ios.onSafeAreaPaddingChange = onSafeAreaPaddingChange.bind(page, page.ios.onSafeAreaPaddingChange);
  }

  function onPageUnload(superOnUnload) {
    superOnUnload && superOnUnload();
    this.themeContext(null);

    // pageContextPatchDispose();
  }

  function onLoad(superOnLoad) {
    superOnLoad && superOnLoad();
    this.themeContext = Application.theme(createPageContext(page, name, null, null), name);

  }

  function pageContextPatchDispose() {
    page.dispatch(null);
    page.dispatch = null;
    page.onLoad = null;
    page.onShow = null;
    page.onHide = null;
    page.onOrientationChange = null;
    page = null;
  };

  return pageContextPatchDispose;
};
