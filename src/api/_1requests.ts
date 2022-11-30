/**
 * @format
 * Файл содержит в себе функции которые выполняют запрос к серверу
 */

import auth from "@react-native-firebase/auth";
import { RequestError } from "src/Errors";
import { Gender, ServerEntities, SupportType } from "./types";
import * as Storage from "./asyncStorage";
import Constants from "expo-constants";
import { Serialization, UserInformation } from "~types";

import { composeUser } from "./converter";

const { extra } = Constants.manifest ?? {};
const { apiURL } = extra;
const URL = "http://" + apiURL + "/";

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
export async function getSubscribeUserInformation(options: { signal?: AbortSignal } = {}) {
	try {
		const requestServer = await getRequest("subscribe/" + false, options.signal);
		if (requestServer.status === 404) {
			return;
		}
		if (requestServer.status >= 500) {
			throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
		}

		return await requestServer.toSubscribe();
	} catch (error) {
		if (error instanceof Error && error.name == "AbortError") {
		} else {
			throw error;
		}
	}
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
	const url = URL + "payment?type=" + 0 + "&needRecurrent=" + (subscribeType === "Week" ? "false" : "true");

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
	[user, subscribe] = await Promise.all([getUserById(uid), getSubscribeUserInformation()]);
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
