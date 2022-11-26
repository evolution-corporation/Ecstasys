/** @format */

import { ActionCreatorWithPayload, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { State } from "~types";

enum DMDActions {
	setOption = "DMD/setOption",
	setSet = "DMD/setSet",
	setTimeConfigurator = "DMD/setTimeConfigurator",
}

export const setOptionForDMD = createAction<State.Practice & { type: "RELAXATION"; audio: string }>(
	DMDActions.setOption
);

export const setSetForDMD = createAction<State.Set>(DMDActions.setSet);

export const setTimeConfiguratorForDMD = createAction<
	ActionCreatorWithPayload<{ type: "action" | "random"; value: number }>
>(DMDActions.setTimeConfigurator, ({ type, value }) => {
	let payload = { type, value };
	switch (type) {
		case "action":
			if (value < 300000) {
				payload = { type, value: 300000 };
			} else if (value > 600000) {
				payload = { type, value: 600000 };
			}
			break;
		case "random":
			if (value < 2100000) {
				payload = { type, value: 2100000 };
			} else if (value > 2700000) {
				payload = { type, value: 2700000 };
			}
			break;
	}
	return { payload };
});
