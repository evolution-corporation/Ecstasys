/**
 * @description Файл содержит в себе обработчики модуля
 * @format */

import auth from "@react-native-firebase/auth";
import * as Validators from "src/validators";
import * as Requests from "./requests";
import { NicknameNotValidate } from "src/validators";
// import { Practices, Users } from "./models";
import { PracticesMeditation, SupportType } from "./types";

//! Скопировано в models/account
/**
 * Регистрирует пользователя в системе Evolution
 * @param nickname уникальное имя пользователя которое ввел пользователь
 * @param birthday дата рождения выбранная пользователем
 * @param image изображение которое выбрал пользователь
 * @returns модель пользователя
 */
// export async function registration(nickname: string, birthday: Date, image?: string): Promise<Users> {
// 	return new Users(await Requests.createUser({ birthday, nickname, image }));
// }

//! Скопировано в models/account
/**
 * Получить информацию об авторизированном пользователе, если вызвать когда пользователь не авторизован выдаст ошибку
 * @returns информация об авторизированном пользователе
 * @throws AuthorizationUerWasNotFound возвращается если функция была вызвана когда пользователь не найден
 */
// export async function authentication(): Promise<Users | null> {
// 	const user = auth().currentUser;
// 	if (user === null)
// 		throw new Error("An authorized user was not found. Check the user's authorization status in React Native Firebase");
// 	const userData = await Requests.getUserById(user.uid);
// 	if (userData === null) return null;
// 	return new Users(userData);
// }

//! Скопировано в models/account

/**
 * Обновляет данные пользователя в системе Evolution
 * @param nickname новый никнейм пользователя
 * @param birthday обновленная дата рождения пользователя
 * @param image новое изображение пользователя
 * @param displayName новое отображаемое имя пользователя
 * @returns обновленную модель пользователя
 */
// export async function update(nickname?: string, birthday?: Date, image?: string, displayName?: string): Promise<Users> {
// 	return new Users(
// 		await Requests.updateUser({
// 			birthday,
// 			displayName,
// 			image,
// 			nickname,
// 		})
// 	);
// }

//! Скопировано в models/changeUserData

/**
 * Проверяет занято ли проверяемое уникальное имя
 * @param nickname проверяемое уникальное имя пользователя
 * @returns если уникальное имя занято, то возвращает true иначе false
 * @throws NicknameNotValidate возвращается, если уникальное проверяемое пользовательское имя не прошло проверку на валидность
 */
// export async function checkNickname(nickname: string): Promise<boolean> {
// 	if (Validators.isNicknameValidate(nickname)) return !!(await Requests.getUserByNickname(nickname));
// 	throw new NicknameNotValidate(
// 		`Checked nickname ${nickname}. Name called function: checkNickname, src/api/middleware.ts`
// 	);
// }

/**
 * Возвращает популярную медитацию за сутки
 * @returns популярная за сутки медитация
 */
export async function getPopularMeditation(): Promise<Practices> {
	return new Practices(await Requests.getPopularToDayMeditation());
}

/**
 * Возвращает список медитаций в каждой категории, кроме DMD
 * @return Количество медитаций в каждой категории
 */
export async function getCountMeditationInPractices(): Promise<(practiceType: PracticesMeditation) => number> {
	const list: [SupportType.TypeMeditation, number][] = [
		["relaxation", await Requests.getCountMeditationsByType("relaxation")],
		["breathingPractices", await Requests.getCountMeditationsByType("breathingPractices")],
		["directionalVisualizations", await Requests.getCountMeditationsByType("directionalVisualizations")],
		["dancePsychotechnics", await Requests.getCountMeditationsByType("dancePsychotechnics")],
	];
	return practiceType => {
		let row: [SupportType.TypeMeditation, number] | undefined;
		switch (practiceType) {
			case PracticesMeditation.RELAXATION:
				row = list.find(name => name[0] === "relaxation");
				break;
			case PracticesMeditation.BREATHING_PRACTICES:
				row = list.find(name => name[0] === "breathingPractices");
				break;
			case PracticesMeditation.DANCE_PSYCHOTECHNICS:
				row = list.find(name => name[0] === "dancePsychotechnics");
				break;
			case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
				row = list.find(name => name[0] === "directionalVisualizations");
				break;
		}
		if (row !== undefined) return row[1];
		return 0;
	};
}

/**
 * Возвращает модель медитации по Id
 * @param id id медитации, которую необходимо вернуть
 * @return модель медитации, если медитации не существует вернет null
 */
export async function getPracticesById(id: string): Promise<Practices | null> {
	const result = await Requests.getMeditationById(id);
	if (result === null) {
		return null;
	}
	return new Practices(result);
}

/**
 * Возвращает список медитаций, принадлежащие определенной категории
 * @param practicesMeditation Тип медитаций, которые необходимо вернуть
 * @return список медитаций которые, которые подходят под описание
 */
export async function getPracticesListByType(practicesMeditation: PracticesMeditation): Promise<Practices[]> {
	if (practicesMeditation !== PracticesMeditation.BASIC) {
		let typeMeditation: SupportType.TypeMeditation;
		switch (practicesMeditation) {
			case PracticesMeditation.RELAXATION:
				typeMeditation = "relaxation";
				break;
			case PracticesMeditation.BREATHING_PRACTICES:
				typeMeditation = "breathingPractices";
				break;
			case PracticesMeditation.DANCE_PSYCHOTECHNICS:
				typeMeditation = "dancePsychotechnics";
				break;
			case PracticesMeditation.DIRECTIONAL_VISUALIZATIONS:
				typeMeditation = "directionalVisualizations";
				break;
		}
		const meditationList = await Requests.getMeditationsByType(typeMeditation);
		return meditationList.map(meditation => new Practices(meditation));
	} else {
		// TODO Добавить обработку базовых практик
		return [];
	}
}

// /**
//  * Возвращает список сетов для DMD
//  * @return список сетов которые
//  */
// export async function getSetDMD(): Promise<Meditation[]> {
// 	await Requests.getMeditationsByType("set");
// }
