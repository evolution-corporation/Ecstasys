/** @format */
// import auth from "@react-native-firebase/auth";

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Converter, Request, Storage } from "~api";
import { Gender, State } from "~types";
import type { AsyncThunkConfig } from "../index";
import { Platform } from "react-native";

import { adapty } from "react-native-adapty";

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
}

export interface SetChangedAccountDataParameters {
	nickname?: string;
	image?: string | null;
	displayName?: string;
	birthday?: Date;
	gender?: Gender;
}

export const addChangedInformationUser = createAsyncThunk<
	State.ChangedUserData,
	SetChangedAccountDataParameters,
	AsyncThunkConfig
>(AccountAction.setChangedData, async ({ birthday, displayName, image, nickname, gender }) => {
	let lastCheckNicknameAndResult: undefined | [Date, boolean];
	if (nickname !== undefined) {
		lastCheckNicknameAndResult = [new Date(), (await Request.getUserByNickname(nickname)) === null];
	}
	if (image === null) image = "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png";
	return {
		birthday: birthday !== undefined ? birthday.toISOString() : undefined,
		displayName,
		image,
		gender,
		nickname: lastCheckNicknameAndResult !== undefined ? nickname : undefined,
		lastCheckNicknameAndResult:
			lastCheckNicknameAndResult !== undefined
				? [lastCheckNicknameAndResult[0].toISOString(), lastCheckNicknameAndResult[1]]
				: undefined,
	};
});

export const removeChangedInformationUser = createAction(AccountAction.removeChangedData);

export const updateAccount = createAsyncThunk<
	State.User,
	{ image?: string; displayName?: string; birthday?: string; gender?: Gender },
	AsyncThunkConfig
>(AccountAction.saveChangeData, async ({ image, birthday, displayName, gender }, { getState }) => {
	const changeData = getState().account.changeData;
	if (image === undefined) {
		if (changeData.image === "https://storage.yandexcloud.net/dmdmeditationimage/users/NoUserImage.png") {
			await Request.removeUserImage();
		} else {
			image = changeData.image;
		}
	}
	if (birthday === undefined) birthday = changeData.birthday;
	if (displayName === undefined) displayName = changeData.displayName;
	if (gender === undefined)
		gender = (() => {
			switch (changeData.gender) {
				case "FEMALE": {
					return Gender.FEMALE;
				}
				case "MALE": {
					return Gender.MALE;
				}
				case "OTHER": {
					return Gender.OTHER;
				}
				default: {
					return;
				}
			}
		})();
	const { nickname } = changeData;
	let { lastCheckNicknameAndResult } = changeData;
	if (
		nickname !== undefined &&
		(lastCheckNicknameAndResult === undefined ||
			Date.now() - new Date(lastCheckNicknameAndResult[0]).getTime() > 300000)
	) {
		const isFree = (await Request.getUserByNickname(nickname)) === null;
		lastCheckNicknameAndResult = [new Date().toISOString(), isFree];
	}
	const currentGender = getState().account.currentData?.gender; //! Fix
	if (gender === undefined && currentGender !== undefined) gender = Gender[currentGender];

	const user = Converter.composeUser(
		await Request.updateUser({
			birthday: birthday === undefined ? undefined : new Date(birthday),
			displayName,
			image,
			gender,
			nickname:
				nickname !== undefined && lastCheckNicknameAndResult !== undefined && lastCheckNicknameAndResult[1]
					? nickname
					: undefined,
		})
	);
	if (user === null) {
		throw new Error("Not Return UserInformation");
	}
	return user;
});

export const registrationAccount = createAsyncThunk<State.User, undefined, AsyncThunkConfig>(
	AccountAction.registration,
	async (_, { getState }) => {
		const { birthday, nickname, image } = getState().account.changeData;
		let { lastCheckNicknameAndResult } = getState().account.changeData;
		if (nickname === undefined || birthday === undefined) {
			throw new Error("Need nickname and birthday");
		}
		if (lastCheckNicknameAndResult === undefined) {
			throw new Error("Nickname not checked");
		}
		if (Date.now() - new Date(lastCheckNicknameAndResult[0]).getTime() > 300000) {
			const isFree = (await Request.getUserByNickname(nickname)) === null;
			lastCheckNicknameAndResult = [new Date().toISOString(), isFree];
		}
		if (lastCheckNicknameAndResult[1]) {
			const user = Converter.composeUser(await Request.createUser({ birthday: new Date(birthday), nickname, image }));
			if (user === null) {
				throw new Error("User Not Create");
			}
			if (Platform.OS === "ios") await adapty.identify(user.uid);
			return user;
		} else {
			throw new Error("nickname is use");
		}
	}
);

export const signOutAccount = createAsyncThunk(AccountAction.signOut, async () => {
	await auth().signOut();
	await Storage.clear();
	if (Platform.OS === "ios") await adapty.logout();
	try {
		if ((await GoogleSignin.getCurrentUser()) !== null) {
			await GoogleSignin.signOut();
		}
	} catch {}
});

export const signInAccount = createAsyncThunk<
	{ user: State.User | null; subscribe: State.Subscribe | null; id: string },
	undefined,
	AsyncThunkConfig
>(AccountAction.signIn, async () => {
	const userFirebase = auth().currentUser;
	if (userFirebase === null) throw new Error("");
	if (Platform.OS === "ios") await adapty.identify(userFirebase.uid);
	const [userServer, subscribeServer] = await Request.getInformationUser();
	const [user, subscribe] = [
		userServer === null ? null : Converter.composeUser(userServer),
		userServer !== null && subscribeServer !== null ? Converter.composeSubscribe(subscribeServer) : null,
	];
	if (user !== null) {
		Storage.setProfile(user.uid, user.nickName, new Date(user.birthday), user.gender, user.image, user.displayName);
	}
	return { user, subscribe, id: userFirebase.uid };
});

export const setRegistrationAccountStatus = createAction(AccountAction.setRegistrationAccountStatus);
export const setNotNewUser = createAction(AccountAction.setNotNewUser);

export const getSubs = createAsyncThunk("account/subs", async () => {
	if (Platform.OS === "ios") {
		const profile = await adapty.getProfile();
		const accessLevels = profile.accessLevels;
		if (accessLevels?.premium?.isActive ?? false) {
			const premium = accessLevels.premium;
			let RemainingTime = new Date(premium.activatedAt);
			RemainingTime.setDate(RemainingTime.getDate() - 28);
			if (premium.expiresAt !== undefined) {
				RemainingTime = premium.expiresAt
			}
      return {
				UserId: profile.profileId,
				WhenSubscribe: WhenSubscribe.toDateString(),
				RemainingTime: RemainingTime.toDateString(),
				Type: monthlySubscribe.isActive ? "Month" : "Month6",
				RebillId: premium.willRenew ? "123" : "-1",
			};
		}
		return null;
	} else {
		return await Request.getSubscribeUserInformation();
	}
});

export const removeSubscribe = createAsyncThunk("account/removeSubscribe", async () => {
	await Request.removeAutoPayment();
});
