import Actor from "../core/Actor";
import merge from "@smartface/styler/lib/utils/merge";
import findClassNames from "@smartface/styler/lib/utils/findClassNames";
import toStringUtil from "../util/toStringUtil";
import ScrollView from "@smartface/native/ui/scrollview";

const _findClassNames = (classNames) => findClassNames(classNames).reduce((acc, item) => (!item && []) || [...acc, item.join("")], []);

const componentObjectProps = {
	android: {},
	ios: {},
	layout: {},
	layoutManager: {},
};

const SCW_LAYOUT_PROPS = {
	alignContent: "alignContent",
	alignItems: "alignItems",
	direction: "direction",
	flexDirection: "flexDirection",
	justifyContent: "justifyContent",
	flexWrap: "flexWrap",
  padding: "padding",
	paddingLeft: "paddingLeft",
	paddingTop: "paddingTop",
	paddingRight: "paddingRight",
	paddingBottom: "paddingBottom",
  margin: "margin",
	marginRight: "marginRight",
	marginLeft: "marginLeft",
	marginTop: "marginTop",
	marginBottom: "marginBottom",
	layoutHeight: "height",
	layoutWidth: "width",
	backgroundColor: "backgroundColor",
};

function componentAssign(component, key, value) {
	if (value !== null && value instanceof Object && componentObjectProps[key]) {
		Object.keys(value).forEach((k) => componentAssign(component[key], k, value[k]));
	} else {
		component[key] = value;
	}
}

// TODO create new jsdoc type for the parameter
/**
 * Styleable Actor HOC. Decorates specifeid component and return an actor component
 *
 * @param {object} component - A component to decorate
 * @param {string} className - initial className for actor
 * @param {function} hooks - context's hooks dispatcher
 *
 * @returns {Object} - A Stylable Actor
 */
export default function makeStylable({ component, classNames = "", defaultClassNames = "", userStyle = {}, name }) {
	userStyle = merge(userStyle);
	/**
	 * Styable actor
	 * @class
	 */
	return new Stylable(component, name, classNames, defaultClassNames, userStyle);
}

class Stylable extends Actor {
	constructor(component, name, classNames, defaultClassNames, userStyle) {
		super(component, name);
		this.waitedStyle = {};
		this.defaultClassNames = defaultClassNames ? _findClassNames(defaultClassNames) : [];
		this.initialClassNames = _findClassNames(classNames);
		this.classNames = [...this.initialClassNames];
		this.styles = {};
		this.inlinestyles = {};
		this.isDirty = true;
		this.userStyle = userStyle;
		this.component = component;
	}
	getUserStyle() {
		return (0, merge)(this.userStyle);
	}

	setSafeArea(area) {
		this.safeArea = area;
		this.makeDirty();
		return this;
	}

	makeDirty() {
		this.isDirty = true;
	}

	clearDirty() {
		this.isDirty = false;
		this.waitedStyle = {};
	}

	updateUserStyle(props) {
		this.userStyle = merge(this.userStyle, props);
		this.isDirty = true;
		return this;
	}

	reset() {
		this.setStyles(this.getStyles());
		this.applyStyles(true);
		return this;
	}

	setUserStyle(props) {
		if (isFunction(props)) {
			this.userStyle = props(this.getUserStyle());
		} else {
			this.userStyle = merge(props);
		}

		this.isDirty = true;
		return this;
	}

	computeAndAssignStyle(style, force = false) {
		const hooks = this.hooks || (() => null);
		var _component = this.getComponent();
		const reduceDiffStyleHook = hooks("reduceDiffStyleHook") || null;
		const safeAreaProps = {};

		if (this.safeArea) {
			const getNotEmpty = (v, y) => (v !== undefined ? v : (y !== undefined && y) || null);

			const addValstoSafeAreaIfExists = (val, willAdd) => (typeof willAdd === "number" && typeof val === "number" ? val + willAdd : willAdd);

			const assigntoSafeAreaIfNotEmpty = (prop) =>
				this.safeArea[prop] !== undefined && (safeAreaProps[prop] = addValstoSafeAreaIfExists(getNotEmpty(style[prop], this.styles[prop]), this.safeArea[prop]));

			assigntoSafeAreaIfNotEmpty("paddingTop");
			assigntoSafeAreaIfNotEmpty("paddingBottom");
			assigntoSafeAreaIfNotEmpty("paddingRight");
			assigntoSafeAreaIfNotEmpty("paddingLeft");
		}
		let diffReducer = !force && reduceDiffStyleHook ? reduceDiffStyleHook(this.styles, style) : null;
		const rawDiff = isFunction(diffReducer) ? diffReducer() : merge(this.styles, style);

		if (rawDiff && Object.keys(safeAreaProps).length) {
			Object.assign(rawDiff, safeAreaProps);
		}

		const beforeHook = hooks("beforeStyleDiffAssign");
		const diff = (beforeHook && beforeHook(rawDiff)) || rawDiff;
		const hasDiff = diff !== null && Object.keys(diff).length > 0; //TODO: extract all specified area @cenk

		// ------------->
        var ifNoNeedApplyLayout = _component.layout && (_component instanceof ScrollView || this.getName().endsWith('_headerBar'));
		_component.subscribeContext
			? hasDiff &&
			  _component.subscribeContext({
					type: "new-styles",
					style: Object.assign({}, diff),
					rawStyle: (0, merge)(rawDiff),
			  })
			: hasDiff &&
			  Object.keys(diff).forEach((key) => {
					try {
						if (!ifNoNeedApplyLayout && _component.layout && SCW_LAYOUT_PROPS[key]) {
							componentAssign(_component.layout, SCW_LAYOUT_PROPS[key], diff[key]);
						} else {
							componentAssign(_component, key, diff[key]);
						}
					} catch (e) {
						e.message = "When [" + key + "] raw value : [\n" + toStringUtil(style[key]) + "\n] \n is being assigned as : [\n" + toStringUtil(diff[key]) + "\n\r] " + e.message;
						throw e;
					}
			  }); // <-------------------
		const afterHook = hooks("afterStyleDiffAssign");
		afterHook && (style = afterHook(style));
		this.styles = merge(this.styles, style);
		return this;
	}

	applyStyles(force = false) {
		this.computeAndAssignStyle(merge({}, this.waitedStyle, this.userStyle), force);
		this.clearDirty();
		return this;
	}

	setStyles(style, force = false) {
		this.waitedStyle = merge(this.waitedStyle, style);
		this.makeDirty();
		return this;
	}

	getStyles() {
		return this.styles ? Object.assign({}, this.styles) : {};
	}

	getClassName() {
		return this.classNames.join(" ");
	}

	setInitialStyles(style) {
		this.styles = Object.assign({}, style);
	}

	getDefaultClassNames() {
		return this.defaultClassNames.join(" ");
	}

	classNamesCount() {
		return this.classNames.length;
	}

	removeClassName(className) {
		return this.removeClassNames(className);
	}

	removeClassNames(classNames) {
		const classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
		this.classNames = this.classNames.filter((cname) => !classNamesArr.some((rname) => cname === rname));
		classNamesArr.length && (this.isDirty = true);
		return this.getClassName();
	}

	resetClassNames(classNames = []) {
		this.classNames = [];
		[...this.initialClassNames, ...classNames].forEach(this.addClassName.bind(this));
		this.isDirty = true;
		return this;
	}

	hasClassName(className) {
		return this.classNames.some((cname) => {
			return cname === className;
		});
	}

	pushClassNames(classNames) {
		const classNamesArr = Array.isArray(classNames) ? classNames : _findClassNames(classNames);
		var newClassNames = classNamesArr.filter((className) =>
			this.classNames.length
				? this.classNames.some((cname) => {
						return cname !== className;
				  })
				: true
		);

		if (newClassNames.length) {
			this.classNames = [...this.classNames, ...newClassNames];
			this.isDirty = true;
		}

		return this.getClassName();
	}

	addClassName(className, index) {
		if (!this.hasClassName(className)) {
			this.classNames.splice(index, 1, className);
			this.isDirty = true;
		}

		return this.getClassName();
	}

	dispose() {
		super.dispose();
		this.styles = null;
	}

	getInitialClassName() {
		return this.initialClassNames;
	}
}

function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}
