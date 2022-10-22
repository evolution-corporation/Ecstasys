/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import { default as AccountReducer } from "./account";
import { default as FavoritePracticesReducer } from "./favoritePractices";
import { default as StyleReducer } from "./styles";
import { default as StatisticReducer } from "./statistic";
import { default as PracticeReducer } from "./practice";
import { default as DMDReduce } from "./DMD";

export default combineReducers({
	account: AccountReducer,
	favoritePractices: FavoritePracticesReducer,
	statistic: StatisticReducer,
	style: StyleReducer,
	practice: PracticeReducer,
	DMD: DMDReduce,
});
