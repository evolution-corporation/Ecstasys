/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { BackHandler } from "react-native";
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
}

export default createReducer<PracticeState>(
	{
		paramsPractice: {
			currentNameBackgroundSound: null,
			currentVolumeBackgroundSound: 0.5,
		},
		listPracticesListened: [],
		listPracticesFavorite: [],
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
		builder.addCase(Actions.editBackgroundVolume, (state, { payload }) => {
			if (payload < 0) payload = 0;
			if (payload > 1) payload = 1;
			state.paramsPractice.currentVolumeBackgroundSound = payload;
		});
		builder.addCase(Actions.setPractice, (state, { payload }) => {
			state.currentPractice = payload;
		});
	}
);
