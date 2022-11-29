import React from "react";
import { SetChangedAccountDataParameters } from "src/store/actions/account";
import { actions, useAppDispatch, useAppSelector } from "src/store/index";
import { Gender, UserInformation } from "~types";

export interface ReturnUserInformationHook {
	currentInformation: UserInformation;
	upload: () => Promise<void>;
	setValue: (parameters: SetChangedAccountDataParameters) => Promise<void>;
	isLoading: boolean;
}

const useUserInformation = (usingChangeData = true): ReturnUserInformationHook => {
	const [isLoading, setIsLoading] = React.useState(false);
	const userData = useAppSelector(store => {
		if (store.account.currentData === undefined)
			throw new Error("Максимально информативная ошибка. useUserInformation");
		const changeData = usingChangeData ? store.account.changeData : undefined;
		return {
			displayName: changeData?.displayName ?? store.account.currentData.displayName,
			nickname: changeData?.nickname ?? store.account.currentData.nickName,
			birthday: new Date(changeData?.birthday ?? store.account.currentData.birthday),
			image: { uri: changeData?.image ?? store.account.currentData.image },
			gender: Gender[changeData?.gender ?? store.account.currentData.gender],
		};
	});

	const appDispatch = useAppDispatch();

	const upload = async () => {
		setIsLoading(true);
		await appDispatch(actions.updateAccount({})).unwrap();
		setIsLoading(false);
	};

	const setValue = async (parameters: SetChangedAccountDataParameters) => {
		appDispatch(actions.addChangedInformationUser(parameters)).unwrap();
		return;
	};

	return {
		currentInformation: userData,
		upload,
		setValue,
		isLoading,
	};
};

export default useUserInformation;
