import { INIT_CONTEXT_ACTION_TYPE } from "./constants";
import raiseErrorMaybe from "./util/raiseErrorMaybe";

const coreReduer = function (context, action, target, state) {
	switch (action.type) {
		case "unload":
			context.remove(target);

			break;

		default:
			return state;
	}
};

export default class Context {
	constructor(actors, reducer, initialState = {}, hookFactory = null) {
		this._hookFactory = hookFactory;
		this.actors = {
			collection: new Map(),
			$$map: [],
			$$idMap: {},
			$$nameMap: {},
			$$lastID: null,
		};
		// new
		this._reducers = [];
		// new
		this.state = Object.assign({}, initialState);
		// new
		this._reducers.push(coreReduer);
		reducer && this._reducers.push(reducer);

		actors && this.setActors(Object.assign({}, actors));
		this.dispatch({
			type: INIT_CONTEXT_ACTION_TYPE,
		});
	}

	getReducer() {
		return this._reducer;
	}

	setActors(actors) {
		Object.keys(actors).forEach((name) => {
			this.add(actors[name], name);
		});

		this.propagateAll();
	}

	getLastActorID() {
		return this.actors.$$lastID;
	}

	reduce(fn, acc = {}) {
		var res = [];

		this.actors.collection.forEach((actor, name) => {
			acc = fn(acc, actor, name);
		});

		return acc;
	}

	map(fn) {
		var res = [];

		this.actors.collection.forEach((actor, name) => {
			res.push(fn(actor, name));
		});

		return res;
	}

	find(instanceId, notValue) {
		const collection = Array.from(this.actors.collection);
		const currentItem = collection.find((item) => item[0].includes(instanceId)) || [];
		return currentItem[1] || notValue;
	}

	addTree(tree) {
		Object.keys(tree).forEach((name) => this.add(tree[name], name));
	}

	add(actor, name) {
		!actor.getID() && actor.setID(Context.getID());
		const instanceId = actor.getInstanceID(); //TODO: map by component type
		this.actors.collection.set(instanceId, actor);
		actor.setHooks(this._hookFactory);
		actor.componentDidEnter((action, target) => this.dispatch(action, target));
		this.actors.$$lastID = actor.getInstanceID();

		return name;
	}

	removeChildren(instanceId) {
		const removeActor = this.actors.collection.get(instanceId);

		this.actors.collection.forEach((actor, nm) => {
			if (nm.indexOf(removeActor.getName() + "_") === 0) {
				actor.componentDidLeave();
				actor.dispose();
				this.actors.collection.delete(nm);
			}
		});
	}

	remove(instanceId) {
		if (!instanceId) {
			throw new Error("name cannot be empty");
		}

		this.removeChildren(instanceId);
		const actor = this.actors.collection.get(instanceId);

		if (actor) {
			this.actors.collection.delete(instanceId);
			actor.componentDidLeave();
			actor.dispose();
		}
	}

	setState(state) {
		if (state !== this.state) {
			this.state = state;
		}
	}

	propagateAll() {
		this.map((actor) => {
			actor.onContextChange && actor.onContextChange(this);
		});
	}

	getState() {
		return Object.assign({}, this.state);
	}

	dispatch(action, target) {
		try {
			let state = this.state || {};
			this._reducers.forEach((reducer) => {
				state = reducer(this, action, target, state);
			});

			state && this.setState(state);
		} catch (e) {
			e.message = `An Error is occurred When action [${action.type}] run on target [${target || ""}]. ${e.message}`;
			raiseErrorMaybe(e, target && !!this.actors.collection[target] && ((e) => this.actors.collection[target].onError(e)));
		}
	}

	dispose() {
		this.state = null;
		this.actors = null;
	}

	subcribe(fn) {}

	static getID = (function () {
		var ID = 1;
		return () => ++ID;
	})();
}
