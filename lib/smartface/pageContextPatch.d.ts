import Page = require("sf-core/ui/page");

declare function onSafeAreaPaddingChange(onSafeAreaPaddingChange: () => any, paddings: { left: number, right: number, top: number, bottom: number}): void;

declare function onHide(superOnHide: () => any): void;

declare function updateHeaderBar(): void;

declare function onShow(superOnShow: () => any, data: any): void;

declare function onOrientationChange(superOnOrientationChange: () => any): void;

declare function componentDidEnter(componentDidEnter: () => any, dispatcher: any): void;

/**
 *  monkey patching wrapper for any page.
 */
export default function pageContextPatch(page: Page, name: string): () => any;