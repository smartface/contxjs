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
    let actor  = makeStylable({component: {}, classNames:".test"});
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
  
  describe("Safe Area", function() {
    it("should be able to add safeArea", function() {
      const component = {};
      const actor  = makeStylable({component, name: "mockComponent", classNames:".test"});
      actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
      actor.isDirty = false;
      
      actor.setSafeArea({
        paddingLeft: 10,
        paddingTop: 0
      });
      
      actor.setStyles({
        paddingLeft: 20,
        paddingTop: 10
      });
      
      actor.applyStyles();
      
      expect(component).to.eql({
        paddingLeft: 30,
        paddingTop: 10
      });
  
      actor.setStyles({
        paddingLeft: 40,
        paddingTop: 0
      });
      
      actor.applyStyles();
      
      expect(component).to.eql({
        paddingLeft: 50,
        paddingTop: 0
      });
  
      actor.setSafeArea({
        paddingLeft: 0,
        paddingTop: 0
      });
      
      actor.applyStyles(true);
      
      expect(component).to.eql({
        paddingLeft: 40,
        paddingTop: 0
      });
    });   
    
    it("should be added to userStyles' paddings", function() {
      const component = {};
      const actor  = makeStylable({component, name: "mockComponent", classNames:".test"});
      
      actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
      actor.isDirty = false;
      
      actor.setSafeArea({
        paddingLeft: 50,
        paddingTop: 0,
      });
      
      actor.applyStyles();
      
      expect(component).to.eql({
        paddingLeft: 50,
        paddingTop: 0,
      });
      
      actor.setSafeArea({
        paddingLeft: 20,
        paddingTop: 20,
      });
      
      actor.setUserStyle({
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 20,
        paddingRight: 10,
      });
      
      actor.applyStyles(true);
      
      expect(component).to.eql({
        paddingLeft: 40,
        paddingRight: 10,
        paddingBottom: 20,
        paddingTop: 30,
      });
    });
  });
});
