/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { State } from "~types";

import Actions from "../actions";

export interface AccountState extends State.Account {
	isLoaded: boolean;
}

export default createReducer<AccountState>(
	{
		changeUserData: {},
		status: "NO_AUTHENTICATION",
		isLoaded: false,
	},
	builder => {
		builder.addCase(Actions.setChangedAccountData.fulfilled, (state, { payload }) => ({ ...state, ...payload }));
		builder.addCase(Actions.removeChangedAccountData, state => {
			state.changeUserData = {};
		});
		builder.addCase(Actions.registrationAccountData.fulfilled, (state, { payload }) => ({ ...state, ...payload }));
		builder.addCase(Actions.signOut.fulfilled, (state, { payload }) => ({ ...state, ...payload }));
		builder.addCase(Actions.signIn.fulfilled, (state, { payload }) => ({ ...state, ...payload }));
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => ({
			...state,
			...payload.account,
			isLoaded: true,
		}));
	}
);
