import Color from "@smartface/native/ui/color";
import Font from "@smartface/native/ui/font";
import Image from "@smartface/native/ui/image";

const HexColorValidationRegexp = /^#[0-9A-Fa-f]{6}$/gi;
const ENUMS = {
    imageFillType: "@smartface/native/ui/imagefilltype",
    textAlignment: "@smartface/native/ui/textalignment",
    keyboardType: "@smartface/native/ui/keyboardtype",
    orientation: "@smartface/native/ui/page",
    type: "@smartface/native/ui/mapview",
    gradientOrientation: "@smartface/native/ui/color",
    searchViewStyle: "@smartface/native/ui/searchview",
    activityIndicatorViewStyle:
        "@smartface/native/ui/activityindicator/ios/activityindicatorviewstyle",
    alignSelf: "@smartface/native/ui/flexlayout",
    alignContent: "@smartface/native/ui/flexlayout",
    alignItems: "@smartface/native/ui/flexlayout",
    direction: "@smartface/native/ui/flexlayout",
    ellipsizeMode: "@smartface/native/ui/ellipsizemode",
    flexDirection: "@smartface/native/ui/flexlayout",
    flexWrap: "@smartface/native/ui/flexlayout",
    justifyContent: "@smartface/native/ui/flexlayout",
    positionType: "@smartface/native/ui/flexlayout",
    overflow: "@smartface/native/ui/flexlayout",
    style: "@smartface/native/ui/statusbarstyle",
    shimmeringDirection: "@smartface/native/ui/shimmerflexlayout",
    ios: {
        style: "@smartface/native/ui/statusbarstyle"
    },
    align: "@smartface/native/ui/scrollview",
    scrollDirection: "@smartface/native/ui/layoutmanager"
};
const ENUMS_META_FIELD = {
    align: "Align",
    orientation: "Orientation",
    type: "Type",
    searchViewStyle: "iOS",
    alignSelf: "AlignSelf",
    alignContent: "AlignContent",
    alignItems: "AlignItems",
    direction: "Direction",
    flexDirection: "FlexDirection",
    flexWrap: "FlexWrap",
    justifyContent: "JustifyContent",
    positionType: "PositionType",
    overflow: "OverFlow",
    scrollDirection: "ScrollDirection",
    shimmeringDirection: "ShimmeringDirection",
    gradientOrientation: "GradientOrientation"
};
const componentObjectProps = {
    android: {},
    ios: {},
    layout: {},
    layoutManager: {}
};

const COLOR_PROPS = [
    "backgroundColor",
    "baseColor",
    "borderColor",
    "cancelButtonColor",
    "color",
    "cursorColor",
    "errorColor",
    "foregroundColor",
    "highlightColor",
    "hintTextColor",
    "itemColor",
    "lineColor",
    "maxTrackColor",
    "minTrackColor",
    "rippleColor",
    "selectedHintTextColor",
    "shadowColor",
    "textColor",
    "textFieldBackgroundColor",
    "thumbColor",
    "thumbOffColor",
    "thumbOnColor",
    "tintColor",
    "titleColor",
    "toggleOffColor",
    "toggleOnColor",
    "underlineColor",
    "strikethroughColor",
    "trackColor",
    "outerTrackColor"
];

const IMAGE_PROPS = [
    "backIndicatorImage",
    "backgroundImage",
    "closeImage",
    "icon",
    "iconImage",
    "image",
    "inactiveImage",
    "maxTrackImage",
    "minTrackImage",
    "thumbImage"
];

const FONT_PROPS = [
    "font",
    "titleFont",
    "cancelButtonFont",
    "doneButtonFont",
    "labelsFont",
    "okFont",
    "cancelFont",
    "subtitleFont",
    "clusterFont"
];

const GIFIMAGE_PROPS = ["gifImage"];

const IMAGE_FILLTYPE_COMMON_PROPS = [
    "ASPECTFIT",
    "NORMAL",
    "STRETCH",
    "ASPECTFILL"
];

const FONT_STYLE = {
    BOLD: "BOLD",
    ITALIC: "ITALIC",
    NORMAL: "NORMAL",
    DEFAULT: "NORMAL"
};

const DEFAULT_FONT_STYLES = ["b", "i", "n", "r", "bi"];

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
    layoutHeight: "height",
    layoutWidth: "width"
};

const VALID_HEX_COLOR_LENGTHS = [3, 6, 8];

function _requireEnum(key) {
    var res = require(ENUMS[key]);
    if (ENUMS_META_FIELD[key]) {
        res = res[ENUMS_META_FIELD[key]];
    }
    return res;
}
/**
 * Create a @smartface/native value
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
        } else if (
            key === "imageFillType" &&
            IMAGE_FILLTYPE_COMMON_PROPS.indexOf(value) === -1
        ) {
            res = value === null ? NaN : _requireEnum(key).ios[value];
        } else if (ENUMS[key]) {
            res = value === null ? NaN : _requireEnum(key)[value];
        } else {
            throw new Error(key + " ENUM value cannot be found");
        }
    } else if (COLOR_PROPS.indexOf(key) !== -1) {
        res = createColorForDevice(value);
    } else if (IMAGE_PROPS.indexOf(key) !== -1) {
        res = createImageForDevice(value);
    } else if (FONT_PROPS.indexOf(key) !== -1) {
        res = createFontForDevice(value);
    } else if (GIFIMAGE_PROPS.indexOf(key) !== -1) {
        res = createGifImageForDevice(value);
    } else {
        res = value === null ? NaN : value;
    }
    return res;
}

export default function buildProps(objectVal) {
    var props = {};

    Object.keys(objectVal).forEach(function(key) {
        if (objectVal[key] !== null) {
            props[key] = createSFCoreProp(key, objectVal[key]);
        }
    });

    return props;
}

function createGifImageForDevice(gifImage) {
    return require("@smartface/native/ui/gifimage").createFromFile(
        `assets://${gifImage}`
    );
}

function createImageForDevice(image) {
    var res;
    if (image instanceof Object) {
        if (image.src !== undefined) {
            res = Image.createFromFile("images://" + image.src);
            res.autoMirrored = image.autoMirrored;
        } else {
            res = {};
            Object.keys(image).forEach(function(c) {
                res[c] = createImageForDevice(image[c]);
            });
        }
    } else {
        res = "images://" + image;
    }
    return res;
}

const createColorForDevice = (function() {
    const reRGB = /rgb/i;
    const reRGBA = /\d\.\d+|\d+/gi;
    return color => {
        reRGBA.lastIndex = reRGB.lastIndex = 0;
        var res;
        if (color instanceof Object) {
            if (color.startColor) {
                // gradient color
                res = Color.createGradient({
                    startColor: createColorForDevice(color.startColor),
                    endColor: createColorForDevice(color.endColor),
                    direction: Color.GradientDirection[color.direction]
                });
            } else {
                // colors object
                res = {};
                Object.keys(color).forEach(c => {
                    res[c] = createColorForDevice(color[c]);
                });
            }
        } else if (color && reRGB.test(color)) {
            // rgba color
            var rgba = color.match(reRGBA);
            rgba.length === 3 && (rgba[3] = 1);
            res = Color.create(
                Number(rgba[3]) * 100,
                Number(rgba[0]),
                Number(rgba[1]),
                Number(rgba[2])
            );
        } else if (color) {
            // hex color
            HexColorValidationRegexp.lastIndex = 0;
            if (
                !HexColorValidationRegexp.test(color) ||
                VALID_HEX_COLOR_LENGTHS.indexOf(color.length - 1) === -1
            )
                throw new Error(
                    `${color} is invalid value. Please, check your styles`
                );
            res = Color.create(getNormalizedHexColor(color));
        }
        return res || color;
    };
})();

function createFontForDevice(font) {
    var res;
    if (
        !font.style ||
        !font.family ||
        font.family === "Default" ||
        DEFAULT_FONT_STYLES.indexOf(font.style) !== -1
    ) {
        var family =
            !font.family || font.family === "Default"
                ? Font.DEFAULT
                : font.family;
        res = Font.create(family, font.size || 16, getFontStyle(font));
        //console.log(`Font.create(${family}, ${font.size||16}, ${getFontStyle(font)})`);
    } else {
        res = Font.create(
            font.family + (font.style ? "-" + font.style : ""),
            font.size || 16
        );
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

function getNormalizedHexColor(_color) {
    if (_color.length === 4) {
        const color = _color.substring(1);
        let resColor = "#";
        for (let i = 0; i < 3; ++i) {
            resColor += color[i] + color[i];
        }
        return resColor;
    }
    return _color;
}
