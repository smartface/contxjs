export default (value) => {
    if (value instanceof Object) return JSON.stringify(value, null, "\t");
    return value;
};
