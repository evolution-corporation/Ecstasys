/** @format */

import React from "react";
import { View } from "react-native";

interface BlackCircleProperty {
	size?: number;
	children: JSX.Element;
}

const BlackCircle: React.FC<BlackCircleProperty> = property => {
	const { children, size = 41 } = property;
	const radius = size / 2;
	return (
		<View
			style={{
				borderRadius: radius,
				width: size,
				height: size,
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(61,61,61, 0.5)",
			}}
		>
			{children}
		</View>
	);
};

export default BlackCircle;
