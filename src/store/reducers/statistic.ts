/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { State } from "~types";

import Actions from "../actions";

export interface StatisticState {
	loaded: boolean;
	data: State.Statistic;
}

export default createReducer<StatisticState>(
	{
		loaded: false,
		data: {},
	},
	builder => {
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => {
			state.data = payload.statistic;
			state.loaded = true;
		});
		builder.addCase(Actions.addStatisticPractice.fulfilled, (state, { payload }) => {
			state.data = payload;
		});
	}
);
