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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { Account, FavoritePractices, MessageProfessor, Practice, Statistic } from "src/models";

import { PracticesMeditation, State } from "~types";
import type { AsyncThunkConfig } from "../index";
import { RequestError } from "src/Errors";

enum GeneralAction {
	initialization = "general/initialization",
}

interface InitializationPayload {
	account: State.Account;
	statistic: State.Statistic;
	favoritePractices: State.FavoritePractices;
	messageProfessor: State.MessageProfessor;
	countPractices: { [key in State.PracticesMeditation]: number };
}

export const initialization = createAsyncThunk<InitializationPayload, undefined, AsyncThunkConfig>(
	GeneralAction.initialization,
	async (_, { getState, fulfillWithValue, rejectWithValue }) => {
		try {
			const account = await Account.createByState(getState().account).initialization();
			const statistic = await Statistic.createByState(getState().statistic.data).initialization();
			const favoritePractices = await FavoritePractices.createByState(
				getState().favoritePractices.data
			).initialization();
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
			const countPractices: { [key in State.PracticesMeditation]: number } = {
				BASIC: await Practice.getCountPractice(PracticesMeditation.BASIC),
				BREATHING_PRACTICES: await Practice.getCountPractice(PracticesMeditation.BREATHING_PRACTICES),
				DANCE_PSYCHOTECHNICS: await Practice.getCountPractice(PracticesMeditation.DANCE_PSYCHOTECHNICS),
				DIRECTIONAL_VISUALIZATIONS: await Practice.getCountPractice(PracticesMeditation.DIRECTIONAL_VISUALIZATIONS),
				RELAXATION: await Practice.getCountPractice(PracticesMeditation.RELAXATION),
			};
			return fulfillWithValue({
				account: account.getState(),
				statistic: statistic.getState(),
				favoritePractices: favoritePractices.getState(),
				messageProfessor: messageProfessor.getState(),
				countPractices: countPractices,
			});
		} catch (error) {
			if (error instanceof RequestError) return rejectWithValue(error.getMessageForUser());
		}
	}
);
