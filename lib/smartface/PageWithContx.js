"use strict";
var PageBase = require('sf-core/ui/page');
var extend = require("js-base/core/extend");
var Page = extend(PageBase);
var pageContextPatch = require('./pageContextPatch');
function $Page(_super, props) {
    _super(this, {});
    this.children = {};
    this.children['statusBar'] = this.statusBar || {};
    this.children['headerBar'] = this.headerBar;
    pageContextPatch(this, (props && props.name) || 'page');
}
$Page.$$styleContext = {
    classNames: '.page',
    defaultClassNames: ' .default_page',
    userProps: {},
    statusBar: {
        classNames: '.sf-statusBar',
        defaultClassNames: ' .default_statusbar',
        userProps: { visible: true }
    },
    headerBar: {
        classNames: '.sf-headerBar',
        defaultClassNames: ' .default_headerbar',
        userProps: { visible: true }
    }
};
module.exports = Page($Page);
//# sourceMappingURL=PageWithContx.js.map