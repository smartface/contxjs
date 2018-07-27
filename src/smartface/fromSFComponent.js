import hooks from '../core/hooks';
import * as StyleContext from '../styling/StyleContext';
import makeStylable from '../styling/Stylable';
import addContextChild from './action/addChild';
import removeContextChild from './action/removeChild';
import removeContextChildren from './action/removeChildren';
import findClassNames from '@smartface/styler/lib/utils/findClassNames';
import raiseErrorMaybe from '../core/util/raiseErrorMaybe';

function addChild(superAddChild, child, name, classNames="", userProps=null) {
  superAddChild(child);
  name && this.dispatch(addContextChild(name, child, classNames, userProps));
}

function removeChild(superRemoveChild, child) {
  if(child){
    superRemoveChild && superRemoveChild(child);
    child.dispatch && child.dispatch(removeContextChild());
  } else {
    this.getParent && this.getParent() && this.getParent().removeChild(this);
    this.dispatch && this.dispatch(removeContextChild());
  }
}

function removeChildren(superRemoveAll) {
  superRemoveAll();
  this.dispatch && this.dispatch(removeContextChildren());
}


function createOriginals(component){
  !component.__original_addChild
    && Object.defineProperty(component, "__original_addChild", {
        value: component.addChild,
        enumerable: false,  
        configurable: false
      });

  !component.__original_removeChild 
    && Object.defineProperty(component, "__original_removeChild", {
        value: component.removeChild,
        enumerable: false,  
        configurable: false
      });

  !component.__original_removeAll 
    && Object.defineProperty(component, "__original_removeAll", {
        value: component.removeAll,
        enumerable: false,  
        configurable: false
      });
}

function patchComponent(component, rootName, name){
  try {
    if(component.layout && typeof component.layout.addChild === 'function'){
      createOriginals(component.layout);
      
      Object.defineProperty(component.layout, "addChild", {
        value: addChild.bind(component, component.layout.__original_addChild.bind(component.layout)),
        enumerable: true,  
        configurable: true
      });
      
      component.layout.removeChild && Object.defineProperty(component.layout, "removeChild", {
        value: removeChild.bind(component, component.layout.__original_removeChild.bind(component.layout)),
        enumerable: true,  
        configurable: true
      });
      
      component.layout.removeAll && Object.defineProperty(component.layout, "removeAll", {
        value: removeChildren.bind(component, component.layout.__original_removeAll.bind(component.layout)),
        enumerable: true,  
        configurable: true
      });
    } else if(typeof component.addChild === 'function'){
      createOriginals(component);

      Object.defineProperty(component, "addChild", {
        value: addChild.bind(component, component.__original_addChild.bind(component)),
        enumerable: true,  
        configurable: true
      });
      
      component.removeChild && Object.defineProperty(component, "removeChild", {
        value: removeChild.bind(component, component.__original_removeChild.bind(component)),
        enumerable: true,  
        configurable: true
      });
      
      component.removeAll && Object.defineProperty(component, "removeAll", {
        value: removeChildren.bind(component, component.__original_removeAll.bind(component)),
        enumerable: true,  
        configurable: true
      });
    } else {
      !component.removeChild && Object.defineProperty(component, "removeChild", {
        value: removeChild.bind(component),
        enumerable: true,  
        configurable: true
      });
    }
  } catch (e) {
    e.message = `An Error is occurred when component [${name}] is patched in the [${rootName}]. ${e.message}`;
    
    raiseErrorMaybe(e, component.onError);
  }
}

function createTreeItem(component, name, rootName, root){
  let componentVars;
  var classNames = component.__tree_item === true ? component.classNames : "";
  
  if (name == rootName + "_statusBar") {
    componentVars = root.constructor && root.constructor.$$styleContext.statusBar || {};
  } else if (name == rootName + "_headerBar") {
    componentVars = root.constructor && root.constructor.$$styleContext.headerBar || {};
  } else {
    componentVars = component.constructor && component.constructor.$$styleContext || {};
  }
  
  patchComponent(component, rootName, name);

  classNames = componentVars.classNames 
    ? componentVars.classNames + " " + classNames + " #" + name 
    : classNames + " #" + name;

  // if (acc[name] === undefined) {
  //   delete acc['@@isEmpty'];
    
  return {
    component,
    classNames,
    userStyle: componentVars.userProps,
    name,
    __tree_item: true
  };
  // }
}

function buildContextTree(component, name, root, rootName, acc) {
  
  if (acc[name] === undefined) {
    delete acc['@@isEmpty'];

    acc[name] = createTreeItem(component, name, rootName, root);
  }

  component.children &&
    Object.keys(component.children).forEach((child) => {
      const comp = component.children[child];
      try {
        if (comp.component !== undefined && comp.classNames !== undefined) {
          buildContextTree(comp.component, createName(name, child), root, rootName, acc);
        } else {
          buildContextTree(comp, createName(name, child), root, rootName, acc);
        }
      } catch (e) {
        e.message = "Error when component would be collected: " + child + ". " + e.message;
        raiseErrorMaybe(e, component.onError);
      }
    });
}

function createName(root, name){
  return root+"_"+name;
}

/**
 * Extract components tree from a SF Component
 * 
 * @param {Object} component - A sf-core component
 * @param {string} name - component name
 * @param {function} initialClassNameMap - classNames mapping with specified component and children
 * @param {?function} hookList - callback function to capture context's hooks
 * @param {?Object} acc [={}] - Initial Accumulator value
 * 
 * @return {function} - context helper
 */
export function extractTreeFromSFComponent(root, rootName, initialClassNameMap, acc = {'@@isEmpty': true}) {
  buildContextTree(root, rootName, root, rootName, acc);
  
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
      return fromSFComponent(root, rootName, hooksList, contextElements);
    }
  );
}

export function createActorTreeFromSFComponent(component, name, rootName) {
  
  if(component.addChild || component.layout){
    const ctree = extractTreeFromSFComponent(root, rootName, null);
  
    Object.keys(ctree).forEach((name) => {
      const item = ctree[name];
  
      ctree[name] = makeStylable(item);
    });
  
    return ctree;
  } else {
    return {
      [createName(rootName, name)]: makeStylable(createTreeItem(component, name, rootName, component))
    };
  }
}
