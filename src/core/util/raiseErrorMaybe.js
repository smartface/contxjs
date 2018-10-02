module.exports = function raiseErrorMaybe(e, fn) {
  if ((fn && fn(e) === false) || !fn) {
    throw e;
  }
};
