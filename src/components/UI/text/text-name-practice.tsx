import React from "react";
import { Text, TextProps } from "react-native";
import { mixingFontStyle, ColorName } from "src/styles";

export interface TextNamePracticeProperties extends TextProps {
	color?: ColorName;
}

const TextNamePractice: React.FC<TextNamePracticeProperties> = properties => (
	<Text
		{...properties}
		style={[
			properties.style,
			mixingFontStyle({
				font: "NamePractice",
				color: properties.color ?? "BLACK",
			}),
		]}
		adjustsFontSizeToFit
	/>
);

TextNamePractice.defaultProps = {};

export default TextNamePractice;
