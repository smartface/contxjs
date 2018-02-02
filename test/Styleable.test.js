/**
 * Created by smartface on 10/18/16.
 */

import { expect } from "chai";
import makeStylable from '../src/styling/Stylable';

// import {findClassNames} from "../src/styler";
// const styler = require("../src/styler").styler;
// const resetStylerCache = require("../src/styler").resetStylerCache;
// const componentStyler = require("../src/styler").componentStyler;

describe("Stylable Actor", function() {
 
  beforeEach(function() {});

  it("should push new classnames", function() {
    const actor  = makeStylable({component: {}, classNames:".test"});
    actor.pushClassNames(".test2");
    expect(actor.getClassName()).to.equal( ".test .test2");
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
    expect(actor4.getClassName()).to.equal("#bottomtabbar_profile");
  });

  it("should remove classnames", function() {
    const actor  = makeStylable({component: {}, classNames:".test"});
    actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
    actor.isDirty = false;
    
    let classNames = actor.removeClassName(".flexLayout-dotIndicator-item.active");
    expect(classNames).to.equal( ".test .test2");
    expect(actor.isDirty).to.equal(true);
    actor.isDirty = false;

    classNames = actor.removeClassNames(".test2");
    expect(classNames).to.equal( ".test");
    expect(actor.isDirty).to.equal(true);
    actor.isDirty = false;

    classNames = actor.removeClassName(".test");
    expect(classNames).to.equal("");
    expect(actor.isDirty).to.equal(true);
  });

  it("should has unique classnames", function() {
  });
});
