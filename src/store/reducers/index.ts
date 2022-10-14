/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import { default as AccountReducer } from "./account";
import { default as FavoritePracticesReducer } from "./favoritePractices";
import { default as StyleReducer } from "./styles";
import { default as StatisticReducer } from "./statistic";

export default combineReducers({
	account: AccountReducer,
	favoritePractices: FavoritePracticesReducer,
	statistic: StatisticReducer,
	style: StyleReducer,
});
