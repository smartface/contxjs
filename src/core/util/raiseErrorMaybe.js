export default function raiseErrorMaybe(e, fn) {
  if (fn) {
    fn(e);
  } else {
    throw e;
  }
}
