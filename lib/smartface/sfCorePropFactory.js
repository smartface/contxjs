(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'sf-core/ui/flexlayout', 'sf-core/ui/color', 'sf-core/ui/image', 'sf-core/ui/font', 'sf-core/ui/imagefilltype', 'sf-core/ui/textalignment', 'sf-core/ui/page', 'sf-core/ui/mapview', 'sf-core/ui/searchview', 'sf-core/ui/scrollview', 'sf-core/ui/statusbarstyle'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('sf-core/ui/flexlayout'), require('sf-core/ui/color'), require('sf-core/ui/image'), require('sf-core/ui/font'), require('sf-core/ui/imagefilltype'), require('sf-core/ui/textalignment'), require('sf-core/ui/page'), require('sf-core/ui/mapview'), require('sf-core/ui/searchview'), require('sf-core/ui/scrollview'), require('sf-core/ui/statusbarstyle'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.flexlayout, global.color, global.image, global.font, global.imagefilltype, global.textalignment, global.page, global.mapview, global.searchview, global.scrollview, global.statusbarstyle);
    global.sfCorePropFactory = mod.exports;
  }
})(this, function (exports, _flexlayout, _color, _image, _font, _imagefilltype, _textalignment, _page, _mapview, _searchview, _scrollview, _statusbarstyle) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createSFCoreProp = createSFCoreProp;

  var _flexlayout2 = _interopRequireDefault(_flexlayout);

  var _color2 = _interopRequireDefault(_color);

  var _image2 = _interopRequireDefault(_image);

  var _font2 = _interopRequireDefault(_font);

  var _imagefilltype2 = _interopRequireDefault(_imagefilltype);

  var _textalignment2 = _interopRequireDefault(_textalignment);

  var _statusbarstyle2 = _interopRequireDefault(_statusbarstyle);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // require('sf-core/ui/imagefilltype')
  var ENUMS = {
    "imageFillType": _imagefilltype2.default,
    "textAlignment": _textalignment2.default,
    "orientation": _page.Orientation,
    "type": _mapview.Type,
    "gradientOrientation": _color2.default.GradientOrientation,
    "searchViewStyle": _searchview.iOS && _searchview.iOS.style || {},
    "alignSelf": _flexlayout2.default.AlignSelf,
    "alignContent": _flexlayout2.default.AlignContent,
    "alignItems": _flexlayout2.default.AlignItems,
    "direction": _flexlayout2.default.Direction,
    "flexDirection": _flexlayout2.default.FlexDirection,
    "flexWrap": _flexlayout2.default.FlexWrap,
    "justifyContent": _flexlayout2.default.JustifyContent,
    "positionType": _flexlayout2.default.PositionType,
    "overflow": _flexlayout2.default.OverFlow,
    "style": _statusbarstyle2.default,
    "align": _scrollview.Align
  };

  var COLOR_PROPS = ["color", "backgroundColor", "textColor", "borderColor", "titleColor", "thumbOffColor", "thumbOnColor", "toggleOffColor", "toggleOnColor", "hintTextColor", "minTrackColor", "maxTrackColor", "thumbColor"];

  var IMAGE_PROPS = ["image", "backgroundImage", "thumbImage", "inactiveImage", "maxTrackImage", "minTrackImage", "backIndicatorImage"];

  var FONT_STYLE = {
    BOLD: "BOLD",
    ITALIC: "ITALIC",
    NORMAL: "NORMAL",
    DEFAULT: "NORMAL"
  };

  var SCW_LAYOUT_PROPS = ["alignContent", "alignItems", "direction", "flexDirection", "justifyContent", "flexWrap", "paddingLeft", "paddingTop", "paddingRight", "paddingBottom", "layoutHeight", "layoutWidth"];

  var LAYOUT_PROPS_MAP = {
    "layoutHeight": "height",
    "layoutWidth": "width"
  };

  /**
   * @function getOneProp
   * get property value 
   * @param {string} key 
   * @param {string/number} [value] value of property
   * @return {object/string/number} properties.
   */
  function createSFCoreProp(key, value) {
    var res;
    if (ENUMS[key]) {
      res = ENUMS[key][value];
    } else if (COLOR_PROPS.indexOf(key) !== -1) {
      res = createColorForDevice(value);
    } else if (IMAGE_PROPS.indexOf(key) !== -1) {
      res = _image2.default.createFromFile("images://" + value);
    } else if (key === "font") {
      res = _font2.default.create(value.family || "Font.DEFAULT", value.size || 16, getFontStyle(value));
    } else {
      res = value;
    }

    return res;
  }

  function createColorForDevice(color) {
    var res;
    if (color.startColor) {
      // gradient color
      res = _color2.default.createGradient({
        startColor: createColorForDevice(color.startColor),
        endColor: createColorForDevice(color.endColor),
        direction: _color2.default.GradientDirection[color.direction]
      });
    } else if (/rgb/i.test(color)) {
      var rgba = color.match(/\d\.\d+|\d+/ig);
      res = _color2.default.create(Number(rgba[3]) * 255, Number(rgba[0]), Number(rgba[1]), Number(rgba[2]));
    } else {
      res = _color2.default.create(color);
    }
    return res;
  }

  function getFontStyle(font) {
    var res = "";
    if (font.bold) {
      res += FONT_STYLE.BOLD;
    }
    if (font.italic) {
      res && (res += "_");
      res += FONT_STYLE.ITALIC;
    }!res && (res = FONT_STYLE.DEFAULT);
    return _font2.default[res];
  }
});