/** @format */

import React from "react";
import { Platform, StyleProp, Text, TextStyle } from "react-native";
import TextProperty from "./text-property";

interface DefaultTextProperty extends TextProperty {
	style?: StyleProp<Omit<TextStyle, "color">>;
}

const DefaultText: React.FC<DefaultTextProperty> = property => {
	const { color = "#3D3D3D", children, style } = property;
	return (
		<Text
			style={[
				{
					fontSize: 14,
					fontWeight: "400",
					lineHeight: 16.41,
					fontFamily: Platform.OS === "ios" ? "System" : "Roboto_400Regular",
					color,
				},
				style,
			]}
		>
			{children}
		</Text>
	);
};

export default DefaultText;
