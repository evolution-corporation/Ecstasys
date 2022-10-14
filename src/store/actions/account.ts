/** @format */

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Account } from "src/models";
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

export const setChangedAccountData = createAsyncThunk<State.Account, SetChangedAccountDataParams, AsyncThunkConfig>(
	AccountAction.setChangedData,
	async ({ birthday, displayName, image, nickname }, { getState }) => {
		const account = Account.createByState(getState().account);
		if (birthday !== undefined) {
			await account.changeUserData.setBirthday(birthday);
		}
		if (displayName !== undefined) {
			await account.changeUserData.setDisplayName(displayName);
		}
		if (image !== undefined) {
			await account.changeUserData.setImage(image);
		}
		if (nickname !== undefined) {
			await account.changeUserData.setNickname(nickname);
		}
		return account.getState();
	}
);

export const removeChangedAccountData = createAction(AccountAction.removeChangedData);

export const saveChangeAccountData = createAsyncThunk<State.Account, undefined, AsyncThunkConfig>(
	AccountAction.saveChangeData,
	async (_, { getState }) => {
		return (await Account.createByState(getState().account).update()).getState();
	}
);

export const registrationAccountData = createAsyncThunk<State.Account, undefined, AsyncThunkConfig>(
	AccountAction.registration,
	async (_, { getState }) => {
		const account = Account.createByState(getState().account);
		const { birthday, nickname, image } = await account.changeUserData.getChangeData();
		if (nickname === undefined || birthday === undefined) {
			throw new Error("Need nickname and birthday");
		}
		return (await account.registration(nickname, birthday, image)).getState();
	}
);

export const signOut = createAsyncThunk<State.Account, undefined, AsyncThunkConfig>(
	AccountAction.signOut,
	async (_, { getState }) => {
		return (await Account.createByState(getState().account).signOut()).getState();
	}
);

export const signIn = createAsyncThunk<State.Account, undefined, AsyncThunkConfig>(
	AccountAction.signIn,
	async (_, { getState }) => {
		return (await Account.createByState(getState().account).authentication()).getState();
	}
);
