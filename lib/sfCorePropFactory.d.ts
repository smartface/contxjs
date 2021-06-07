
/**
 * Create a @smartface/native value
 *
 * @function
 *
 * @param {string} key
 * @param {string/number} [value] value of property
 * @return {object/string/number} properties.
 */
export function createSFCoreProp(key: string, value: any): any;

export default function buildProps(objectVal: { [key: string]: any }): { [key: string]: any };
