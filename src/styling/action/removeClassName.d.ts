/**
 * Push classnames to the target actor
 * 
 * @deprecated
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
export default function removeClassName(className: string|string[]): {
    type: "removeClassName",
    className: string|string[]
}