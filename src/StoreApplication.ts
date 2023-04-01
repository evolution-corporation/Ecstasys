/** @format */

export interface IActionTools {
	signal?: AbortSignal;
	returnResult?: unknown;
}

export interface Action<T> {
	name: string;
	(state: T, tools: IActionTools): Promise<T>;
}

export interface Listener<T> {
	name: string;
	<P>(slice: P, info: { actionName: string; state: T }): void;
}
export interface IOptionsManagerState<T> {
	debug: boolean;
	getSnapshotAfterAction?: (state: T) => Promise<void>;
	getSnapshotBeforeAction?: (state: T) => Promise<void>;
}

export class ManagerState<IState extends object, ActionNames = string> {
	private state: IState;

	private listenerList: Map<string, Listener<IState>> = new Map();

	private listenerEndPoint: Map<string, string> = new Map();

	private actionList: Map<string, Action<IState>> = new Map();

	private options: IOptionsManagerState<IState> = {
		debug: false,
	};

	constructor(state: IState, options?: Partial<IOptionsManagerState<IState>>) {
		this.state = state;
		if (!!options) {
			this.options = {
				...this.options,
				...options,
			};
		}
	}

	public addAction(action: Action<IState>, name?: string) {
		this.actionList.set(name ?? action.name, action);
	}

	public actionCall(actionName: ActionNames, tools: IActionTools = {}) {
		const action = this.actionList.get(actionName as string);
		if (action === undefined) {
			if (this.options.debug) throw new Error(`Action "${actionName}" not found`);
			return (callback: (success: boolean) => void) => {
				callback(false);
			};
		} else {
			const promiseAction = new Promise<void>(async resolve => {
				try {
					if (!!this.options.getSnapshotBeforeAction) this.options.getSnapshotBeforeAction({ ...this.state });
					console.log(2.1, actionName);
					this.state = await action({ ...this.state }, { ...tools });
					console.log(2.2, actionName);
					if (!!this.options.getSnapshotAfterAction) this.options.getSnapshotAfterAction({ ...this.state });
				} catch (error) {
					if (this.options.debug) console.error(error);
				}
				resolve();
			});
			return (callback: (success: boolean) => void) => {
				promiseAction.then(() => callback(true)).catch(() => callback(false));
			};
		}
	}

	public on(listener: Listener<IState>, endPoints: string) {
		const id = Math.floor(Math.random() * 1000).toString();
		this.listenerList.set(id, listener);
		this.listenerEndPoint.set(id, endPoints);

		return () => {
			this.listenerList.delete(id);
			this.listenerEndPoint.delete(id);
		};
	}
}

interface State {
	name: string;
}

const state: State = {
	name: "nikita",
};

const manager = new ManagerState<State>(state);

manager.addAction(async function Test(state_, {}) {
	console.log("action1");
	return state_;
});
manager.addAction(async function Test2(state_, {}) {
	console.log("action2");
	return state_;
});

console.log(1.1);
manager.actionCall("Test");
console.log(1.2);
manager.actionCall("Test2");
console.log(1.3);


manager.on((slice, { actionName, state }) => {
  console.log({ slice, actionName, state)
}, ".")