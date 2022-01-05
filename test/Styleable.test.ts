/**
 * Created by smartface on 10/18/16.
 */

import merge from "@smartface/styler/lib/utils/merge";
import { expect } from "chai";
import makeStylable, { Stylable } from "../src/styling/Stylable";

function getStylesDiff(
  oldStyles: { [key: string]: any },
  newStyles: { [key: string]: any }
) {
  function isEqual(
    oldStyle: { [key: string]: any },
    newStyle: { [key: string]: any }
  ) {
    if (oldStyle === undefined) {
      return false;
    }

    var keys1 = Object.keys(oldStyle);
    var keys2 = Object.keys(newStyle);

    if (keys1.length !== keys2.length) {
      return false;
    }

    let res = keys2.some(function (key) {
      return oldStyle[key] !== newStyle[key];
    });

    return !res;
  }

  return function diffStylingReducer() {
    return Object.keys(newStyles).reduce(
      (acc: { [key: string]: any }, key: string) => {
        // align is readolnly issue on Android
        if (key === "align") {
          acc[key] = undefined;
          return acc;
        } else if (key === "layout") {
          var diffReducer = getStylesDiff(
            oldStyles[key] || {},
            newStyles[key] || {}
          );
          diffReducer();
        } else if (key == "flexProps" && newStyles[key]) {
          Object.keys(newStyles[key]).forEach(function (name) {
            if (
              oldStyles[key] === undefined ||
              newStyles[key][name] !== oldStyles[key][name]
            ) {
              acc[name] = newStyles[key][name];

              if (newStyles[key][name] === null) {
                acc[name] = NaN;
                // fixes flexgrow NaN value bug
                if (name === "flexGrow") {
                  acc[name] = 0;
                }
              } else {
                acc[name] = newStyles[key][name];
              }
            }
          });
        } else if (
          newStyles[key] !== null &&
          newStyles[key] instanceof Object
        ) {
          if (
            Object.keys(newStyles[key]).length > 0 &&
            !isEqual(oldStyles[key] || {}, newStyles[key])
          ) {
            acc[key] = merge(oldStyles[key], newStyles[key]);
          }
        } else if (oldStyles[key] !== newStyles[key]) {
          acc[key] = newStyles[key];
        }

        if (acc[key] === null) {
          acc[key] = NaN;
        }

        return acc;
      },
      {}
    );
  };
}

describe("Stylable Actor", function () {
  let component = {};
  let actor: Stylable;

  beforeEach(function () {
    component = {};
    actor = makeStylable({
      component: component as any,
      name: "mockComponent",
      classNames: ".test",
    });
    actor.clearDirty();
  });

  function getPaddings({ ...params }) {
    return { ...params };
  }

  it("should push new classnames", function () {
    actor.clearDirty();
    actor.pushClassNames(".test2");
    expect(actor.getClassName()).to.equal(".test .test2");
    expect(actor.isDirty).to.equal(true);
    actor.pushClassNames(".test3 .test4");
    expect(actor.getClassName()).to.equal(".test .test2 .test3 .test4");
    actor.pushClassNames(
      ".flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );
    expect(actor.getClassName()).to.equal(
      ".test .test2 .test3 .test4 .flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );

    const actor2 = makeStylable({
      component: {} as any,
      name: "component1",
      classNames: ".flexLayout .flexLayout-default #pgSignupPhone.flMain",
    });
    expect(actor2.getClassName()).to.equal(
      ".flexLayout .flexLayout-default #pgSignupPhone.flMain"
    );

    const actor3 = makeStylable({
      component: {} as any,
      name: "component1",
      classNames: "",
    });
    expect(actor3.getClassName()).to.equal("");
    actor3.pushClassNames("#actor3_bottomtabbar_profile");
    expect(actor3.getClassName()).to.equal("#actor3_bottomtabbar_profile");

    const actor5 = makeStylable({
      component: {} as any,
      name: "component1",
      classNames: " ",
    });
    expect(actor5.getClassName()).to.equal("");

    const actor4 = makeStylable({
      component: {} as any,
      name: "component1",
      classNames: "#bottomtabbar_profile",
    });
    expect(actor4.getClassName()).to.equal("#bottomtabbar_profile");
  });

  it("should remove classnames", function () {
    actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
    actor.clearDirty();

    let classNames = actor.removeClassName(
      ".flexLayout-dotIndicator-item.active"
    );
    expect(classNames).to.equal(".test .test2");
    expect(actor.isDirty).to.equal(true);
    actor.clearDirty();

    classNames = actor.removeClassNames(".test2");
    expect(classNames).to.equal(".test");
    expect(actor.isDirty).to.equal(true);
    actor.clearDirty();

    classNames = actor.removeClassName(".test");
    expect(classNames).to.equal("");
    expect(actor.isDirty).to.equal(true);
  });

  it("should set and apply userStyles", function () {
    actor.clearDirty();
    actor.setUserStyle({
      width: 100,
      left: 10,
    });

    expect(actor.isDirty).to.equal(true);

    actor.applyStyles();
    expect(actor.isDirty).to.equal(false);
    expect(actor.getStyles()).to.eql({
      width: 100,
      left: 10,
    });
  });

  describe("Safe Area", function () {
    it("should be always overrode", function () {
      actor.pushClassNames(".test2 .flexLayout-dotIndicator-item.active");
      actor.clearDirty();

      actor.setSafeArea({
        paddingLeft: 10,
        paddingTop: 0,
      });

      actor.setSafeArea({
        paddingLeft: 20,
        paddingTop: 10,
      });

      actor.applyStyles();

      expect(component).to.eql(
        getPaddings({
          paddingLeft: 20,
          paddingTop: 10,
        })
      );

      actor.setSafeArea({
        paddingLeft: 30,
        paddingTop: 20,
      });

      expect(component).to.eql({
        paddingLeft: 20,
        paddingTop: 10,
      });

      actor.applyStyles();

      expect(component).to.eql(
        getPaddings({
          paddingLeft: 30,
          paddingTop: 20,
        })
      );
    });

    it("should be able to add safeArea", function () {
      actor.clearDirty();

      actor.setSafeArea({
        paddingLeft: 10,
        paddingTop: 0,
      });

      actor.setStyles(
        getPaddings({
          paddingLeft: 20,
          paddingTop: 10,
        })
      );

      actor.applyStyles();

      expect(component).to.eql(
        getPaddings({
          paddingLeft: 30,
          paddingTop: 10,
        })
      );

      actor.setStyles(
        getPaddings({
          paddingLeft: 40,
          paddingTop: 0,
        })
      );

      actor.applyStyles();

      expect(component).to.eql({
        paddingLeft: 50,
        paddingTop: 0,
      });

      actor.setSafeArea({
        paddingLeft: 0,
        paddingTop: 0,
      });

      actor.applyStyles(true);

      expect(component).to.eql(
        getPaddings({
          paddingLeft: 40,
          paddingTop: 0,
        })
      );
    });

    it("should be added to userStyles' paddings", function () {
      actor.clearDirty();

      actor.setStyles(
        getPaddings({
          paddingLeft: 0,
          paddingTop: 0,
        })
      );

      actor.setSafeArea({
        paddingLeft: 50,
      });

      actor.applyStyles();

      expect({
        paddingLeft: 50,
        paddingTop: 0,
      }).to.eql(actor.component);
    });

    it("should apply only diff of new styles with new user-styles", function () {
      actor.setStyles({
        paddingLeft: 0,
        paddingTop: 0,
        visible: true,
        flexLayout: {
          justifyContent: "center",
        },
      });
      actor.applyStyles();

      expect({
        paddingLeft: 0,
        paddingTop: 0,
        visible: true,
        flexLayout: {
          justifyContent: "center",
        }
      }).to.eql(actor.component);

      let hookSpy = 0;
      actor.setHooks((hook) => {
        switch (hook) {
          case "reduceDiffStyleHook":
            return (styles, newStyles) => {
              expect({
                paddingLeft: 0,
                paddingTop: 0,
                visible: true,
                flexLayout: {
                  justifyContent: "center",
                }
              }).to.eql(styles);
              expect({
                paddingTop: 10,
                visible: true,
                flexLayout: {
                  flexGrow: 1,
                },
              }).to.eql(newStyles);
              const diffReducer = getStylesDiff(styles, newStyles);

              const diff = diffReducer();

              hookSpy++;
              expect({
                paddingTop: 10,
                flexLayout: {
                  flexGrow: 1,
                  justifyContent: "center",
                },
              }).to.eql(diff);
              return styles;
            };
          default:
            return (styles) => styles;
        }
      });

      actor.updateUserStyle({
        paddingTop: 10,
        visible: true,
        flexLayout: {
          flexGrow: 1,
        },
      });
      actor.applyStyles();
      expect(hookSpy).to.be.eq(1);
      expect({
        paddingLeft: 0,
        paddingTop: 10,
        visible: true,
        flexLayout: {
          flexGrow: 1,
          justifyContent: "center",
        },
      }).to.eql(actor.component);
    });

    it("should be added to userStyles' paddings", function () {
      actor.setStyles({
        paddingLeft: 0,
        paddingTop: 0,
      });

      actor.setSafeArea({
        paddingLeft: 50,
      });

      actor.applyStyles();

      expect(component).to.eql({
        paddingLeft: 50,
        paddingTop: 0,
      });

      actor.setUserStyle({
        paddingLeft: 20,
      });

      actor.applyStyles();

      expect(component).to.eql({
        paddingLeft: 70,
        paddingTop: 0,
      });

      actor.setSafeArea({
        paddingLeft: 20,
        paddingTop: 20,
      });

      actor.setUserStyle(
        getPaddings({
          paddingLeft: 20,
          paddingTop: 10,
          paddingBottom: 20,
          paddingRight: 10,
        })
      );

      actor.applyStyles();

      expect(component).to.eql(
        getPaddings({
          paddingLeft: 40,
          paddingRight: 10,
          paddingBottom: 20,
          paddingTop: 30,
        })
      );
    });
  });
});
