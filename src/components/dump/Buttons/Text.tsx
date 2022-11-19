/** @format */

import React from "react";
import { TextStyle } from "react-native";
import { PressableProps } from "react-native";
import { Pressable, Text } from "react-native";
import Tools from "~core";

const TextButton: React.FC<TextButton> = props => {
	const { styleText, onPress, children } = props;

	return (
		<Pressable hitSlop={10} onPress={onPress} {...props}>
			<Text
				style={[
					{
						color: Tools.gStyle.colors.TextOnTheBackground,
						fontSize: 13,
						...Tools.gStyle.font("500"),
						textAlignVertical: "center",
						textAlign: "center",
					},
					styleText,
				]}
				adjustsFontSizeToFit
			>
				{children}
			</Text>
		</Pressable>
	);
};

interface TextButton extends PressableProps {
	children?: string;
	styleText?: TextStyle | TextStyle[];
}

export default TextButton;
