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
