/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { State } from "~types";

import Actions from "../actions";

export interface AccountState {
	uid?: string;
	currentData?: {
		displayName?: string;
		image: string;
		birthday: string;
		nickName: string;
		gender: "MALE" | "FEMALE" | "OTHER";
	};
	changeData: {
		nickname?: string;
		image?: string;
		displayName?: string;
		birthday?: string;
		gender?: "MALE" | "FEMALE" | "OTHER";
		lastCheckNicknameAndResult?: [string, boolean];
	};
	subscribe?: {
		type: "WEEK" | "MONTH" | "HALF_YEAR";
		whenSubscribe: string;
		autoPayment: boolean;
	};
	status: "REGISTRATION" | "NO_REGISTRATION" | "NO_AUTHENTICATION" | "IS_LOADING";
}

export default createReducer<AccountState>(
	{
		changeData: {},
		status: "IS_LOADING",
	},
	builder => {
		builder.addCase(Actions.initialization.fulfilled, (state, { payload }) => {
			if (payload.account === null) {
				state.status = "NO_AUTHENTICATION";
			} else {
				const { user, subscribe, id } = payload.account;
				state.uid = id;
				if (user !== null) {
					state.status = "REGISTRATION";
					state.currentData = {
						nickName: user.nickName,
						birthday: user.birthday,
						displayName: user.displayName,
						image: user.image,
						gender: user.gender,
					};
					if (subscribe !== null) {
						state.subscribe = {
							autoPayment: subscribe.autoPayment,
							type: subscribe.type,
							whenSubscribe: subscribe.whenSubscribe,
						};
					}
				} else {
					state.status = "NO_REGISTRATION";
				}
			}
		});
		builder.addCase(Actions.signInAccount.fulfilled, (state, { payload }) => {
			const { user, subscribe, id } = payload;
			state.uid = id;
			if (user !== null) {
				state.status = "REGISTRATION";
				state.currentData = {
					nickName: user.nickName,
					birthday: user.birthday,
					displayName: user.displayName,
					image: user.image,
					gender: user.gender,
				};
				if (subscribe !== null) {
					state.subscribe = {
						autoPayment: subscribe.autoPayment,
						type: subscribe.type,
						whenSubscribe: subscribe.whenSubscribe,
					};
				}
			} else {
				state.status = "NO_REGISTRATION";
			}
		});
		builder.addCase(Actions.signOutAccount.fulfilled, (state, { payload }) => {
			state.status = "NO_AUTHENTICATION";
			state.currentData = undefined;
			state.changeData = {};
			state.uid = undefined;
			state.subscribe = undefined;
		});
		builder.addCase(Actions.registrationAccount.fulfilled, (state, { payload }) => {
			state.currentData = payload;
			state.uid = payload.uid;
			state.changeData = {};
			state.status = "REGISTRATION";
		});
		builder.addCase(Actions.updateAccount.fulfilled, (state, { payload }) => {
			state.changeData = {};
			state.currentData = payload;
		});
		builder.addCase(Actions.removeChangedInformationUser, state => {
			state.changeData = {};
		});
		builder.addCase(Actions.addChangedInformationUser.fulfilled, (state, { payload }) => {
			state.changeData = {
				...state.changeData,
				...payload,
			};
		});
	}
);
