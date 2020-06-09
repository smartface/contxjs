/**
 * Push classnames to the target actor
 * 
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
export default function removeClassNames(className: string): {
    type: string,
    className: string
}