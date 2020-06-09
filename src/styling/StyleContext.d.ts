import { INIT_CONTEXT_ACTION_TYPE } from "../core/constants";
import Context from "../core/Context";
import merge from "@smartface/styler/lib/utils/merge";
import Actor from "../core/Actor";

/**
 * Style Context. Returns context composer
 * 
 * @param {Array.<Object>} actors - Actors List
 * @param {function} hookMaybe - Hooks factory
 * @returns {function} - Context Composer Function
 */
export function createStyleContext(actors: Actor[], hookMaybe: () => any, updateContextTree: () => any): Context;