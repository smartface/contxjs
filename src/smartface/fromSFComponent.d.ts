import View = require("sf-core/ui/view");

declare function addChild(superAddChild: () => {}, child: View, name: string, classNames: string = "", userProps: object | null = null, defaultClassNames: string = ""): void;

declare function removeChild(superRemoveChild: () => {}, child: View): void;

declare function removeChildren(superRemoveAll: () => {});

declare function createOriginals(component: View): void;

declare function patchComponent(component: View, rootName: string, name: string): void;

declare function createTreeItem(component: View, name: string, rootName: string, root: View, defaultClassNames: string[] | string): void;

declare function buildContextTree(component: View, name: string, root: any, rootName: string, defaultClassNames: string[] | string, acc: object): void;

declare function createName(root: View, name: string): string;

export function extractTreeFromSFComponent(root: View, rootName: string, defaultClassNames: string, acc: object = {}): () => {} {
  buildContextTree(root, rootName, root, rootName, defaultClassNames, acc);
  return acc;
}

export default function fromSFComponent(root: View, rootName: string, hooksList: any = null, collection: object = {}): () => {};

export function createActorTreeFromSFComponent(component: View, name: string, rootName: string, defaultClassNames: string[] | string): any[];