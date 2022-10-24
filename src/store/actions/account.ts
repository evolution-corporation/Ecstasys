/** @format */
import auth from "@react-native-firebase/auth";

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Account } from "src/models";
import { Converter, Request, Storage } from "~api";
import { State } from "~types";
import type { AsyncThunkConfig } from "../index";

enum AccountAction {
	setChangedData = "account/setChangedData",
	removeChangedData = "account/removeChangedData",
	saveChangeData = "account/saveChangedData",
	registration = "account/Registration",
	signOut = "account/signOut",
	signIn = "account/signIn",
	getData = "account/getAccountData",
	initialization = "account/initialization",
}

interface SetChangedAccountDataParams {
	nickname?: string;
	image?: string;
	displayName?: string;
	birthday?: Date;
}

export const addChangedInformationUser = createAsyncThunk<
	State.ChangedUserData,
	SetChangedAccountDataParams,
	AsyncThunkConfig
>(AccountAction.setChangedData, async ({ birthday, displayName, image, nickname }) => {
	let lastCheckNicknameAndResult: undefined | [Date, boolean];
	if (nickname !== undefined) {
		lastCheckNicknameAndResult = [new Date(), (await Request.getUserByNickname(nickname)) === null];
	}
	return {
		birthday: birthday !== undefined ? birthday.toISOString() : undefined,
		displayName,
		image,
		nickname: lastCheckNicknameAndResult !== undefined ? nickname : undefined,
		lastCheckNicknameAndResult:
			lastCheckNicknameAndResult !== undefined
				? [lastCheckNicknameAndResult[0].toISOString(), lastCheckNicknameAndResult[1]]
				: undefined,
	};
});

export const removeChangedInformationUser = createAction(AccountAction.removeChangedData);

export const updateAccount = createAsyncThunk<State.User, undefined, AsyncThunkConfig>(
	AccountAction.saveChangeData,
	async (_, { getState }) => {
		let { birthday, displayName, gender, image, lastCheckNicknameAndResult, nickname } = getState().account.changeData;
		if (nickname !== undefined) {
			if (
				lastCheckNicknameAndResult === undefined ||
				Date.now() - new Date(lastCheckNicknameAndResult[0]).getTime() > 300000
			) {
				const isFree = (await Request.getUserByNickname(nickname)) === null;
				lastCheckNicknameAndResult = [new Date().toISOString(), isFree];
			}
		}
		const user = Converter.composeUser(
			await Request.updateUser({
				birthday: birthday !== undefined ? new Date(birthday) : undefined,
				displayName,
				image,
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
	}
);

export const registrationAccount = createAsyncThunk<State.User, undefined, AsyncThunkConfig>(
	AccountAction.registration,
	async (_, { getState }) => {
		let { birthday, nickname, image, lastCheckNicknameAndResult } = getState().account.changeData;
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
			return user;
		} else {
			throw new Error("nickname is use");
		}
	}
);

export const signOutAccount = createAsyncThunk(AccountAction.signOut, async () => {
	await auth().signOut();
	//! Сделать функцию по очистке AsyncStorage
});

export const signInAccount = createAsyncThunk<
	{ user: State.User | null; subscribe: State.Subscribe | null; id: string },
	undefined,
	AsyncThunkConfig
>(AccountAction.signIn, async () => {
	const userFirebase = auth().currentUser;
	if (userFirebase === null) throw new Error("");
	let user: State.User | null;
	let subscribe: State.Subscribe | null;
	const [userServer, subscribeServer] = await Request.getInformationUser();
	[user, subscribe] = [
		userServer !== null ? Converter.composeUser(userServer) : null,
		userServer !== null && subscribeServer !== null ? Converter.composeSubscribe(subscribeServer) : null,
	];
	if (user !== null) {
		Storage.setProfile(user.uid, user.nickName, new Date(user.birthday), user.gender, user.image, user.displayName);
	}
	return { user, subscribe, id: userFirebase.uid };
});
