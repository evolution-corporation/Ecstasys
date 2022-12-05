/** @format */

import React from "react";
import { SetChangedAccountDataParams } from "src/store/actions/account";
import { actions, useAppDispatch, useAppSelector } from "src/store/index";
import { CurrentData } from "src/store/reducers/account";
import { Gender } from "~types";

export interface ReturnUserInformationHook extends CurrentData {
	upload: () => Promise<void>;
	setValue: (parameters: SetChangedAccountDataParams) => Promise<void>;
	isLoading: boolean;
	clearChangedValue: () => Promise<void>;
}

const useUserInformation = (usingChangeData = true, clearUnmount = true): ReturnUserInformationHook => {
	const [isLoading, setIsLoading] = React.useState(false);
	const userData = useAppSelector(store => {
		if (store.account.currentData === undefined)
			throw new Error("Максимально информативная ошибка. useUserInformation");
		const changeData = usingChangeData ? store.account.changeData : undefined;
		return {
			displayName: changeData?.displayName ?? store.account.currentData.displayName,
			nickName: changeData?.nickname ?? store.account.currentData.nickName,
			birthday: changeData?.birthday ?? store.account.currentData.birthday,
			image: changeData?.image ?? store.account.currentData.image,
			gender: Gender[changeData?.gender ?? store.account.currentData.gender],
		};
	});

	const appDispatch = useAppDispatch();

	const upload = async () => {
		setIsLoading(true);
		await appDispatch(actions.updateAccount({})).unwrap();
		setIsLoading(false);
	};

	const setValue = async (parameters: SetChangedAccountDataParams) => {
		appDispatch(actions.addChangedInformationUser(parameters)).unwrap();
		return;
	};

	const clearChangedValue = async () => {
		appDispatch(actions.removeChangedInformationUser());
	};

	React.useEffect(() => {
		return () => {
			if (clearUnmount) clearChangedValue();
		};
	}, []);

	return {
		...userData,
		upload,
		setValue,
		isLoading,
		clearChangedValue,
	};
};

export default useUserInformation;
