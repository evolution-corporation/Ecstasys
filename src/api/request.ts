import * as Storage from "./asyncStorage";
import auth from "@react-native-firebase/auth";
import { UserInformation, CanSerialization, SubscribeInformation } from "~types";

class Request {
	public static getFirebaseToken = async (firebaseToken?: string) => {
		if (firebaseToken === undefined) {
			const tokenSaved = await Storage.getToken();
			if (tokenSaved === null) {
				const firebaseUser = auth().currentUser;
				if (firebaseUser !== null) {
					const { token, expirationTime } = await firebaseUser.getIdTokenResult(true);
					firebaseToken = await Storage.saveToken(token, new Date(expirationTime));
				}
			} else {
				firebaseToken = tokenSaved;
			}
		}
		if (firebaseToken === undefined) {
			throw new Error("User token not found");
		}
		return firebaseToken;
	};

	public static get = async (url: string, signal?: AbortSignal) =>
		fetch(URL + url, {
			method: "GET",
			headers: { Authorization: await this.getFirebaseToken() },
			signal: signal,
		});

	public static post = async <T>(url: string, body: T, signal?: AbortSignal) =>
		fetch(URL + url, {
			method: "POST",
			headers: { Authorization: await this.getFirebaseToken(), "Content-Type": "application/json" },
			body: JSON.stringify(body),
			signal: signal,
		});

	public static patch = async <T>(url: string, body: T, signal?: AbortSignal) =>
		fetch(URL + url, {
			method: "PATCH",
			headers: { Authorization: await this.getFirebaseToken(), "Content-Type": "application/json" },
			body: JSON.stringify(body),
			signal: signal,
		});
}

export default Request;

declare global {
	interface Response {
		toSubscribe: () => Promise<Readonly<SubscribeInformation & CanSerialization<SubscribeInformation>> | undefined>;
	}
}
