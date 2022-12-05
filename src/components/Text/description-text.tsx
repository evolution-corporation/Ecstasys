/** @format */

import React from "react";
import { Platform, Text } from "react-native";
import TextProperty from "./text-property";

export enum TextAlign {
	Center = "center",
	Left = "left",
	Right = "right",
	Justify = "justify",
}

interface DescriptionTextProperty extends TextProperty {
	textAlign?: TextAlign;
}

const DescriptionText: React.FC<DescriptionTextProperty> = property => {
	const { color = "#3D3D3D", children, textAlign = TextAlign.Center } = property;
	return (
		<Text
			style={{
				fontSize: 16.5,
				fontFamily: Platform.OS === "ios" ? "System" : "Roboto_400Regular",
				lineHeight: 23,
				fontWeight: "400",
				color,
				textAlign,
			}}
		>
			{children}
		</Text>
	);
};

export default DescriptionText;
