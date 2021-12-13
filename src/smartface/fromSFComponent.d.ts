import View = require("@smartface/native/ui/view");

declare function addChild(superAddChild: () => any, child: View, name: string, classNames: string, userProps: { [key: string]: any } | null, defaultClassNames: string): void;

declare function removeChild(superRemoveChild: () => any, child: View): void;

declare function removeChildren(superRemoveAll: () => any);

declare function createOriginals(component: View): void;

declare function patchComponent(component: View, rootName: string, name: string): void;

declare function createTreeItem(component: View, name: string, rootName: string, root: View, defaultClassNames: string[] | string): void;

declare function buildContextTree(component: View, name: string, root: any, rootName: string, defaultClassNames: string[] | string, acc: { [key: string]: any }): void;

declare function createName(root: View, name: string): string;

export function extractTreeFromSFComponent(root: View, rootName: string, defaultClassNames: string, acc: { [key: string]: any }): {};

export default function fromSFComponent(root: View, rootName: string, hooksList: any, collection: { [key: string]: any }): () => any;

export function createActorTreeFromSFComponent(component: View, name: string, rootName: string, defaultClassNames: string[] | string): any[];