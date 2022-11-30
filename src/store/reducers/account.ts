/** @format */

import { createReducer } from "@reduxjs/toolkit";
import { AccountStatus } from "src/enum";
import { Serialization, SubscribeInformation, UserInformation } from "~types";

import Actions from "../actions";

export interface AccountState {
	current?: Serialization<UserInformation>;
	changeData: Omit<Partial<Serialization<UserInformation>>, "id" | "nickname"> & {
		nickname?: Serialization<{ value: string; timeLastCheck: Date }>;
	};
	statusAuthentication?: AccountStatus;
	isLoading: boolean;
	subscribe?: Serialization<SubscribeInformation>;
	isNewUser?: boolean;
}

export default createReducer<AccountState>(
	{
		changeData: {},
		isLoading: true,
	},
	builder => {
		builder.addCase(Actions.initializationAccount.fulfilled, (state, { payload }) => {
			const { subscribe, user, status } = payload;
			state.current = user?.toSerialization();
			state.subscribe = subscribe?.toSerialization();
			state.statusAuthentication = status;
			state.isLoading = false;
			if (status === AccountStatus.NO_REGISTRATION || status === AccountStatus.REGISTRATION) {
				state.isNewUser = status === AccountStatus.NO_REGISTRATION;
			}
		});
		builder.addCase(Actions.signInAccount.fulfilled, (state, { payload }) => {
			const { user, subscribe } = payload;
			state.statusAuthentication = user ? AccountStatus.REGISTRATION : AccountStatus.NO_REGISTRATION;
			state.current = user?.toSerialization();
			state.isNewUser = !!user;
			state.subscribe = subscribe?.toSerialization();
		});
		builder.addCase(Actions.signOutAccount.fulfilled, state => {
			state.statusAuthentication = AccountStatus.NO_AUTHENTICATION;
			state.current = undefined;
			state.changeData = {};
			state.subscribe = undefined;
			state.isNewUser = undefined;
		});
		builder.addCase(Actions.registrationAccount.fulfilled, (state, { payload }) => {
			state.current = payload.toSerialization();
			state.changeData = {};
			state.isNewUser = true;
			state.statusAuthentication = AccountStatus.REGISTRATION;
		});
		builder.addCase(Actions.updateAccount.fulfilled, (state, { payload }) => {
			state.changeData = {};
			state.current = payload.toSerialization();
			state.isNewUser = false;
		});
		builder.addCase(Actions.removeChangedInformationUser, state => {
			state.changeData = {};
		});
		builder.addCase(Actions.addChangedInformationUser.fulfilled, (state, { payload }) => {
			state.changeData = {
				birthday: payload.birthday === undefined ? undefined : payload.birthday.toISOString(),
				displayName: payload.displayName,
				gender: payload.gender,
				image: payload.image,
				nickname:
					payload.nickname !== undefined && payload.lastCheckNicknameAndResult !== undefined
						? { value: payload.nickname, timeLastCheck: payload.lastCheckNicknameAndResult.toISOString() }
						: undefined,
			};
		});
		builder.addCase(Actions.setRegistrationAccountStatus, state => {
			state.statusAuthentication = AccountStatus.REGISTRATION;
		});
		builder.addCase(Actions.setNotNewUser, state => {
			state.isNewUser = false;
		});
	}
);
