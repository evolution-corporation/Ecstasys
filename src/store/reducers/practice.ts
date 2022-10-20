/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { BackHandler } from "react-native";
import { BackgroundSound } from "src/models/practices";
import { State } from "~types";

import Actions from "../actions";

export interface StatisticState {
	currentPractice?: State.Practice;
	countPractice: { [key in State.PracticesMeditation]: number };
	selectBackgroundMusicName: null | keyof typeof BackgroundSound;
	backgroundMusicVolume: number;
}

export default createReducer<StatisticState>(
	{
		countPractice: {
			BASIC: 0,
			BREATHING_PRACTICES: 0,
			DANCE_PSYCHOTECHNICS: 0,
			DIRECTIONAL_VISUALIZATIONS: 0,
			RELAXATION: 0,
		},
		selectBackgroundMusicName: null,
		backgroundMusicVolume: 0.5,
	},
	builder => {
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => {
			state.countPractice = payload.countPractices;
		});
		builder.addCase(Actions.editBackgroundMusic, (state, { payload }) => {
			state.selectBackgroundMusicName = payload;
		});
		builder.addCase(Actions.editBackgroundVolume, (state, { payload }) => {
			if (payload < 0) payload = 0;
			if (payload > 1) payload = 1;
			state.backgroundMusicVolume = payload;
		});
	}
);
