function toStrinUtil(value) {
  if (value instanceof Object) return JSON.stringify(value, null, "\t");
  return value;
}

module.exports = toStrinUtil;
