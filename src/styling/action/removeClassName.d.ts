/**
 * Push classnames to the target actor
 * 
 * @deprecated
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
export default function removeClassName(className: string): {
    type: string,
    className: string
}