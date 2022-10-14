/** @format */
import { loadAsync } from "expo-font";

import {
	Roboto_100Thin,
	Roboto_300Light,
	Roboto_400Regular,
	Roboto_500Medium,
	Roboto_700Bold,
	Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Inter_700Bold } from "@expo-google-fonts/inter";

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Account, FavoritePractices, MessageProfessor, Statistic } from "src/models";

import { State } from "~types";
import type { AsyncThunkConfig } from "../index";

enum GeneralAction {
	initialization = "general/initialization",
}

interface InitializationPayload {
	account: State.Account;
	statistic: State.Statistic;
	favoritePractices: State.FavoritePractices;
	messageProfessor: State.MessageProfessor;
}

export const initialization = createAsyncThunk<InitializationPayload, undefined, AsyncThunkConfig>(
	GeneralAction.initialization,
	async (_, { getState }) => {
		const account = await Account.createByState(getState().account).initialization();
		const statistic = await Statistic.createByState(getState().statistic.data).initialization();
		const favoritePractices = await FavoritePractices.createByState(getState().favoritePractices.data).initialization();
		await loadAsync({
			Roboto_100Thin,
			Roboto_300Light,
			Roboto_400Regular,
			Roboto_500Medium,
			Roboto_700Bold,
			Roboto_900Black,
			Inter_700Bold,
		});
		const messageProfessor = await MessageProfessor.initialization();

		return {
			account: account.getState(),
			statistic: statistic.getState(),
			favoritePractices: favoritePractices.getState(),
			messageProfessor: messageProfessor.getState(),
		};
	}
);
