/**
 * Push classnames to the target actor
 * 
 * @params {string} classnames - Component classnames
 * @returns {Object}
 */
export default function pushClassNames(classNames: string[] | string): {
    type: string,
    classNames: string[] | string
}