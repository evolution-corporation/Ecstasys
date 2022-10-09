/** @format */

import auth from "@react-native-firebase/auth";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "~api";
import { AccountJSON, AccountStatus, ChangedAccountData } from "~types";
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

export const setChangedAccountData = createAction(AccountAction.setChangedData, (changedData: ChangedAccountData) => ({
	payload: Object.fromEntries(
		Object.entries(changedData).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value])
	),
}));

export const removeChangedAccountData = createAction(AccountAction.removeChangedData);

export const saveChangeAccountData = createAsyncThunk<AccountJSON, undefined, AsyncThunkConfig>(
	AccountAction.saveChangeData,
	async (_, { getState }) => {
		const { changedAccountData } = getState().account;
		return await API.update(
			changedAccountData.nickname,
			changedAccountData.birthday ? new Date(changedAccountData.birthday) : undefined,
			changedAccountData.image,
			changedAccountData.displayName
		);
	}
);

export const registrationAccountData = createAsyncThunk<
	AccountJSON,
	{
		birthday: Date;
		nickname: string;
		image?: string;
	},
	AsyncThunkConfig
>(
	AccountAction.registration,
	async ({ birthday, nickname, image }) => await API.registration(nickname, birthday, image)
);

export const signOut = createAsyncThunk<void, undefined, AsyncThunkConfig>(AccountAction.signOut, async (_, {}) => {
	const user = auth().currentUser;
	if (user !== null) {
		await auth().signOut();
	}
});

export const signIn = createAsyncThunk<AccountJSON | null, undefined, AsyncThunkConfig>(
	AccountAction.signIn,
	async () => {
		return await API.authentication();
	}
);

export const initializationAccount = createAsyncThunk<[AccountJSON | null, AccountStatus], undefined, AsyncThunkConfig>(
	AccountAction.initialization,
	async () => {
		const user = auth().currentUser;
		if (user === null) {
			return [null, AccountStatus.NO_AUTHENTICATION];
		} else {
			const userData = await API.authentication();
			return [userData, userData ? AccountStatus.REGISTRATION : AccountStatus.NO_REGISTRATION];
		}
	}
);
