import hooks from '../core/hooks';
import * as StyleContext from '../styling/StyleContext';
import makeStylable from '../styling/Stylable';
import addContextChild from './action/addChild';
import removeContextChild from './action/removeChild';
import removeContextChildren from './action/removeChildren';
import findClassNames from '@smartface/styler/lib/utils/findClassNames';

function addChild(superAddChild, child, name, classNames="", props={}) {
  superAddChild(child);
  name && this.dispatch(addContextChild(name, child, classNames, props));
}

function removeChild(superRemoveChild, child) {
  superRemoveChild(child);
  child.dispatch && child.dispatch(removeContextChild());
}

function removeChildren(superRemoveAll) {
  superRemoveAll();
  this.dispatch && this.dispatch(removeContextChildren());
}

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
    
    if(component.layout && typeof component.layout.addChild === 'function'){
      Object.defineProperty(component.layout, "addChild", {
        value: addChild.bind(component, component.layout.addChild.bind(component.layout))
      });
      
      component.layout.removeChild && Object.defineProperty(component.layout, "removeChild", {
        value: removeChild.bind(component, component.layout.removeChild.bind(component.layout))
      });
      
      component.layout.removeAll && Object.defineProperty(component.layout, "removeAll", {
        value: removeChildren.bind(component, component.layout.removeAll.bind(component.layout))
      });
    } else if(typeof component.addChild === 'function'){
      Object.defineProperty(component, "addChild", {
        value: addChild.bind(component, component.addChild.bind(component))
      });
      
      component.removeChild && Object.defineProperty(component, "removeChild", {
        value: removeChild.bind(component, component.removeChild.bind(component))
      });
      
      component.removeAll && Object.defineProperty(component, "removeAll", {
        value: removeChildren.bind(component, component.removeAll.bind(component))
      });
    }

    const classNames = componentVars.classNames ? componentVars.classNames+ " #" + name : "#" + name;

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
