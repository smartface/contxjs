export default function hooks(hooksList) {
  return function hookMaybe(hook, value) {
    return hooksList
      ? hooksList(hook)
      : value;
  };
}
