/** @format */

type FunctionForPromise<T, P, S> = (
	resolve: (value: T) => void,
	reject: (value: P) => void,
	returnMiddle: (value: S) => void,
	signalCancel: AbortSignal
) => Promise<void>;

export default class PromisePlusClass<T, P, S> {
	private isCancel: boolean = false;
	private resolve?: (value: T) => void;
	private reject?: (value: P) => void;
	private def: FunctionForPromise<T, P, S>;
	private controller: AbortController;
	private middle?: (value: S) => void;
	constructor(def: FunctionForPromise<T, P, S>, autoStart: boolean = true) {
		this.def = def;
		this.controller = new AbortController();
		if (autoStart) {
			setTimeout(() => this.start(), 0);
		}
	}

	public catch(def: (value: P) => void) {
		this.reject = def;
		return this;
	}

	public finally(def: (value: T) => void) {
		this.resolve = def;
		return this;
	}

	public then(def: (value: P | T) => void) {
		this.resolve = def;
		this.reject = def;
		return this;
	}

	private wrapperCancel<SS>(returnValue: (value: SS) => void) {
		return (value: SS) => {
			if (!this.isCancel) {
				returnValue(value);
			}
		};
	}

	public async start() {
		await this.def(
			this.wrapperCancel((value: T) => {
				if (this.resolve) this.resolve(value);
			}),
			this.wrapperCancel((value: P) => {
				if (this.reject) this.reject(value);
			}),
			this.wrapperCancel((value: S) => {
				if (this.middle) this.middle(value);
			}),
			this.controller.signal
		);
	}

	public cancel() {
		this.isCancel = true;
		this.controller.abort();
	}

	public getMiddle(def: (value: S) => void) {
		this.middle = def;
		return this;
	}
}
