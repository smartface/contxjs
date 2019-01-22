const PageBase = require('sf-core/ui/page');
const extend = require("js-base/core/extend");
const Page = extend(PageBase);
const pageContextPatch = require('./pageContextPatch');

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