/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import { default as AccountReducer } from "./account";
import { default as StyleReducer } from "./styles";
import { default as PracticeReducer } from "./practice";
import { default as DMDReduce } from "./DMD";
import { default as ExperimentalConfigReducer } from "./experimental-config";

export default combineReducers({
	account: AccountReducer,
	style: StyleReducer,
	practice: PracticeReducer,
	DMD: DMDReduce,
	ExperimentalConfig: ExperimentalConfigReducer,
});
