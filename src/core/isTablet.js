import { orientation } from "sf-extension-utils";
import System from 'sf-core/device/system';
import('sf-core/util/Android/androidconfig')
    .then((config) => {
       AndroidConfig = config
    });
let AndroidConfig
var isTablet = false;

if (System.OS === "iOS" && orientation.shortEdge >= 720) {
    isTablet = true;
}
else if (System.OS === "Android") {
    const Activity = AndroidConfig.activity;
    const context = Activity;
    
    const SCREENLAYOUT_SIZE_MASK = 15,
        SCREENLAYOUT_SIZE_LARGE = 3;
    let xlarge = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) === 4);
    let large = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) == SCREENLAYOUT_SIZE_LARGE);
    isTablet = (xlarge || large);
}

module.exports = isTablet;
