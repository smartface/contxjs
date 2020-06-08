import PageBase = require('sf-core/ui/page');
import Application = require('sf-core/application');
import StatusBar = Application.statusBar;
import HeaderBar = require('sf-core/ui/headerbar');

export default class Page extends PageBase {
    children: {
        statusBar: StatusBar,
        headerBar: HeaderBar
    }
    constructor(): void;
}