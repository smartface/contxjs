import * as orientation  from "@smartface/extension-utils/lib/orientation";
import System from '@smartface/native/device/system';
function load(src){
    return require(src);
}
let AndroidConfig
var isTablet = false;

if (System.OS === "iOS" && orientation.shortEdge >= 720) {
    isTablet = true;
} else if (System.OS === "Android") {
    AndroidConfig = load('@smartface/native/util/Android/androidconfig');
    const Activity = AndroidConfig.activity;
    const context = Activity;

    const SCREENLAYOUT_SIZE_MASK = 15,
        SCREENLAYOUT_SIZE_LARGE = 3;
    let xlarge = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) === 4);
    let large = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) == SCREENLAYOUT_SIZE_LARGE);
    isTablet = (xlarge || large);
}

module.exports = isTablet;
