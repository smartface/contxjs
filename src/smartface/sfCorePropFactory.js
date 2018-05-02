import FlexLayout from 'sf-core/ui/flexlayout';
import Color from 'sf-core/ui/color';
import Image from 'sf-core/ui/image';
import Font from 'sf-core/ui/font';
import imageFillType from 'sf-core/ui/imagefilltype';
import textAlignment from 'sf-core/ui/textalignment';
import { Orientation } from 'sf-core/ui/page';
import { Type as MapViewType } from 'sf-core/ui/mapview';
import { iOS } from 'sf-core/ui/searchview';
import { Align as ScrollViewAlign } from 'sf-core/ui/scrollview';
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
  "ios": {
    "style": style
  },
  "align": ScrollViewAlign
};

const componentObjectProps = {
  "android": {},
  "ios": {},
  "layout": {}
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
  "thumbColor",
  "itemColor",
  "shadowColor",
  "foregroundColor",
  "underlineColor"
];

const IMAGE_PROPS = [
  "image",
  "backgroundImage",
  "thumbImage",
  "inactiveImage",
  "maxTrackImage",
  "minTrackImage",
  "backIndicatorImage",
  "icon"
];

const IMAGE_FILLTYPE_COMMON_PROPS = [
  "ASPECTFIT",
  "NORMAL",
  "STRETCH"
];

const FONT_STYLE = {
  BOLD: "BOLD",
  ITALIC: "ITALIC",
  NORMAL: "NORMAL",
  DEFAULT: "NORMAL"
};

const DEFAULT_FONT_STYLES = [
  "b",
  "i",
  "n",
  "r",
  "bi"
];

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
 * Create a sf-core value
 * 
 * @function
 * 
 * @param {string} key 
 * @param {string/number} [value] value of property
 * @return {object/string/number} properties.
 */
export function createSFCoreProp(key, value) {
  var res;
  if (componentObjectProps[key] || ENUMS[key]) {
    if (value instanceof Object) {
      res = {};
      Object.keys(value).forEach(function(name) {
        // if (ENUMS[key] && ENUMS[key][name]) {
        //   res[name] = ENUMS[key][name][value[name]];
        // } else {
        res[name] = createSFCoreProp(name, value[name]);
        // }
      });
    }
    else if ((key === "imageFillType") && (IMAGE_FILLTYPE_COMMON_PROPS.indexOf(value) === -1)) {
      res = value === null ? NaN : ENUMS[key].ios[value];
    }
    else if (ENUMS[key]) {
      res = value === null ? NaN : ENUMS[key][value];
    }
    else {
      throw new Error(key + " ENUM value cannot be found");
    }
  }
  else if (COLOR_PROPS.indexOf(key) !== -1) {
    res = createColorForDevice(value);
  }
  else if (IMAGE_PROPS.indexOf(key) !== -1) {
    res = createImageForDevice(value);
  }
  else if (key === "font") {
    res = createFontForDevice(value);
  }
  else {
    res = value === null ? NaN : value;
  }

  return res;
}

export default function buildProps(objectVal) {
  var props = {};

  Object
    .keys(objectVal)
    .forEach(function(key) {
      if (objectVal[key] !== null) {
        props[key] = createSFCoreProp(key, objectVal[key]);
      }
    });

  return props;
}

function createImageForDevice(image) {
  var res;
  if (image instanceof Object) {
    res = {};
    Object.keys(image).forEach(function(c) {
      res[c] = createImageForDevice(image[c]);
    });
  }
  else {
    res = Image.createFromFile("images://" + image);
  }
  if (res === null) {
    throw new Error(`Image [${image}] cannot be found`);
  }
  return res;
}

function createColorForDevice(color) {
  var res;
  if (color instanceof Object) {
    if (color.startColor) { // gradient color
      res = Color.createGradient({
        startColor: createColorForDevice(color.startColor),
        endColor: createColorForDevice(color.endColor),
        direction: Color.GradientDirection[color.direction]
      });
    }
    else { // colors object
      res = {};
      Object.keys(color).forEach(c => {
        res[c] = createColorForDevice(color[c]);
      });
    }
  }
  else if (color && /rgb/i.test(color)) { // rgba color
    var rgba = color.match(/\d\.\d+|\d+/ig);
    rgba.length === 3 && (rgba[3] = 1);
    res = Color.create((Number(rgba[3]) * 100), Number(rgba[0]), Number(rgba[1]), Number(rgba[2]));
  }
  else if (color) { // hex color
    res = Color.create(color);
  }

  return res || color;
}

function createFontForDevice(font) {
  var res;
  if (!font.style || !font.family || (font.family === "Default") || (DEFAULT_FONT_STYLES.indexOf(font.style) !== -1)) {
    var family = (!font.family || font.family === "Default") ? Font.DEFAULT : font.family;
    res = Font.create(family, font.size || 16, getFontStyle(font));
    //console.log(`Font.create(${family}, ${font.size||16}, ${getFontStyle(font)})`);
  }
  else {
    res = Font.create(font.family + (font.style ? "-" + font.style : ""), font.size);
    //console.log(`Font.create(${font.family + (font.style ? "-" + font.style : "")}, ${font.size || 16})`);
  }
  return res;
}

function getFontStyle(font) {
  var res = "";
  if (font && (font.bold || font.style === "b")) {
    res += FONT_STYLE.BOLD;
  }
  if (font && (font.italic || font.style === "i")) {
    res && (res += "_");
    res += FONT_STYLE.ITALIC;
  }

  return Font[res || FONT_STYLE.DEFAULT];
}
