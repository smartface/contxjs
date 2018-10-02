/**
 * Created by smartface on 10/18/16.
 */

// import createPageContext from '../src/smartface/pageContext';

// import {findClassNames} from "../src/styler";
// const styler = require("../src/styler").styler;
// const resetStylerCache = require("../src/styler").resetStylerCache;
// const componentStyler = require("../src/styler").componentStyler;

describe("Page Context", function() {
  /*let pageContext;
  let page;
  let component1;
  let component2;
  
  beforeEach(function() {
    component1 = {};
    component2 = {};
    
    page = {
      children: {
        component1,
        component2
      }
    };
    pageContext = createPageContext(page, "page");
  });
  
  it("should merge nested objects", () => {
    let style = {};
    let context = pageContext(style);
  });*/

  it("should push new classnames", function() {
    /*let actor  = makeStylable({component: {}, classNames:".test"});
    actor.isDirty = false;
    actor.pushClassNames(".test2");
    expect(actor.getClassName()).to.equal( ".test .test2");
    expect(actor.isDirty).to.equal(true);
    actor.pushClassNames(".test3 .test4");
    expect(actor.getClassName()).to.equal( ".test .test2 .test3 .test4");
    actor.pushClassNames(".flexLayout .flexLayout-default #pgSignupPhone.flMain");
    expect(actor.getClassName()).to.equal( ".test .test2 .test3 .test4 .flexLayout .flexLayout-default #pgSignupPhone.flMain");

    const actor2  = makeStylable({component: {}, classNames:".flexLayout .flexLayout-default #pgSignupPhone.flMain"});
    expect(actor2.getClassName()).to.equal( ".flexLayout .flexLayout-default #pgSignupPhone.flMain");

    const actor3  = makeStylable({component: {}, classNames:""});
    expect(actor3.getClassName()).to.equal("");
    actor3.pushClassNames("#bottomtabbar_profile");
    expect(actor3.getClassName()).to.equal("#bottomtabbar_profile");

    const actor5  = makeStylable({component: {}, classNames:" "});
    expect(actor5.getClassName()).to.equal("");

    const actor4  = makeStylable({component: {}, classNames:"#bottomtabbar_profile"});
    expect(actor4.getClassName()).to.equal("#bottomtabbar_profile");*/
    // const rootComponent = {};
    // const context = pageContext(rootComponent, "root");
  });
});
