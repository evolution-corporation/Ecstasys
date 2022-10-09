/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { AccountJSON, AccountStatus, ChangedAccountDataJSON } from "~types";

import Actions from "../actions";

export interface AccountState {
	accountStatus?: AccountStatus;
	accountData?: AccountJSON;
	changedAccountData: ChangedAccountDataJSON;
	isLoaded: boolean;
	isNewAccount: boolean;
}

export default createReducer<AccountState>(
	{
		isLoaded: false,
		changedAccountData: {},
		isNewAccount: false,
	},
	builder => {
		builder.addCase(Actions.setChangedAccountData, (state, { payload }) => {
			state.changedAccountData = { ...state.accountData, ...payload };
		});
		builder.addCase(Actions.removeChangedAccountData, state => {
			state.changedAccountData = {};
		});
		builder.addCase(Actions.registrationAccountData.fulfilled, (state, { payload }) => {
			state.accountData = payload;
			state.accountStatus = AccountStatus.REGISTRATION;
		});
		builder.addCase(Actions.signOut.fulfilled, state => {
			state.accountData = undefined;
			state.changedAccountData = {};
			state.accountStatus = AccountStatus.NO_AUTHENTICATION;
		});
		builder.addCase(Actions.signIn.fulfilled, (state, { payload }) => {
			if (payload === null) {
				state.accountStatus == AccountStatus.NO_REGISTRATION;
				state.accountData = undefined;
				state.isNewAccount = true;
			} else {
				state.accountData = payload;
				state.accountStatus == AccountStatus.REGISTRATION;
			}
			state.changedAccountData = {};
		});
		builder.addCase(Actions.initializationAccount.fulfilled, (state, { payload }) => {
			state.isLoaded = true;
			state.accountStatus = payload[1];
			state.accountData = payload[0] ?? undefined;
		});
	}
);
