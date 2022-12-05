/** @format */

import React from "react";
import { ColorValue, Platform, Text } from "react-native";
import TextProperty from "./text-property";

interface HeaderTextProperty extends TextProperty {
	color?: ColorValue;
	children: string;
}

const HeaderText: React.FC<HeaderTextProperty> = property => {
	const { color = "#3D3D3D", children } = property;
	return (
		<Text
			style={{
				fontSize: 20,
				fontFamily: Platform.OS === "ios" ? "System" : "Roboto_500Medium",
				fontWeight: "600",
				// lineHeight: 23.44,
				width: "100%",
				textAlign: "center",
				textAlignVertical: "auto",
				color,
			}}
			adjustsFontSizeToFit
			numberOfLines={2}
		>
			{children}
		</Text>
	);
};

export default HeaderText;
