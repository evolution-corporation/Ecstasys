/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { State } from "~types";
import Actions from "../actions";

export interface FavoritePracticesState {
	loaded: boolean;
	data: State.FavoritePractices;
}

export default createReducer<FavoritePracticesState>(
	{
		loaded: false,
		data: [],
	},
	builder => {
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => {
			state.data = payload.favoritePractices;
			state.loaded = true;
		});
		builder.addCase(Actions.addFavoritePractice.fulfilled, (state, { payload }) => {
			state.data = payload;
		});
		builder.addCase(Actions.removeFavoritePractice.fulfilled, (state, { payload }) => {
			state.data = payload;
		});
	}
);
