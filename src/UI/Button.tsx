/** @format */

import React from "react";
import { ColorValue, Pressable, Text } from "react-native";
import Animated from "react-native-reanimated";

export interface ButtonProps {
	text: string;
	onPress?: () => void;
	textColor: ColorValue;
	backgroundColor: ColorValue;
}

const Button: React.FC<ButtonProps> = ({ text, onPress, textColor, backgroundColor }) => {
	return (
		<Pressable>
			<Animated.View>
				<Text style={{ ...gs }}>{text}</Text>
			</Animated.View>
		</Pressable>
	);
};
