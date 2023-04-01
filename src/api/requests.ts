/**
 * @format
 * Файл содержит в себе функции которые выполняют запрос к серверу
 */

import auth from "@react-native-firebase/auth";
import { RequestError } from "src/Errors";
import { Gender, ServerEntities, Subscription, SupportType } from "./types";
import * as Storage from "./asyncStorage";
import Constants from "expo-constants";

const { extra } = Constants.manifest ?? {};
const { apiURL } = extra;
const URL = "http://api.evodigital.one/";
const fixUrl = "http://" + "51.250.8.125:5000";

/**
 * Получает FirebaseToken пользователя
 * @returns FirebaseToken пользователя
 */
async function getFirebaseToken(firebaseToken: string | undefined) {
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
}
/**
 *	Возвращает пользователя по ID
 *	@param userId id пользователя данне которого необходимо получить
 *	@param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 *	@return данные об пользователе которые хранятся на сервере, если он найден иначе null
 */
export async function getUserById(userId: string, firebaseTokenToken?: string): Promise<ServerEntities.User | null> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "users?id=" + userId;
	const requestServer = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404) {
		return null;
	}
	if (requestServer.status >= 500) {
		throw new RequestError(`getUserById: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json as ServerEntities.User;
}

/**
 *	Отправляет запрос на создание пользователя серверу
 *	@param obj параметры функции
 *	@param obj.nickName уникальное имя пользователя
 *	@param obj.birthday дата рождения пользователя
 *	@param obj.image изображение пользователя
 *	@param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 *	@return данные об новом пользователе
 */
export async function createUser({ birthday, nickname, image }: CreateUserParams, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "users";
	const requestServer = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			NickName: nickname,
			Birthday: birthday.toISOString(),
			Image: image,
		}),
	});
	const fix = await fetch(`${fixUrl}/image`, {
		method: "POST",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(image),
	});
	const Image = await fix.text();
	if (requestServer.status >= 500) {
		throw new RequestError(
			`createUser: ${await requestServer.text()}`,
			url,
			JSON.stringify({
				NickName: nickname,
				Birthday: birthday.toISOString(),
				Image: image,
			}),
			"POST",
			"50x"
		);
	}
	const json = await requestServer.json();
	return { ...json, Image } as ServerEntities.User;
}
interface CreateUserParams {
	readonly nickname: string;
	readonly birthday: Date;
	readonly image?: string;
}

/**
		Отправляет запрос на обновление данных пользователя серверу
		@param obj параметры функции
		@param obj.nickname обновленный уникальное имя пользователя
		@param obj.displayName обновленное имя пользователя
		@param obj.birthday обновленная дата рождения пользователя
		@param obj.image обновленное изображение пользователя
		@param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
		@return обновленные данные об пользователе
	*/
export async function updateUser(
	{ birthday, displayName, image, nickname, gender }: UpdateUserParams,
	firebaseTokenToken?: string
) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const body: [string, any][] = [];
	if (nickname !== undefined) body.push(["NickName", nickname]);
	if (displayName !== undefined) body.push(["DisplayName", displayName]);
	if (birthday !== undefined) body.push(["Birthday", birthday.toISOString()]);
	if (gender !== undefined) body.push(["Gender", gender]);
	const url = URL + "users";
	if (image !== undefined) {
		await fetch(`${fixUrl}/image`, {
			method: "POST",
			headers: {
				Authorization: firebaseTokenToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(image),
		});
	}
	const requestServer = await fetch(url, {
		method: "PATCH",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(Object.fromEntries(body)),
	});

	if (requestServer.status >= 500) {
		throw new RequestError(
			`updateUser: ${await requestServer.text()}`,
			url,
			JSON.stringify(Object.fromEntries(body)),
			"PATCH",
			"50x"
		);
	}
	const json = await requestServer.json();
	return { ...json } as ServerEntities.User;
}
interface UpdateUserParams {
	nickname?: string;
	displayName?: string;
	image?: string;
	birthday?: Date;
	gender?: Gender;
}

/**
 * Возвращает популярную медитацию за сутки
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Популярная медитация за сутки
 */
export async function getPopularToDayMeditation(firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?popularToday=true";
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status >= 500) {
		throw new RequestError(`getPopularToDayMeditation: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json as ServerEntities.Meditation;
}

/**
 * Возвращает данные об запрошенной медитации по Id
 * @param meditationId id запрошенной медитации
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Запрошенная медитация
 */
export async function getMeditationById(meditationId: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?meditationId=" + meditationId;
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404) {
		return null;
	}
	if (requestServer.status >= 500) {
		throw new RequestError(`getMeditationById: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json.Meditation as ServerEntities.Meditation;
}

export async function getInstructionMeditationById(meditationId: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?meditationId=" + meditationId;
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404) {
		return null;
	}
	if (requestServer.status >= 500) {
		throw new RequestError(`getMeditationById: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json.Subscription as ServerEntities.Subscription;
}

/**
 * Возвращает список медитаций отфильтрованных по определенном типу
 * @param meditationType тип запрашиваемых медитаций
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Запрошенная медитация
 */
export async function getMeditationsByType(meditationType: SupportType.TypeMeditation, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?type=" + meditationType;
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status >= 500) {
		throw new RequestError(`getMeditationsByType: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json as ServerEntities.Meditation[];
}

/**
 * Возвращает количество медитаций в определенном определенном типу
 * @param meditationType тип запрашиваемых медитаций
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return количество медитаций
 */
export async function getCountMeditationsByType(
	meditationType: SupportType.TypeMeditation,
	firebaseTokenToken?: string
) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?type=" + meditationType + "&count=0";
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status >= 500) {
		throw new RequestError(`getCountMeditationsByType: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json.length as number;
}

/**
 * Возвращает информацию об подписке пользователя
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Данные об подписке пользователя
 */
export async function getSubscribeUserInformation(
	firebaseTokenToken?: string
): Promise<ServerEntities.Subscribe | null> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "subscribe/" + false, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404 || requestServer.status === 204) {
		return null;
	}
	if (requestServer.status >= 500) {
		throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
	}
	const json = await requestServer.json();
	return json as ServerEntities.Subscribe;
}

/**
 * Получает ссылку для проведения оплаты подписки
 * @param subscribeType тип подписки для которой происходит оплата
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Ссылка для проведения оплаты
 */
export async function getPaymentURL(subscribeType: SupportType.SubscribeType, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "payment?type=" + 0 + "&needRecurrent=" + (subscribeType === "Week" ? "false" : "true");
	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status >= 500) {
		throw new RequestError(`getPaymentURL: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json.length as string;
}

export async function redirectPaymentURL(subscribeType: SupportType.SubscribeType, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url =
		URL +
		"payment?type=" +
		(subscribeType === "Week" ? 0 : subscribeType === "Month" ? 1 : 2) +
		"&needRecurrent=" +
		(subscribeType === "Week" ? "false" : "true");

	return {
		uri: url,
		headers: {
			Authorization: firebaseTokenToken,
		},
	};
}

/**
 * Получает информацию об пользователе по его nickname
 * @param nickname nickname пользователя информацию об котором необходимо найти
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Информация об пользователе или null если пользователь с таким nickname не найден
 */
export async function getUserByNickname(
	nickname: string,
	options: { firebaseTokenToken?: string; signal?: AbortSignal } = {}
) {
	const firebaseTokenToken = await getFirebaseToken(options.firebaseTokenToken);
	const url = URL + "nickname?nickname=" + nickname;
	try {
		const requestServer = await fetch(url, {
			headers: {
				Authorization: firebaseTokenToken,
				"Content-Type": "application/json",
			},
			signal: options.signal,
		});
		if (requestServer.status === 404) {
			return null;
		}
		if (requestServer.status >= 500) {
			throw new RequestError(`getUserByNickname: ${await requestServer.text()}`, url, undefined, "GET", "50x");
		}
		const json = await requestServer.json();
		return json.length as ServerEntities.User;
	} catch (error) {
		if (error instanceof Error && error.name == "AbortError") {
		} else {
			throw error;
		}
	}
}

//!
export async function checkAccess() {
	try {
		const request = await fetch(URL + "api/204");
		return request.ok;
	} catch (error) {
		return false;
	}
}

//!
export async function reservationNickname(nickname: string, firebaseTokenToken?: string): Promise<boolean> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "nickname";
	const requestServer = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: nickname,
	});
	if (requestServer.status === 409) {
		return false;
	}
	if (requestServer.status >= 500) {
		throw new RequestError(`getUserByNickname: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	return requestServer.status === 200;
}

//!
export async function getInformationUser(
	firebaseTokenToken?: string
): Promise<[ServerEntities.User | null, ServerEntities.Subscribe | null]> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const uid = auth().currentUser?.uid;
	if (uid === undefined) throw new Error("Not found uid");
	let user: ServerEntities.User | null = null;
	let subscribe: ServerEntities.Subscribe | null = null;
	// [user, subscribe] = await Promise.all([getUserById(uid), getSubscribeUserInformation()]);
	user = await getUserById(uid);
	if (user !== null) {
		subscribe = await getSubscribeUserInformation();
	}
	return [user, subscribe];
}

//!

export async function getRecommendationMeditation(firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation?getIsNotListened=true&countOfMeditations=1";

	const requestServer = await fetch(url, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status >= 500) {
		throw new RequestError(`getRecommendationMeditation: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	if (requestServer.status === 404) {
		return null;
	}

	const json = (await requestServer.json())[0];
	return json as ServerEntities.Meditation;
}

export async function getSubscribeUserInformationSubs(
	firebaseTokenToken?: string
): Promise<ServerEntities.Subscribe | null> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "subscribe/" + true, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404 || requestServer.status === 204) {
		return null;
	}
	if (requestServer.status >= 500) {
		throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
	}
	const json = await requestServer.json();
	return json as ServerEntities.Subscribe;
}

export async function removeAutoPayment(firebaseTokenToken?: string): Promise<void> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "subscribe", {
		method: "DELETE",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});

	if (requestServer.status >= 500) {
		throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
	}
}

export async function removeUserImage(firebaseTokenToken?: string): Promise<void> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "user.image", {
		method: "DELETE",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});

	if (requestServer.status >= 500) {
		throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
	}
}

export async function sendErrorInformation(name: string, error: Error, payload: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	fetch("http://dev.hades.evodigital.one/error", {
		method: "POST",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: auth().currentUser?.uid ?? null,
			errorName: name,
			errorPayload: `${error.name}: ${error.message} \nCause: \n\t${
				error.cause ?? "Error not have cause"
			} \nPayload: \n\t${payload.replaceAll("\n", "\n\t")}	\nStack: \n\t${error.stack?.slice(
				error.stack.indexOf("at")
			)}`,
		}),
	});
}

export async function meditationIsLisent(meditationId: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "meditation" + "?meditationId=" + meditationId + "&meditationLanguage=ru";
	const requestServer = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			meditationId: meditationId,
			meditationLanguage: "ru",
		}),
	});
	console.log(requestServer.status, await requestServer.text());
}

export async function deleteUSer(firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	await fetch(`${fixUrl}/user`, {
		method: "DELETE",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
}
