/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { BackgroundSound } from "src/models/practices";
import { State } from "~types";

import Actions from "../actions";

export interface PracticeState {
	currentPractice?: State.Practice;
	paramsPractice: {
		currentNameBackgroundSound: null | keyof typeof BackgroundSound;
		currentVolumeBackgroundSound: number;
	};
	listPracticesListened: { dateListen: string; msListened: number; practice: State.Practice }[];
	listPracticesFavorite: State.Practice[];
	recommendationPracticeToDay?: State.Practice;
	colorDor: string;
}

export default createReducer<PracticeState>(
	{
		paramsPractice: {
			currentNameBackgroundSound: null,
			currentVolumeBackgroundSound: 0.2,
		},
		listPracticesListened: [],
		listPracticesFavorite: [],
		colorDor: "#FFF",
	},
	builder => {
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => {
			const { listPracticesFavorite, listPracticesListened, recommendationPracticeToDay } = payload.practice;
			for (let practiceFavorite of listPracticesFavorite) {
				if (practiceFavorite === null) {
					continue;
				}
				state.listPracticesFavorite = [...state.listPracticesFavorite, practiceFavorite];
			}
			for (let practiceListen of listPracticesListened) {
				if (practiceListen === null) {
					continue;
				}
				state.listPracticesListened = [
					...state.listPracticesListened,
					{
						practice: practiceListen.practice,
						dateListen: practiceListen.dateListen,
						msListened: practiceListen.msListened,
					},
				];
			}
			if (recommendationPracticeToDay !== null) state.recommendationPracticeToDay = recommendationPracticeToDay;
		});
		builder.addCase(Actions.editBackgroundMusic, (state, { payload }) => {
			state.paramsPractice.currentNameBackgroundSound = payload;
		});
		builder.addCase(Actions.editBackgroundVolume, (state, { payload }) => {
			if (payload < 0) payload = 0;
			if (payload > 1) payload = 1;
			state.paramsPractice.currentVolumeBackgroundSound = payload;
		});
		builder.addCase(Actions.setPractice, (state, { payload }) => {
			state.currentPractice = payload;
		});
		builder.addCase(Actions.addFavoritePractice.fulfilled, (state, { payload }) => {
			state.listPracticesFavorite = [...state.listPracticesFavorite, payload];
		});
		builder.addCase(Actions.addStatisticPractice.fulfilled, (state, { payload }) => {
			state.listPracticesListened = [
				...state.listPracticesListened,
				{ dateListen: payload[1], msListened: payload[0], practice: payload[2] },
			];
		});
		builder.addCase(Actions.removeFavoritePractice.fulfilled, (state, { payload }) => {
			state.listPracticesFavorite = [...state.listPracticesFavorite.filter(({ id }) => payload.id !== id)];
		});
		builder.addCase(Actions.signOutAccount.fulfilled, state => {
			state.listPracticesListened = [];
			state.listPracticesFavorite = [];
			state.recommendationPracticeToDay = undefined;
		});
		builder.addCase(Actions.getPracticeDay.fulfilled, (state, { payload }) => {
			if (payload !== null) state.recommendationPracticeToDay = payload;
		});
		builder.addCase(Actions.changeColorDot, (state, { payload }) => {
			state.colorDor = payload;
		});
	}
);
