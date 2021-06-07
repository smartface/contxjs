import PageBase = require('@smartface/native/ui/page');
import Application = require('@smartface/native/application');
import StatusBar = Application.statusBar;
import HeaderBar = require('@smartface/native/ui/headerbar');

export default class Page extends PageBase {
    children: {
        statusBar: StatusBar,
        headerBar: HeaderBar
    }
    constructor(): void;
}