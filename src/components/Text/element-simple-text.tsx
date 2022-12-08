/** @format */

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import TextProperty from "./text-property";

// interface ElementSimpleTextProperty extends TextProperty {}

const ElementSimpleText: React.FC<TextProperty> = property => {
	const { children, color } = property;
	return (
		<Text
			style={{
				fontSize: 13,
				fontFamily: Platform.OS === "ios" ? "System" : "Roboto_700Bold",
				fontWeight: "600",
				color,
			}}
		>
			{children}
		</Text>
	);
};

export default ElementSimpleText;
