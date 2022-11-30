/** @format */
import auth from "@react-native-firebase/auth";

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Converter, Request, Storage } from "~api";
import { State, UserInformation } from "~types";
import { AccountStatus, Gender } from "src/enum";
import createAsyncThunkApp from "../create-async-thunk";

enum AccountAction {
	setChangedData = "account/setChangedData",
	removeChangedData = "account/removeChangedData",
	saveChangeData = "account/saveChangedData",
	registration = "account/Registration",
	signOut = "account/signOut",
	signIn = "account/signIn",
	getData = "account/getAccountData",
	setRegistrationAccountStatus = "account/setRegistrationAccountStatus",
	getPaymentURLForSubscribe = "account/getPaymentURLForSubscribe",
	setNotNewUser = "account/setNotNewUser",
	initialization = "account/initialization",
}

export const addChangedInformationUser = createAsyncThunkApp(
	AccountAction.setChangedData,
	async ({ birthday, displayName, image, nickname, gender }: Omit<Partial<UserInformation>, "id">) => {
		let lastCheckNicknameAndResult: undefined | [Date, boolean];
		if (nickname !== undefined) {
			lastCheckNicknameAndResult = [new Date(), (await Request.getUserByNickname(nickname)) === null];
		}
		return {
			birthday: birthday === undefined ? undefined : birthday,
			displayName,
			image,
			gender,
			nickname: lastCheckNicknameAndResult === undefined ? undefined : nickname,
			lastCheckNicknameAndResult: lastCheckNicknameAndResult === undefined ? undefined : lastCheckNicknameAndResult[0],
		};
	}
);

export const removeChangedInformationUser = createAction(AccountAction.removeChangedData);

export const updateAccount = createAsyncThunkApp(
	AccountAction.saveChangeData,
	async (updateData: Omit<Partial<UserInformation>, "id">, { getState }) => {
		const changeData = getState().account.changeData;
		let image: string | undefined = changeData.image;
		let displayName: string | undefined = changeData.displayName;
		let birthday: Date | undefined = changeData.birthday === undefined ? undefined : new Date(changeData.birthday);
		let gender: Gender | undefined = changeData.gender === undefined ? undefined : Gender[changeData.gender];
		let nickName: string | undefined = changeData.nickname?.value;
		if (updateData.image !== undefined) image = updateData.image;
		if (updateData.displayName !== undefined) displayName = updateData.displayName;
		if (updateData.birthday !== undefined) birthday = updateData.birthday;
		if (updateData.gender !== undefined) gender = updateData.gender;

		if (updateData.nickname !== undefined) nickName = updateData.nickname;
		let isFree = true;
		if (
			nickName !== undefined &&
			changeData.nickname?.timeLastCheck !== undefined &&
			Date.now() - new Date(changeData.nickname?.timeLastCheck).getTime() > 300_000
		) {
			isFree = !(await Request.getUserByNickname(changeData.nickname.value));
		}
		const user = await Request.updateUser({
			birthday,
			displayName,
			image,
			nickname: isFree ? nickName : undefined,
			gender,
		});

		if (user === undefined) {
			throw new Error("Not Return UserInformation");
		}
		return user;
	}
);

export const registrationAccount = createAsyncThunkApp(AccountAction.registration, async (_, { getState }) => {
	const { birthday, image, nickname, displayName, gender = Gender.OTHER } = getState().account.changeData;
	if (nickname === undefined || birthday === undefined) {
		throw new Error("Need nickname and birthday");
	}
	let isFree = true;
	if (Date.now() - new Date(nickname.timeLastCheck).getTime() > 300_000) {
		isFree = !(await Request.getUserByNickname(nickname.value));
	}
	if (isFree) {
		const user = await Request.createUser({
			birthday: new Date(birthday),
			nickname: nickname.value,
			image: image,
			displayName,
			gender: Gender[gender],
		});
		if (user === undefined) {
			throw new Error("User Not Create");
		}
		return user;
	} else {
		throw new Error("nickname is use");
	}
});

export const signOutAccount = createAsyncThunk(AccountAction.signOut, async () => {
	await auth().signOut();
	await Storage.clear();
	try {
		if ((await GoogleSignin.getCurrentUser()) !== null) {
			await GoogleSignin.signOut();
		}
	} catch (error) {
		console.error(error);
	}
});

export const signInAccount = createAsyncThunk(AccountAction.signIn, async () => {
	const userFirebase = auth().currentUser;
	if (userFirebase === null) throw new Error("Not Found Account UserBase");
	const user = await Request.getUserById(userFirebase.uid);
	let subscribe;
	if (user !== undefined) subscribe = await Request.getSubscribeUserInformation();
	return { user, subscribe };
});

export const setRegistrationAccountStatus = createAction(AccountAction.setRegistrationAccountStatus);
export const setNotNewUser = createAction(AccountAction.setNotNewUser);

///

export const initializationAccount = createAsyncThunk(AccountAction.initialization, async () => {
	const userFirebase = auth().currentUser;
	if (userFirebase === null) {
		return { status: AccountStatus.NO_AUTHENTICATION };
	}
	if (await Request.checkAccess()) {
		const user = await Request.getUserById(userFirebase.uid);
		let subscribe;
		if (user !== undefined) subscribe = await Request.getSubscribeUserInformation();

		return { user, subscribe, status: user === undefined ? AccountStatus.NO_REGISTRATION : AccountStatus.REGISTRATION };
	}
	return { status: AccountStatus.ERROR };
});
