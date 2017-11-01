export default function patchMethod(scope, method, bindingfFunc){
  return bindingfFunc.bind(scope, typeof scope[method] === "function" ? scope[method].bind(scope) : null) 
}
