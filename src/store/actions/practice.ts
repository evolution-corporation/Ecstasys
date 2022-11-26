/** @format */

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { BackgroundSound } from "src/models/practices";
import { State } from "~types";
import { Converter, Storage, Request } from "~api";
import type { AsyncThunkConfig } from "../index";
import { SupportType } from "src/api/types";
import * as Crypto from "expo-crypto";

enum PracticeAction {
	addFavorite = "practice/addFavorite",
	removeFavorite = "practice/removeFavorite",
	addStatistic = "practice/addStatistic",
	editBackgroundMusic = "practice/editBackgroundMusic",
	editBackgroundVolume = "practice/editBackgroundVolume",
	setPractice = "practice/setPractice",
	getPracticeDay = "practice/getPracticeDay"
}

export const getPracticeDay = createAsyncThunk<State.Practice | null, void, AsyncThunkConfig>(
	PracticeAction.getPracticeDay,
	async () => {
		return Converter.composePractice(await Request.getRecommendationMeditation())
	}
)

export const addFavoritePractice = createAsyncThunk<State.Practice, State.Practice, AsyncThunkConfig>(
	PracticeAction.addFavorite,
	async practiceState => {
		let type: SupportType.PracticesMeditation;
		switch (practiceState.type) {
			case "BREATHING_PRACTICES":
				type = "breathingPractices";
				break;
			case "DANCE_PSYCHOTECHNICS":
				type = "dancePsychotechnics";
				break;
			case "DIRECTIONAL_VISUALIZATIONS":
				type = "directionalVisualizations";
				break;
			case "RELAXATION":
				type = "relaxation";
				break;
			default:
				throw new Error("12345");
		}
		await Storage.addFavoriteMeditationPractices(
			practiceState.id,
			practiceState.name,
			practiceState.description,
			type,
			practiceState.length,
			practiceState.audio
		);
		return practiceState;
	}
);

export const removeFavoritePractice = createAsyncThunk<State.Practice, State.Practice, AsyncThunkConfig>(
	PracticeAction.removeFavorite,
	async practiceState => {
		await Storage.removeFavoriteMeditationPractices(practiceState.id);
		return practiceState;
	}
);

export const addStatisticPractice = createAsyncThunk<
	[number, string, State.Practice],
	[State.Practice, number],
	AsyncThunkConfig
>(PracticeAction.addStatistic, async ([practiceState, timeListen]) => {
	const statisticsList = await Storage.getStatistic();
	let lastIndex: string;
	if (statisticsList.length > 0) {
		lastIndex = statisticsList[statisticsList.length - 1].id;
	} else {
		lastIndex = Math.floor(100 * Math.random()).toString();
	}

	const nextId = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, lastIndex);
	const toDay = new Date();
	await Storage.addStatistic(nextId, timeListen, toDay, practiceState.id);
	return [timeListen, toDay.toISOString(), practiceState];
});

export const editBackgroundMusic = createAction<keyof typeof BackgroundSound | null>(
	PracticeAction.editBackgroundMusic
);

export const editBackgroundVolume = createAction<number>(PracticeAction.editBackgroundVolume);

export const setPractice = createAction<State.Practice>(PracticeAction.setPractice);

export const addStatisticBasePractice = createAsyncThunk<
	[number, string, State.BasePractice],
	[State.BasePractice, number],
	AsyncThunkConfig
>(PracticeAction.addStatistic, async ([practiceState, timeListen]) => {
	const statisticsList = await Storage.getStatistic();
	let lastIndex: string;
	if (statisticsList.length > 0) {
		lastIndex = statisticsList[statisticsList.length - 1].id;
	} else {
		lastIndex = Math.floor(100 * Math.random()).toString();
	}

	const nextId = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, lastIndex);
	const toDay = new Date();
	await Storage.addStatistic(nextId, timeListen, toDay, practiceState.id);
	return [timeListen, toDay.toISOString(), practiceState];
});
