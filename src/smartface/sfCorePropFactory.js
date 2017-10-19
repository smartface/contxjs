import FlexLayout from 'sf-core/ui/flexlayout';
import Color from 'sf-core/ui/color';
import Image from 'sf-core/ui/image';
import Font from 'sf-core/ui/font';
import imageFillType from 'sf-core/ui/imagefilltype';
import textAlignment from 'sf-core/ui/textalignment';
import {Orientation} from 'sf-core/ui/page';
import {Type as MapViewType} from 'sf-core/ui/mapview';
import {iOS} from 'sf-core/ui/searchview';
import {Align as ScrollViewAlign} from 'sf-core/ui/scrollview';
import style from 'sf-core/ui/statusbarstyle';

// require('sf-core/ui/imagefilltype')
const ENUMS = {
  "imageFillType": imageFillType,
  "textAlignment": textAlignment,
  "orientation": Orientation,
  "type": MapViewType,
  "gradientOrientation": Color.GradientOrientation,
  "searchViewStyle": iOS && iOS.style || {},
  "alignSelf": FlexLayout.AlignSelf,
  "alignContent": FlexLayout.AlignContent,
  "alignItems": FlexLayout.AlignItems,
  "direction": FlexLayout.Direction,
  "flexDirection": FlexLayout.FlexDirection,
  "flexWrap": FlexLayout.FlexWrap,
  "justifyContent": FlexLayout.JustifyContent,
  "positionType": FlexLayout.PositionType,
  "overflow": FlexLayout.OverFlow,
  "style": style,
  "align": ScrollViewAlign
};

const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "textColor",
  "borderColor",
  "titleColor",
  "thumbOffColor",
  "thumbOnColor",
  "toggleOffColor",
  "toggleOnColor",
  "hintTextColor",
  "minTrackColor",
  "maxTrackColor",
  "thumbColor"
];

const IMAGE_PROPS = [
  "image",
  "backgroundImage",
  "thumbImage",
  "inactiveImage",
  "maxTrackImage",
  "minTrackImage",
  "backIndicatorImage"
];

const FONT_STYLE = {
  BOLD: "BOLD",
  ITALIC: "ITALIC",
  NORMAL: "NORMAL",
  DEFAULT: "NORMAL"
};

const SCW_LAYOUT_PROPS = [
  "alignContent",
  "alignItems",
  "direction",
  "flexDirection",
  "justifyContent",
  "flexWrap",
  "paddingLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "layoutHeight",
  "layoutWidth"
];

const LAYOUT_PROPS_MAP = {
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
export function createSFCoreProp(key, value) {
  var res;
  if (ENUMS[key]) {
    res = ENUMS[key][value];
  }
  else if (COLOR_PROPS.indexOf(key) !== -1) {
    res = createColorForDevice(value);
  }
  else if (IMAGE_PROPS.indexOf(key) !== -1) {
    res = Image.createFromFile("images://" + value);
  }
  else if (key === "font") {
    res = Font.create(value.family || "Font.DEFAULT", value.size || 16, getFontStyle(value));
  }
  else {
    res = value;
  }

  return res;
}

function createColorForDevice(color) {
  var res;
  if (color.startColor) { // gradient color
    res = Color.createGradient({
      startColor: createColorForDevice(color.startColor),
      endColor: createColorForDevice(color.endColor),
      direction: Color.GradientDirection[color.direction]
    });
  }
  else if (/rgb/i.test(color)) {
    var rgba = color.match(/\d\.\d+|\d+/ig);
    res = Color.create((Number(rgba[3]) * 255), Number(rgba[0]), Number(rgba[1]), Number(rgba[2]));
  }
  else {
    res = Color.create(color);
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
  return Font[res];
}
