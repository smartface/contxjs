/**
 * Forces Component's invalidated.
 * 
 * @params {string} name - Component classnames
 * @returns {Object}
 */
export default function forceComponentUpdate(name: string): {
    type: string,
    name: string
};