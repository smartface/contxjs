/* globals Android*/
import orientation from "sf-extension-utils";
import System from 'sf-core/device/system';
// import AndroidConfig from "sf-core/util/Android/androidconfig";

var isTablet = false;
if (System.OS === "iOS" && orientation.shortEdge >= 720) {
    isTablet = true;
} else if (System.OS === "Android") {
    /*const SCREENLAYOUT_SIZE_MASK = 15,
        SCREENLAYOUT_SIZE_LARGE = 3;
    
    let Activity = AndroidConfig.activity;
    let context = Activity;
    let xlarge = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) === 4);
    let large = Boolean((context.getResources().getConfiguration().screenLayout & SCREENLAYOUT_SIZE_MASK) == SCREENLAYOUT_SIZE_LARGE);
    isTablet = (xlarge || large);*/
}

export default isTablet;
