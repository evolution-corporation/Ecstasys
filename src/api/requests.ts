/** @format */

import auth from "@react-native-firebase/auth";
import { ServerEntities, SubscribeType, TypeMeditation } from "~types";

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

/** Function getUserById
 *	Возвращает пользователя по ID
 *	@param userId id пользователя данне которого необходимо получить
 *	@param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 *	@return данные об пользователе которые хранятся на сервере, если он найден иначе null
 */
export async function getUserById(userId: string, firebaseTokenToken?: string): Promise<ServerEntities.User | null> {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "users?id=" + userId, {
		method: "GET",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404) {
		return null;
	}
	const json = await requestServer.json();
	console.log(json);
	return json as ServerEntities.User;
}

/** Function createUser
 *	Отправляет запрос на создание пользователя серверу
 *	@param obj параметры функции
 *	@param obj.nickName уникальное имя пользователя
 *	@param obj.birthday дата рождения пользователя
 *	@param obj.image изображение пользователя
 *	@param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 *	@return данные об новом пользователе
 */
export async function createUser({ birthday, nickName, image }: CreateUserParams, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "users", {
		method: "POST",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			NickName: nickName,
			Birthday: birthday.toISOString(),
			Image: image,
		}),
	});
	const json = await requestServer.json();
	return json as ServerEntities.User;
}
interface CreateUserParams {
	readonly nickName: string;
	readonly birthday: Date;
	readonly image?: string;
}

/** Function updateUser
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
	const requestServer = await fetch(URL + "users", {
		method: "PUT",
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(Object.fromEntries(body)),
	});
	const json = await requestServer.json();
	return json as ServerEntities.User;
}
interface UpdateUserParams {
	nickname?: string;
	displayName?: string;
	image?: string;
	birthday?: Date;
}

/** Function getPopularToDayMeditation
 * Возвращает популярную медитацию за сутки
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Популярная медитация за сутки
 */
export async function getPopularToDayMeditation(firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "meditation?popularToday=true", {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	const json = await requestServer.json();
	return json as ServerEntities.Meditation;
}

/** Function getMeditationById
 * Возвращает данные об запрошенной медитации по Id
 * @param meditationId id запрошенной медитации
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Запрошенная медитация
 */
export async function getMeditationById(meditationId: string, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "meditation?meditationId=" + meditationId + "&count=1", {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	if (requestServer.status === 404) {
		return null;
	}
	const json = await requestServer.json();
	return json as ServerEntities.Meditation;
}

/** Function getMeditationsByType
 * Возвращает список медитаций отфильтрованных по определенном типу
 * @param meditationType тип запрашиваемых медитаций
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Запрошенная медитация
 */
export async function getMeditationsByType(meditationType: TypeMeditation, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "meditation?type=" + meditationType, {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	const json = await requestServer.json();
	return json as ServerEntities.Meditation[];
}

/** Function getCountMeditationsByType
 * Возвращает количество медитаций в определенном определенном типу
 * @param meditationType тип запрашиваемых медитаций
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return количество медитаций
 */
export async function getCountMeditationsByType(meditationType: TypeMeditation, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "meditation?type=" + meditationType + "&count=0", {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	const json = await requestServer.json();
	return json.length as number;
}

/** Function getSubscribeUserInformation
 * Возвращает информацию об подписке пользователя
 * @param firebaseTokenToken FirebaseToken пользователя от имени которого происходит запрос
 * @return Данные об подписке пользователя
 */
export async function getSubscribeUserInformation(firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(URL + "subscribe", {
		headers: {
			Authorization: firebaseTokenToken,
			"Content-Type": "application/json",
		},
	});
	const json = await requestServer.json();
	return json.length as ServerEntities.Subscribe;
}

/** Function getPaymentURL
 * Получает ссылку для проведения оплаты подписки
 * @param subscribeType тип подписки для которой происходит оплата
 * @return Ссылка для проведения оплаты
 */
export async function getPaymentURL(subscribeType: SubscribeType, firebaseTokenToken?: string) {
	firebaseTokenToken = await getFirebaseToken(firebaseTokenToken);
	const requestServer = await fetch(
		URL + "payment?type=" + subscribeType + "&needRecurrent=" + subscribeType === "Week" ? "false" : "true",
		{
			headers: {
				Authorization: firebaseTokenToken,
				"Content-Type": "application/json",
			},
		}
	);
	const json = await requestServer.json();
	return json.length as string;
}
