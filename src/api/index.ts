/**
 * @module api
 * @description Модуль отвечает за работу с данными. Получение данных с сервера/Асинхронного хранилища/Файловой системы
 * TODO Добавить в меню разработчика возможность отключать работу с api
 * @format
 */
// import auth from "@react-native-firebase/auth";
import { State } from "~types";

import * as Types from "./types";
import * as Request from "./requests";
import * as Storage from "./asyncStorage";
import * as Converter from "./converter";

export async function initializationAccount(): Promise<null | {
	uid: string;
	userInformation: State.User | null;
	subsInformation: State.Subscribe | null;
}> {
	const userFirebase = auth().currentUser;
	if (userFirebase === null) {
		return null;
	}
	let user: State.User | null = null;
	let subscribe: State.Subscribe | null = null;
	if (await Request.checkAccess()) {
		user = Converter.composeUser(await Request.getUserById(userFirebase.uid));
		subscribe = Converter.composeSubscribe(await Request.getSubscribeUserInformation());
		if (user !== null) {
			Storage.setProfile(user.uid, user.nickName, new Date(user.birthday), user.gender, user.image, user.displayName);
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
	return {
		userInformation: user,
		subsInformation: subscribe,
		uid: userFirebase.uid,
	};
}

export { Types, Request, Storage, Converter };
