import hooks from '../core/hooks';
import * as StyleContext from '../styling/StyleContext';
import makeStylable from '../styling/Stylable';

/**
 * Extract components tree from a SF Component
 * 
 * @param {Object} component - A sf-core component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * @param {?Object} acc [={}] - Accumulator
 * 
 * @return {function} - context helper
 */
export function extractTreeFromSFComponent(root, rootName, initialClassNameMap, acc = {'@@isEmpty': true}) {
  function buildContextTree(component, name) {
    let componentVars;

    if (name == rootName + "_statusBar") {
      componentVars = root.constructor.$$styleContext.statusBar || {};
    } else if (name == rootName + "_headerBar") {
      componentVars = root.constructor.$$styleContext.headerBar || {};
    } else {
      componentVars = component.constructor.$$styleContext || {};
    }

    const classNames = componentVars.classNames ? componentVars.classNames.trim() + " #" + name : "#" + name;

    if (acc[name] === undefined) {
      delete acc['@@isEmpty'];
      
      acc[name] = {
        component,
        classNames,
        initialProps: componentVars.initialProps,
        name
      };
    }

    component.children &&
      Object.keys(component.children).forEach((child) => {
        try {
          buildContextTree(component.children[child], name + "_" + child);
        } catch (e) {
          e.message = "Error when component would be collected: " + child + ". " + e.message;
          throw e;
        }
      });
  }

  buildContextTree(root, rootName);
  
  return acc;
}

export default function fromSFComponent(root, rootName, hooksList = null, collection = {}) {
  const ctree = extractTreeFromSFComponent(root, rootName, null);

  Object.keys(ctree).forEach((name) => {
    const item = ctree[name];
    ctree[name] = collection[name] || makeStylable(item);
  });
  
  return StyleContext.createStyleContext(
    ctree,
    hooks(hooksList),
    function updateContextTree(contextElements={}) {
      return fromSFComponent(root, rootName, null, hooksList, contextElements);
    }
  );
}

export function createActorTreeFromSFComponent(root, rootName, collection = {}) {
  const ctree = extractTreeFromSFComponent(root, rootName, null);

  Object.keys(ctree).forEach((name) => {
    const item = ctree[name];
    ctree[name] = collection[name] || makeStylable(item);
  });

  return ctree;
}
