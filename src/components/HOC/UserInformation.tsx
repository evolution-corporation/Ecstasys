/** @format */

import React from "react";
import { useAppSelector } from "~store";

export interface WrapperProps {
	image?: string;
	nickname?: string;
	displayName?: string;
	birthday?: string;
}

export default function <T>(
	WrapperComponent: React.FC<T & WrapperProps>,
	usingChangeData: boolean = false
): React.FC<T> {
	return (props: T) => {
		const { birthday, displayName, image, nickname } = useAppSelector(store => {
			if (store.account.currentData === undefined) throw new Error("Максимально информативная ошибка");
			const changeData = usingChangeData ? store.account.changeData : null;
			return {
				displayName: changeData?.displayName ?? store.account.currentData.displayName,
				nickname: changeData?.nickname ?? store.account.currentData.nickName,
				birthday: changeData?.birthday ?? store.account.currentData.birthday,
				image: changeData?.image ?? store.account.currentData.image,
			};
		});
		return (
			<WrapperComponent {...props} birthday={birthday} displayName={displayName} image={image} nickname={nickname} />
		);
	};
}
