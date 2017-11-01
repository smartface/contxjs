export default function flush(str = "", obj) {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] != null && obj[key] instanceof Object) {
      str += key + ": " + flush("", obj[key]) + ", ";
    } else {
      str += key + ": " + obj[key] + ", ";
    }
  });

  return "{ " + str.trim(", ") + " }";
}
