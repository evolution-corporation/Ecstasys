/**
 * @format
 * Файл содержит в себе функции которые выполняют запрос к серверу
 */

import auth from "@react-native-firebase/auth";
import { RequestError } from "src/Errors";
import { ServerEntities, SupportType } from "./types";

const URL = "http://62.84.125.238:8000/";

/**
 * Получает FirebaseToken пользователя
 * @returns FirebaseToken пользователя
 */
async function getFirebaseToken(firebaseToken: string | undefined) {
	if (firebaseToken === undefined) {
		firebaseToken = await auth().currentUser?.getIdToken();
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
	return json as ServerEntities.User;
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
	{ birthday, displayName, image, nickname }: UpdateUserParams,
	firebaseTokenToken?: string
) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const body: [string, any][] = [];
	if (nickname !== undefined) body.push(["NickName", nickname]);
	if (displayName !== undefined) body.push(["DisplayName", displayName]);
	if (birthday !== undefined) body.push(["Birthday", birthday.toISOString()]);
	if (image !== undefined) body.push(["Image", image]);
	const url = URL + "users";
	const requestServer = await fetch(url, {
		method: "PUT",
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
			"PUT",
			"50x"
		);
	}
	const json = await requestServer.json();
	return json as ServerEntities.User;
}
interface UpdateUserParams {
	nickname?: string;
	displayName?: string;
	image?: string;
	birthday?: Date;
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
	const url = URL + "meditation?meditationId=" + meditationId + "&count=1";
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
	return json as ServerEntities.Meditation;
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
	if (false) {
		const requestServer = await fetch(URL + "subscribe", {
			headers: {
				Authorization: firebaseTokenToken,
				"Content-Type": "application/json",
			},
		});
		if (requestServer.status === 404) {
			return null;
		}
		if (requestServer.status >= 500) {
			throw new Error(`Server Error in getSubscribeUserInformation: ${await requestServer.text()}`);
		}
		const json = await requestServer.json();
		return json.length as ServerEntities.Subscribe;
	} else {
		return {
			Type: "Month",
			UserId: "GEdKUP844QdzlStc6rpmnyPEyqJ2",
			RebillId: -1,
			WhenSubscribe: "2022-10-11T18:00:00.000Z",
			RemainingTime: 20,
		};
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
	const url = URL + "payment?type=" + subscribeType + "&needRecurrent=" + subscribeType === "Week" ? "false" : "true";
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

/**
 * Получает информацию об пользователе по его nickname
 * @param nickname nickname пользователя информацию об котором необходимо найти
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Информация об пользователе или null если пользователь с таким nickname не найден
 */
export async function getUserByNickname(nickname: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const url = URL + "nickname?nickname=" + nickname;
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
		throw new RequestError(`getUserByNickname: ${await requestServer.text()}`, url, undefined, "GET", "50x");
	}
	const json = await requestServer.json();
	return json.length as ServerEntities.User;
}

//!
export async function checkAccess() {
	try {
		const request = await fetch(URL + "api/204");
		return request.status === 204;
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
