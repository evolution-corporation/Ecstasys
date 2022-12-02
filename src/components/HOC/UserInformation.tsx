/** @format */

import React from "react";
import useUserInformation from "src/hooks/use-user-information";

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
		const { birthday, displayName, image, nickName } = useUserInformation();
		return (
			<WrapperComponent {...props} birthday={birthday} displayName={displayName} image={image} nickname={nickName} />
		);
	};
}
