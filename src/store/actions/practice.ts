/** @format */

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FavoritePractices, Practice, Statistic } from "src/models";
import { BackgroundSound } from "src/models/practices";
import { State } from "~types";
import type { AsyncThunkConfig } from "../index";

enum PracticeAction {
	addFavorite = "practice/addFavorite",
	removeFavorite = "practice/removeFavorite",
	addStatistic = "practice/addStatistic",
	editBackgroundMusic = "practice/editBackgroundMusic",
	editBackgroundVolume = "practice/editBackgroundVolume",
	setPractice = "practice/setPractice",
}

export const addFavoritePractice = createAsyncThunk<State.FavoritePractices, State.Practice, AsyncThunkConfig>(
	PracticeAction.addFavorite,
	async (practiceState, { getState }) => {
		return (
			await FavoritePractices.createByState(getState().favoritePractices.data).addPractice(
				Practice.createByState(practiceState)
			)
		).getState();
	}
);

export const removeFavoritePractice = createAsyncThunk<State.FavoritePractices, State.Practice, AsyncThunkConfig>(
	PracticeAction.removeFavorite,
	async (practiceState, { getState }) => {
		return (
			await FavoritePractices.createByState(getState().favoritePractices.data).removePractice(
				Practice.createByState(practiceState)
			)
		).getState();
	}
);

export const addStatisticPractice = createAsyncThunk<State.Statistic, [State.Practice, number], AsyncThunkConfig>(
	PracticeAction.addStatistic,
	async ([practiceState, timeListen], { getState }) => {
		return (
			await Statistic.createByState(getState().statistic.data).addMeditation(
				Practice.createByState(practiceState),
				timeListen
			)
		).getState();
	}
);

export const editBackgroundMusic = createAction<keyof typeof BackgroundSound | null>(
	PracticeAction.editBackgroundMusic
);

export const editBackgroundVolume = createAction<number>(PracticeAction.editBackgroundVolume);

export const setPractice = createAction<State.Practice>(PracticeAction.setPractice);
