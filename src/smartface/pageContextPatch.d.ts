import Page = require("sf-core/ui/page");

declare function onSafeAreaPaddingChange(onSafeAreaPaddingChange: () => {}, paddings: { left: number, right: number, top: number, bottom: number}): void;

declare function onHide(superOnHide: () => {}): void;

declare function updateHeaderBar(): void;

declare function onShow(superOnShow: () => {}, data: any): void;

declare function onOrientationChange(superOnOrientationChange: () => {}): void;

declare function componentDidEnter(componentDidEnter: () => {}, dispatcher: any): void;

/**
 *  monkey patching wrapper for any page.
 */
export default function pageContextPatch(page: Page, name: string): () => {};