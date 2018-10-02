/**
 * Created by smartface on 10/18/16.
 */

const makeStylable = require("../src/styling/Stylable");

// import {findClassNames} from "../src/styler";
// const styler = require("../src/styler").styler;
// const resetStylerCache = require("../src/styler").resetStylerCache;
// const componentStyler = require("../src/styler").componentStyler;

describe("Stylable Actor", function() {
  let component = {};
  let actor;

  beforeEach(function() {
    component = {};
    actor = makeStylable({
      component,
      name: "mockComponent",
      classNames: ".test"
    });
    actor.clearDirty();
  });

  function getPaddings({ ...params }) {
    return { ...params };
  }

  it("should push new classnames", function() {
    actor.isDirty = false;
    actor.pushClassNames(".test2");
    expect(actor.getClassName()).toBe(".test .test2");
    expect(actor.isDirty).toBe(true);
    actor.pushClassNames(".test3 .test4");
    expect(actor.getClassName()).toBe(".test .test2 .test3 .test4");
    actor.pushClassNames(
      ".flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );
    expect(actor.getClassName()).toBe(
      ".test .test2 .test3 .test4 .flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );

    const actor2 = makeStylable({
      component: {},
      classNames: ".flexLayout .flexLayout-default #pgSignupPhone.flMain"
    });
    expect(actor2.getClassName()).toBe(
      ".flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );

    const actor3 = makeStylable({ component: {}, classNames: "" });
    expect(actor3.getClassName()).toBe("");
    actor3.pushClassNames("#bottomtabbar_profile");
    expect(actor3.getClassName()).toBe("#bottomtabbar_profile");

    const actor5 = makeStylable({ component: {}, classNames: " " });
    expect(actor5.getClassName()).toBe("");

    const actor4 = makeStylable({
      component: {},
      classNames: "#bottomtabbar_profile"
    });
    expect(actor4.getClassName()).toBe("#bottomtabbar_profile");
  });

  it("should remove classnames", function() {
    actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
    actor.isDirty = false;

    let classNames = actor.removeClassName(
      ".flexLayout-dotIndicator-item.active"
    );
    expect(classNames).toBe(".test .test2");
    expect(actor.isDirty).toBe(true);
    actor.isDirty = false;

    classNames = actor.removeClassNames(".test2");
    expect(classNames).toBe(".test");
    expect(actor.isDirty).toBe(true);
    actor.isDirty = false;

    classNames = actor.removeClassName(".test");
    expect(classNames).toBe("");
    expect(actor.isDirty).toBe(true);
  });

  // it("should set and apply userStyles", function() {
  //   actor.isDirty = false;
  //   actor.setUserStyle({
  //     width: 100,
  //     left: 10
  //   });

  //   expect(actor.isDirty).toBe(true);

  //   actor.applyStyles();
  //   expect(actor.isDirty).toBe(false);
  //   expect(actor.getStyles()).to.eql({
  //     width: 100,
  //     left: 10
  //   });
  // });

  describe("Safe Area", function() {
    // it("should be always overrode", function() {
    //   actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
    //   actor.isDirty = false;

    //   actor.setSafeArea({
    //     paddingLeft: 10,
    //     paddingTop: 0
    //   });

    //   actor.setSafeArea({
    //     paddingLeft: 20,
    //     paddingTop: 10
    //   });

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 20,
    //       paddingTop: 10
    //     })
    //   );

    //   actor.setSafeArea({
    //     paddingLeft: 30,
    //     paddingTop: 20
    //   });

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 20,
    //       paddingTop: 10
    //     })
    //   );

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 30,
    //       paddingTop: 20
    //     })
    //   );
    // });

    // it("should be able to add safeArea", function() {
    //   actor.isDirty = false;

    //   actor.setSafeArea({
    //     paddingLeft: 10,
    //     paddingTop: 0
    //   });

    //   actor.setStyles(
    //     getPaddings({
    //       paddingLeft: 20,
    //       paddingTop: 10
    //     })
    //   );

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 30,
    //       paddingTop: 10
    //     })
    //   );

    //   actor.setStyles(
    //     getPaddings({
    //       paddingLeft: 40,
    //       paddingTop: 0
    //     })
    //   );

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 50,
    //       paddingTop: 0
    //     })
    //   );

    //   actor.setSafeArea({
    //     paddingLeft: 0,
    //     paddingTop: 0
    //   });

    //   actor.applyStyles(true);

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 40,
    //       paddingTop: 0
    //     })
    //   );
    // });

    it("should be added to userStyles' paddings", function() {
      actor.isDirty = false;

      actor.setStyles(
        getPaddings({
          paddingLeft: 0,
          paddingTop: 0
        })
      );

      actor.setSafeArea({
        paddingLeft: 50
      });
    });

    // it("should be added to userStyles' paddings", function() {
    //   actor.setStyles(
    //     getPaddings({
    //       paddingLeft: 0,
    //       paddingTop: 0
    //     })
    //   );

    //   actor.setSafeArea({
    //     paddingLeft: 50
    //   });

    //   actor.applyStyles();

    //   actor.setSafeArea({
    //     paddingLeft: 50
    //   });

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 50,
    //       paddingTop: 0
    //     })
    //   );

    //   actor.setUserStyle(
    //     getPaddings({
    //       paddingLeft: 20
    //     })
    //   );

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 70,
    //       paddingTop: 0
    //     })
    //   );

    //   actor.setSafeArea({
    //     paddingLeft: 20,
    //     paddingTop: 20
    //   });

    //   actor.setUserStyle(
    //     getPaddings({
    //       paddingLeft: 20,
    //       paddingTop: 10,
    //       paddingBottom: 20,
    //       paddingRight: 10
    //     })
    //   );

    //   actor.applyStyles();

    //   expect(component).to.eql(
    //     getPaddings({
    //       paddingLeft: 40,
    //       paddingRight: 10,
    //       paddingBottom: 20,
    //       paddingTop: 30
    //     })
    //   );
    // });
  });
});
