/** @format */

import React from "react";
import { ColorValue, Platform, Text } from "react-native";
import { getFontOption } from "src/styles/font";
import { FontWeight } from "src/styles/type";

export interface CustomPartTextProperty {
	fontWeight?: FontWeight;
	color?: ColorValue;
	children: string;
}

const CustomPartText: React.FC<CustomPartTextProperty> = property => {
	const { color, children, fontWeight } = property;
	let fontFamily: string | undefined;
	if (Platform.OS === "android") {
		if (!!fontWeight) fontFamily = getFontOption(fontWeight).fontFamily;
	} else {
		fontFamily = "System";
	}
	return (
		<Text
			style={{
				fontFamily,
				fontWeight,
				color,
			}}
		>
			{children}
		</Text>
	);
};

export default CustomPartText;
