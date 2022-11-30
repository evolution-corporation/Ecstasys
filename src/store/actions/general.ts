/** @format */
import { loadAsync } from "expo-font";
import auth from "@react-native-firebase/auth";
import MessageId from "~assets/messageProfessor.json";

import {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { State } from "~types";
import { Request, Converter, Storage } from "~api";

import { AsyncThunkConfig } from "~store";
import { registrationAccount, signInAccount } from "./account";
import { getPracticeDay } from "./practice";

enum GeneralAction {
	initialization = "general/initialization",
	registration = "general/registration",
	signIn = "general/signIn",
	signOut = "generl/signOut",
}

export const initialization = createAsyncThunk(GeneralAction.initialization, async (_, {}) => {
	let [accountInformation, __, practicesInformation, messageProfessor] = await Promise.all([
		// авторизация данных об аккаунте и их перезапись в памяти
		(async () => {
			const userFirebase = auth().currentUser;
			if (userFirebase === null) {
				return null;
			}
			let user: State.User | null = null;
			let subscribe: State.Subscribe | null = null;
			if (await Request.checkAccess()) {
				const [userServer, subscribeServer] = await Request.getInformationUser();
				[user, subscribe] = [
					userServer !== null ? Converter.composeUser(userServer) : null,
					userServer !== null && subscribeServer !== null ? Converter.composeSubscribe(subscribeServer) : null,
				];
				if (user !== null) {
					Storage.setProfile(
						user.uid,
						user.nickName,
						new Date(user.birthday),
						user.gender,
						user.image,
						user.displayName
					);
				}
			} else {
				const saveUserData = await Storage.getProfile();
				user = {
					birthday: saveUserData.birthday,
					gender: saveUserData.gender,
					image: saveUserData.image,
					nickName: saveUserData.nickName,
					displayName: saveUserData.displayName,
					uid: saveUserData.id,
				};
			}
			return { user, subscribe, id: userFirebase.uid };
		})(),
		// загрузка шрифтов
		(async () => {
			await loadAsync({
				Roboto_100Thin,
				Roboto_300Light,
				Roboto_400Regular,
				Roboto_500Medium,
				Roboto_700Bold,
				Roboto_900Black,
				Inter_700Bold,
			});
		})(),
		// Обработка практик
		(async () => {
			//* Получаем список медитаций данные которых нам нужно получить
			const userFirebase = auth().currentUser;
			if (userFirebase === null) {
				return {
					listPracticesListened: [],
					listPracticesFavorite: [],
					recommendationPracticeToDay: null,
				};
			}
			const listNeedPracticeId: string[] = [];
			const listPracticesListened = await Storage.getStatistic();
			listNeedPracticeId.push(...listPracticesListened.map(item => item.meditationId));
			const listPracticesFavorite = await Storage.getFavoriteMeditationPractices();
			listNeedPracticeId.push(
				...listPracticesFavorite.filter(item => !listNeedPracticeId.includes(item.id)).map(item => item.id)
			);
			const listNeedPractice = new Map<string, State.Practice>();
			let recommendationPracticeToDay: State.Practice | null = null;
			if (await Request.checkAccess()) {
				//* Получаем данные по медитациям с которыми мы как-то связаны.
				for (let id of listNeedPracticeId) {
					if (id !== "32c996f7-13e6-4604-966d-b96a8bf0e7c3" && id !== "9ce4657e-2d0a-405a-b02f-408dd76cc8f7") {
						const practice = Converter.composePractice(await Request.getMeditationById(id));
						if (practice !== null) listNeedPractice.set(id, practice);
					}
				}
				recommendationPracticeToDay = Converter.composePractice(await Request.getRecommendationMeditation());
			} else {
				let randomId =
					listPracticesFavorite.length > 0
						? listPracticesFavorite[Math.floor(listPracticesFavorite.length * Math.random())].id
						: null;
				const listNeedPracticeDataAsync = [...listPracticesFavorite];
				for (let id of listNeedPracticeId) {
					const indexPracticeDataAsync = listNeedPracticeDataAsync.findIndex(item => item.id === id);
					if (indexPracticeDataAsync !== -1) {
						const practice = listNeedPracticeDataAsync[indexPracticeDataAsync];
						let type: State.PracticesMeditation;
						switch (practice.typePractices) {
							case "base":
								type = "BASIC";
								break;
							case "breathingPractices":
								type = "BREATHING_PRACTICES";
								break;
							case "dancePsychotechnics":
								type = "DANCE_PSYCHOTECHNICS";
								break;
							case "directionalVisualizations":
								type = "DIRECTIONAL_VISUALIZATIONS";
								break;
							case "relaxation":
								type = "RELAXATION";
								break;
						}
						const practiceState = {
							id,
							description: practice.description,
							type,
							length: practice.length,
							isNeedSubscribe: true,
							name: practice.name,
							image:
								"https://storage.yandexcloud.net/dmdmeditationimage/meditations/404-not-found-error-page-examples.png",
							instruction: { body: [], description: "", id: "", title: "" },
						};
						listNeedPractice.set(id, practiceState);
						if (randomId === id) {
							recommendationPracticeToDay = practiceState;
						}
					} else if (randomId === id) {
						randomId = listPracticesFavorite[Math.floor(listPracticesFavorite.length * Math.random())].id;
					}
				}
			}
			return {
				listPracticesListened: listPracticesListened
					.map(item => {
						const practice = listNeedPractice.get(item.meditationId);
						if (practice === undefined) return null;
						return { practice, dateListen: item.date, msListened: item.time };
					})
					.filter(item => item !== null),
				listPracticesFavorite: listPracticesFavorite
					.map(item => {
						const practice = listNeedPractice.get(item.id);
						if (practice === undefined) return null;
						return practice;
					})
					.filter(item => item !== null),
				recommendationPracticeToDay,
			};
		})(),
		// Сообщения от профессора
		(async () => {
			let message: State.MessageProfessor;
			const listUsedMessage = await Storage.getUsingMessages();
			if (listUsedMessage.length === 0) {
				message = {
					idMessage: MessageId[Math.floor(Math.random() * MessageId.length)],
					dateTimeLastUpdate: new Date().toISOString(),
				};
				await Storage.addUsingMessage(message.idMessage);
			} else {
				const toDay = new Date();
				toDay.setHours(0, 0, 0, 0);
				const lastMessage = listUsedMessage[listUsedMessage.length - 1];
				if (new Date(lastMessage.dateLastUpdate).getTime() >= toDay.getTime()) {
					const hoursCurrentTime = new Date().getHours();
					const hoursLastTimeUpdate = new Date(lastMessage.dateLastUpdate).getHours();
					let updateDateLastUpdate: Date | undefined = undefined;
					if (
						(hoursLastTimeUpdate >= 0 && hoursLastTimeUpdate < 6 && hoursCurrentTime > 6) ||
						(hoursLastTimeUpdate >= 6 && hoursLastTimeUpdate < 12 && hoursCurrentTime > 12) ||
						(hoursLastTimeUpdate >= 12 && hoursLastTimeUpdate < 18 && hoursCurrentTime > 18)
					) {
						updateDateLastUpdate = new Date();
					}
					message = {
						idMessage: lastMessage.messageId,
						dateTimeLastUpdate:
							updateDateLastUpdate === undefined ? lastMessage.dateLastUpdate : updateDateLastUpdate.toISOString(),
					};
					await Storage.updateMessage(lastMessage.id);
				} else {
					const toStartMonth = new Date();
					toStartMonth.setHours(23, 59, 59, 999);
					toStartMonth.setDate(0);
					const blackListMessageId = listUsedMessage
						.filter(item => new Date(item.dateLastUpdate).getTime() > toStartMonth.getTime())
						.map(item => item.messageId);
					const whiteListMessageId = MessageId.filter(item => !blackListMessageId.includes(item));
					message = {
						idMessage: whiteListMessageId[Math.floor(Math.random() * whiteListMessageId.length)],
						dateTimeLastUpdate: new Date().toISOString(),
					};
					await Storage.addUsingMessage(message.idMessage);
				}
			}
			return message;
		})(),
		// async () => {
		// 	await Notifications.setNotificationCategoryAsync("~Meditation", [
		// 		{ buttonTitle: i18n.t("Pause"), identifier: "~pause", options: { opensAppToForeground: true } },
		// 	]);
		// },
	]);
	return {
		account:
			accountInformation !== null
				? {
						user: accountInformation.user,
						subscribe: accountInformation.subscribe,
						id: accountInformation.id,
				  }
				: null,
		practice: practicesInformation,
		messageProfessor,
	};
});

export const registation = createAsyncThunk<void, undefined, AsyncThunkConfig>(
	GeneralAction.registration,
	async (_, { dispatch }) => {
		const user = await dispatch(registrationAccount()).unwrap();
		if (user !== null) {
			dispatch(getPracticeDay());
		}
	}
);

export const sigIn = createAsyncThunk<void, undefined, AsyncThunkConfig>(
	GeneralAction.signIn,
	async (_, { dispatch }) => {
		const user = await dispatch(signInAccount()).unwrap();
		if (user !== null) {
			dispatch(getPracticeDay());
		}
	}
);
