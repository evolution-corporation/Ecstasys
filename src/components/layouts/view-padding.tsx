/** @format */

import React from "react";
import { View } from "react-native";

export interface ViewPaddingProperty {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	children: JSX.Element;
	flex?: boolean;
	flexSize?: number;
}

const ViewPadding: React.FC<ViewPaddingProperty> = properties => {
	const { children, bottom, left, right, top, flex = false, flexSize } = properties;
	const paddingHorizontal = !!left && !!right && left === right ? right : undefined;
	const paddingVertical = !!top && !!bottom && top === bottom ? bottom : undefined;

	const paddingAll =
		!!paddingHorizontal && !!paddingVertical && paddingHorizontal === paddingVertical ? paddingHorizontal : undefined;

	if (React.Children.count(children) !== 1) {
		throw new Error("Необходим один потомок");
	}

	return (
		<View
			style={{
				paddingHorizontal,
				paddingVertical,
				padding: paddingAll,
				paddingBottom: bottom,
				paddingLeft: left,
				paddingRight: right,
				paddingTop: top,
				flex: flex ? flexSize : undefined,
				// borderColor: "red",
				// borderWidth: 1,
			}}
		>
			{children}
		</View>
	);
};

export default ViewPadding;
