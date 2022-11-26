/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { BackHandler } from "react-native";
import { BackgroundSound } from "src/models/practices";
import { State } from "~types";
import actions from "../actions";

import Actions from "../actions";

export interface StatisticState {
	option?: State.Practice & { type: "RELAXATION"; audio: string };
	set?: State.Set;
	configuratorNotification: {
		option?: number;
		activate: number;
		random: number;
	};
}

export default createReducer<StatisticState>(
	{
		configuratorNotification: {
			activate: 300000,
			random: 2100000,
		},
	},
	builder => {
		builder.addCase(actions.setOptionForDMD, (state, { payload }) => {
			state.option = payload;
			state.configuratorNotification.option = payload.length;
		});
		builder.addCase(actions.setSetForDMD, (state, { payload }) => {
			state.set = payload;
		});
		builder.addCase(actions.setTimeConfiguratorForDMD, (state, { payload: { type, value } }) => {
			switch (type) {
				case "action":
					state.configuratorNotification.activate = value;
					break;
				case "random":
					state.configuratorNotification.random = value;
					break;
			}
		});
	}
);
