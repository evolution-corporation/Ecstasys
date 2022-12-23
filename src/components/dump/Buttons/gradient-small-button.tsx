/** @format */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable } from "react-native";
import ElementSimpleText from "~components/Text/element-simple-text";
import i18n from "~i18n";

interface GradientSmallButtonProperty {
	onPress: () => void;
	children?: string;
}

const GradientSmallButton: React.FC<GradientSmallButtonProperty> = properties => {
	const { onPress, children } = properties;
	return (
		<Pressable
			onPress={() => {
				if (onPress) onPress();
			}}
		>
			<LinearGradient
				style={{
					borderRadius: 10,
					paddingHorizontal: 34,
					height: 30,
					alignItems: "center",
					justifyContent: "center",
					width: "auto",
				}}
				colors={["#75348B", "#6A2382"]}
			>
				<ElementSimpleText color={"#FFFFFF"}>{children}</ElementSimpleText>
			</LinearGradient>
		</Pressable>
	);
};

export default GradientSmallButton;
