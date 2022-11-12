/**
 * Файл содержит в себе функции которые выполняют запрос к асинхронному хранилищу
 * @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageEntities, GreetingScreen, StatusShowGreetingScreens, SupportType } from "./types";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

enum AsyncStorageKey {
	STATUS_SHOW_GREETING_SCREEN = "@STATUS_SHOW_GREETING_SCREEN",
	FAVORITE_MEDITATION = "@FAVORITE_MEDITATION",
	PROFILE = "@PROFILE",
	STATISTIC = "@STATISTIC",
	USE_MESSAGE_PROFESSOR = "@USE_MESSAGE_PROFESSOR",
	JWT_TOKEN = "@JWT_TOKEN",
	JWT_TOKEN_TIME_DEAD = "@JWT_TOKEN_TIME_DEAD",
}

/**
 * Сохраняет данные в асинхронном хранилище
 * @param key Ключ асинхронного хранилища
 * @param value значение которое необходимо сохранить
 */
async function AsyncStorageSet<T>(key: AsyncStorageKey, value: T, secure: boolean = false) {
	if (secure && new Blob([JSON.stringify(value)], { type: "text/plain" }).size < 2048) {
		await SecureStore.setItemAsync(key.replace("@", "."), JSON.stringify(value));
	} else {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	}
}

/**
 * Получить данные с асинхронного хранилища
 * @param key Ключ асинхронного хранилища по которому будут получены данные
 * @returns null если данных по данному ключу не найдено
 */
async function AsyncStorageGet<T>(key: AsyncStorageKey, secure: boolean = false): Promise<T | null> {
	let asyncStorageRequest: string | null = null;
	if (secure) {
		asyncStorageRequest = await SecureStore.getItemAsync(key.replace("@", "."));
	} else asyncStorageRequest = await AsyncStorage.getItem(key);
	if (asyncStorageRequest === null) {
		return null;
	} else {
		return JSON.parse(asyncStorageRequest) as T;
	}
}

/**
 * Функция возвращает объект в котором указанно показывался ли приветственных экран или нет
 * * В асинхронном хранилище данные хранятся в виде ["Greeting"]
 * @returns объект содержащий название и статус окн
 */
export async function getStatusShowGreetingScreens(): Promise<StatusShowGreetingScreens> {
	const listShowScreenGreeting = await AsyncStorageGet<GreetingScreen[]>(AsyncStorageKey.STATUS_SHOW_GREETING_SCREEN);
	if (listShowScreenGreeting === null) {
		return {
			DescriptionDMD: false,
			DescriptionPractices: false,
			Greeting: false,
			Intro: false,
		};
	} else {
		return {
			DescriptionDMD: listShowScreenGreeting.includes(GreetingScreen.DESCRIPTION_DMD),
			DescriptionPractices: listShowScreenGreeting.includes(GreetingScreen.DESCRIPTION_PRACTICES),
			Greeting: listShowScreenGreeting.includes(GreetingScreen.GREETING),
			Intro: listShowScreenGreeting.includes(GreetingScreen.INTRO),
		};
	}
}

/**
 * Функция меняет состояние в асинхронном хранилище отображалось оно или нет
 * * В асинхронном хранилище данные хранятся в виде ["Greeting"]
 * @params название окна статус котором нужно поменять
 * @returns объект содержащий обновленное название и статус окн
 */
export async function setStatusShowGreetingScreen(
	screenName: GreetingScreen,
	status: boolean = true
): Promise<StatusShowGreetingScreens> {
	const state = { ...(await getStatusShowGreetingScreens()) };
	state[screenName] = status;
	await AsyncStorageSet(
		AsyncStorageKey.STATUS_SHOW_GREETING_SCREEN,
		Object.entries(state)
			.filter(([key, value]) => value)
			.map(([key, value]) => key)
	);
	return state;
}

/**
 * Возвращает список сохраненных в избранном медитаций
 * * В асинхронном хранилище данные хранятся в виде [{"id": "Пример id","name": "Пример названия", "description": "Пример описания", "typePractices": "relax", "length": 60000, "urlAudi": "Примерная ссылка"}]
 * @return список медитационных практик, которые сохранены в избранное
 */
export async function getFavoriteMeditationPractices(): Promise<readonly AsyncStorageEntities.Practices[]> {
	const listFavorite = await AsyncStorageGet<readonly AsyncStorageEntities.Practices[]>(
		AsyncStorageKey.FAVORITE_MEDITATION
	);
	if (listFavorite === null) {
		return [];
	} else {
		return listFavorite;
	}
}

/**
 * Добавляет медитационную практику в асинхронный список избранных практик
 * * В асинхронном хранилище данные хранятся в виде [{"id": "Пример id","name": "Пример названия", "description": "Пример описания", "typePractices": "relax", "length": 60000, "urlAudi": "Примерная ссылка"}]
 * @param id уникальный идентификатор медитационной практики
 * @param name название практики
 * @param description описание практики
 * @param typePractices тип практики
 * @param length длина практики
 * @param urlAudio ссылка на главную аудиозапись
 * @return обновленный список медитационной практикой
 */
export async function addFavoriteMeditationPractices(
	id: string,
	name: string,
	description: string,
	typePractices: SupportType.PracticesMeditation,
	length: number,
	urlAudio?: string
): Promise<readonly AsyncStorageEntities.Practices[]> {
	const listFavorite = await getFavoriteMeditationPractices();
	const practiceData = Object.entries({ id, name, description, typePractices, length });
	if (urlAudio !== undefined) {
		practiceData.push(["urlAudio", urlAudio]);
	}
	const practice = Object.fromEntries(practiceData) as unknown as AsyncStorageEntities.Practices;
	const updateListFavorite: readonly AsyncStorageEntities.Practices[] = [
		...listFavorite.filter(practice => id !== practice.id),
		practice,
	];
	await AsyncStorageSet(AsyncStorageKey.FAVORITE_MEDITATION, updateListFavorite);
	return updateListFavorite;
}

/**
 * Убирает медитационную практику из асинхронного списка избранных практик
 * * В асинхронном хранилище данные хранятся в виде [{"id": "Пример id","name": "Пример названия", "description": "Пример описания", "typePractices": "relax", "length": 60000, "urlAudi": "Примерная ссылка"}]
 * @param id уникальный идентификатор медитационной практики
 * @returns обновленный список медитационной практикой
 */
export async function removeFavoriteMeditationPractices(
	id: string
): Promise<readonly AsyncStorageEntities.Practices[]> {
	const listFavorite = await getFavoriteMeditationPractices();
	const updateListFavorite: readonly AsyncStorageEntities.Practices[] = [
		...listFavorite.filter(practice => id !== practice.id),
	];
	await AsyncStorageSet(AsyncStorageKey.FAVORITE_MEDITATION, updateListFavorite);
	return updateListFavorite;
}

/**
 * Возвращает информацию об пользователе, которая хранится в асинхронном хранилище
 * @returns Пользовательские данные
 * @throws Если пользователь не сохранен в асинхронном хранилище, то вызовет ошибку.
 */
export async function getProfile(): Promise<AsyncStorageEntities.User> {
	const userData = await AsyncStorageGet<AsyncStorageEntities.User>(AsyncStorageKey.PROFILE);
	if (userData === null) {
		throw new Error("Profile not found in asynchronous storage");
	} else {
		return userData;
	}
}

/**
 * Сохраняет информацию об пользователе в асинхронном хранилище
 * @param id уникальный идентификатор пользователя
 * @param nickName уникальное имя пользователя
 * @param birthday дата рождения пользователя
 * @param gender пол указанный пользователем
 * @param image ссылка на изображения пользователя
 * @param displayName отображаемое имя пользователя
 * @returns обновленные данные об пользователе которое сохранены в асинхронном хранилище
 */
export async function setProfile(
	id: string,
	nickName: string,
	birthday: Date,
	gender: SupportType.Gender,
	image: string,
	displayName?: string
): Promise<AsyncStorageEntities.User> {
	const userData = Object.entries({
		id,
		nickName,
		birthday: birthday.toISOString(),
		gender,
		image,
	});
	if (displayName !== undefined) {
		userData.push(["displayName", displayName]);
	}
	const user = Object.fromEntries(userData) as unknown as AsyncStorageEntities.User;
	await AsyncStorageSet(AsyncStorageKey.PROFILE, user);
	return user;
}

// !
export async function getStatistic(): Promise<AsyncStorageEntities.Statistic> {
	const statistic = await AsyncStorageGet<AsyncStorageEntities.Statistic>(AsyncStorageKey.STATISTIC);
	if (statistic === null) {
		return [];
	} else {
		return statistic;
	}
}

export async function addStatistic(
	id: string,
	time: number,
	date: Date,
	meditationId: string
): Promise<AsyncStorageEntities.Statistic> {
	const statistic: AsyncStorageEntities.Statistic = [
		...((await AsyncStorageGet<AsyncStorageEntities.Statistic>(AsyncStorageKey.STATISTIC)) ?? []),
		{ id, date: date.toISOString(), time, meditationId },
	];
	await AsyncStorageSet(AsyncStorageKey.STATISTIC, statistic);
	return statistic;
}

//!
export async function addUsingMessage(messageId: string): Promise<AsyncStorageEntities.UsedMessage> {
	const currentStorageMessages = await getUsingMessages();
	const messageList: AsyncStorageEntities.UsedMessage = [
		...currentStorageMessages,
		{
			id: await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.SHA256,
				currentStorageMessages.length === 0 ? "0" : currentStorageMessages[currentStorageMessages.length - 1].id
			),
			dateLastUpdate: new Date().toISOString(),
			messageId: messageId,
		},
	];
	await AsyncStorageSet(AsyncStorageKey.USE_MESSAGE_PROFESSOR, messageList);
	return messageList;
}

export async function getUsingMessages(): Promise<AsyncStorageEntities.UsedMessage> {
	return [...((await AsyncStorageGet<AsyncStorageEntities.UsedMessage>(AsyncStorageKey.USE_MESSAGE_PROFESSOR)) ?? [])];
}

export async function updateMessage(id?: string): Promise<AsyncStorageEntities.UsedMessage> {
	const message = [...(await getUsingMessages())];
	let index: number;
	if (message.length === 0) {
		return message;
	}
	if (id === undefined) {
		index = message.length - 1;
	} else {
		index = message.findIndex(item => item.id === id);
	}
	message[index] = { ...message[index], dateLastUpdate: new Date().toISOString() };
	await AsyncStorageSet(AsyncStorageKey.USE_MESSAGE_PROFESSOR, message);
	return message;
}

//!
export async function getToken(): Promise<null | string> {
	const timeDeadStorage = await AsyncStorageGet<string>(AsyncStorageKey.JWT_TOKEN_TIME_DEAD);
	if (timeDeadStorage === null) return null;
	if (new Date(timeDeadStorage).getTime() <= Date.now()) return null;
	const token = await AsyncStorageGet<string | null>(AsyncStorageKey.JWT_TOKEN, true);
	return token;
}

//!
export async function saveToken(token: string, timeDead: Date): Promise<string> {
	await AsyncStorageSet<string>(AsyncStorageKey.JWT_TOKEN_TIME_DEAD, timeDead.toISOString());
	await AsyncStorageSet(AsyncStorageKey.JWT_TOKEN, token, true);
	return token;
}

export async function clear() {
	await AsyncStorage.clear();
	await SecureStore.deleteItemAsync(AsyncStorageKey.JWT_TOKEN.replaceAll("@", "."));
}
