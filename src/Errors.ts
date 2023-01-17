/** @format */

export class RequestError extends Error {
	private code: "50x" | "40x";
	private url: string;
	private method: "POST" | "GET" | "PUT";
	private body?: string;

	constructor(
		message: string,
		url: string,
		body?: string,
		method: "POST" | "GET" | "PUT" | "PATCH" = "GET",
		codeError: "50x" | "40x" = "50x"
	) {
		super(message);
		this.name = "Request Error";
		this.code = codeError;
		this.body = body;
		this.url = url;
		this.method = method;
	}

	getMessageForUser() {
		return `${this.code} ${this.method} ${this.url}` + this.method !== "GET"
			? ` ${this.body}`
			: "" + "\n" + this.message;
	}
}

// export class MeditationError extends Error {
// 	protected payload?: string;

// 	constructor(name: string, payload: string, options?: ErrorOptions) {
// 		super(name + payload, options);
// 		this.payload = payload;
// 		printInformationError(name, this, payload);
// 	}
// }

// export class MeditationNotFoundError extends MeditationError {
// 	constructor(payload: string, options?: ErrorOptions) {
// 		super("Meditation not found", payload, options);
// 	}
// }
